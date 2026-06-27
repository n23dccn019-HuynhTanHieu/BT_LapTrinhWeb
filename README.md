
# Đồ Án Lập Trình Web - Website Thương Mại Điện Tử (Ecommerce)

Dự án Website Thương mại điện tử hoàn chỉnh được phát triển theo kiến trúc tách biệt độc lập **Frontend - Backend**, đóng gói và vận hành tối ưu trong môi trường **Docker Container**. Cấu trúc Cơ sở dữ liệu được quản lý tự động theo phương pháp **Code-First (Entity Framework Core)**.

---

## 🚀 Công Nghệ Sử Dụng

* **Frontend:** ReactJS / Vite / Nginx (Đóng gói cổng mạng nội bộ `80`)
* **Backend:** .NET 8 Web API / Kestrel
* **Database:** SQL Server (Chạy trực tiếp trên hệ điều hành máy thật)
* **ORM & Migration:** Entity Framework Core 8
* **Containerization:** Docker

---

## 🌐 Địa Chỉ Truy Cập Hệ Thống

Sau khi kích hoạt các container Docker, bạn truy cập dự án qua:
* **Giao diện Web (Frontend):** [http://localhost:3000](http://localhost:3000)
* **Tài liệu API (Backend Swagger):** [http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html)

---

## 🛠️ Hướng Dẫn Cài Đặt Và Khởi Chạy

### 🗒️ Lưu ý chuẩn bị trước:
1. Khởi động phần mềm **Docker Desktop** trên máy.
2. Đảm bảo máy tính đã cài đặt `.NET 8 SDK` và công cụ `dotnet-ef`.

Mở Terminal tại thư mục gốc `D:\BT_LapTrinhWeb` và chạy tuần tự các nhóm lệnh sau:

### Bước 1: Khởi Tạo Cơ Sở Dữ Liệu & Nạp Dữ Liệu Mẫu

Dự án sử dụng phương pháp Code-First, cấu trúc bảng được định nghĩa bằng mã nguồn C#. Chạy lệnh sau để tự động tạo Database và toàn bộ các bảng trống trong SQL Server:

```bash
# 1. Di chuyển vào thư mục backend nơi chứa mã nguồn .NET 8
cd backend

# 2. Chạy lệnh cập nhật cấu hình và tự động sinh cấu trúc bảng vào SQL Server
dotnet ef database update

```

**📌 Thực hiện nạp dữ liệu mẫu (Seed Data):**

* Mở phần mềm **SQL Server Management Studio (SSMS)** và kết nối vào SQL Server của bạn.
* Chọn đúng cơ sở dữ liệu `EcommerceDB` vừa được sinh ra.
* Mở file script **`SQLQueryInsertData.sql`** (được đính kèm trong thư mục dự án) trực tiếp bằng SSMS và nhấn **Execute (F5)** để nạp dữ liệu mồi ban đầu (tài khoản mẫu, danh mục, sản phẩm) vào hệ thống.

---

### Bước 2: Khởi Chạy Backend .NET API (Cổng 8080)

Nhóm lệnh này sẽ dọn dẹp container cũ, tự động build lại mã nguồn Backend mới nhất và kích hoạt kết nối về SQL Server máy thật (sử dụng quyền Windows Authentication), đồng thời ánh xạ ổ đĩa lưu trữ ảnh để không bị mất dữ liệu khi xóa container.

```bash
# 1. Dọn dẹp container backend cũ tránh xung đột tên (nếu đang ở thư mục backend)
docker rm -f backend-container

# 2. Build image mới từ mã nguồn hiện tại
docker build --no-cache -t backend-api:latest .

# 3. Khởi chạy container với cấu hình Volume và Biến môi trường
docker run -d -p 8080:8080 --name backend-container -v d:/BT_LapTrinhWeb/backend/Uploads:/app/Uploads -e ConnectionStrings__DefaultConnection="Server=host.docker.internal;Database=EcommerceDB;Integrated Security=True;TrustServerCertificate=True;" -e Jwt__Key="THIS_IS_MY_SUPER_SECRET_JWT_KEY_2026_123456789" -e Jwt__Issuer="EcommerceAPI" -e Jwt__Audience="EcommerceAPI" backend-api:latest

```

### Bước 3: Khởi Chạy Frontend React (Cổng 3000)

Quay trở lại thư mục gốc, di chuyển vào thư mục `frontend` để thực hiện biên dịch code tĩnh và đưa vào môi trường Docker:

```bash
# 1. Di chuyển sang thư mục frontend
cd ../frontend

# 2. Xóa container frontend cũ
docker rm -f frontend-container

# 3. Biên dịch mã nguồn React sang thư mục dist
npm run build

# 4. Đóng gói Image cho Frontend
docker build --no-cache -t frontend-web:latest .

# 5. Khởi chạy container Frontend lên cổng 3000
docker run -d -p 3000:80 --name frontend-container frontend-web:latest

```

## 🔍 Lệnh Quản Lý Tiện Ích

* **Kiểm tra trạng thái các container đang hoạt động:**
```bash
docker ps

```


* **Xem log vận hành / Báo lỗi của Backend:**
```bash
docker logs backend-container

```


* **Dừng nhanh toàn bộ hệ thống dự án:**
```bash
docker stop backend-container frontend-container

```
