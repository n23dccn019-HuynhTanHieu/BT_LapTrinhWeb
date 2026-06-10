import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Tag, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
} from '../../../services/categoryService';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: '', description: '' });

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Load categories error:', error);
    } finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentCategory.name.trim()) return;

    try {
      const payload = { categoryName: currentCategory.name, description: currentCategory.description };
      if (currentCategory.id) {
        await updateCategory(currentCategory.id, payload);
      } else {
        await createCategory(payload);
      }
      await loadCategories();
      setModalOpen(false);
      setCurrentCategory({ id: null, name: '', description: '' });
    } catch (error) { console.error('Save error:', error); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa danh mục này?')) {
      try {
        await deleteCategory(id);
        await loadCategories();
      } catch (error) { console.error('Delete error:', error); }
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', WebkitFontSmoothing: 'subpixel-antialiased', MozOsxFontSmoothing: 'auto' }}>
      
      {/* Header Panel */}
      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '2px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', fontWeight: '900', margin: 0, color: '#000000' }}>
            <Tag style={{ color: '#2563eb' }} size={24} strokeWidth={3} /> Quản Lý Danh Mục
          </h2>
          <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: '700', marginTop: '6px' }}>Cơ cấu và quản lý nhóm phân loại danh mục sản phẩm hệ thống.</p>
        </div>

        <button
          onClick={() => {
            setCurrentCategory({ id: null, name: '', description: '' });
            setModalOpen(true);
          }}
          className="btn-auth-submit"
          style={{ width: 'auto', margin: 0, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '900' }}
        >
          <Plus size={18} strokeWidth={3} /> Thêm Danh Mục
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
        <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#000000' }} size={18} strokeWidth={2.5} />
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          className="nav-search-input"
          style={{ paddingLeft: '40px', background: '#ffffff', border: '2px solid #000000', color: '#000000', fontWeight: '700', fontSize: '14px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Bảng Dữ Liệu */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '2px solid #cbd5e1', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#000000', fontWeight: '900', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <Loader2 className="animate-spin" style={{ color: '#2563eb' }} size={28} />
            Đang đồng bộ dữ liệu...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#000000', fontWeight: '900', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <AlertCircle style={{ color: '#dc2626' }} size={28} />
            Không tìm thấy danh mục nào phù hợp.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '15px' }}>
            <thead style={{ background: '#e2e8f0', borderBottom: '3px solid #cbd5e1', color: '#000000' }}>
              <tr>
                <th style={{ padding: '16px', fontWeight: '900', width: '100px' }}>ID</th>
                <th style={{ padding: '16px', fontWeight: '900', width: '25%' }}>Tên danh mục</th>
                <th style={{ padding: '16px', fontWeight: '900' }}>Mô tả ngắn</th>
                <th style={{ padding: '16px', fontWeight: '900', textAlign: 'right', width: '120px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <tr key={cat.categoryID} style={{ borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ padding: '16px', color: '#000000', fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: '800' }}>{cat.categoryID}</td>
                  <td style={{ padding: '16px', fontWeight: '800', color: '#000000' }}>{cat.categoryName}</td>
                  <td style={{ padding: '16px', color: '#1e293b', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>{cat.description || '—'}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                      <button
                        onClick={() => {
                          setCurrentCategory({ id: cat.categoryID, name: cat.categoryName, description: cat.description });
                          setModalOpen(true);
                        }}
                        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 0 }}
                        title="Sửa"
                      >
                        <Edit2 size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.categoryID)}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 0 }}
                        title="Xóa"
                      >
                        <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '2px solid #cbd5e1', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '900', color: '#000000' }}>
              {currentCategory.id ? 'Cập Nhật Danh Mục' : 'Thêm Danh Mục Mới'}
            </h3>
            <form onSubmit={handleSave} className="auth-form">
              <div className="form-group">
                <label style={{ fontWeight: '800', color: '#000000', fontSize: '14px' }}>Tên danh mục</label>
                <input
                  type="text"
                  required
                  style={{ border: '2px solid #000000', fontWeight: '700', color: '#000000', fontSize: '15px' }}
                  className="auth-input"
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: '800', color: '#000000', fontSize: '14px' }}>Mô tả</label>
                <textarea
                  rows="3"
                  style={{ border: '2px solid #000000', fontWeight: '700', color: '#000000', fontSize: '15px', padding: '12px', borderRadius: '12px', outline: 'none' }}
                  value={currentCategory.description}
                  onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ background: '#e2e8f0', border: '2px solid #cbd5e1', padding: '10px 20px', borderRadius: '12px', fontWeight: '900', color: '#000000', cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-auth-submit"
                  style={{ width: 'auto', margin: 0, padding: '10px 24px', fontWeight: '900' }}
                >
                  Lưu lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;