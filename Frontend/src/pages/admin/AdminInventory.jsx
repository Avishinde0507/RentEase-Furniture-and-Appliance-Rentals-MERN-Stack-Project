import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Search, Filter, Image as ImageIcon, X } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { toast } from 'react-hot-toast';

const AdminInventory = () => {
  const { products, addProduct, removeProduct, updateProduct } = useProducts();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Furniture',
    subCategory: '',
    brand: '',
    rentPrice: '',
    securityDeposit: '',
    description: '',
    images: [''],
    specifications: { Dimensions: '', Color: '', Material: '' }
  });

  const resetForm = () => {
    setNewProduct({
      name: '',
      category: 'Furniture',
      subCategory: '',
      brand: '',
      rentPrice: '',
      securityDeposit: '',
      description: '',
      images: [''],
      specifications: { Dimensions: '', Color: '', Material: '' }
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleEditClick = (product) => {
    const specs = product.specifications instanceof Map 
      ? Object.fromEntries(product.specifications)
      : (product.specifications || {});

    setNewProduct({
      ...product,
      rentPrice: product.rentPrice ? product.rentPrice.toString() : '',
      securityDeposit: (product.securityDeposit || 0).toString(),
      images: product.images && product.images.length > 0 ? product.images : [''],
      specifications: {
        Dimensions: specs.Dimensions || '',
        Color: specs.Color || '',
        Material: specs.Material || '',
      }
    });
    setIsEditing(true);
    setEditId(product._id || product.id);
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.rentPrice || !newProduct.images[0] || !newProduct.description || !newProduct.subCategory) {
      toast.error('Please fill in all required fields (Name, Price, Image, Description, Sub-Category)');
      return;
    }
    
    const productData = {
      ...newProduct,
      rentPrice: parseInt(newProduct.rentPrice),
      securityDeposit: parseInt(newProduct.securityDeposit || 0),
    };

    try {
      if (isEditing) {
        await updateProduct(editId, productData);
        toast.success('Product updated successfully!');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully!');
      }
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Operation failed:', error);
      toast.error('Failed to save product. Please check your admin permissions.');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Inventory Management</h2>
        <button 
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search products by name or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-12 focus:ring-2 focus:ring-slate-500/10"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Product</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Category</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Rent Price</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm">Stock Status</th>
              <th className="px-8 py-5 font-bold text-slate-900 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProducts.map((p) => (
              <tr key={p._id || p.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                      <img 
                        src={p.images[0]} 
                        alt={p.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          const appliancePlaceholder = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800';
                          const furniturePlaceholder = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800';
                          e.target.src = p.category === 'Appliances' ? appliancePlaceholder : furniturePlaceholder;
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{p.category}</span>
                </td>
                <td className="px-8 py-5 font-bold text-slate-900 text-sm">₹{p.rentPrice}/mo</td>
                <td className="px-8 py-5">
                  <span className="flex items-center gap-1.5 text-emerald-500 text-sm font-bold">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> In Stock
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditClick(p)}
                      className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        if(window.confirm('Delete this product?')) removeProduct(p._id || p.id);
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => {
            setShowAddModal(false);
            resetForm();
          }}></div>
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-900">{isEditing ? 'Edit Product' : 'Add New Inventory'}</h3>
              <button onClick={() => {
                setShowAddModal(false);
                resetForm();
              }} className="p-2 hover:bg-slate-50 rounded-full transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Product Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Ergonomic Office Chair" 
                    className="input-field" 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Category</label>
                  <select 
                    className="input-field"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option>Furniture</option>
                    <option>Appliances</option>
                    <option>Office</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Sub-Category</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Sofa, Fridge, Desk" 
                    className="input-field" 
                    value={newProduct.subCategory}
                    onChange={(e) => setNewProduct({...newProduct, subCategory: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Brand</label>
                  <input 
                    type="text" 
                    placeholder="e.g. UrbanLiving" 
                    className="input-field" 
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Rent Price (₹/mo)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="899" 
                    className="input-field" 
                    value={newProduct.rentPrice}
                    onChange={(e) => setNewProduct({...newProduct, rentPrice: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Security Deposit (₹)</label>
                  <input 
                    type="number" 
                    placeholder="1500" 
                    className="input-field" 
                    value={newProduct.securityDeposit}
                    onChange={(e) => setNewProduct({...newProduct, securityDeposit: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Product Image URL</label>
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/..." 
                    className="input-field" 
                    value={newProduct.images[0]}
                    onChange={(e) => setNewProduct({...newProduct, images: [e.target.value]})}
                  />
                  {newProduct.images[0] && (
                    <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                      <img 
                        src={newProduct.images[0]} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <textarea 
                  rows="3" 
                  placeholder="Tell us about the product..." 
                  className="input-field resize-none"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                ></textarea>
              </div>

              {/* Product Specifications */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm">Product Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Dimensions</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 72 W x 32 D x 34 H" 
                      className="input-field" 
                      value={newProduct.specifications?.Dimensions || ''}
                      onChange={(e) => setNewProduct({
                        ...newProduct, 
                        specifications: { ...newProduct.specifications, Dimensions: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Color</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Emerald Green" 
                      className="input-field" 
                      value={newProduct.specifications?.Color || ''}
                      onChange={(e) => setNewProduct({
                        ...newProduct, 
                        specifications: { ...newProduct.specifications, Color: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Material</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Velvet & Solid Wood" 
                      className="input-field" 
                      value={newProduct.specifications?.Material || ''}
                      onChange={(e) => setNewProduct({
                        ...newProduct, 
                        specifications: { ...newProduct.specifications, Material: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-8 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary !py-4">{isEditing ? 'Save Changes' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
