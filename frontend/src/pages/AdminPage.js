import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/AdminPage.css';

const ADMIN_AVATAR_FALLBACK = 'https://www.placecats.com/80/80';

const AdminPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [bands, setBands] = useState([]);

  const initialTab = useMemo(() => {
    if (location.pathname.startsWith('/admin/bands')) return 'bands';
    return 'products';
  }, [location.pathname]);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [productView, setProductView] = useState('list'); // list | grid

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    // keep tab synced with URL
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    // Skip authentication for development
    setUser({ name: 'Dev Admin', email: 'admin@dev.local', role: 'admin' });
    loadData().finally(() => setLoading(false));
  }, []);

  const loadData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

      // Load products
      const productsResponse = await fetch(`${apiUrl}/api/products`, {
        credentials: 'include'
      });
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.products || []);
      }

      // Load bands
      const bandsResponse = await fetch(`${apiUrl}/api/bands`, {
        credentials: 'include'
      });
      if (bandsResponse.ok) {
        const bandsData = await bandsResponse.json();
        setBands(bandsData.bands || []);
      }
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== productId));
      } else {
        setError('Failed to delete product');
      }
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const deleteBand = async (bandId) => {
    if (!window.confirm('Are you sure you want to delete this band?')) return;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/bands/${bandId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setBands(bands.filter((b) => b._id !== bandId));
      } else {
        setError('Failed to delete band');
      }
    } catch (err) {
      setError('Failed to delete band');
    }
  };

  const handleCellClick = (itemId, field, currentValue, type) => {
    if (field === 'image' || field === 'logo') return; // Don't allow editing image fields
    if (field === 'featured') return; // handled by toggle button

    setEditingCell(`${itemId}-${field}`);

    // Format price for editing (convert to Brazilian format)
    if (field === 'price' && type === 'product') {
      setEditValue(currentValue.toFixed(2).replace('.', ','));
    } else {
      setEditValue(currentValue);
    }
  };

  const updateItem = async (itemId, updateData, type) => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const endpoint = type === 'product' ? 'products' : 'bands';

    const response = await fetch(`${apiUrl}/api/${endpoint}/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error(`Failed to update ${type}`);
    }

    // Update local state
    if (type === 'product') {
      setProducts(products.map((p) => (p._id === itemId ? { ...p, ...updateData } : p)));
    } else {
      setBands(bands.map((b) => (b._id === itemId ? { ...b, ...updateData } : b)));
    }
  };

  const handleCellSave = async (itemId, field, type) => {
    try {
      let updateData = { [field]: editValue };

      // Handle special field conversions
      if (field === 'price' && type === 'product') {
        updateData[field] = parseFloat(editValue.replace(',', '.'));
      } else if (field === 'countInStock' && type === 'product') {
        updateData[field] = parseInt(editValue);
      } else if (field === 'formedYear' && type === 'band') {
        updateData[field] = parseInt(editValue);
      }

      await updateItem(itemId, updateData, type);
    } catch (err) {
      setError(`Failed to update ${type}`);
    }

    setEditingCell(null);
    setEditValue('');
  };

  const toggleFeatured = async (itemId, currentValue, type) => {
    try {
      await updateItem(itemId, { featured: !currentValue }, type);
    } catch (err) {
      setError(`Failed to update ${type}`);
    }
  };

  const renderFeaturedToggle = (itemId, checked, type, { showLabel = true } = {}) => {
    return (
      <label className="admin-toggle" aria-label="Toggle featured">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => toggleFeatured(itemId, checked, type)}
        />
        <span className="admin-toggle__track" />
        {showLabel ? <span className="admin-toggle__label">{checked ? 'Featured' : 'Not featured'}</span> : null}
      </label>
    );
  };

  const handleKeyPress = (e, itemId, field, type) => {
    if (e.key === 'Enter') {
      handleCellSave(itemId, field, type);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  };

  const renderEditableCell = (itemId, field, value, type, options = {}) => {
    const cellKey = `${itemId}-${field}`;
    const isEditing = editingCell === cellKey;

    if (field === 'image' || field === 'logo') {
      return <img src={value || '/images/placeholder.jpg'} alt="Item" className="table-image" />;
    }

    if (field === 'featured') {
      const checked = Boolean(value);
      return renderFeaturedToggle(itemId, checked, type, { showLabel: options.showLabel !== false });
    }

    if (isEditing) {
      return (
        <div className="editable-cell">
          <input
            type={field === 'price' || field === 'countInStock' || field === 'formedYear' ? 'text' : 'text'}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleCellSave(itemId, field, type)}
            onKeyDown={(e) => handleKeyPress(e, itemId, field, type)}
            autoFocus
          />
        </div>
      );
    }

    return (
      <div className="editable-cell" onClick={() => handleCellClick(itemId, field, value, type)}>
        {field === 'price' && type === 'product' ? `R$ ${value.toFixed(2).replace('.', ',')}` : value}
      </div>
    );
  };

  const goToTab = (tab) => {
    if (tab === 'bands') navigate('/admin/bands');
    else navigate('/admin/products');
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading admin panel...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-page">
        <div className="login-container">
          <h1>Admin Login Required</h1>
          <p>Please login with your Google account to access the admin panel.</p>
          <button className="btn btn-primary" onClick={handleGoogleLogin}>
            <i className="fab fa-google"></i> Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user-info">
          <img
            src={user.avatar || ADMIN_AVATAR_FALLBACK}
            onError={(e) => {
              e.currentTarget.src = ADMIN_AVATAR_FALLBACK;
            }}
            alt={user.name}
            className="user-avatar"
          />
          <span>Welcome, {user.name}</span>
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => goToTab('products')}>
          Products ({products.length})
        </button>
        <button className={`tab-btn ${activeTab === 'bands' ? 'active' : ''}`} onClick={() => goToTab('bands')}>
          Bands ({bands.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-header">
              <h2>Manage Products</h2>

              <div className="admin-section-actions">
                <div className="admin-view-toggle" role="group" aria-label="Products view">
                  <button
                    type="button"
                    className={`admin-view-btn ${productView === 'grid' ? 'active' : ''}`}
                    onClick={() => setProductView('grid')}
                    title="Grid view"
                  >
                    <i className="fas fa-th"></i>
                  </button>
                  <button
                    type="button"
                    className={`admin-view-btn ${productView === 'list' ? 'active' : ''}`}
                    onClick={() => setProductView('list')}
                    title="List view"
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>

                <button className="btn btn-primary" onClick={() => navigate('/admin/add-product')}>
                  + Add New Product
                </button>
              </div>
            </div>

            {productView === 'grid' ? (
              <div className="admin-products-grid">
                {products.map((product) => (
                  <div key={product._id} className="admin-product-card">
                    <img
                      src={product.images?.[0] || '/images/placeholder.jpg'}
                      alt={product.name}
                      className="admin-product-card__img"
                    />
                    <div className="admin-product-card__body">
                      <div className="admin-product-card__title">{product.name}</div>
                      <div className="admin-product-card__meta">{product.artist}</div>
                      <div className="admin-product-card__row">
                        <span className="admin-product-card__price">R$ {Number(product.price || 0).toFixed(2)}</span>
                        <span className="admin-product-card__stock">Stock: {product.countInStock ?? 0}</span>
                      </div>
                      <div className="admin-product-card__row">
                        {renderEditableCell(product._id, 'featured', product.featured, 'product')}
                        <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Artist</th>
                      <th>Category</th>
                      <th>Price (R$)</th>
                      <th>Stock</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="clickable-row">
                        <td>{renderEditableCell(product._id, 'image', product.images?.[0], 'product')}</td>
                        <td>{renderEditableCell(product._id, 'name', product.name, 'product')}</td>
                        <td>{renderEditableCell(product._id, 'artist', product.artist, 'product')}</td>
                        <td>{renderEditableCell(product._id, 'category', product.category, 'product')}</td>
                        <td>{renderEditableCell(product._id, 'price', product.price, 'product')}</td>
                        <td>{renderEditableCell(product._id, 'countInStock', product.countInStock, 'product')}</td>
                        <td>{renderEditableCell(product._id, 'featured', product.featured, 'product', { showLabel: false })}</td>
                        <td>
                          <button className="btn btn-danger" onClick={() => deleteProduct(product._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bands' && (
          <div className="bands-section">
            <div className="section-header">
              <h2>Manage Bands</h2>
              <button className="btn btn-primary">+ Add New Band</button>
            </div>

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Genre</th>
                    <th>Formed</th>
                    <th>Members</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bands.map((band) => (
                    <tr key={band._id} className="clickable-row">
                      <td>{renderEditableCell(band._id, 'logo', band.logo, 'band')}</td>
                      <td>{renderEditableCell(band._id, 'name', band.name, 'band')}</td>
                      <td>{renderEditableCell(band._id, 'genre', band.genre, 'band')}</td>
                      <td>{renderEditableCell(band._id, 'formedYear', band.formedYear, 'band')}</td>
                      <td>{band.members.length}</td>
                      <td>{renderEditableCell(band._id, 'featured', band.featured, 'band', { showLabel: false })}</td>
                      <td>
                        <button className="btn btn-danger" onClick={() => deleteBand(band._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
