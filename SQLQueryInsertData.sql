INSERT INTO Categories(CategoryName, Description, CreatedAt, UpdatedAt)
VALUES
(N'Laptop', N'Các dòng máy tính xách tay văn phòng, gaming, đồ họa', GETDATE(), GETDATE()),
(N'Điện thoại', N'Smartphone chính hãng từ các thương hiệu lớn', GETDATE(), GETDATE()),
(N'Phụ kiện', N'Chuột, bàn phím, tai nghe, sạc dự phòng...', GETDATE(), GETDATE());

INSERT INTO Products
(CategoryID, ProductName, Price, PromoPrice, Thumbnail, Description,
StockQuantity, IsActive, CreatedAt, UpdatedAt)
VALUES

-- Laptop
(1,N'Laptop Dell XPS 13',32000000,29990000,
'http://localhost:8080/Uploads/9f87075d-cbe2-40bf-ba0a-5e0fe63e36fa.webp',
N'Laptop cao cấp màn hình OLED',25,1,GETDATE(),GETDATE()),

(1,N'MacBook Air M3 13 inch',31000000,29900000,
'http://localhost:8080/Uploads/3119e902-ce43-473a-b1f3-165098c24ed3.webp',
N'Laptop Apple chip M3',40,1,GETDATE(),GETDATE()),

(1,N'Lenovo ThinkPad E14 Gen 5',22000000,20990000,
'http://localhost:8080/Uploads/fa4281ff-92c0-42fb-82d3-c87cbeb04a42.webp',
N'Laptop doanh nhân',35,1,GETDATE(),GETDATE()),

(1,N'Acer Nitro 5 Gaming',24000000,22990000,
'http://localhost:8080/Uploads/271e4100-4ba8-4b41-8ca3-12169d2aa1d8.webp',
N'Laptop gaming RTX',20,1,GETDATE(),GETDATE()),

(1,N'ASUS Vivobook 15',18000000,16990000,
'http://localhost:8080/Uploads/991877c1-896f-462e-879f-3b80578524f9.webp',
N'Laptop học tập văn phòng',45,1,GETDATE(),GETDATE()),

(1,N'HP Pavilion 15',19500000,18500000,
'http://localhost:8080/Uploads/a7b6f712-b53d-49f7-89e3-53bd241e22c3.webp',
N'Laptop đa năng',30,1,GETDATE(),GETDATE()),

(1,N'MSI Cyborg 15',26000000,24990000,
'http://localhost:8080/Uploads/97717620-8608-4999-9d15-41b455062b33.webp',
N'Laptop gaming',18,1,GETDATE(),GETDATE()),

(1,N'ASUS ROG Strix G16',35000000,33990000,
'http://localhost:8080/Uploads/8be29ba9-ad54-4b37-b32d-2c9e7303b138.webp',
N'Gaming hiệu năng cao',15,1,GETDATE(),GETDATE()),

(1,N'Dell Inspiron 15',17000000,15990000,
'http://localhost:8080/Uploads/79fb4bb0-1abb-4589-a927-e9090e60c86e.webp',
N'Laptop văn phòng',50,1,GETDATE(),GETDATE()),

(1,N'Lenovo IdeaPad Slim 5',21000000,19990000,
'http://localhost:8080/Uploads/0040dd54-98ba-4605-acfb-fb88fc221b47.webp',
N'Mỏng nhẹ pin lâu',28,1,GETDATE(),GETDATE()),

-- Điện thoại
(2,N'iPhone 14 128GB',20000000,18990000,
'http://localhost:8080/Uploads/3aff8b74-6bea-4fd5-8def-0dc3ce0266a7.webp',
N'iPhone chính hãng',60,1,GETDATE(),GETDATE()),

(2,N'iPhone 15 128GB',24000000,22990000,
'http://localhost:8080/Uploads/3bf7414b-aba3-42bd-83c0-aba9c58cbdd7.webp',
N'iPhone Dynamic Island',55,1,GETDATE(),GETDATE()),

(2,N'Samsung Galaxy S25',25000000,23990000,
'http://localhost:8080/Uploads/42442a8f-53f2-4056-9227-02327cb74b03.webp',
N'Flagship Samsung',40,1,GETDATE(),GETDATE()),

(2,N'Samsung Galaxy A56',11000000,10500000,
'http://localhost:8080/Uploads/8bfe5181-3c6d-40f0-a399-5ca221058339.jpg',
N'Tầm trung pin lớn',100,1,GETDATE(),GETDATE()),

(2,N'Xiaomi 15 Ultra',25000000,23990000,
'http://localhost:8080/Uploads/ad10acee-f217-4935-8f77-ab57c557c997.webp',
N'Camera Leica',45,1,GETDATE(),GETDATE()),

(2,N'OPPO Find X8 Pro',27000000,25990000,
'http://localhost:8080/Uploads/6bf6007b-a8dc-4f8d-bd15-aa8f1ed1d367.jpg',
N'Camera cao cấp',50,1,GETDATE(),GETDATE()),

(2,N'vivo X200 Pro',26000000,24990000,
'http://localhost:8080/Uploads/63e7cf82-13dc-4d14-8043-b3def708a5f1.jpg',
N'Flagship Vivo',30,1,GETDATE(),GETDATE()),

(2,N'Realme GT 7',13000000,12500000,
'http://localhost:8080/Uploads/04089550-41ed-401d-89ca-bcb3cf6467c2.webp',
N'Hiệu năng mạnh',70,1,GETDATE(),GETDATE()),

(2,N'Google Pixel 9',22000000,20990000,
'http://localhost:8080/Uploads/a78b843f-5475-417b-bfff-f2ebc3057dd7.jpg',
N'Android gốc',20,1,GETDATE(),GETDATE()),

(2,N'Nothing Phone 3',17000000,15990000,
'http://localhost:8080/Uploads/2b221e05-3201-4960-a4ff-e1546dde371d.jpg',
N'Thiết kế độc đáo',25,1,GETDATE(),GETDATE()),

-- Phụ kiện
(3,N'Bàn phím Logitech MX Keys S',3200000,NULL,
'http://localhost:8080/Uploads/59665f3a-f4c9-4257-9526-ba84698fe3d7.jpg',
N'Bàn phím cao cấp',80,1,GETDATE(),GETDATE()),

(3,N'Chuột Logitech MX Master 3S',2500000,2300000,
'http://localhost:8080/Uploads/4a76b541-4977-439e-a1e5-ce6787a4893c.webp',
N'Chuột văn phòng',70,1,GETDATE(),GETDATE()),

(3,N'Chuột Gaming Logitech G502 X',1800000,1650000,
'http://localhost:8080/Uploads/f2529160-3829-4010-a5ec-59433432e6df.webp',
N'Gaming HERO',90,1,GETDATE(),GETDATE()),

(3,N'Tai nghe AirPods Pro 2',6500000,6200000,
'http://localhost:8080/Uploads/4cd30a83-8d36-4ad7-98e7-378f53c01e97.webp',
N'Chống ồn chủ động',70,1,GETDATE(),GETDATE()),

(3,N'Sony WH-1000XM5',7000000,6800000,
'http://localhost:8080/Uploads/328f934a-458c-4295-9170-88b9b85883c9.jpg',
N'Tai nghe chống ồn',40,1,GETDATE(),GETDATE()),

(3,N'Sạc dự phòng Anker 20000mAh',1200000,NULL,
'http://localhost:8080/Uploads/f39b4d8a-3cc8-47a0-8881-afc870b9a5ff.webp',
N'Sạc nhanh PD',150,1,GETDATE(),GETDATE()),

(3,N'Webcam Logitech C920 HD Pro',2200000,NULL,
'http://localhost:8080/Uploads/a66907b1-cf31-47f6-b950-700b254d60a9.webp',
N'Webcam Full HD',50,1,GETDATE(),GETDATE()),

(3,N'Ổ cứng SSD Samsung T7 1TB',2800000,2600000,
'http://localhost:8080/Uploads/1a42dce1-4b30-4191-a9a1-c3c2c88311df.webp',
N'SSD di động',35,1,GETDATE(),GETDATE()),

(3,N'Loa Bluetooth JBL Flip 6',2500000,2390000,
'http://localhost:8080/Uploads/c1f9564a-425c-4957-a5c7-f33968997abf.jpg',
N'Loa chống nước',60,1,GETDATE(),GETDATE()),

(3,N'Hub USB-C UGREEN 6 in 1',900000,NULL,
'http://localhost:8080/Uploads/4e15765f-1046-47bf-b48f-00ba3cfd405f.jpg',
N'Hub mở rộng cổng kết nối',100,1,GETDATE(),GETDATE());

INSERT INTO Users
(RoleID, Username, PasswordHash, FullName, Email, Phone, Address,
IsActive, CreatedAt, UpdatedAt)
VALUES

-- Admin
(1,'admin',
'$2a$11$x2kGvx3hUhvkbREInoUmwusPxzXU/ufyQLGpL6VtI1XMumuPM3hvC',
N'Quản trị viên',
'admin@ecommerce.com',
'0901234567',
N'Quận 1, TP.HCM',
1,GETDATE(),GETDATE()),

-- Customer test
(2,'testcustomer01',
'$2a$11$x2kGvx3hUhvkbREInoUmwusPxzXU/ufyQLGpL6VtI1XMumuPM3hvC',
N'Nguyễn Thành Công',
'testcustomer01@gmail.com',
'0912345678',
N'Thủ Đức, TP.HCM',
1,GETDATE(),GETDATE()),

(2,'phamminhduc',
'$2a$11$x2kGvx3hUhvkbREInoUmwusPxzXU/ufyQLGpL6VtI1XMumuPM3hvC',
N'Phạm Minh Đức',
'duc@gmail.com',
'0923456789',
N'Gò Vấp, TP.HCM',
1,GETDATE(),GETDATE()),

(2,'nguyenkhanhlinh',
'$2a$11$x2kGvx3hUhvkbREInoUmwusPxzXU/ufyQLGpL6VtI1XMumuPM3hvC',
N'Nguyễn Khánh Linh',
'linh@gmail.com',
'0934567890',
N'Bình Thạnh, TP.HCM',
1,GETDATE(),GETDATE()),

(2,'lequanghuy',
'$2a$11$x2kGvx3hUhvkbREInoUmwusPxzXU/ufyQLGpL6VtI1XMumuPM3hvC',
N'Lê Quang Huy',
'huy@gmail.com',
'0945678901',
N'Tân Bình, TP.HCM',
1,GETDATE(),GETDATE()),

(2,'vothanhha',
'$2a$11$x2kGvx3hUhvkbREInoUmwusPxzXU/ufyQLGpL6VtI1XMumuPM3hvC',
N'Võ Thanh Hà',
'ha@gmail.com',
'0956789012',
N'Quận 7, TP.HCM',
1,GETDATE(),GETDATE());

INSERT INTO Orders
(UserID, ReceiverName, ReceiverPhone, ReceiverAddress,
OrderStatus, TotalAmount, Note, OrderDate, UpdatedAt)
VALUES

-- Tháng 4
(2,N'Nguyễn Thành Công','0912345678',N'Thủ Đức, TP.HCM',5,29990000,N'Đã giao','2026-04-03',GETDATE()),
(3,N'Phạm Minh Đức','0923456789',N'Gò Vấp, TP.HCM',5,23990000,N'Đã giao','2026-04-07',GETDATE()),
(4,N'Nguyễn Khánh Linh','0934567890',N'Bình Thạnh, TP.HCM',5,6500000,N'Đã giao','2026-04-11',GETDATE()),
(5,N'Lê Quang Huy','0945678901',N'Tân Bình, TP.HCM',5,12500000,N'Đã giao','2026-04-15',GETDATE()),
(6,N'Võ Thanh Hà','0956789012',N'Quận 7, TP.HCM',5,20990000,N'Đã giao','2026-04-22',GETDATE()),

-- Tháng 5
(2,N'Nguyễn Thành Công','0912345678',N'Thủ Đức, TP.HCM',5,22990000,N'Đã giao','2026-05-02',GETDATE()),
(3,N'Phạm Minh Đức','0923456789',N'Gò Vấp, TP.HCM',5,33990000,N'Đã giao','2026-05-06',GETDATE()),
(4,N'Nguyễn Khánh Linh','0934567890',N'Bình Thạnh, TP.HCM',5,16990000,N'Đã giao','2026-05-10',GETDATE()),
(5,N'Lê Quang Huy','0945678901',N'Tân Bình, TP.HCM',5,2600000,N'Đã giao','2026-05-14',GETDATE()),
(6,N'Võ Thanh Hà','0956789012',N'Quận 7, TP.HCM',5,6800000,N'Đã giao','2026-05-20',GETDATE()),

-- Đầu tháng 6
(2,N'Nguyễn Thành Công','0912345678',N'Thủ Đức, TP.HCM',5,23990000,N'Đã giao','2026-06-01',GETDATE()),
(3,N'Phạm Minh Đức','0923456789',N'Gò Vấp, TP.HCM',5,24990000,N'Đã giao','2026-06-05',GETDATE()),
(4,N'Nguyễn Khánh Linh','0934567890',N'Bình Thạnh, TP.HCM',5,2300000,N'Đã giao','2026-06-08',GETDATE()),
(5,N'Lê Quang Huy','0945678901',N'Tân Bình, TP.HCM',5,2390000,N'Đã giao','2026-06-10',GETDATE()),
(6,N'Võ Thanh Hà','0956789012',N'Quận 7, TP.HCM',5,6200000,N'Đã giao','2026-06-12',GETDATE()),

-- Tuần hiện tại
(2,N'Nguyễn Thành Công','0912345678',N'Thủ Đức, TP.HCM',0,29990000,N'', '2026-06-17',GETDATE()),
(3,N'Phạm Minh Đức','0923456789',N'Gò Vấp, TP.HCM',1,23990000,N'', '2026-06-18',GETDATE()),
(4,N'Nguyễn Khánh Linh','0934567890',N'Bình Thạnh, TP.HCM',2,20990000,N'', '2026-06-19',GETDATE()),
(5,N'Lê Quang Huy','0945678901',N'Tân Bình, TP.HCM',3,6500000,N'', '2026-06-20',GETDATE()),
(6,N'Võ Thanh Hà','0956789012',N'Quận 7, TP.HCM',4,12500000,N'', '2026-06-20',GETDATE());

INSERT INTO OrderDetails(OrderID, ProductID, Quantity, Price)
VALUES

(1,1,1,29990000),
(2,15,1,23990000),
(3,17,1,6500000),
(4,18,1,12500000),
(5,19,1,20990000),

(6,12,1,22990000),
(7,8,1,33990000),
(8,5,1,16990000),
(9,28,1,2600000),
(10,25,1,6800000),

(11,13,1,23990000),
(12,17,1,24990000),
(13,22,1,2300000),
(14,29,1,2390000),
(15,24,1,6200000),

(16,1,1,29990000),
(17,15,1,23990000),
(18,19,1,20990000),
(19,24,1,6500000),
(20,18,1,12500000);
