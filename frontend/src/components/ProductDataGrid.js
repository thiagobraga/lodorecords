import React, { useState } from 'react';
import './ProductDataGrid.css';

const ProductDataGrid = ({ products, setProducts, onDeleteProduct }) => {
  const [loading, setLoading] = useState(false);
  const [editingCell, setEditingCell] = useState(null);

  // Auto-save function to update product on the server
  const saveProduct = async (updatedProduct) => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/products/${updatedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: updatedProduct.name,
          artist: updatedProduct.artist,
          category: updatedProduct.category,
          price: parseFloat(updatedProduct.price) || 0,
          countInStock: parseInt(updatedProduct.countInStock) || 0,
          featured: updatedProduct.featured,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      const data = await response.json();
      const savedProduct = data.product || data;
      
      // Update the products array in parent component
      const updatedProducts = products.map(product => 
        product._id === updatedProduct._id ? savedProduct : product
      );
      setProducts(updatedProducts);
      
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cell value changes
  const handleCellChange = async (productId, field, value) => {
    const current = products.find(p => p._id === productId);
    // Skip save if value did not change
    if (!current || current[field] === value) {
      setEditingCell(null);
      return;
    }

    const updatedProducts = products.map(product => {
      if (product._id === productId) {
        const updatedProduct = { ...product, [field]: value };
        // Auto-save after a short delay
        setTimeout(() => saveProduct(updatedProduct), 500);
        return updatedProduct;
      }
      return product;
    });
    setProducts(updatedProducts);
    setEditingCell(null);
  };

  // Render editable cell
  const renderEditableCell = (product, field, value) => {
    const cellKey = `${product._id}-${field}`;
    const isEditing = editingCell === cellKey;

    if (field === 'featured') {
      return (
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => handleCellChange(product._id, field, e.target.checked)}
          className="featured-checkbox"
        />
      );
    }

    if (field === 'price') {
      return isEditing ? (
        <input
          type="number"
          step="0.01"
          min="0"
          value={value || ''}
          onChange={(e) => handleCellChange(product._id, field, e.target.value)}
          onBlur={() => setEditingCell(null)}
          onKeyPress={(e) => e.key === 'Enter' && setEditingCell(null)}
          className="price-input"
          autoFocus
        />
      ) : (
        <span
          onClick={() => setEditingCell(cellKey)}
          className="editable-cell"
        >
          R$ {parseFloat(value || 0).toFixed(2)}
        </span>
      );
    }

    if (field === 'countInStock') {
      return isEditing ? (
        <input
          type="number"
          min="0"
          value={value || ''}
          onChange={(e) => handleCellChange(product._id, field, e.target.value)}
          onBlur={() => setEditingCell(null)}
          onKeyPress={(e) => e.key === 'Enter' && setEditingCell(null)}
          className="stock-input"
          autoFocus
        />
      ) : (
        <span
          onClick={() => setEditingCell(cellKey)}
          className="editable-cell"
        >
          {value || 0}
        </span>
      );
    }

    // Text fields (name, artist, category)
    return isEditing ? (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => handleCellChange(product._id, field, e.target.value)}
        onBlur={() => setEditingCell(null)}
        onKeyPress={(e) => e.key === 'Enter' && setEditingCell(null)}
        className="text-input"
        autoFocus
      />
    ) : (
      <span
        onClick={() => setEditingCell(cellKey)}
        className="editable-cell"
      >
        {value || ''}
      </span>
    );
  };

  return (
    <div className="product-data-grid">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <span>Saving changes...</span>
        </div>
      )}
      
      <div className="grid-container">
        <table className="data-grid-table">
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
              <tr key={product._id}>
                <td>
                  <div className="image-cell">
                    <img 
                      src={product.images?.[0] || '/images/placeholder.jpg'} 
                      alt={product.name}
                      className="grid-image"
                    />
                  </div>
                </td>
                <td>{renderEditableCell(product, 'name', product.name)}</td>
                <td>{renderEditableCell(product, 'artist', product.artist)}</td>
                <td>{renderEditableCell(product, 'category', product.category)}</td>
                <td>{renderEditableCell(product, 'price', product.price)}</td>
                <td>{renderEditableCell(product, 'countInStock', product.countInStock)}</td>
                <td>{renderEditableCell(product, 'featured', product.featured)}</td>
                <td>
                  <div className="actions-cell">
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this product?')) {
                          onDeleteProduct(product._id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDataGrid;