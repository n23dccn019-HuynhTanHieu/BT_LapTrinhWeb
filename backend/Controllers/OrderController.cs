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

        // CUSTOMER CREATE ORDER
        [HttpPost]
        public async Task<IActionResult> Create(CreateOrderDTO dto)
        {
            decimal totalAmount = 0;

            var order = new Order
            {
                UserID = dto.UserID,
                ReceiverName = dto.ReceiverName,
                ReceiverPhone = dto.ReceiverPhone,
                ReceiverAddress = dto.ReceiverAddress,
                Note = dto.Note,
                OrderStatus = 1,
                OrderDate = DateTime.Now
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            foreach (var item in dto.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductID);

                if (product == null)
                {
                    return BadRequest("Product not found");
                }

                if (product.StockQuantity < item.Quantity)
                {
                    return BadRequest($"{product.ProductName} out of stock");
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

                // decrease stock
                product.StockQuantity -= item.Quantity;
            }

            order.TotalAmount = totalAmount;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Order success",
                orderId = order.OrderID
            });
        }

        //========================================================
        // CUSTOMER GET ORDER HISTORY (KHÁCH HÀNG XEM LỊCH SỬ MUA)
        // ========================================================
        [Authorize]
        [HttpGet("customer-history")]
        public async Task<IActionResult> GetCustomerHistory()
        {
            // Quét claim tìm User ID tương tự UserController
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                            ?? User.FindFirst("id")?.Value
                            ?? User.FindFirst("Id")?.Value
                            ?? User.FindFirst("UserID")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Không xác định được danh tính từ Token." });

            int userId = int.Parse(userIdClaim);

            // Lấy toàn bộ đơn hàng của khách hàng này, kèm theo danh sách sản phẩm chi tiết
            var orders = await _context.Orders
                .Include(x => x.OrderDetails)
                .ThenInclude(x => x.Product)
                .Where(x => x.UserID == userId)
                .OrderByDescending(x => x.OrderID) // Đơn hàng mới nhất lên đầu
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
                .Include(x => x.User)
                .AsQueryable();

            // Lọc theo trạng thái
            if (status.HasValue)
            {
                query = query.Where(x => x.OrderStatus == status.Value);
            }

            // Lọc theo từ khóa (ID hoặc tên)
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(x => 
                    x.OrderID.ToString().Contains(keyword) || 
                    x.ReceiverName.Contains(keyword)
                );
            }

            var totalItems = await query.CountAsync();

            // SỬA TẠI ĐÂY: Sử dụng OrderBy để sắp xếp TĂNG DẦN theo ID
            var orders = await query
                .OrderBy(x => x.OrderID) 
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

        // CUSTOMER CANCEL ORDER
        [Authorize]
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            // only pending
            if (order.OrderStatus != 1)
            {
                return BadRequest("Cannot cancel this order");
            }

            order.OrderStatus = 0;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Order canceled" });
        }
    }
}