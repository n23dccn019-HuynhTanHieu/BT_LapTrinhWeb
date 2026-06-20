# Stage 1: Build ứng dụng
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Môi trường chạy
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# 🔴 THAY ĐỔI TẠI ĐÂY: Tạo thư mục Uploads thay vì wwwroot
RUN mkdir -p Uploads

COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "backend.dll"]