import React, { useState } from 'react';

const AdminList = () => {
  const [admins, setAdmins] = useState([
    { id: 1, username: 'admin_king', role: 'Super Admin' },
    { id: 2, username: 'admin_sales', role: 'Staff Đơn Hàng' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', role: 'Staff Đơn Hàng' });

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if(!newAdmin.username || !newAdmin.password) return;

    setAdmins([...admins, { id: Date.now(), username: newAdmin.username, role: newAdmin.role }]);
    setModalOpen(false);
    setNewAdmin({ username: '', password: '', role: 'Staff Đơn Hàng' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Xóa quyền truy cập trang quản trị của tài khoản này?')) {
      setAdmins(admins.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">🔑 Quản Lý Tài Khoản Quản Trị</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm text-sm"
        >
          + Cấp Tài Khoản Admin
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">Username</th>
              <th className="p-4 font-semibold text-gray-600">Vai trò</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {admins.map((adm, index) => (
              <tr key={adm.id} className="hover:bg-gray-50">
                <td className="p-4 text-gray-500">{index + 1}</td>
                <td className="p-4 font-medium text-gray-800">{adm.username}</td>
                <td className="p-4 text-sm"><span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium border">{adm.role}</span></td>
                <td className="p-4 text-right space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Đổi mật khẩu</button>
                  <button onClick={() => handleDelete(adm.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Cấp Quyền Admin */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Cấp Tài Khoản Mới</h3>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username Admin</label>
                <input
                  type="text" required className="w-full border p-2 rounded-lg focus:outline-indigo-500"
                  value={newAdmin.username} onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu ban đầu</label>
                <input
                  type="password" required className="w-full border p-2 rounded-lg focus:outline-indigo-500"
                  value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phân quyền</label>
                <select
                  className="w-full border p-2 rounded-lg focus:outline-indigo-500"
                  value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                >
                  <option value="Staff Đơn Hàng">Staff Đơn Hàng</option>
                  <option value="Quản Lý Kho">Quản Lý Kho</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg text-gray-600 text-sm">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Cấp Tài Khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminList;