using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/product
        [HttpGet]
        public async Task<IActionResult> GetAll(
            string? keyword,
            int? categoryId,
            decimal? minPrice,
            decimal? maxPrice,
            string? sortBy,
            int page = 1,
            int pageSize = 10
        )
        {
            var query = _context.Products
                .Include(x => x.Category)
                .AsQueryable();

            // Search
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(x =>
                    x.ProductName.Contains(keyword));
            }

            // Filter Category
            if (categoryId.HasValue)
            {
                query = query.Where(x =>
                    x.CategoryID == categoryId);
            }

            // Filter Price
            if (minPrice.HasValue)
            {
                query = query.Where(x =>
                    x.Price >= minPrice);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(x =>
                    x.Price <= maxPrice);
            }

            // Sorting
            query = sortBy switch
                {
                    "price_asc" => query.OrderBy(x => x.Price),
                    "price_desc" => query.OrderByDescending(x => x.Price),
                    "name_asc" => query.OrderBy(x => x.ProductName),
                    "name_desc" => query.OrderByDescending(x => x.ProductName),
                    _ => query.OrderBy(x => x.ProductID)
                };

            var totalItems = await query.CountAsync();

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                totalItems,
                page,
                pageSize,
                data = products
            });
        }

        // GET: api/product/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(x => x.Category)
                .FirstOrDefaultAsync(x =>
                    x.ProductID == id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        // POST: api/product
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(Product model)
        {
            _context.Products.Add(model);

            await _context.SaveChangesAsync();

            return Ok(model);
        }

        // PUT: api/product/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Product model)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            // Kiểm tra số lượng tồn kho không được âm
            if (model.StockQuantity < 0)
            {
                return BadRequest("Số lượng tồn kho không được là số âm.");
            }

            product.ProductName = model.ProductName;
            product.Price = model.Price;
            product.PromoPrice = model.PromoPrice;
            product.Thumbnail = model.Thumbnail;
            product.Description = model.Description;
            product.StockQuantity = model.StockQuantity; // Cập nhật kho
            product.CategoryID = model.CategoryID;
            product.IsActive = model.IsActive;
            product.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(product);
        }
        // DELETE: api/product/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products
                .FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Delete success"
            });
        }
    }
}