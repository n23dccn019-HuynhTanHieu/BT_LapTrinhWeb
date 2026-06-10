using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            var totalProducts =
                await _context.Products.CountAsync();

            var totalUsers = await _context.Users
                .Include(x => x.Role)
                .CountAsync(x => x.Role.RoleName == "Customer");

            var totalOrders =
                await _context.Orders.CountAsync();

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