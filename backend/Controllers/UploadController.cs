using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            var folderPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "Uploads"
            );

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var fileName =
                Guid.NewGuid().ToString() +
                Path.GetExtension(file.FileName);

            var filePath = Path.Combine(
                folderPath,
                fileName
            );

            using (var stream = new FileStream(
                filePath,
                FileMode.Create
            ))
            {
                await file.CopyToAsync(stream);
            }

            var url =
                $"{Request.Scheme}://{Request.Host}/Uploads/{fileName}";

            return Ok(new
            {
                imageUrl = url
            });
        }
    }
}