import React, {
  useState,
  useEffect,
} from 'react';

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../services/categoryService';

const CategoryList = () => {
  const [categories, setCategories] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [modalOpen, setModalOpen] =
    useState(false);

  const [currentCategory, setCurrentCategory] =
    useState({
      id: null,
      name: '',
      description: '',
    });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response =
        await getCategories();

      setCategories(
        response.data.data
      );
    } catch (error) {
      console.error(
        'Load categories error:',
        error
      );
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      !currentCategory.name.trim()
    )
      return;

    try {
      const payload = {
        categoryName:
          currentCategory.name,
        description:
          currentCategory.description,
      };

      if (currentCategory.id) {
        await updateCategory(
          currentCategory.id,
          payload
        );
      } else {
        await createCategory(
          payload
        );
      }

      await loadCategories();

      setModalOpen(false);

      setCurrentCategory({
        id: null,
        name: '',
        description: '',
      });
    } catch (error) {
      console.error(
        'Save category error:',
        error
      );
    }
  };

  const handleDelete = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        'Bạn chắc chắn muốn xóa danh mục này?'
      );

    if (!confirmDelete)
      return;

    try {
      await deleteCategory(id);

      await loadCategories();
    } catch (error) {
      console.error(
        'Delete category error:',
        error
      );
    }
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          🗂️ Quản Lý Danh Mục
        </h2>

        <button
          onClick={() => {
            setCurrentCategory({
              id: null,
              name: '',
              description: '',
            });

            setModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
        >
          + Thêm Danh Mục
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          className="border p-2 rounded-lg w-full max-w-xs focus:outline-indigo-500"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">
                ID
              </th>

              <th className="p-4 font-semibold text-gray-600">
                Tên danh mục
              </th>

              <th className="p-4 font-semibold text-gray-600">
                Mô tả
              </th>

              <th className="p-4 font-semibold text-gray-600">
                Số sản phẩm
              </th>

              <th className="p-4 font-semibold text-gray-600 text-right">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {categories
              .filter((c) =>
                c.categoryName
                  ?.toLowerCase()
                  .includes(
                    searchTerm.toLowerCase()
                  )
              )
              .map(
                (
                  cat,
                  index
                ) => (
                  <tr
                    key={
                      cat.categoryID
                    }
                    className="hover:bg-gray-50"
                  >
                    <td className="p-4 text-gray-500">
                      {cat.categoryID}
                    </td>

                    <td className="p-4 font-medium text-gray-800">
                      {
                        cat.categoryName
                      }
                    </td>

                    <td className="p-4 text-gray-500">
                      {cat.description}
                    </td>

                    <td className="p-4 text-gray-500">
                      {cat.products
                        ? cat.products
                            .length
                        : 0}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setCurrentCategory(
                            {
                              id:
                                cat.categoryID,
                              name:
                                cat.categoryName,
                              description:
                                cat.description ||
                                '',
                            }
                          );

                          setModalOpen(
                            true
                          );
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Sửa
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            cat.categoryID
                          )
                        }
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {currentCategory.id
                ? 'Sửa Danh Mục'
                : 'Thêm Danh Mục Mới'}
            </h3>

            <form
              onSubmit={
                handleSave
              }
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên danh mục
                </label>

                <input
                  type="text"
                  required
                  className="w-full border p-2 rounded-lg focus:outline-indigo-500"
                  value={
                    currentCategory.name
                  }
                  onChange={(e) =>
                    setCurrentCategory(
                      {
                        ...currentCategory,
                        name:
                          e.target
                            .value,
                      }
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>

                <textarea
                  rows="3"
                  className="w-full border p-2 rounded-lg focus:outline-indigo-500"
                  value={
                    currentCategory.description
                  }
                  onChange={(e) =>
                    setCurrentCategory(
                      {
                        ...currentCategory,
                        description:
                          e.target
                            .value,
                      }
                    )
                  }
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setModalOpen(
                      false
                    )
                  }
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
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