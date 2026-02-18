import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  
  // Load cart items from localStorage
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setCartItems(parsedCart);
          calculateSubtotal(parsedCart);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCartItems();
  }, []);
  
  // Calculate subtotal whenever cart items change
  const calculateSubtotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  };
  
  // Update quantity of an item in the cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateSubtotal(updatedCart);
    
    // Dispatch custom event to update cart count in header
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };
  
  // Remove an item from the cart
  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateSubtotal(updatedCart);
    
    // Dispatch custom event to update cart count in header
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };
  
  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    setSubtotal(0);
    
    // Dispatch custom event to update cart count in header
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };
  
  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="container">
          <h1>Your Cart</h1>
          <div className="empty-cart-message">
            <i className="fas fa-shopping-cart"></i>
            <p>Your cart is empty</p>
            <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="cart-page">
      <div className="container">
        <h1>Your Cart</h1>
        
        <div className="cart-actions top">
          <button className="btn btn-outline" onClick={clearCart}>
            Clear Cart
          </button>
          <Link to="/products" className="btn btn-outline">
            Continue Shopping
          </Link>
        </div>
        
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-header">
              <div className="cart-header-product">Product</div>
              <div className="cart-header-price">Price</div>
              <div className="cart-header-quantity">Quantity</div>
              <div className="cart-header-total">Total</div>
              <div className="cart-header-actions">Actions</div>
            </div>
            
            {cartItems.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-product">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h3>
                      <Link to={`/products/${item.id}`}>{item.name}</Link>
                    </h3>
                    {item.category && <p className="cart-item-category">{item.category}</p>}
                  </div>
                </div>
                
                <div className="cart-item-price">
                  R$ {item.price.toFixed(2).replace('.', ',')}
                </div>
                
                <div className="cart-item-quantity">
                  <div className="quantity-selector">
                    <button 
                      className="quantity-btn" 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    />
                    <button 
                      className="quantity-btn" 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <div className="cart-item-actions">
                  <button 
                    className="btn btn-icon" 
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="cart-checkout">
              <Link to="/checkout" className="btn btn-primary btn-block">
                Proceed to Checkout
              </Link>
            </div>
            
            <div className="payment-methods">
              <p>We accept:</p>
              <div className="payment-icons">
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-amex"></i>
                <i className="fab fa-cc-paypal"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;