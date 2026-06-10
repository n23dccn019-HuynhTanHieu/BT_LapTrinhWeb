import React, { useEffect, useState } from "react";
import userService from "../../../services/userService";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await userService.getAll(
        "",
        1,
        100,
        token
      );

      setCustomers(res.data.data);
    } catch (error) {
      console.error(
        "Lỗi lấy danh sách khách hàng:",
        error
      );
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">
        👥 Danh Sách Khách Hàng Thành Viên
      </h2>

      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc số điện thoại..."
          className="border p-2 rounded-lg w-full max-w-xs"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">
                Họ và tên
              </th>
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">
                Số điện thoại
              </th>
              <th className="p-4">
                Địa chỉ
              </th>
              <th className="p-4">
                Vai trò
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map(
              (user) => (
                <tr
                  key={user.userID}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">
                    {user.userID}
                  </td>

                  <td className="p-4">
                    {user.fullName}
                  </td>

                  <td className="p-4">
                    {user.username}
                  </td>

                  <td className="p-4">
                    {user.email}
                  </td>

                  <td className="p-4">
                    {user.phone || "-"}
                  </td>

                  <td className="p-4">
                    {user.address || "-"}
                  </td>

                  <td className="p-4">
                    {user.role}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;