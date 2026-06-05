import React, { useState } from 'react';
import OrderDetail from './OrderDetail';

const OrderList = () => {
  const [orders, setOrders] = useState([
    { id: 'DH1001', customerName: 'Nguyễn Văn A', phone: '0901234567', date: '2026-05-24', total: 31990000, status: 'Đang chuẩn bị', isMember: true, address: '123 Đường ABC, Quận 1, TP.HCM', items: [{ name: 'iPhone 15 Pro Max 256GB', qty: 1, price: 31990000 }] },
    { id: 'DH1002', customerName: 'Trần Thị B (Đặt nhanh)', phone: '0987654321', date: '2026-05-25', total: 1200000, status: 'Đang giao', isMember: false, address: '456 Đường XYZ, Cần Thơ', items: [{ name: 'Sạc Dự Phòng Anker', qty: 1, price: 1200000 }] },
  ]);

  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Cập nhật trạng thái đơn hàng nhanh từ bảng
  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const filteredOrders = statusFilter === 'All' ? orders : orders.filter(o => o.status === statusFilter);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">📑 Quản Lý Đơn Hàng</h2>

      {/* Bộ lọc Tab Trạng Thái */}
      <div className="flex border-b overflow-x-auto space-x-2">
        {['All', 'Huỷ', 'Đang chuẩn bị', 'Đang giao', 'Đã giao', 'Hoàn thành'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`py-2 px-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              statusFilter === status
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {status === 'All' ? 'Tất cả đơn' : status}
          </button>
        ))}
      </div>

      {/* Bảng đơn hàng */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Mã đơn</th>
              <th className="p-4 font-semibold text-gray-600">Khách hàng</th>
              <th className="p-4 font-semibold text-gray-600">Ngày đặt</th>
              <th className="p-4 font-semibold text-gray-600">Tổng tiền</th>
              <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold text-indigo-600">{order.id}</td>
                <td className="p-4">
                  <div className="font-medium text-gray-800">{order.customerName}</div>
                  <div className="text-xs text-gray-400">{order.phone}</div>
                  {order.isMember && <span className="inline-block bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded mt-0.5 font-bold">Thành viên</span>}
                </td>
                <td className="p-4 text-gray-500 text-sm">{order.date}</td>
                <td className="p-4 text-gray-800 font-medium">{order.total.toLocaleString('vi-VN')}đ</td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="border rounded p-1 text-sm bg-gray-50 font-medium focus:outline-none"
                  >
                    <option value="Huỷ">Huỷ</option>
                    <option value="Đang chuẩn bị">Đang chuẩn bị</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã giao">Đã giao</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gọi Component Popup hiển thị chi tiết khi click */}
      {selectedOrder && (
        <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default OrderList;