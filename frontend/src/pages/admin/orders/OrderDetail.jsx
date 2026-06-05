import React from 'react';

const OrderDetail = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-900">Chi Tiết Đơn Hàng: <span className="text-indigo-600">{order.id}</span></h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <div className="overflow-y-auto space-y-4 flex-1 pr-1">
          {/* Thông tin người nhận */}
          <div className="bg-gray-50 p-4 rounded-lg border text-sm space-y-1">
            <h4 className="font-bold text-gray-700 mb-1">📋 THÔNG TIN GIAO HÀNG</h4>
            <p><span className="text-gray-500">Người nhận:</span> <span className="font-medium text-gray-800">{order.customerName}</span></p>
            <p><span className="text-gray-500">Số điện thoại:</span> {order.phone}</p>
            <p><span className="text-gray-500">Địa chỉ nhận hàng:</span> {order.address}</p>
            <p><span className="text-gray-500">Loại đơn hàng:</span> {order.isMember ? 'Tài khoản Thành viên đăng nhập' : 'Khách vãng lai đặt nhanh'}</p>
          </div>

          {/* Danh sách sản phẩm mua */}
          <div>
            <h4 className="font-bold text-gray-700 text-sm mb-2">📦 DANH SÁCH SẢN PHẨM</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 font-medium text-gray-600">Sản phẩm</th>
                    <th className="p-3 font-medium text-gray-600 text-center">Số lượng</th>
                    <th className="p-3 font-medium text-gray-600 text-right">Đơn giá</th>
                    <th className="p-3 font-medium text-gray-600 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium text-gray-800">{item.name}</td>
                      <td className="p-3 text-center text-gray-700">{item.qty}</td>
                      <td className="p-3 text-right text-gray-600">{item.price.toLocaleString('vi-VN')}đ</td>
                      <td className="p-3 text-right font-medium text-gray-800">{(item.qty * item.price).toLocaleString('vi-VN')}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tổng tiền chân trang */}
        <div className="border-t pt-4 mt-4 flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Trạng thái hiện tại:</span>
            <span className="ml-2 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs border border-amber-200">{order.status}</span>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500 mr-2">Tổng giá trị:</span>
            <span className="text-xl font-bold text-red-600">{order.total.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;