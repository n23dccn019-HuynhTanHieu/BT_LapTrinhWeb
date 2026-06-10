import React from "react";

const statusText = {
  0: "Huỷ",
  1: "Chờ xử lý",
  2: "Đang chuẩn bị",
  3: "Đang giao",
  4: "Đã giao",
  5: "Hoàn thành",
};

const OrderDetail = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl flex flex-col max-h-[90vh]">

        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-bold">
            Chi Tiết Đơn Hàng #
            <span className="text-indigo-600">
              {order.orderID}
            </span>
          </h3>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-4">

          <div className="bg-gray-50 p-4 rounded border">
            <h4 className="font-bold mb-2">
              📋 THÔNG TIN GIAO HÀNG
            </h4>

            <p>
              <strong>Người nhận:</strong>{" "}
              {order.receiverName}
            </p>

            <p>
              <strong>SĐT:</strong>{" "}
              {order.receiverPhone}
            </p>

            <p>
              <strong>Địa chỉ:</strong>{" "}
              {order.receiverAddress}
            </p>

            <p>
              <strong>Ghi chú:</strong>{" "}
              {order.note || "Không có"}
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">
              📦 DANH SÁCH SẢN PHẨM
            </h4>

            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">
                    Sản phẩm
                  </th>
                  <th className="p-2 text-center">
                    SL
                  </th>
                  <th className="p-2 text-right">
                    Đơn giá
                  </th>
                  <th className="p-2 text-right">
                    Thành tiền
                  </th>
                </tr>
              </thead>

              <tbody>
                {order.orderDetails?.map(
                  (item) => (
                    <tr
                      key={item.orderDetailID}
                      className="border-t"
                    >
                      <td className="p-2">
                        {
                          item.product
                            ?.productName
                        }
                      </td>

                      <td className="p-2 text-center">
                        {item.quantity}
                      </td>

                      <td className="p-2 text-right">
                        {item.price.toLocaleString(
                          "vi-VN"
                        )}
                        đ
                      </td>

                      <td className="p-2 text-right">
                        {(
                          item.quantity *
                          item.price
                        ).toLocaleString(
                          "vi-VN"
                        )}
                        đ
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t pt-4 mt-4 flex justify-between">
          <div>
            <span>
              Trạng thái:
            </span>

            <span className="ml-2 font-bold text-indigo-600">
              {
                statusText[
                  order.orderStatus
                ]
              }
            </span>
          </div>

          <div>
            <span className="mr-2">
              Tổng tiền:
            </span>

            <span className="font-bold text-red-600 text-xl">
              {order.totalAmount?.toLocaleString(
                "vi-VN"
              )}
              đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;