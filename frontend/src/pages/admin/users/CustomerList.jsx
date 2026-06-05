import React, { useState } from 'react';

const CustomerList = () => {
  // Chỉ Xem thông tin
  const [customers] = useState([
    { id: 1, name: 'Nguyễn Văn Thành', email: 'thanhnv@gmail.com', phone: '0912345678', createdAt: '2026-01-10' },
    { id: 2, name: 'Lê Thị Diễm', email: 'diemle@gmail.com', phone: '0945678901', createdAt: '2026-03-15' },
  ]);

  const [search, setSearch] = useState('');

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">👥 Danh Sách Khách Hàng Thành Viên</h2>
      <p className="text-xs text-gray-400 font-medium bg-blue-50 border text-blue-700 px-3 py-1.5 rounded-lg inline-block">📌 Theo yêu cầu đặc tả: Trang này chỉ dành để xem thông tin khách hàng.</p>

      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc số điện thoại..."
          className="border p-2 rounded-lg w-full max-w-xs focus:outline-indigo-500 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">Họ và Tên</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Số điện thoại</th>
              <th className="p-4 font-semibold text-gray-600">Ngày đăng ký tài khoản</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers
              .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))
              .map((user, idx) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-500">{idx + 1}</td>
                  <td className="p-4 font-medium text-gray-800">{user.name}</td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4 text-gray-600">{user.phone}</td>
                  <td className="p-4 text-gray-500 text-sm">{user.createdAt}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;