namespace backend.DTOs.Admin
{
    public class CreateAdminDto
    {
        public string Username { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public string? Address { get; set; }

        public string Password { get; set; } = string.Empty;
    }
}