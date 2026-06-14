using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using backend.DTOs.Admin;
using backend.Models;
using backend.DTOs;

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

        // ==========================================
        // 1. ADMIN GET USERS (QUẢN TRỊ VIÊN LẤY DANH SÁCH)
        // ==========================================
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? keyword,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 100
        )
        {
            var query = _context.Users
                .Include(x => x.Role)
                .Where(x => x.Role.RoleName == "Customer");

            if (!string.IsNullOrEmpty(keyword))
            {
                string cleanKeyword = keyword.Trim();

                if (int.TryParse(cleanKeyword, out int searchId))
                {
                    query = query.Where(x => x.UserID == searchId);
                }
                else
                {
                    query = query.Where(x =>
                        x.FullName.Contains(cleanKeyword) ||
                        x.Username.Contains(cleanKeyword) ||
                        (x.Phone != null && x.Phone.Contains(cleanKeyword))
                    );
                }
            }

            var totalItems = await query.CountAsync();

            var users = await query
                .OrderBy(x => x.UserID) 
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

        // ==========================================
        // 2. USER PROFILE (XEM HỒ SƠ CÁ NHÂN)
        // ==========================================
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

            if (user == null) return NotFound(new { message = "Không tìm thấy người dùng." });

            return Ok(user);
        }

        // ==========================================
        // 3. UPDATE PROFILE (CẬP NHẬT HỒ SƠ CÁ NHÂN)
        // ==========================================
        [Authorize]
        [HttpPut("profile")] 
        public async Task<IActionResult> Update([FromBody] UpdateAdminDto dto) 
        {
            // Quét đa tầng tất cả các kiểu đặt tên Claim của JWT Token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst("id")?.Value
                              ?? User.FindFirst("Id")?.Value
                              ?? User.FindFirst("UserID")?.Value;

            if (string.IsNullOrEmpty(userIdClaim)) 
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng từ Token." });
            
            int id = int.Parse(userIdClaim);

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Tài khoản không tồn tại." });

            // Cập nhật thông tin cá nhân
            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.Phone = dto.Phone;
            user.Address = dto.Address;
            user.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new {
                user.UserID,
                user.Username,
                user.FullName,
                user.Email,
                user.Phone,
                user.Address,
                message = "Cập nhật thông tin thành công!"
            });
        }

        // ==========================================
        // 4. CHANGE PASSWORD (ĐỔI MẬT KHẨU USER)
        // ==========================================
        [Authorize]
        [HttpPut("change-password")] 
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst("id")?.Value
                              ?? User.FindFirst("Id")?.Value
                              ?? User.FindFirst("UserID")?.Value;

            if (string.IsNullOrEmpty(userIdClaim)) 
                return Unauthorized(new { message = "Không xác định được danh tính người dùng." });
            
            int id = int.Parse(userIdClaim);

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Tài khoản không tồn tại." });

            bool checkOldPassword = BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash);
            if (!checkOldPassword)
            {
                return BadRequest(new { message = "Mật khẩu cũ không chính xác!" });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Đổi mật khẩu thành công!" });
        }

        // ==========================================
        // 5. ADMIN MANAGEMENT (QUẢN LÝ ADMINS KHÁC)
        // ==========================================
        [Authorize(Roles = "Admin")]
        [HttpGet("admins")]
        public async Task<IActionResult> GetAdmins()
        {
            var admins = await _context.Users
                .Include(x => x.Role)
                .Where(x => x.Role.RoleName == "Admin") // Chỉ lấy duy nhất quyền Admin
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
                    Role = x.Role.RoleName // Đảm bảo trả ra chữ "Admin" cho Frontend đọc
                })
                .ToListAsync();

            return Ok(new { data = admins });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("admins")]
        public async Task<IActionResult> CreateAdmin(CreateAdminDto dto)
        {
            bool exists = await _context.Users.AnyAsync(x => x.Username == dto.Username);
            if (exists) return BadRequest("Username already exists");

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
        public async Task<IActionResult> UpdateAdmin(int id, UpdateAdminDto dto)
        {
            var admin = await _context.Users.FindAsync(id);
            if (admin == null) return NotFound();

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
        public async Task<IActionResult> ChangeAdminPassword(int id, ChangePasswordDto dto)
        {
            var admin = await _context.Users.FindAsync(id);
            if (admin == null) return NotFound(new { message = "Không tìm thấy tài khoản quản trị viên" });

            bool isOldPasswordValid = BCrypt.Net.BCrypt.Verify(dto.OldPassword, admin.PasswordHash);
            if (!isOldPasswordValid) return BadRequest(new { message = "Mật khẩu hiện tại không chính xác!" });

            admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            admin.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Password updated successfully" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("admins/{id}")]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            var admin = await _context.Users.FindAsync(id);
            if (admin == null) return NotFound();

            _context.Users.Remove(admin);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Admin deleted successfully" });
        }
    }
}