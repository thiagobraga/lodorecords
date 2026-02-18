import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(5.99);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [step, setStep] = useState(1); // 1: Information, 2: Shipping, 3: Payment
  
  // Form state
  const [formData, setFormData] = useState({
    // Customer Information
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    
    // Shipping Address
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Billing Address
    sameAsShipping: true,
    billingAddress: '',
    billingApartment: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'United States',
    
    // Payment Information
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    
    // Shipping Method
    shippingMethod: 'standard'
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Calculate totals whenever cart items or shipping method changes
  const calculateTotals = useCallback((items, shippingMethod = formData.shippingMethod) => {
    const itemsSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(itemsSubtotal);
    
    // Set shipping cost based on method
    let shipping = 5.99; // standard shipping
    if (shippingMethod === 'express') {
      shipping = 12.99;
    } else if (shippingMethod === 'overnight') {
      shipping = 19.99;
    }
    setShippingCost(shipping);
    
    // Calculate tax (assuming 8% tax rate)
    const taxAmount = itemsSubtotal * 0.08;
    setTax(taxAmount);
    
    // Calculate total
    setTotal(itemsSubtotal + shipping + taxAmount);
  }, [formData.shippingMethod]);
  
  // Load cart items from localStorage
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          
          // Redirect to cart if empty
          if (parsedCart.length === 0) {
            navigate('/cart');
            return;
          }
          
          setCartItems(parsedCart);
          calculateTotals(parsedCart);
        } else {
          navigate('/cart');
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCartItems();
  }, [navigate, calculateTotals]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Clear error when field is edited
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
    }
    
    // Update shipping cost when shipping method changes
    if (name === 'shippingMethod') {
      calculateTotals(cartItems, value);
    }
  };
  
  // Validate form based on current step
  const validateForm = () => {
    const newErrors = {};
    
    if (step === 1) {
      // Validate customer information
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
    } else if (step === 2) {
      // Validate shipping address
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
      
      // Validate billing address if not same as shipping
      if (!formData.sameAsShipping) {
        if (!formData.billingAddress) newErrors.billingAddress = 'Billing address is required';
        if (!formData.billingCity) newErrors.billingCity = 'Billing city is required';
        if (!formData.billingState) newErrors.billingState = 'Billing state is required';
        if (!formData.billingZipCode) newErrors.billingZipCode = 'Billing ZIP code is required';
      }
    } else if (step === 3) {
      // Validate payment information
      if (!formData.cardName) newErrors.cardName = 'Name on card is required';
      
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      else if (!/^[0-9]{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      
      if (!formData.cardExpiry) newErrors.cardExpiry = 'Expiration date is required';
      else if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Expiration date must be in MM/YY format';
      }
      
      if (!formData.cardCvc) newErrors.cardCvc = 'CVC is required';
      else if (!/^[0-9]{3,4}$/.test(formData.cardCvc)) {
        newErrors.cardCvc = 'CVC must be 3 or 4 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle next step
  const handleNextStep = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        // In a real application, you would send the order data to your backend
        // and integrate with Stripe or another payment processor
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Clear cart after successful order
        localStorage.setItem('cart', JSON.stringify([]));
        
        // Redirect to order confirmation
        navigate('/order-confirmation', { 
          state: { 
            orderId: 'LD-' + Math.floor(100000 + Math.random() * 900000),
            total: total
          } 
        });
      } catch (error) {
        console.error('Error processing order:', error);
        alert('There was an error processing your order. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  if (loading) {
    return <div className="loading">Loading checkout...</div>;
  }
  
  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Information</div>
            </div>
            <div className="step-divider"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Shipping</div>
            </div>
            <div className="step-divider"></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Payment</div>
            </div>
          </div>
        </div>
        
        <div className="checkout-content">
          <div className="checkout-form-container">
            <form onSubmit={step === 3 ? handleSubmit : handleNextStep}>
              {/* Step 1: Customer Information */}
              {step === 1 && (
                <div className="checkout-form-step">
                  <h2>Customer Information</h2>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? 'error' : ''}
                      />
                      {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? 'error' : ''}
                      />
                      {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <div className="error-message">{errors.phone}</div>}
                  </div>
                  
                  <div className="form-actions">
                    <Link to="/cart" className="btn btn-outline">Return to Cart</Link>
                    <button type="submit" className="btn btn-primary">Continue to Shipping</button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Shipping Information */}
              {step === 2 && (
                <div className="checkout-form-step">
                  <h2>Shipping Address</h2>
                  
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={errors.address ? 'error' : ''}
                    />
                    {errors.address && <div className="error-message">{errors.address}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="apartment">Apartment, suite, etc. (optional)</label>
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={errors.city ? 'error' : ''}
                      />
                      {errors.city && <div className="error-message">{errors.city}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="state">State</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={errors.state ? 'error' : ''}
                      />
                      {errors.state && <div className="error-message">{errors.state}</div>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="zipCode">ZIP Code</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={errors.zipCode ? 'error' : ''}
                      />
                      {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="country">Country</label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <input
                      type="checkbox"
                      id="sameAsShipping"
                      name="sameAsShipping"
                      checked={formData.sameAsShipping}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="sameAsShipping">Billing address same as shipping</label>
                  </div>
                  
                  {!formData.sameAsShipping && (
                    <div className="billing-address">
                      <h2>Billing Address</h2>
                      
                      <div className="form-group">
                        <label htmlFor="billingAddress">Address</label>
                        <input
                          type="text"
                          id="billingAddress"
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleInputChange}
                          className={errors.billingAddress ? 'error' : ''}
                        />
                        {errors.billingAddress && <div className="error-message">{errors.billingAddress}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="billingApartment">Apartment, suite, etc. (optional)</label>
                        <input
                          type="text"
                          id="billingApartment"
                          name="billingApartment"
                          value={formData.billingApartment}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="billingCity">City</label>
                          <input
                            type="text"
                            id="billingCity"
                            name="billingCity"
                            value={formData.billingCity}
                            onChange={handleInputChange}
                            className={errors.billingCity ? 'error' : ''}
                          />
                          {errors.billingCity && <div className="error-message">{errors.billingCity}</div>}
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="billingState">State</label>
                          <input
                            type="text"
                            id="billingState"
                            name="billingState"
                            value={formData.billingState}
                            onChange={handleInputChange}
                            className={errors.billingState ? 'error' : ''}
                          />
                          {errors.billingState && <div className="error-message">{errors.billingState}</div>}
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="billingZipCode">ZIP Code</label>
                          <input
                            type="text"
                            id="billingZipCode"
                            name="billingZipCode"
                            value={formData.billingZipCode}
                            onChange={handleInputChange}
                            className={errors.billingZipCode ? 'error' : ''}
                          />
                          {errors.billingZipCode && <div className="error-message">{errors.billingZipCode}</div>}
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="billingCountry">Country</label>
                          <select
                            id="billingCountry"
                            name="billingCountry"
                            value={formData.billingCountry}
                            onChange={handleInputChange}
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <h2>Shipping Method</h2>
                  <div className="shipping-methods">
                    <div className="shipping-method">
                      <input
                        type="radio"
                        id="standard"
                        name="shippingMethod"
                        value="standard"
                        checked={formData.shippingMethod === 'standard'}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="standard">
                        <div className="shipping-method-name">Standard Shipping</div>
                        <div className="shipping-method-price">R$ 5,99</div>
                        <div className="shipping-method-info">5-7 business days</div>
                      </label>
                    </div>
                    
                    <div className="shipping-method">
                      <input
                        type="radio"
                        id="express"
                        name="shippingMethod"
                        value="express"
                        checked={formData.shippingMethod === 'express'}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="express">
                        <div className="shipping-method-name">Express Shipping</div>
                        <div className="shipping-method-price">R$ 12,99</div>
                        <div className="shipping-method-info">2-3 business days</div>
                      </label>
                    </div>
                    
                    <div className="shipping-method">
                      <input
                        type="radio"
                        id="overnight"
                        name="shippingMethod"
                        value="overnight"
                        checked={formData.shippingMethod === 'overnight'}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="overnight">
                        <div className="shipping-method-name">Overnight Shipping</div>
                        <div className="shipping-method-price">R$ 19,99</div>
                        <div className="shipping-method-info">Next business day</div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="btn btn-outline" onClick={handlePrevStep}>Return to Information</button>
                    <button type="submit" className="btn btn-primary">Continue to Payment</button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Payment Information */}
              {step === 3 && (
                <div className="checkout-form-step">
                  <h2>Payment Information</h2>
                  
                  <div className="payment-methods-header">
                    <div className="payment-icons">
                      <i className="fab fa-cc-visa"></i>
                      <i className="fab fa-cc-mastercard"></i>
                      <i className="fab fa-cc-amex"></i>
                      <i className="fab fa-cc-discover"></i>
                    </div>
                    <div className="secure-payment">
                      <i className="fas fa-lock"></i> Secure Payment
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cardName">Name on Card</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className={errors.cardName ? 'error' : ''}
                    />
                    {errors.cardName && <div className="error-message">{errors.cardName}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className={errors.cardNumber ? 'error' : ''}
                    />
                    {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="cardExpiry">Expiration Date</label>
                      <input
                        type="text"
                        id="cardExpiry"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className={errors.cardExpiry ? 'error' : ''}
                      />
                      {errors.cardExpiry && <div className="error-message">{errors.cardExpiry}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cardCvc">CVC</label>
                      <input
                        type="text"
                        id="cardCvc"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        placeholder="123"
                        className={errors.cardCvc ? 'error' : ''}
                      />
                      {errors.cardCvc && <div className="error-message">{errors.cardCvc}</div>}
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="btn btn-outline" onClick={handlePrevStep}>Return to Shipping</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Processing...' : 'Complete Order'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
          
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            
            <div className="checkout-items">
              {cartItems.map(item => (
                <div className="checkout-item" key={item.id}>
                  <div className="checkout-item-image">
                    <img src={item.image} alt={item.name} />
                    <span className="checkout-item-quantity">{item.quantity}</span>
                  </div>
                  <div className="checkout-item-details">
                    <h3>{item.name}</h3>
                    {item.category && <p className="checkout-item-category">{item.category}</p>}
                  </div>
                  <div className="checkout-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="checkout-total-row">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              
              <div className="checkout-total-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="checkout-total-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;