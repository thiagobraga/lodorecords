import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        
        // Fetch the specific product
        const productResponse = await fetch(`${apiUrl}/api/products/${id}`);
        const productData = await productResponse.json();
        
        if (!productData.success) {
          throw new Error(productData.error || 'Product not found');
        }
        
        setProduct(productData.product);
        
        // Fetch related products (same category, excluding current product)
        const relatedResponse = await fetch(`${apiUrl}/api/products?category=${productData.product.category}`);
        const relatedData = await relatedResponse.json();
        
        if (relatedData.success) {
          const related = relatedData.products
            .filter(p => p._id !== productData.product._id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
        
        setIsLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load product details. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchProductDetails();
    // Reset scroll position when product ID changes
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value < 1 ? 1 : value);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const addToCart = () => {
    if (!product) return;
    
    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === (product._id || product.id));
    
    if (existingProductIndex !== -1) {
      // Update quantity if product exists
      cart[existingProductIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.push({
        id: product._id,
        name: product.name,
        price: product.price,
        image: (product.images && product.images[0]) || 'https://via.placeholder.com/300x300?text=Lodo+Records',
        quantity: quantity
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch custom event to update cart count in header
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show feedback
    alert(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <p>{error}</p>
          <Link to="/products" className="btn btn-primary">Back to Products</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="error">
          <p>Product not found</p>
          <Link to="/products" className="btn btn-primary">Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> / 
          <Link to="/products">Products</Link> / 
          <Link to={`/products?category=${product.category}`}>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</Link> / 
          <span>{product.name}</span>
        </div>
        
        <div className="product-detail">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={(product.images && product.images[0]) || 'https://via.placeholder.com/500x500?text=Lodo+Records'} alt={product.name} />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="image-gallery">
                {product.images.map((img, index) => (
                  <div className="gallery-thumbnail" key={index}>
                    <img src={img} alt={`${product.name} - view ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-price">R$ {product.price.toFixed(2).replace('.', ',')}</p>
            
            <div className="product-description">
              <p>{product.description}</p>
            </div>
            
            {product.artist && (
              <div className="product-meta">
                <p><strong>Artist:</strong> {product.artist}</p>
              </div>
            )}
            
            <div className="product-actions">
              <div className="quantity-selector">
                <button 
                  className="quantity-btn" 
                  onClick={decreaseQuantity}
                  aria-label="Decrease quantity"
                >
                  <i className="fas fa-minus"></i>
                </button>
                <input 
                  type="number" 
                  min="1" 
                  value={quantity} 
                  onChange={handleQuantityChange} 
                  aria-label="Quantity"
                />
                <button 
                  className="quantity-btn" 
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              
              <button 
                className="btn btn-primary add-to-cart-btn" 
                onClick={addToCart}
                disabled={product.countInStock === 0}
              >
                {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
            
            <div className="product-meta">
              <p><strong>Category:</strong> {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
              <p><strong>Availability:</strong> {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of Stock'}</p>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>You May Also Like</h2>
            <div className="related-products-grid grid">
              {relatedProducts.map(relatedProduct => (
                <div className="product-card card" key={relatedProduct._id}>
                  <Link to={`/products/${relatedProduct._id}`} className="product-link">
                    <div className="product-image-container">
                      <img 
                        src={(relatedProduct.images && relatedProduct.images[0]) || 'https://via.placeholder.com/300x300?text=Lodo+Records'} 
                        alt={relatedProduct.name} 
                        className="product-image card-img" 
                      />
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{relatedProduct.name}</h3>
                      <p className="card-price">R$ {relatedProduct.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;