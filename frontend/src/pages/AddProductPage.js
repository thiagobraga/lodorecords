import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddProductPage.css';

const AddProductPage = () => {
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'vinyl',
    artist: '',
    images: [''],
    countInStock: '',
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...productForm.images];
    newImages[index] = value;
    setProductForm(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setProductForm(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    if (productForm.images.length > 1) {
      const newImages = productForm.images.filter((_, i) => i !== index);
      setProductForm(prev => ({ ...prev, images: newImages }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        countInStock: parseInt(productForm.countInStock),
        images: productForm.images.filter(img => img.trim() !== '')
      };
      
      const response = await fetch(`${apiUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        // Navigate back to admin page after successful creation
        navigate('/admin');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create product');
      }
    } catch (err) {
      setError('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="page-header">
        <button 
          className="btn btn-primary back-btn"
          onClick={() => navigate('/admin')}
        >
          ← Back to Admin
        </button>
        <h1>Add New Product</h1>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleAddProduct} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={productForm.name}
                onChange={handleProductFormChange}
                required
                maxLength="100"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Artist *</label>
              <input
                type="text"
                name="artist"
                value={productForm.artist}
                onChange={handleProductFormChange}
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={productForm.description}
              onChange={handleProductFormChange}
              required
              maxLength="2000"
              rows="4"
              disabled={loading}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={productForm.category}
                onChange={handleProductFormChange}
                required
                disabled={loading}
              >
                <option value="vinyl">Vinyl</option>
                <option value="cd">CD</option>
                <option value="cassette">Cassette</option>
                <option value="clothing">Clothing</option>
                <option value="accessory">Accessory</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Price (R$) *</label>
              <input
                type="number"
                name="price"
                value={productForm.price}
                onChange={handleProductFormChange}
                required
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Stock Quantity *</label>
              <input
                type="number"
                name="countInStock"
                value={productForm.countInStock}
                onChange={handleProductFormChange}
                required
                min="0"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Product Images *</label>
            {productForm.images.map((image, index) => (
              <div key={index} className="image-input-row">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="Enter image URL"
                  required={index === 0}
                  disabled={loading}
                />
                {productForm.images.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeImageField(index)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={addImageField}
              disabled={loading}
            >
              Add Another Image
            </button>
          </div>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="featured"
                checked={productForm.featured}
                onChange={handleProductFormChange}
                disabled={loading}
              />
              Featured Product
            </label>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => navigate('/admin')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;