using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization; // Cần thiết để tính số tuần

namespace backend.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        // OVERVIEW
        [HttpGet("overview")]
        public async Task<IActionResult> Overview()
        {
            var totalProducts = await _context.Products.CountAsync();

            var totalUsers = await _context.Users
                .Include(x => x.Role)
                .CountAsync(x => x.Role.RoleName == "Customer");

            var totalOrders = await _context.Orders.CountAsync();

            var revenue = await _context.Orders
                .Where(x => x.OrderStatus == 5)
                .SumAsync(x => (decimal?)x.TotalAmount) ?? 0;

            return Ok(new
            {
                totalProducts,
                totalUsers,
                totalOrders,
                revenue
            });
        }

        // REVENUE BY DAY
        [HttpGet("revenue-by-day")]
        public async Task<IActionResult> RevenueByDay()
        {
            var data = await _context.Orders
                .Where(x => x.OrderStatus == 5)
                .GroupBy(x => x.OrderDate.Date)
                .Select(g => new
                {
                    date = g.Key,
                    revenue = g.Sum(x => x.TotalAmount)
                })
                .OrderBy(x => x.date)
                .ToListAsync();

            return Ok(data);
        }

        // THÊM MỚI: REVENUE BY WEEK (Thống kê doanh thu theo tuần)
        [HttpGet("revenue-by-week")]
        public async Task<IActionResult> RevenueByWeek()
        {
            // Do Entity Framework Core không thể dịch trực tiếp các hàm xử lý tuần phức tạp xuống SQL tùy loại DB,
            // Giải pháp tối ưu và an toàn nhất là lấy data thô đã filter về RAM (AsEnumerable), sau đó GroupBy trên bộ nhớ.
            var orders = await _context.Orders
                .Where(x => x.OrderStatus == 5)
                .Select(x => new { x.OrderDate, x.TotalAmount })
                .ToListAsync();

            var data = orders
                .GroupBy(x => new
                {
                    Year = x.OrderDate.Year,
                    // Sử dụng thư viện chuẩn để xác định số tuần trong năm (ISO 8601)
                    Week = ISOWeek.GetWeekOfYear(x.OrderDate)
                })
                .Select(g => new
                {
                    year = g.Key.Year,
                    week = g.Key.Week,
                    revenue = g.Sum(x => x.TotalAmount)
                })
                .OrderBy(x => x.year)
                .ThenBy(x => x.week)
                .ToList();

            return Ok(data);
        }

        // REVENUE BY MONTH
        [HttpGet("revenue-by-month")]
        public async Task<IActionResult> RevenueByMonth()
        {
            var data = await _context.Orders
                .Where(x => x.OrderStatus == 5)
                .GroupBy(x => new
                {
                    x.OrderDate.Year,
                    x.OrderDate.Month
                })
                .Select(g => new
                {
                    year = g.Key.Year,
                    month = g.Key.Month,
                    revenue = g.Sum(x => x.TotalAmount)
                })
                .OrderBy(x => x.year)
                .ThenBy(x => x.month)
                .ToListAsync();

            return Ok(data);
        }
    }
}