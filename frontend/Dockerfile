# Sử dụng trực tiếp Web Server Nginx siêu nhẹ
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy THẲNG thư mục 'dist' bạn đã build thành công ở máy thật vào Nginx
COPY dist /usr/share/nginx/html

# Mở cổng 80 trong container
EXPOSE 80

# SỬA DÒNG NÀY: Viết dạng chuỗi thuần túy không ngoặc vuông
CMD nginx -g "daemon off;"