import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import ProductCard from '../components/ProductCard';
import '../styles/ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  
  const location = useLocation();

  // Parse query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [location.search]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        let url = `${apiUrl}/api/products`;
        
        // Add query parameters
        const params = new URLSearchParams();
        if (activeCategory && activeCategory !== 'all') {
          params.append('category', activeCategory);
        }
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
        } else {
          throw new Error(data.error || 'Failed to fetch products');
        }
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, searchTerm]);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (activeCategory !== 'all') {
      result = result.filter(product => product.category === activeCategory);
    }
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(search) || 
          product.description.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-a-z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep default order
        break;
    }
    
    setFilteredProducts(result);
  }, [products, activeCategory, searchTerm, sortOption]);

  // Category filter handler
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Sort handler
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">Shop</h1>
        
        {/* Filters and Search */}
        <div className="products-controls">
          <div className="categories">
            <button 
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              All Products
            </button>
            <button 
              className={`category-btn ${activeCategory === 'music' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('music')}
            >
              Music
            </button>
            <button 
              className={`category-btn ${activeCategory === 'apparel' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('apparel')}
            >
              Apparel
            </button>
            <button 
              className={`category-btn ${activeCategory === 'merch' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('merch')}
            >
              Merchandise
            </button>
          </div>
          
          <div className="search-sort">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <i className="fas fa-search search-icon"></i>
            </div>
            
            <div className="sort-container">
              <select 
                value={sortOption} 
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="default">Sort by: Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Products Display */}
        {isLoading ? (
          <div className="loading">Loading products...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
            <button 
              className="btn btn-primary reset-btn"
              onClick={() => {
                setActiveCategory('all');
                setSearchTerm('');
                setSortOption('default');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="products-grid grid">
            {filteredProducts.map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;