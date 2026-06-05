import React, { useState } from 'react';

const Dashboard = () => {
  const [timeFrame, setTimeFrame] = useState('month'); // day, week, month

  // Giả lập dữ liệu thay đổi theo bộ lọc thời gian
  const stats = {
    day: { revenue: '5,400,000đ', orders: 12, newUsers: 3, topProduct: 'iPhone 15 Pro Max' },
    week: { revenue: '38,200,000đ', orders: 84, newUsers: 18, topProduct: 'MacBook Air M2' },
    month: { revenue: '168,500,000đ', orders: 342, newUsers: 75, topProduct: 'iPhone 15 Pro Max' },
  };

  const currentStat = stats[timeFrame];

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Bộ lọc */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">📊 Thống Kê Doanh Thu</h2>
        <div className="bg-white border rounded-lg p-1 flex gap-1 shadow-sm">
          {['day', 'week', 'month'].map((type) => (
            <button
              key={type}
              onClick={() => setTimeFrame(type)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeFrame === type
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type === 'day' ? 'Hôm nay' : type === 'week' ? 'Tuần này' : 'Tháng này'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid thẻ báo cáo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Doanh Thu</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{currentStat.revenue}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Số Đơn Hàng</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{currentStat.orders} đơn</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Khách Hàng Mới</p>
          <p className="text-2xl font-bold text-purple-600 mt-2">+{currentStat.newUsers} user</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Sản Phẩm Bán Chạy</p>
          <p className="text-lg font-bold text-gray-800 mt-2 truncate">{currentStat.topProduct}</p>
        </div>
      </div>

      {/* Khu vực giả lập biểu đồ */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80 flex flex-col justify-center items-center text-gray-400">
        <span className="text-4xl mb-2">📈</span>
        <p>Khu vực hiển thị Biểu đồ tăng trưởng doanh thu ({timeFrame === 'day' ? 'Giờ' : timeFrame === 'week' ? 'Ngày' : 'Tuần'})</p>
        <p className="text-xs text-gray-400 mt-1">(Nhóm có thể cài thêm thư viện Chart.js hoặc Recharts ở giai đoạn sau)</p>
      </div>
    </div>
  );
};

export default Dashboard;