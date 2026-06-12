using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using backend.DTOs.Admin;
using backend.Models;

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
        [FromQuery] string? keyword,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 100
    )
    {
        // 1. Tạo câu lệnh base và lọc cứng Role Name từ đầu
        var query = _context.Users
            .Include(x => x.Role)
            .Where(x => x.Role.RoleName == "Customer");

        // 2. Xử lý bộ lọc tìm kiếm
        if (!string.IsNullOrEmpty(keyword))
        {
            string cleanKeyword = keyword.Trim();

            if (int.TryParse(cleanKeyword, out int searchId))
            {
                // Lọc tuyệt đối theo ID tài khoản
                query = query.Where(x => x.UserID == searchId);
            }
            else
            {
                // Lọc tương đối theo thông tin chuỗi
                query = query.Where(x =>
                    x.FullName.Contains(cleanKeyword) ||
                    x.Username.Contains(cleanKeyword) ||
                    (x.Phone != null && x.Phone.Contains(cleanKeyword))
                );
            }
        }

        // 3. Đếm tổng số lượng dòng thỏa mãn điều kiện lọc
        var totalItems = await query.CountAsync();

        // 4. THỰC THI SẮP XẾP VÀ PHÂN TRANG (Đảm bảo OrderBy chạy trực tiếp trên SQL server)
        var users = await query
            .OrderBy(x => x.UserID) // Ép SQL Server quét chỉ mục (Index) tăng dần
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
        public async Task<IActionResult> Update(int id, Models.User model)
        {
            var user = await _context.Users.FindAsync(id);

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
        public async Task<IActionResult> ChangePassword(int id, string oldPassword, string newPassword)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            bool checkOldPassword = BCrypt.Net.BCrypt.Verify(oldPassword, user.PasswordHash);

            if (!checkOldPassword)
            {
                return BadRequest("Old password incorrect");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Password changed" });
        }

        //ADMIN GET ADMIN
        [Authorize(Roles = "Admin")]
        [HttpGet("admins")]
        public async Task<IActionResult> GetAdmins()
        {
            var admins = await _context.Users
                .Include(x => x.Role)
                .Where(x => x.Role.RoleName == "Admin")
                .Select(x => new
                {
                    x.UserID,
                    x.Username,
                    x.FullName,
                    x.Email,
                    x.Phone,
                    x.Address,
                    x.IsActive,
                    x.CreatedAt
                })
                .ToListAsync();

            return Ok(admins);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("admins")]
        public async Task<IActionResult> CreateAdmin(CreateAdminDto dto)
        {
            bool exists = await _context.Users
                .AnyAsync(x => x.Username == dto.Username);

            if (exists)
                return BadRequest("Username already exists");

            var admin = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                RoleID = 1, // Admin
                IsActive = true,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Users.Add(admin);
            await _context.SaveChangesAsync();

            return Ok(admin);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("admins/{id}")]
        public async Task<IActionResult> UpdateAdmin(
            int id,
            UpdateAdminDto dto)
        {
            var admin = await _context.Users.FindAsync(id);

            if (admin == null)
                return NotFound();

            admin.FullName = dto.FullName;
            admin.Email = dto.Email;
            admin.Phone = dto.Phone;
            admin.Address = dto.Address;
            admin.IsActive = dto.IsActive;
            admin.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(admin);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("admins/{id}/password")]
        public async Task<IActionResult> ChangeAdminPassword(
            int id,
            ChangePasswordDto dto)
        {
            var admin = await _context.Users.FindAsync(id);

            if (admin == null)
                return NotFound();

            admin.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            admin.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Password updated successfully"
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("admins/{id}")]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            var admin = await _context.Users.FindAsync(id);

            if (admin == null)
                return NotFound();

            _context.Users.Remove(admin);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Admin deleted successfully"
            });
        }
    }
}