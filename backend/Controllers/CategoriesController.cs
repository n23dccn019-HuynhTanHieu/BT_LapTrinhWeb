using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/categories
        [HttpGet]
        public async Task<IActionResult> GetAll(
            string? keyword,
            int page = 1,
            int pageSize = 10
        )
        {
            var query = _context.Categories.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(x =>
                    x.CategoryName.Contains(keyword));
            }

            var totalItems = await query.CountAsync();

            var categories = await query
                .OrderBy(x => x.CategoryID)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                totalItems,
                page,
                pageSize,
                data = categories
            });
        }

        // GET: api/categories/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var categories = await _context.Categories
                .FindAsync(id);

            if (categories == null)
            {
                return NotFound();
            }

            return Ok(categories);
        }

        // POST: api/categories
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(Category model)
        {
            _context.Categories.Add(model);

            await _context.SaveChangesAsync();

            return Ok(model);
        }

        // PUT: api/categories/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            Category model
        )
        {
            var categories = await _context.Categories
                .FindAsync(id);

            if (categories == null)
            {
                return NotFound();
            }

            categories.CategoryName = model.CategoryName;
            categories.Description = model.Description;
            categories.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(categories);
        }

        // DELETE: api/categories/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var categories = await _context.Categories
                .FindAsync(id);

            if (categories == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(categories);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Delete success"
            });
        }
    }
}