using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        // CUSTOMER CREATE ORDER (MUA HÀNG + ĐẶT HÀNG NHANH)
        [HttpPost]
        public async Task<IActionResult> Create(CreateOrderDTO dto)
        {
            // 1. Kiểm tra nếu có truyền UserID nhưng ID lại không hợp lệ
            if (dto.UserID.HasValue && dto.UserID.Value <= 0)
            {
                return BadRequest("Thông tin tài khoản khách hàng không hợp lệ.");
            }

            // 2. Nếu LÀ KHÁCH VÃNG LAI (UserID == null), bắt buộc phải điền thông tin giao hàng
            if (!dto.UserID.HasValue)
            {
                if (string.IsNullOrWhiteSpace(dto.ReceiverName) || 
                    string.IsNullOrWhiteSpace(dto.ReceiverPhone) || 
                    string.IsNullOrWhiteSpace(dto.ReceiverAddress))
                {
                    return BadRequest("Khách vãng lai vui lòng nhập đầy đủ: Tên, Số điện thoại và Địa chỉ để đặt hàng nhanh.");
                }
            }

            // 3. Kiểm tra danh sách sản phẩm trống
            if (dto.Items == null || !dto.Items.Any())
            {
                return BadRequest("Giỏ hàng của bạn đang trống.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                decimal totalAmount = 0;

                var order = new Order
                {
                    UserID = dto.UserID, // Nhận null nếu là khách vãng lai (Database đã hỗ trợ nhờ migration của bạn)
                    ReceiverName = dto.ReceiverName,
                    ReceiverPhone = dto.ReceiverPhone,
                    ReceiverAddress = dto.ReceiverAddress,
                    Note = dto.Note,
                    OrderStatus = 1, // 1: Chờ xử lý / Đã đặt
                    OrderDate = DateTime.Now
                };

                _context.Orders.Add(order);
                // Lưu trước để có OrderID cho bảng OrderDetails
                await _context.SaveChangesAsync();

                foreach (var item in dto.Items)
                {
                    // 🚀 BẮT LỖI 1: Số lượng đặt phải lớn hơn 0
                    if (item.Quantity <= 0)
                    {
                        return BadRequest("Số lượng sản phẩm đặt hàng phải lớn hơn 0.");
                    }

                    var product = await _context.Products.FindAsync(item.ProductID);

                    if (product == null)
                    {
                        return BadRequest($"Sản phẩm (ID: {item.ProductID}) không tồn tại trong hệ thống.");
                    }

                    // 🚀 BẮT LỖI 2: Số lượng đặt vượt quá số lượng tồn kho
                    if (product.StockQuantity < item.Quantity)
                    {
                        return BadRequest($"{product.ProductName} chỉ còn {product.StockQuantity} sản phẩm trong kho.");
                    }

                    decimal price = product.PromoPrice ?? product.Price;
                    totalAmount += price * item.Quantity;

                    var orderDetail = new OrderDetail
                    {
                        OrderID = order.OrderID,
                        ProductID = item.ProductID,
                        Quantity = item.Quantity,
                        Price = price
                    };

                    _context.OrderDetails.Add(orderDetail);

                    // Trừ số lượng trong kho tương ứng với số lượng khách mua
                    product.StockQuantity -= item.Quantity;
                }

                // Cập nhật lại tổng tiền chính xác sau khi quét qua toàn bộ item
                order.TotalAmount = totalAmount;
                await _context.SaveChangesAsync();

                // Xác nhận toàn bộ giao dịch thành công dữ liệu hợp lệ
                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Order success",
                    orderId = order.OrderID
                });
            }
            catch (Exception ex)
            {
                // Hoàn tác dữ liệu kho và đơn hàng nếu sập lỗi giữa chừng
                await transaction.RollbackAsync();
                
                var dbError = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Lỗi hệ thống Database: {dbError}");
            }
        }

        // CUSTOMER GET ORDER HISTORY
        [Authorize]
        [HttpGet("customer-history")]
        public async Task<IActionResult> GetCustomerHistory()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                            ?? User.FindFirst("id")?.Value
                            ?? User.FindFirst("Id")?.Value
                            ?? User.FindFirst("UserID")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Không xác định được danh tính từ Token." });

            int userId = int.Parse(userIdClaim);

            var orders = await _context.Orders
                .Include(x => x.OrderDetails)
                .ThenInclude(x => x.Product)
                .Where(x => x.UserID == userId)
                .OrderByDescending(x => x.OrderID)
                .ToListAsync();

            return Ok(orders);
        }

        // ADMIN GET ALL ORDERS
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int? status,
            [FromQuery] string? keyword = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50
        )
        {
            var query = _context.Orders
                .Include(x => x.User) // EF Core tự động LEFT JOIN, không lo mất đơn hàng có UserID = null
                .AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(x => x.OrderStatus == status.Value);
            }

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(x => 
                    x.OrderID.ToString().Contains(keyword) || 
                    x.ReceiverName.Contains(keyword)
                );
            }

            var totalItems = await query.CountAsync();

            var orders = await query
                .OrderByDescending(x => x.OrderID)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                totalItems,
                page,
                pageSize,
                data = orders
            });
        }

        // ORDER DETAIL
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _context.Orders
                .Include(x => x.User)
                .Include(x => x.OrderDetails)
                .ThenInclude(x => x.Product)
                .FirstOrDefaultAsync(x => x.OrderID == id);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }

        // UPDATE STATUS
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromQuery] int status)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            order.OrderStatus = status;
            order.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(order);
        }

        // CUSTOMER CANCEL ORDER (HỦY ĐƠN VÀ HOÀN LẠI SỐ LƯỢNG KHO)
        [Authorize]
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.OrderID == id);

            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            if (order.OrderStatus != 1)
            {
                return BadRequest("Cannot cancel this order. Only pending orders can be canceled.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                foreach (var detail in order.OrderDetails)
                {
                    var product = await _context.Products.FindAsync(detail.ProductID);
                    if (product != null)
                    {
                        product.StockQuantity += detail.Quantity;
                    }
                }

                order.OrderStatus = 0;
                order.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Order canceled and stock restored successfully." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                var dbError = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Error while canceling order: {dbError}");
            }
        }
    }
}