import React, { useEffect, useState } from "react";
import OrderDetail from "./OrderDetail";
import orderService from "../../../services/orderService";

const statusText = {
  0: "Huỷ",
  1: "Chờ xử lý",
  2: "Đang chuẩn bị",
  3: "Đang giao",
  4: "Đã giao",
  5: "Hoàn thành",
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await orderService.getAll(
        null,
        1,
        50,
        token
      );

      setOrders(res.data.data);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    }
  };

  const handleUpdateStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      const token = localStorage.getItem("token");

      await orderService.updateStatus(
        orderId,
        Number(newStatus),
        token
      );

      fetchOrders();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await orderService.getById(
        id,
        token
      );

      setSelectedOrder(res.data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
    }
  };

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter(
          (o) =>
            statusText[o.orderStatus] === statusFilter
        );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">
        📑 Quản Lý Đơn Hàng
      </h2>

      <div className="flex border-b overflow-x-auto space-x-2">
        {[
          "All",
          "Huỷ",
          "Chờ xử lý",
          "Đang chuẩn bị",
          "Đang giao",
          "Đã giao",
          "Hoàn thành",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`py-2 px-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              statusFilter === status
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {status === "All"
              ? "Tất cả đơn"
              : status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Mã đơn</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Ngày đặt</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-right">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredOrders.map((order) => (
              <tr
                key={order.orderID}
                className="hover:bg-gray-50"
              >
                <td className="p-4 font-bold text-indigo-600">
                  #{order.orderID}
                </td>

                <td className="p-4">
                  {order.user?.fullName ??
                    "Khách vãng lai"}
                </td>

                <td className="p-4">
                  {new Date(
                    order.orderDate
                  ).toLocaleDateString("vi-VN")}
                </td>

                <td className="p-4 font-medium">
                  {order.totalAmount?.toLocaleString(
                    "vi-VN"
                  )}
                  đ
                </td>

                <td className="p-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleUpdateStatus(
                        order.orderID,
                        e.target.value
                      )
                    }
                    className="border rounded p-1"
                  >
                    <option value={0}>Huỷ</option>
                    <option value={1}>
                      Chờ xử lý
                    </option>
                    <option value={2}>
                      Đang chuẩn bị
                    </option>
                    <option value={3}>
                      Đang giao
                    </option>
                    <option value={4}>
                      Đã giao
                    </option>
                    <option value={5}>
                      Hoàn thành
                    </option>
                  </select>
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() =>
                      handleViewDetail(
                        order.orderID
                      )
                    }
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
        />
      )}
    </div>
  );
};

export default OrderList;