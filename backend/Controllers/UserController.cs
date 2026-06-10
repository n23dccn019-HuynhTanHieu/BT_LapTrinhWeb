using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // ADMIN GET USERS
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll(
            string? keyword,
            int page = 1,
            int pageSize = 10
        )
        {
            var query = _context.Users
                .Include(x => x.Role)
                .Where(x => x.Role.RoleName == "Customer")
                .AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(x =>
                    x.FullName.Contains(keyword) ||
                    x.Username.Contains(keyword)
                );
            }

            var totalItems = await query.CountAsync();

            var users = await query
                .OrderByDescending(x => x.UserID)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new
                {
                    x.UserID,
                    x.Username,
                    x.FullName,
                    x.Email,
                    x.Phone,
                    x.Address,
                    x.IsActive,
                    x.CreatedAt,
                    Role = x.Role.RoleName
                })
                .ToListAsync();

            return Ok(new
            {
                totalItems,
                page,
                pageSize,
                data = users
            });
        }
        // USER PROFILE
        [Authorize]
        [HttpGet("profile/{id}")]
        public async Task<IActionResult> GetProfile(int id)
        {
            var user = await _context.Users
                .Include(x => x.Role)
                .Where(x => x.UserID == id)
                .Select(x => new
                {
                    x.UserID,
                    x.Username,
                    x.FullName,
                    x.Email,
                    x.Phone,
                    x.Address,
                    Role = x.Role.RoleName
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // UPDATE PROFILE
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            Models.User model
        )
        {
            var user = await _context.Users
                .FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            user.FullName = model.FullName;
            user.Email = model.Email;
            user.Phone = model.Phone;
            user.Address = model.Address;
            user.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(user);
        }

        // CHANGE PASSWORD
        [Authorize]
        [HttpPut("{id}/change-password")]
        public async Task<IActionResult> ChangePassword(
            int id,
            string oldPassword,
            string newPassword
        )
        {
            var user = await _context.Users
                .FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            bool checkOldPassword =
                BCrypt.Net.BCrypt.Verify(
                    oldPassword,
                    user.PasswordHash
                );

            if (!checkOldPassword)
            {
                return BadRequest(
                    "Old password incorrect"
                );
            }

            user.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(
                    newPassword
                );

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Password changed"
            });
        }
    }
}