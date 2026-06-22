import React, { useState, useEffect } from 'react';

export default function App() {
  // --- STATE ---
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('tj_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(true);
  const [databaseName, setDatabaseName] = useState('Conectando...');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Admin Panels state
  const [activeAdminTab, setActiveAdminTab] = useState('products'); // 'products' or 'categories'
  
  // Forms state
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductImageBase64, setNewProductImageBase64] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Password Verification state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // --- FETCH DATA FROM SERVERLESS CLOUD DATABASE ON MOUNT ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
        setProducts(data.products || []);
        setDatabaseName(data.database || 'Turso Cloud');
        
        // Auto-select first category as default for product form dropdown
        if (data.categories && data.categories.length > 0) {
          setNewProductCategory(data.categories[0]);
        }
      } else {
        setDatabaseName('Error de conexión');
      }
    } catch (err) {
      console.error('Error fetching data from backend:', err);
      setDatabaseName('Modo Desconectado');
    } finally {
      setLoading(false);
    }
  };

  // --- SYNC CART WITH LOCAL STORAGE ---
  useEffect(() => {
    localStorage.setItem('tj_cart', JSON.stringify(cart));
  }, [cart]);

  // Set default category when categories list updates
  useEffect(() => {
    if (categories.length > 0 && !newProductCategory) {
      setNewProductCategory(categories[0]);
    }
  }, [categories, newProductCategory]);

  // --- HELPERS ---
  const getProductById = (id) => {
    return products.find(p => p.id === id);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const prod = getProductById(item.id);
      return total + (prod ? prod.price * item.quantity : 0);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // --- ACTIONS ---

  // Cart operations
  const addToCart = (productId) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === productId);
      if (existing) {
        return prevCart.map(item => 
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { id: productId, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Admin Toggle Handler
  const handleAdminClick = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      setAdminPassword('');
      setPasswordError('');
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (adminPassword === 'joaco2026') {
      setIsAdminMode(true);
      setIsPasswordModalOpen(false);
      setAdminPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Contraseña incorrecta. Inténtalo de nuevo.');
    }
  };

  // Admin operations: Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const cleanName = newCategoryName.trim();
    if (!cleanName) return;

    if (categories.some(c => c.toLowerCase() === cleanName.toLowerCase())) {
      alert('La categoría ya existe.');
      return;
    }

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'joaco2026' // verified on serverless backend
        },
        body: JSON.stringify({ name: cleanName })
      });

      if (res.ok) {
        setCategories([...categories, cleanName]);
        setNewCategoryName('');
      } else {
        const errData = await res.json();
        alert(errData.error || 'Error al guardar categoría.');
      }
    } catch (err) {
      console.error('Error adding category:', err);
      alert('Error de red. No se pudo guardar la categoría.');
    }
  };

  // Admin operations: Delete Category
  const handleDeleteCategory = async (catName) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${catName}"? Los productos en esta categoría pasarán a "Sin Categoría".`)) {
      try {
        const res = await fetch(`/api/categories?name=${encodeURIComponent(catName)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'joaco2026'
          }
        });

        if (res.ok) {
          setCategories(categories.filter(c => c !== catName));
          setProducts(products.map(p => 
            p.category === catName ? { ...p, category: 'Sin Categoría' } : p
          ));
          if (selectedCategory === catName) {
            setSelectedCategory('Todas');
          }
        } else {
          const errData = await res.json();
          alert(errData.error || 'Error al eliminar categoría.');
        }
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Error de red. No se pudo eliminar la categoría.');
      }
    }
  };

  // Admin operations: Add Product image loader
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProductImageBase64(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Admin operations: Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const name = newProductName.trim();
    const priceVal = parseFloat(newProductPrice);
    
    if (!name || isNaN(priceVal) || priceVal <= 0) {
      alert('Por favor, ingresa un nombre válido y un precio mayor a 0.');
      return;
    }

    const newProduct = {
      id: 'prod-' + Date.now(),
      name,
      price: priceVal,
      category: newProductCategory || 'Sin Categoría',
      image: newProductImageBase64 || 'https://via.placeholder.com/150?text=Sin+Imagen'
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'joaco2026'
        },
        body: JSON.stringify(newProduct)
      });

      if (res.ok) {
        setProducts([newProduct, ...products]);
        
        // Reset Form
        setNewProductName('');
        setNewProductPrice('');
        setNewProductImageBase64('');
        setImagePreview('');
      } else {
        const errData = await res.json();
        alert(errData.error || 'Error al guardar el producto.');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Error de red. No se pudo registrar el producto.');
    }
  };

  // Admin operations: Delete Product
  const handleDeleteProduct = async (productId) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const res = await fetch(`/api/products?id=${encodeURIComponent(productId)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'joaco2026'
          }
        });

        if (res.ok) {
          setProducts(products.filter(p => p.id !== productId));
          removeFromCart(productId);
        } else {
          const errData = await res.json();
          alert(errData.error || 'Error al borrar el producto.');
        }
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Error de red. No se pudo borrar el producto.');
      }
    }
  };

  // Checkout redirect via WhatsApp
  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    let message = '¡Hola Joaco! 🛒 Quisiera realizar el siguiente pedido en Tienda Joaco:\n\n';
    
    cart.forEach((item, index) => {
      const prod = getProductById(item.id);
      if (prod) {
        const subtotal = prod.price * item.quantity;
        message += `${index + 1}. *${prod.name}*\n`;
        message += `   Cantidad: ${item.quantity} x $${prod.price.toLocaleString('es-AR')} \n`;
        message += `   Subtotal: *$${subtotal.toLocaleString('es-AR')}*\n\n`;
      }
    });

    const total = getCartTotal();
    message += `💵 *Total a pagar: $${total.toLocaleString('es-AR')}*\n\n`;
    message += 'Muchas gracias. ¡Quedo atento para coordinar!';

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5491173578742?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // --- FILTERS ---
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // --- SKELETON LOADING VIEW ON LAUNCH ---
  if (loading) {
    return (
      <div className="app-container" style={{justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '1.5rem', backgroundColor: '#090d16'}}>
        <div className="logo-container" style={{flexDirection: 'column', gap: '1rem', textAlign: 'center'}}>
          <img src="/logo.jpg" alt="Tienda Joaco" className="logo-image" style={{height: '110px', width: 'auto', border: '2px solid rgba(255, 106, 0, 0.5)', borderRadius: '12px'}} />
          <div style={{
            width: '44px',
            height: '44px',
            border: '4px solid rgba(255, 255, 255, 0.1)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '1.5rem auto 1rem auto'
          }}></div>
          <p style={{fontFamily: 'var(--font-title)', fontWeight: 600, color: 'var(--text-white)', fontSize: '1.1rem', letterSpacing: '0.3px'}}>
            Conectando con Turso Cloud Database...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-container">
            <img src="/logo.jpg" alt="Tienda Joaco Logo" className="logo-image" />
            <span className="logo-text">Tienda Joaco</span>
          </div>

          <div className="search-bar">
            <span className="search-icon">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Buscar productos en la tienda..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="header-actions">
            <button 
              onClick={handleAdminClick} 
              className={`admin-toggle-btn ${isAdminMode ? 'active' : ''}`}
              title="Modo Administrador"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"></path>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"></path>
              </svg>
              <span>{isAdminMode ? 'Volver a Tienda' : 'Modo Admin'}</span>
            </button>

            <button onClick={() => setIsCartOpen(true)} className="cart-trigger" aria-label="Ver carrito">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path>
              </svg>
              {getCartItemsCount() > 0 && (
                <span className="cart-badge">{getCartItemsCount()}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO BANNER - Displayed only in storefront mode */}
      {!isAdminMode && (
        <section className="hero-banner">
          <div className="hero-content">
            <img src="/logo.jpg" alt="Tienda Joaco Banner" className="hero-logo" />
            <p className="hero-tagline">🛍️ ¡Tu tienda de confianza al alcance de un clic! 🛍️</p>
          </div>
        </section>
      )}

      {/* WORKSPACE */}
      <main className="main-content">
        {/* Connection status banner */}
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          fontSize: '0.8rem', 
          fontWeight: 600, 
          color: databaseName.includes("Turso") ? '#2e7d32' : '#d84315',
          backgroundColor: databaseName.includes("Turso") ? 'rgba(46, 125, 50, 0.08)' : 'rgba(216, 67, 21, 0.08)',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-sm)',
          width: 'fit-content',
          marginBottom: '1.25rem',
          border: `1px solid ${databaseName.includes("Turso") ? 'rgba(46, 125, 50, 0.15)' : 'rgba(216, 67, 21, 0.15)'}`
        }}>
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            animation: databaseName.includes("Cargando") ? 'pulse 1s infinite alternate' : 'none'
          }}></span>
          <span>Base de datos: {databaseName}</span>
        </div>

        {isAdminMode ? (
          /* ========================================================
             ADMINISTRATIVE CONTROL PANEL
             ======================================================== */
          <div className="admin-workspace">
            <div className="admin-header-tabs">
              <button 
                onClick={() => setActiveAdminTab('products')} 
                className={`admin-tab-btn ${activeAdminTab === 'products' ? 'active' : ''}`}
              >
                Productos
              </button>
              <button 
                onClick={() => setActiveAdminTab('categories')} 
                className={`admin-tab-btn ${activeAdminTab === 'categories' ? 'active' : ''}`}
              >
                Categorías
              </button>
            </div>

            <div className="admin-panel-content">
              {activeAdminTab === 'products' ? (
                /* MANAGE PRODUCTS WORKSPACE */
                <div className="admin-grid-layout">
                  {/* Left Form: Add product */}
                  <form onSubmit={handleAddProduct} className="admin-form-card">
                    <h3 className="admin-form-title">Cargar Producto</h3>
                    
                    <div className="form-group">
                      <label className="form-label">Nombre del Producto</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Bizcocho Dulce 200g"
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Precio ($ ARS)</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        placeholder="Ej. 800"
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Categoría</label>
                      <select 
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value)}
                        className="form-select"
                      >
                        {categories.map((cat, idx) => (
                          <option key={idx} value={cat}>{cat}</option>
                        ))}
                        <option value="Sin Categoría">Sin Categoría</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Foto del Producto</label>
                      <div className="file-upload-zone">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{color: 'var(--text-light)'}}>
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Sube una imagen</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageChange}
                          className="file-input"
                        />
                      </div>
                      {imagePreview && (
                        <img src={imagePreview} alt="Previsualización" className="upload-preview" />
                      )}
                    </div>

                    <button type="submit" className="submit-form-btn">
                      Guardar Producto
                    </button>
                  </form>

                  {/* Right List: Display products */}
                  <div className="admin-list-card">
                    <h3 className="admin-form-title" style={{marginBottom: '1rem'}}>
                      Inventario de Productos ({products.length})
                    </h3>

                    {products.length === 0 ? (
                      <div className="empty-state">
                        <p className="empty-state-title">No hay productos guardados.</p>
                      </div>
                    ) : (
                      <div className="admin-table-container">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Foto</th>
                              <th>Nombre</th>
                              <th>Categoría</th>
                              <th>Precio</th>
                              <th style={{textAlign: 'right'}}>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((prod) => (
                              <tr key={prod.id}>
                                <td>
                                  <div className="admin-table-image-wrapper">
                                    <img src={prod.image} alt={prod.name} className="admin-table-image" />
                                  </div>
                                </td>
                                <td style={{fontWeight: 600}}>{prod.name}</td>
                                <td>
                                  <span style={{
                                    backgroundColor: 'var(--light-bg)',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.8rem',
                                    fontWeight: 500
                                  }}>
                                    {prod.category}
                                  </span>
                                </td>
                                <td style={{fontFamily: 'var(--font-title)', fontWeight: 700}}>
                                  ${prod.price.toLocaleString('es-AR')}
                                </td>
                                <td style={{textAlign: 'right'}}>
                                  <button 
                                    onClick={() => handleDeleteProduct(prod.id)} 
                                    className="delete-action-btn"
                                    title="Eliminar producto"
                                  >
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <polyline points="3 6 5 6 21 6"></polyline>
                                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                      <line x1="10" y1="11" x2="10" y2="17"></line>
                                      <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* MANAGE CATEGORIES WORKSPACE */
                <div className="categories-dashboard">
                  {/* Left Form: Add Category */}
                  <form onSubmit={handleAddCategory} className="admin-form-card">
                    <h3 className="admin-form-title">Nueva Categoría</h3>
                    <div className="form-group">
                      <label className="form-label">Nombre de Categoría</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Alimentos, Bazar, etc."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <button type="submit" className="submit-form-btn">
                      Agregar Categoría
                    </button>
                  </form>

                  {/* Right List: Display Categories */}
                  <div className="admin-list-card">
                    <h3 className="admin-form-title">Categorías Activas ({categories.length})</h3>
                    <div className="categories-list">
                      {categories.map((cat, idx) => (
                        <div key={idx} className="category-list-item">
                          <span>{cat}</span>
                          <button 
                            onClick={() => handleDeleteCategory(cat)} 
                            className="delete-action-btn"
                            title="Eliminar Categoría"
                          >
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================
             CLIENT STOREFRONT
             ======================================================== */
          <>
            {/* CATEGORIES FILTERS TAB BAR */}
            <nav className="categories-nav">
              <button 
                onClick={() => setSelectedCategory('Todas')} 
                className={`category-tab ${selectedCategory === 'Todas' ? 'active' : ''}`}
              >
                Todos los productos
              </button>
              {categories.map((cat, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedCategory(cat)} 
                  className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </nav>

            {/* SECTIONS HEADER */}
            <div className="section-header">
              <h2 className="section-title">
                {selectedCategory === 'Todas' ? 'Nuestros Productos' : selectedCategory}
              </h2>
              <span className="results-count">
                Mostrando {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* STOREFRONT PRODUCT GRID */}
            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{color: 'var(--text-light)'}}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
                <h3 className="empty-state-title">No encontramos productos</h3>
                <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Intenta buscando con otros términos o seleccionando otra categoría.</p>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((prod) => {
                  const cartItem = cart.find(item => item.id === prod.id);
                  return (
                    <article key={prod.id} className="product-card">
                      <div className="product-image-wrapper">
                        <img src={prod.image} alt={prod.name} className="product-card-image" loading="lazy" />
                        <span className="product-card-badge">{prod.category}</span>
                      </div>
                      <div className="product-details">
                        <div className="product-price">
                          ${prod.price.toLocaleString('es-AR')}
                        </div>
                        <h3 className="product-title" title={prod.name}>
                          {prod.name}
                        </h3>
                        <div className="product-card-footer">
                          {cartItem ? (
                            /* Quantity counter selector like jumbo.com.ar */
                            <div className="quantity-selector">
                              <button 
                                onClick={() => updateQuantity(prod.id, -1)} 
                                className="qty-btn"
                                aria-label="Disminuir cantidad"
                              >
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                              </button>
                              <span className="qty-value">{cartItem.quantity}</span>
                              <button 
                                onClick={() => addToCart(prod.id)} 
                                className="qty-btn"
                                aria-label="Aumentar cantidad"
                              >
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <line x1="12" y1="5" x2="12" y2="19"></line>
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                              </button>
                            </div>
                          ) : (
                            /* Simple Add to cart button */
                            <button 
                              onClick={() => addToCart(prod.id)} 
                              className="add-to-cart-btn"
                            >
                              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                              <span>Agregar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* SHOPPING CART OVERLAY / SIDEBAR */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h3 className="cart-title">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path>
              </svg>
              <span>Mi Carrito</span>
            </h3>
            <button onClick={() => setIsCartOpen(false)} className="close-cart-btn" aria-label="Cerrar carrito">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="cart-items-container">
            {cart.length === 0 ? (
              <div className="empty-cart-view">
                <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" style={{color: 'var(--text-light)'}}>
                  <path d="M2.28 2.28l19.44 19.44M6 6H4.24l2.68 13.39A2 2 0 008.92 21h9.72a2 2 0 002-1.61L21.35 15M16 11.5L20 8M12.5 13H18"></path>
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                </svg>
                <p style={{fontWeight: 600}}>Tu carrito está vacío</p>
                <p style={{fontSize: '0.85rem', color: 'var(--text-light)'}}>Navega por la tienda y agrega los productos que desees comprar.</p>
              </div>
            ) : (
              cart.map((item) => {
                const prod = getProductById(item.id);
                if (!prod) return null;
                return (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image-wrapper">
                      <img src={prod.image} alt={prod.name} className="cart-item-image" />
                    </div>
                    <div className="cart-item-details">
                      <h4 className="cart-item-title">{prod.name}</h4>
                      <div className="cart-item-price-row">
                        <span className="cart-item-price">
                          ${(prod.price * item.quantity).toLocaleString('es-AR')}
                        </span>
                        
                        <div className="cart-item-qty-controls">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            className="cart-item-qty-btn"
                          >
                            -
                          </button>
                          <span className="cart-item-qty-val">{item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item.id)} 
                            className="cart-item-qty-btn"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="remove-item-btn"
                      aria-label="Quitar del carrito"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                      </svg>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-summary-footer">
              <div className="cart-total-row">
                <span className="cart-total-label">Total del pedido:</span>
                <span className="cart-total-value">${getCartTotal().toLocaleString('es-AR')}</span>
              </div>
              <button 
                onClick={handleWhatsAppCheckout} 
                className="whatsapp-checkout-btn"
              >
                {/* WhatsApp logo inline SVG */}
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.022-.08-.117-.146-.217-.196-.123-.06-1.003-.493-1.16-.55-.156-.057-.27-.088-.388.09-.118.179-.46.55-.563.667-.103.117-.207.13-.328.07-.121-.06-.51-.188-1.724-1.272-.943-.841-1.579-1.879-1.764-2.196-.185-.318-.02-.489.14-.649.145-.143.328-.38.492-.57.164-.19.219-.318.328-.53.11-.213.055-.399-.028-.57-.082-.172-.736-1.77-.997-2.42-.26-.64-.53-.55-.736-.56-.189-.01-.405-.01-.621-.01-.216 0-.57.08-.868.41-.299.33-1.14 1.11-1.14 2.71 0 1.6 1.16 3.15 1.32 3.37.16.22 2.29 3.5 5.56 4.9 1.95.83 2.74.9 3.73.72.73-.13 2.27-.93 2.59-1.83.32-.9.32-1.67.22-1.83zM12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.9 5.86L2.62 22l4.31-1.24C8.5 21.43 10.18 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.63 0-3.17-.46-4.5-1.26l-.32-.2-2.53.73.74-2.46-.22-.35C4.33 15.17 3.8 13.63 3.8 12c0-4.52 3.68-8.2 8.2-8.2 4.52 0 8.2 3.68 8.2 8.2 0 4.52-3.68 8.2-8.2 8.2z"/>
                </svg>
                <span>Hacer pedido por WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-logo-row">
            <img src="/logo.jpg" alt="Tienda Joaco Logo" className="footer-logo-img" />
            <span className="footer-logo-text">Tienda Joaco</span>
          </div>
          
          <p className="footer-tagline">
            E-commerce estático optimizado para Netlify. Los pedidos se envían directamente al WhatsApp oficial del vendedor para asegurar una atención rápida y personalizada.
          </p>

          <div className="footer-links">
            <a href="https://wa.me/5491173578742" target="_blank" rel="noopener noreferrer" className="footer-link">WhatsApp de Joaco</a>
            <span style={{color: 'var(--dark-border)'}}>|</span>
            <button onClick={handleAdminClick} className="footer-link">
              {isAdminMode ? 'Volver al catálogo' : 'Panel de Control (Admin)'}
            </button>
          </div>

          <p style={{fontSize: '0.8rem', color: 'var(--text-light)'}}>
            © {new Date().getFullYear()} Tienda Joaco. Todos los derechos reservados. Est. 2024.
          </p>
        </div>
      </footer>

      {/* PASSWORD MODAL FOR ADMIN ACCESS */}
      <div className={`modal-overlay ${isPasswordModalOpen ? 'open' : ''}`} onClick={() => setIsPasswordModalOpen(false)}>
        <div className="password-modal-card" onClick={(e) => e.stopPropagation()}>
          <h3 className="password-modal-title">Acceso Administrador</h3>
          
          <form onSubmit={handlePasswordSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div className="form-group" style={{marginBottom: 0}}>
              <label className="form-label" style={{color: 'var(--text-light)'}}>Contraseña</label>
              <input 
                type="password" 
                required
                placeholder="Ingresa la contraseña..."
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="form-input"
                style={{backgroundColor: 'var(--dark-bg)', borderColor: 'var(--dark-border)', color: 'var(--text-white)'}}
                autoFocus={isPasswordModalOpen}
              />
            </div>
            
            {passwordError && (
              <p className="password-error-msg">{passwordError}</p>
            )}

            <div className="password-modal-actions">
              <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="password-btn-cancel">
                Cancelar
              </button>
              <button type="submit" className="password-btn-submit">
                Ingresar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
