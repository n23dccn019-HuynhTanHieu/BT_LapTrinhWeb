INSERT INTO Categories(CategoryName, Description, CreatedAt, UpdatedAt)
VALUES
(N'Laptop', N'Các dòng máy tính xách tay văn phòng, gaming, đồ họa', GETDATE(), GETDATE()),
(N'Điện thoại', N'Smartphone chính hãng từ các thương hiệu lớn', GETDATE(), GETDATE()),
(N'Phụ kiện', N'Chuột, bàn phím, tai nghe, sạc dự phòng...', GETDATE(), GETDATE());

INSERT INTO Products
(CategoryID, ProductName, Price, PromoPrice, Thumbnail, Description,
StockQuantity, IsActive, CreatedAt, UpdatedAt)
VALUES

(1,N'Laptop Dell XPS 13',32000000,29990000,
'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRc5JsPNpPDG8UlE9GzmS3wMc7MjjoLqYdI5jXeuKY-FvLPre4Ih8qzM3TU8ugWqhexpwCUNEdZNwm_LTeaLMrFNJ2ViINomiRxpPVRZyYqRAPDH7ym5AhnMoPuHxFRy06AoaywzYE&usqp=CAc',
N'Laptop cao cấp màn hình OLED, thiết kế mỏng nhẹ',
25,1,GETDATE(),GETDATE()),

(1,N'MacBook Air M3 13 inch',31000000,29900000,
'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSIJ3f04y4ICHyWQyQbQd2Pxmp8mYoRjNbcbYu-7gjwS_2E-IQAkHmPhltyPJDnm2OfBFMh1Y-6WrqSOAIAF3QHGG7muxqW42Ad37qpFHGlapJrn2IoFooY1P9uxTQNiXfxVkkQ7wg&usqp=CAc',
N'Laptop Apple chip M3 hiệu năng cao',
40,1,GETDATE(),GETDATE()),

(1,N'Laptop Lenovo ThinkPad E14 Gen 5',22000000,20990000,
'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSYnjmHo6Jo8cHK59W2qNudJWnn3jkSnpA-EHrZu0nMjBES6eS9bkiAW7wE6KThHf1W2jXZbuuBQF7Esc5rT_cruVclNOQvS6eNyM0uWRfLPaHQBchJcuZ22MHqhExtg6wCqaPiTQ&usqp=CAc',
N'Laptop doanh nhân bền bỉ, bàn phím chất lượng',
35,1,GETDATE(),GETDATE()),

(1,N'Acer Nitro 5 Gaming',24000000,22990000,
'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTGGHaku81mRKffFhwF0yA5oBFsLTLPNK-Y_5C7mzsClV6NoXNj9eQrLQwlhyr0FLkOfi8jFRloudy9gmA8FwwQGupRS_nC1IZu76kKxOk6bxwBRylG9M-B99hFUaVAvMaEb2Izxg&usqp=CAc',
N'Laptop gaming RTX 4050, màn hình 144Hz',
20,1,GETDATE(),GETDATE()),

(2,N'iPhone 14 128GB',20000000,18990000,
'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSjbRpxN69Px9_7ENhP4aRG268vgyFXG_48l4Rw9B4WtAi12p6gN8gmN-BKdgDia4-oSAdi0GW-WAxhTfAAMeNFZWDf-fNaukIgxJOhiBdnTJPps5VQ9jdd66WnilbYzlTgiza7cVT6k18&usqp=CAc',
N'iPhone thế hệ trước vẫn rất mạnh mẽ',
60,1,GETDATE(),GETDATE()),

(2,N'Xiaomi 15 Ultra',25000000,23990000,
'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS4hSelFmu5wEZbj8liFmDPIECTw9AhgiN1Y1n-1XykBXqMXUEweat6KWjeilDIWbVaXfkIeybHA2S0sdBD45nNBTF0TNWF',
N'Flagship camera Leica cao cấp',
45,1,GETDATE(),GETDATE()),

(2,N'OPPO Find X8 Pro',27000000,25990000,
'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTYErMvwiTkLW7rY3Wz9e-2UsJBRfiQ2vdE5LEU86eFpmsQ7FS2-JNtwnByZhIxEPNkifYzYGyxAG1iPpoal2qdhW3ztDUU9f-eOCgGKdAvCXpRIIQG5Z1lnIRMfwrn6iUO47cL5g&usqp=CAc',
N'Điện thoại camera chất lượng cao',
50,1,GETDATE(),GETDATE()),

(2,N'Samsung Galaxy A56',11000000,10500000,
'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQj3LwmHsIhtiehQ0H6VKvW3FRQXxgTXelkPb5UMLOhFLbGvuKyDZPGVuPSUkEuuIgtpNAumft5lhTtzHzfjb-fAh7NX08tyh_90BsNJbuiWTu1dcXhAaFVz-GQRGTAXw6AdLnwpjx7zZQ&usqp=CAc',
N'Điện thoại tầm trung pin lớn',
100,1,GETDATE(),GETDATE()),

(3,N'Bàn phím Logitech MX Keys S',3200000,NULL,
'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTWs2CbPxVV2mz8rxZdyG3OzaAgywfTjRwqa_VRpQc6cIQ1vO2opLu-9wADBEAQOphET8by9D9I1v6EqsHFY6fKPH82mEnXobUdhLFzwvs1Bk1LACjLJBbj5zCduTr7CuwPuxa2JQ&usqp=CAc',
N'Bàn phím không dây cao cấp',
80,1,GETDATE(),GETDATE()),

(3,N'Tai nghe AirPods Pro 2',6500000,6200000,
'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT7btpuvj9VCYRACChcHGA-VzKArITYp8DHeXBHsPgJwp-99YuguvAtnwput7ysdGM5uop717gGiQsd8uOFitI2J6obeMBnZavNPZQmoXRRi2saT6dgVORtlX8tKdvxj9Cgvho6b3g&usqp=CAc',
N'Tai nghe chống ồn chủ động của Apple',
70,1,GETDATE(),GETDATE()),

(3,N'Sạc dự phòng Anker 20000mAh',1200000,NULL,
'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQVo4lcgSTNn79oPPY-QAVJNtKIAJH_UfMH5h1mRUNzuQej0oDgBeyM-jovHPaW6G6BPUtPrncionNVVZ3p-0eEK3Dvb-Q6hdLnLrnOpyozzB3hOsrYK1EvvkGtF_8Mqaj05sD004aEqg&usqp=CAc',
N'Sạc nhanh PD 20W dung lượng lớn',
150,1,GETDATE(),GETDATE()),

(3,N'Chuột Gaming Logitech G502 X',1800000,1650000,
'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ41dwtZjJNh1JPtzdMBkSX6MKVJ5keIARVEomek8R8OpAlLM4Cx9lvBPV18fl2khyJF0ncYzoG2jpjkSxem50ZAlRC5IGA_TfDhXmCuQ2DKl16CvKY1LrH35mUDpQBj-kIz8eyb3lS&usqp=CAc',
N'Chuột gaming cảm biến HERO',
90,1,GETDATE(),GETDATE()),

(3,N'Webcam Logitech C920 HD Pro',2200000,NULL,
'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ1vYFwelvkaJeSuT0uksKVsSxdEe4tnZYnGNcrjK3xsNs6kAq5JtW9W1o7RyhJLLAt3nEJeicKNUm4HC0_WiFIfVC-6oR-FRjO-gVNelS3R2EIr2lfWpDAXb448hfkyyM_d6xYKJ5Rqw&usqp=CAc',
N'Webcam Full HD dành cho học tập và họp online',
50,1,GETDATE(),GETDATE());

INSERT INTO Users
(RoleID, Username, PasswordHash, FullName, Email, Phone, Address,
IsActive, CreatedAt, UpdatedAt)
VALUES

-- Admin
(1,'admin','$2a$11$x2kGvx3hUhvkbREInoUmwusPxzXU/ufyQLGpL6VtI1XMumuPM3hvC',
N'Quản Trị Viên','admin@ecommerce.com','0901234567',
N'123 Đường Lê Lợi, TP.HCM',1,GETDATE(),GETDATE()),

-- Customers
(2,'nguyenvana','$2a$11$x2kGvx3hUhvkbREInoUmwusPxzXU/ufyQLGpL6VtI1XMumuPM3hvC',
N'Nguyễn Văn A','vana@gmail.com','0912345678',
N'456 Nguyễn Huệ, TP.HCM',1,GETDATE(),GETDATE()),

(2,'lethib','$2a$11$x2kGvx3hUhvkbREInoUmwusPxzXU/ufyQLGpL6VtI1XMumuPM3hvC',
N'Lê Thị B','thib@gmail.com','0923456789',
N'789 CMT8, TP.HCM',1,GETDATE(),GETDATE()),

(2,'tranvanc','$2a$11$x2kGvx3hUhvkbREInoUmwusPxzXU/ufyQLGpL6VtI1XMumuPM3hvC',
N'Trần Văn C','vanc@gmail.com','0934567890',
N'101 Điện Biên Phủ, TP.HCM',1,GETDATE(),GETDATE()),

(2,'phamvand','$2a$11$x2kGvx3hUhvkbREInoUmwusPxzXU/ufyQLGpL6VtI1XMumuPM3hvC',
N'Phạm Văn D','vand@gmail.com','0945678901',
N'12 Nguyễn Trãi, TP.HCM',1,GETDATE(),GETDATE()),

(2,'hoangthie','$2a$11$x2kGvx3hUhvkbREInoUmwusPxzXU/ufyQLGpL6VtI1XMumuPM3hvC',
N'Hoàng Thị E','thie@gmail.com','0956789012',
N'34 Lê Duẩn, TP.HCM',1,GETDATE(),GETDATE());

INSERT INTO Orders
(UserID, ReceiverName, ReceiverPhone, ReceiverAddress,
OrderStatus, TotalAmount, Note, OrderDate, UpdatedAt)
VALUES

(2,N'Nguyễn Văn A','0912345678',N'456 Nguyễn Huệ, TP.HCM',5,23500000,N'Đã giao','2026-06-19',GETDATE()),
(3,N'Lê Thị B','0923456789',N'789 CMT8, TP.HCM',5,28990000,N'Đã giao','2026-06-18',GETDATE()),
(4,N'Trần Văn C','0934567890',N'101 Điện Biên Phủ, TP.HCM',5,6500000,N'Đã giao','2026-06-17',GETDATE()),
(5,N'Phạm Văn D','0945678901',N'12 Nguyễn Trãi, TP.HCM',5,2500000,N'Đã giao','2026-06-12',GETDATE()),
(6,N'Hoàng Thị E','0956789012',N'34 Lê Duẩn, TP.HCM',5,28990000,N'Đã giao','2026-06-08',GETDATE()),

(2,N'Nguyễn Văn A','0912345678',N'456 Nguyễn Huệ, TP.HCM',5,26500000,N'Đã giao','2026-05-20',GETDATE()),
(3,N'Lê Thị B','0923456789',N'789 CMT8, TP.HCM',5,2500000,N'Đã giao','2026-05-12',GETDATE()),
(4,N'Trần Văn C','0934567890',N'101 Điện Biên Phủ, TP.HCM',5,18000000,N'Đã giao','2026-04-17',GETDATE()),
(5,N'Phạm Văn D','0945678901',N'12 Nguyễn Trãi, TP.HCM',5,23500000,N'Đã giao','2026-04-07',GETDATE()),
(6,N'Hoàng Thị E','0956789012',N'34 Lê Duẩn, TP.HCM',5,5990000,N'Đã giao','2026-03-13',GETDATE()),

(2,N'Nguyễn Văn A','0912345678',N'456 Nguyễn Huệ, TP.HCM',0,23500000,N'',GETDATE(),GETDATE()),
(3,N'Lê Thị B','0923456789',N'789 CMT8, TP.HCM',1,28990000,N'',GETDATE(),GETDATE()),
(4,N'Trần Văn C','0934567890',N'101 Điện Biên Phủ, TP.HCM',3,6500000,N'',GETDATE(),GETDATE());

INSERT INTO OrderDetails(OrderID, ProductID, Quantity, Price)
VALUES
(1,1,1,23500000),
(2,3,1,28990000),
(3,6,1,6500000),
(4,5,1,2500000),
(5,3,1,28990000),

(6,4,1,26500000),
(7,5,1,2500000),
(8,2,1,18000000),
(9,1,1,23500000),
(10,6,1,5990000),

(11,1,1,23500000),
(12,3,1,28990000),
(13,6,1,6500000);