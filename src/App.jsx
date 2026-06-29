import React, { useState, useEffect } from 'react';

// Database of local and famous shops for the delivery portal
const SHOPS = {
  restaurantes: [
    { name: "Tinicome", url: "/tinicome", type: "tinicome", isMenuShop: true },
    { name: "Restaurante El Lostan", url: "/lostan", type: "lostan", isMenuShop: true },
    { name: "La Perla", url: "https://www.laperlaballester.com.ar", type: "la_perla" },
    { name: "La Carerita", url: "https://lacarerita.com.ar", type: "la_carerita" },
    { name: "Fiko", isCustom: true, type: "fiko" },
    { name: "Donato", url: "https://donato.com.ar", type: "donato" },
    { name: "La Dionisia", url: "https://ladionisiaparrilla.com.ar", type: "la_dionisia" },
    { name: "Pokos Pop", url: "https://pokospop.com.ar", type: "pokos_pop" },
    { name: "Diastl La Caserita", url: "https://diastl.com.ar", type: "diastl" },
    { name: "McDonald's", url: "https://www.mcdonalds.com.ar", type: "mcdonalds" },
    { name: "Burger King", url: "https://www.burgerking.com.ar", type: "burger_king" }
  ],
  supermercados: [
    { name: "Jumbo", url: "https://www.jumbo.com.ar", type: "jumbo" },
    { name: "Disco", url: "https://www.disco.com.ar", type: "disco" },
    { name: "Carrefour", url: "https://www.carrefour.com.ar", type: "carrefour" },
    { name: "Día", url: "https://www.diaonline.com.ar", type: "dia" },
    { name: "Libertad", url: "https://www.libertad.com.ar", type: "libertad" },
    { name: "Makro", url: "https://www.makro.com.ar", type: "makro" }
  ],
  heladerias: [
    { name: "Rompesol", url: "/rompesol", type: "rompesol", isMenuShop: true },
    { name: "Heladería Joaco", isCustom: true, type: "joaco_helados" },
    { name: "Freddo", url: "https://freddo.com.ar", type: "freddo" },
    { name: "Daniel", url: "https://heladosdaniel.com.ar", type: "daniel" },
    { name: "Grido", url: "https://gridohelados.com.ar", type: "grido" },
    { name: "Lucciano's", url: "https://luccianos.net", type: "luccianos" }
  ],
  kioscos: [
    { name: "Open 25 hs", url: "https://open25.com.ar", type: "open25" },
    { name: "El Jauja", url: "https://jauja.com.ar", type: "jauja" },
    { name: "Kiosco 365", url: "https://365.com.ar", type: "kiosco365" }
  ],
  farmacias: [
    { name: "Farmacity", url: "https://www.farmacity.com", type: "farmacity" },
    { name: "Dr. Ahorro", url: "https://www.doctorahorro.com.ar", type: "drahorro" }
  ]
};

// Branded configuration settings for each interactive local menu shop
const SHOP_THEMES = {
  tinicome: {
    themeClass: 'theme-tinicome',
    color: '#92c83e', // Tinicome light green
    colorDark: '#679b1b',
    colorLight: '#f4fae9',
    title: 'Tinicome',
    subtitle: 'NUESTRAS COMIDAS',
    bannerText: '¡Las mejores hamburguesas y minutas caseras de Joaco!',
    logo: '/tinicome.png',
    categories: ['Hamburguesas', 'Minutas', 'Pastas', 'Bebidas'],
    icon: '🍔'
  },
  lostan: {
    themeClass: 'theme-lostan',
    color: '#70b01a', // Lostan classic green
    colorDark: '#2e7d32',
    colorLight: '#f0f9e8',
    title: 'Restaurante El Lostan',
    subtitle: 'EL PLACER DE COMER BIEN',
    bannerText: 'Pizzas, empanadas y pastas caseras con el verdadero sabor de bodegón.',
    logo: '/lostan.png',
    categories: ['Pizzas', 'Entradas', 'Minutas', 'Pastas', 'Bebidas'],
    icon: '🍝'
  },
  rompesol: {
    themeClass: 'theme-rompesol',
    color: '#ffd600', // Sunny yellow
    colorDark: '#e65100', // warm beach orange
    colorLight: '#fffde7',
    title: 'Heladería Rompesol',
    subtitle: 'HELADOS ARTESANALES',
    bannerText: 'Disfruta de nuestros helados y paletas artesanales de Joaco.',
    logo: '/rompesol.jpg',
    categories: ['Vasos', 'Conos', 'Paletas', 'Sabores'],
    icon: '🍦'
  }
};

// High-fidelity CSS/SVG Shop Logo renderer matching the mockup image exactly
function ShopLogo({ type }) {
  switch (type) {
    // --- INTEGRATED LOCAL MENU SHOPS ---
    case "tinicome":
      return (
        <img src="/tinicome.png" alt="Tinicome" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      );
    case "lostan":
      return (
        <img src="/lostan.png" alt="Restaurante El Lostan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      );
    case "rompesol":
      return (
        <img src="/rompesol.jpg" alt="Heladería Rompesol" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      );

    // --- RESTAURANTES VILLA BALLESTER & chains ---
    case "la_perla":
      return (
        <div style={{ background: '#ffffff', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#a81c24', width: '88%', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #7d1217' }}>
            <span style={{ color: '#ffffff', fontSize: '9px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.3px', textAlign: 'center', lineHeight: 1 }}>LA PERLA</span>
          </div>
        </div>
      );
    case "la_carerita":
      return (
        <div style={{ background: '#fdf7ee', border: '1px solid #eadaa2', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
          <div style={{ color: '#7c1c1f', fontSize: '9px', fontWeight: 900, textAlign: 'center', lineHeight: 1.1, fontFamily: 'Outfit, sans-serif' }}>LA CARERITA</div>
          <div style={{ fontSize: '10px', marginTop: '2px', display: 'flex', gap: '2px' }}>
            <span>🌾</span><span>🍕</span><span>🌾</span>
          </div>
        </div>
      );
    case "fiko":
      return (
        <div style={{ background: '#55585d', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
          <span style={{ fontSize: '12px' }}>🍴</span>
          <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', letterSpacing: '0.5px' }}>FIKO</span>
        </div>
      );
    case "donato":
      return (
        <div style={{ background: '#000000', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ border: '2px solid #a81c24', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fdfbf7', overflow: 'hidden' }}>
            <div style={{ fontSize: '13px' }}>👨‍🍳</div>
            <div style={{ color: '#a81c24', fontSize: '7px', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginTop: '-2px' }}>DONATO</div>
          </div>
        </div>
      );
    case "la_dionisia":
      return (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
          <span style={{ color: '#163a24', fontSize: '8px', fontWeight: 'bold', fontFamily: 'Georgia, serif', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.1 }}>La Dionisia</span>
          <span style={{ color: '#163a24', fontSize: '6px', fontWeight: 700, letterSpacing: '0.5px', marginTop: '1px' }}>L & D</span>
        </div>
      );
    case "pokos_pop":
      return (
        <div style={{ background: '#00979c', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#ffffff', fontSize: '9px', fontWeight: 500, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>pokos</span>
          <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 800, fontFamily: 'Outfit, sans-serif', letterSpacing: '0.5px', marginTop: '-1px' }}>POP</span>
        </div>
      );
    case "diastl":
      return (
        <div style={{ background: '#ef7285', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
          <span style={{ color: '#ffffff', fontSize: '9px', fontWeight: 700, lineHeight: 1 }}>Diastl</span>
          <span style={{ fontSize: '11px', margin: '1px 0' }}>👩‍🍳</span>
          <span style={{ color: '#ffffff', fontSize: '7px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.2px' }}>LA CASERITA</span>
        </div>
      );
    case "mcdonalds":
      return (
        <div style={{ background: '#bd1922', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#ffc72c', fontSize: '32px', fontWeight: 900, fontFamily: 'sans-serif', lineHeight: 1 }}>M</span>
        </div>
      );
    case "burger_king":
      return (
        <div style={{ background: '#502d16', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#f5ebdc', fontSize: '10px', fontWeight: 900, letterSpacing: '-0.3px', lineHeight: 1 }}>BURGER</span>
          <span style={{ color: '#ff3c00', fontSize: '10px', fontWeight: 900, letterSpacing: '0.3px', marginTop: '-2px' }}>KING</span>
        </div>
      );

    // --- SUPERMERCADOS ---
    case "jumbo":
      return (
        <img src="/jumbo.png" alt="Jumbo" style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '18px' }} />
      );
    case "disco":
      return (
        <img src="/disco.png" alt="Disco" style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '18px' }} />
      );
    case "carrefour":
      return (
        <img src="/carrefour.png" alt="Carrefour" style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '18px' }} />
      );
    case "dia":
      return (
        <img src="/dia.png" alt="Dia" style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '18px' }} />
      );
    case "libertad":
      return (
        <img src="/libertad.png" alt="Libertad" style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '18px' }} />
      );
    case "makro":
      return (
        <div style={{ background: '#0d47a1', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#ffea00', fontSize: '11px', fontWeight: 900, fontStyle: 'italic' }}>makro</span>
        </div>
      );

    // --- HELADOS ---
    case "joaco_helados":
      return (
        <div style={{ background: '#e21a42', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '14px' }}>🍦</span>
          <span style={{ color: '#ffffff', fontSize: '8px', fontWeight: 800, marginTop: '1px' }}>JOACO</span>
        </div>
      );
    case "freddo":
      return (
        <div style={{ background: '#002855', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 900, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>f</span>
        </div>
      );
    case "daniel":
      return (
        <div style={{ background: '#4fc3f7', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#ffffff', fontSize: '10px', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>Daniel</span>
        </div>
      );
    case "grido":
      return (
        <div style={{ background: '#1565c0', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#ffeb3b', fontSize: '10px', fontWeight: 900 }}>Grido</span>
        </div>
      );
    case "luccianos":
      return (
        <div style={{ background: '#000000', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#ffffff', fontSize: '8px', fontWeight: 900, letterSpacing: '0.3px', textTransform: 'uppercase' }}>Lucciano's</span>
        </div>
      );

    // --- KIOSCOS ---
    case "open25":
      return (
        <div style={{ background: '#6a1b9a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#ffd600', fontSize: '11px', fontWeight: 900, lineHeight: 1 }}>OPEN</span>
          <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 900, marginTop: '1px' }}>25</span>
        </div>
      );
    case "jauja":
      return (
        <div style={{ background: '#ef6c00', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 900 }}>JAUJA</span>
        </div>
      );
    case "kiosco365":
      return (
        <div style={{ background: '#00c853', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 900 }}>365</span>
        </div>
      );

    // --- FARMACIAS ---
    case "farmacity":
      return (
        <div style={{ background: '#00838f', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#ffffff', fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3px' }}>farmacity</span>
        </div>
      );
    case "drahorro":
      return (
        <div style={{ background: '#2e7d32', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#ffeb3b', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase' }}>Dr. Ahorro</span>
        </div>
      );

    default:
      return (
        <div style={{ background: '#7c3aed', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 800 }}>TJ</span>
        </div>
      );
  }
}

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
  
  // Delivery Hub Selection State
  const [activeHubCategory, setActiveHubCategory] = useState(null); // 'restaurantes', 'supermercados', etc.
  
  // Custom interactive shop view state
  const [activeShopDetail, setActiveShopDetail] = useState(null); // null, 'tinicome', 'lostan', 'rompesol'
  const [localAdminShops, setLocalAdminShops] = useState({ tinicome: false, lostan: false, rompesol: false });
  const [passwordTarget, setPasswordTarget] = useState('global'); // 'global', 'tinicome', 'lostan', 'rompesol'

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Admin Panels state
  const [activeAdminTab, setActiveAdminTab] = useState('products'); // 'products' or 'categories'
  
  // Product Edit state
  const [editingProduct, setEditingProduct] = useState(null);

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

  // Adjust default category selector when active shop or categories change
  useEffect(() => {
    if (activeShopDetail && SHOP_THEMES[activeShopDetail]) {
      setNewProductCategory(SHOP_THEMES[activeShopDetail].categories[0]);
    } else if (categories.length > 0) {
      setNewProductCategory(categories[0]);
    }
  }, [activeShopDetail, categories]);

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

  const getCartItemDisplayName = (prod) => {
    if (!prod) return '';
    if (prod.shop_id === 'tinicome') return `[Tinicome] ${prod.name}`;
    if (prod.shop_id === 'lostan') return `[El Lostan] ${prod.name}`;
    if (prod.shop_id === 'rompesol') return `[Rompesol] ${prod.name}`;
    return prod.name;
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

  // Global Admin Toggle Handler
  const handleAdminClick = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      handleCancelEdit();
    } else {
      setPasswordTarget('global');
      setAdminPassword('');
      setPasswordError('');
      setIsPasswordModalOpen(true);
    }
  };

  // Local Shop Admin Toggle Handler
  const handleLocalAdminClick = (shopId) => {
    const isCurrentShopAdmin = isAdminMode || localAdminShops[shopId];
    if (isCurrentShopAdmin) {
      setLocalAdminShops(prev => ({ ...prev, [shopId]: false }));
      handleCancelEdit();
    } else {
      setPasswordTarget(shopId);
      setAdminPassword('');
      setPasswordError('');
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (adminPassword === 'joaco2026') {
      if (passwordTarget === 'global') {
        setIsAdminMode(true);
      } else {
        setLocalAdminShops(prev => ({ ...prev, [passwordTarget]: true }));
      }
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
          'Authorization': 'joaco2026'
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

  // Admin operations: Edit button click handler
  const handleEditClick = (prod) => {
    setEditingProduct(prod);
    setNewProductName(prod.name);
    setNewProductPrice(prod.price.toString());
    setNewProductCategory(prod.category);
    setNewProductImageBase64(prod.image);
    setImagePreview(prod.image);
    
    // Smooth scroll to form in mobile devices
    const formEl = document.querySelector('.admin-form-card');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Admin operations: Cancel edit mode
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNewProductName('');
    setNewProductPrice('');
    setNewProductImageBase64('');
    setImagePreview('');
  };

  // Admin operations: Add/Edit Product Save
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const name = newProductName.trim();
    const priceVal = parseFloat(newProductPrice);
    
    if (!name || isNaN(priceVal) || priceVal <= 0) {
      alert('Por favor, ingresa un nombre válido y un precio mayor a 0.');
      return;
    }

    const productId = editingProduct ? editingProduct.id : 'prod-' + Date.now();
    const shopId = activeShopDetail || 'main';
    const defaultCat = activeShopDetail && SHOP_THEMES[activeShopDetail] ? SHOP_THEMES[activeShopDetail].categories[0] : 'Sin Categoría';
    
    const productPayload = {
      id: productId,
      name,
      price: priceVal,
      category: newProductCategory || defaultCat,
      image: newProductImageBase64 || 'https://via.placeholder.com/150?text=Sin+Imagen',
      shop_id: shopId
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'joaco2026'
        },
        body: JSON.stringify(productPayload)
      });

      if (res.ok) {
        if (editingProduct) {
          // Update product in storefront state
          setProducts(products.map(p => p.id === productId ? productPayload : p));
          setEditingProduct(null);
        } else {
          // Add product to storefront state
          setProducts([productPayload, ...products]);
        }
        
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
      console.error('Error saving product:', err);
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
          
          // Re-verify if we were editing the deleted product
          if (editingProduct && editingProduct.id === productId) {
            handleCancelEdit();
          }
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
        const displayName = getCartItemDisplayName(prod);
        message += `${index + 1}. *${displayName}*\n`;
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

  // Interactive local shop clicks
  const handleShopClick = (shop) => {
    if (shop.isMenuShop) {
      setActiveShopDetail(shop.type);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (shop.isCustom) {
      alert(`🛒 ¡Próximamente! Podrás explorar y comprar los productos de ${shop.name} directamente desde Tienda Joaco.`);
    } else if (shop.url) {
      window.open(shop.url, '_blank');
    }
  };

  // Toggle delivery category banners
  const handleHubCategoryToggle = (category) => {
    setActiveHubCategory(prev => prev === category ? null : category);
  };

  // --- FILTERS ---
  // 1. Filter products loaded from database (Joaco Market catalog)
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    const isMainProduct = !product.shop_id || product.shop_id === 'main';
    return matchesSearch && matchesCategory && isMainProduct;
  });

  // 2. Filter active category shops if search query is typed in the header
  const getFilteredShops = () => {
    if (!activeHubCategory || !SHOPS[activeHubCategory]) return [];
    const rawShops = SHOPS[activeHubCategory];
    if (!searchQuery.trim()) return rawShops;
    return rawShops.filter(shop => shop.name.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  // Get active themed shop configurations
  const activeTheme = activeShopDetail ? SHOP_THEMES[activeShopDetail] : null;

  // Filter products for the active interactive shop
  const activeShopProducts = activeShopDetail
    ? products.filter(p => p.shop_id === activeShopDetail && p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Group active shop products by category
  const getGroupedShopProducts = () => {
    const grouped = {};
    if (!activeTheme) return grouped;
    
    // Initialize groups in defined category order
    activeTheme.categories.forEach(cat => {
      grouped[cat] = [];
    });
    
    // Place products into correct groups
    activeShopProducts.forEach(prod => {
      const cat = prod.category;
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(prod);
    });

    return grouped;
  };

  // Check if current shop admin panel is active
  const isCurrentShopAdmin = activeShopDetail && (isAdminMode || localAdminShops[activeShopDetail]);

  // --- PREMIUM SKELETON LOADING VIEW (No mentions of Turso) ---
  if (loading) {
    return (
      <div className="loading-screen">
        <img src="/logo.jpg" alt="Cargando..." className="loading-logo" />
        <p style={{fontFamily: 'var(--font-title)', fontWeight: 600, color: 'var(--text-main)', fontSize: '1.05rem', letterSpacing: '0.5px'}}>
          Cargando tu tienda...
        </p>
      </div>
    );
  }

  return (
    <div className={`app-container ${activeTheme ? activeTheme.themeClass : ''}`}>
      {/* HEADER */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-container" onClick={() => { setActiveShopDetail(null); setActiveHubCategory(null); setSelectedCategory('Todas'); }}>
            <img src="/logo.jpg" alt="Tienda Joaco Logo" className="logo-image" />
            <span className="logo-text">Tienda Joaco</span>
          </div>

          {/* Search bar with magnifying glass relocated to the right inside the input */}
          <div className="search-bar">
            <input 
              type="text" 
              placeholder={activeTheme ? `Buscar en ${activeTheme.title}...` : "Locales, productos y ofertas en Tienda Joaco..."} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon-right">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>

          <div className="header-actions">
            {activeShopDetail ? (
              // Local Admin Mode Button
              <button 
                onClick={() => handleLocalAdminClick(activeShopDetail)}
                className={`admin-toggle-btn ${isCurrentShopAdmin ? 'active' : ''}`}
                title="Modo Administrador del Local"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"></path>
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"></path>
                </svg>
                <span>{isCurrentShopAdmin ? 'Catálogo' : 'Admin'}</span>
              </button>
            ) : (
              // Global Admin Mode Button
              <button 
                onClick={handleAdminClick} 
                className={`admin-toggle-btn ${isAdminMode ? 'active' : ''}`}
                title="Modo Administrador General"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"></path>
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"></path>
                </svg>
                <span>{isAdminMode ? 'Tienda' : 'Admin'}</span>
              </button>
            )}

            <button onClick={() => setIsCartOpen(true)} className="cart-trigger" aria-label="Ver carrito">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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

      {/* DYNAMIC SECONDARY TAGLINE BAR */}
      {!isAdminMode && !activeShopDetail && (
        <div className="hub-tagline-bar">
          <span>Tu tienda de confianza al alcance de un clic.</span>
        </div>
      )}

      {/* WORKSPACE */}
      <main className="main-content" style={{paddingTop: '1rem'}}>
        {/* Connection status banner - Displayed ONLY in admin mode */}
        {(isAdminMode || Object.values(localAdminShops).some(Boolean)) && (
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
            margin: '0 auto 1.25rem auto',
            border: `1px solid ${databaseName.includes("Turso") ? 'rgba(46, 125, 50, 0.15)' : 'rgba(216, 67, 21, 0.15)'}`
          }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'currentColor'
            }}></span>
            <span>Base de datos: {databaseName}</span>
          </div>
        )}

        {/* --------------------------------------------------------
            VIEW 1: DETAILED THEMED SHOP MENU (Tinicome, Lostan, Rompesol)
            -------------------------------------------------------- */}
        {activeShopDetail && activeTheme ? (
          <div className="shop-menu-view-container" style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 1.25rem' }}>
            {/* Navigation back button */}
            <div style={{ marginBottom: '1.25rem' }}>
              <button 
                onClick={() => { setActiveShopDetail(null); handleCancelEdit(); }} 
                className="shop-back-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontWeight: 700,
                  color: activeTheme.colorDark,
                  fontSize: '1.05rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '12px'
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Volver a Tienda Joaco</span>
              </button>
            </div>

            {/* Themed Hero Banner */}
            <div className="shop-hero-banner" style={{
              background: `linear-gradient(135deg, ${activeTheme.colorLight} 0%, #ffffff 100%)`,
              border: `2px solid ${activeTheme.color}33`
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '20px',
                overflow: 'hidden',
                border: `3px solid #ffffff`,
                boxShadow: 'var(--shadow-md)',
                backgroundColor: '#ffffff',
                flexShrink: 0
              }}>
                <img src={activeTheme.logo} alt={activeTheme.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-title)', fontWeight: 800, color: 'var(--text-main)', fontSize: '1.65rem', marginBottom: '0.25rem' }}>
                  {activeTheme.title}
                </h1>
                <h2 style={{ fontSize: '0.8rem', fontWeight: 800, color: activeTheme.colorDark, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {activeTheme.subtitle}
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {activeTheme.bannerText}
                </p>
              </div>
            </div>

            {/* Local Shop Admin Panel (displayed when unlocked) */}
            {isCurrentShopAdmin && (
              <div className="local-admin-section" style={{ marginBottom: '2rem' }}>
                <form onSubmit={handleAddProduct} className="admin-form-card" style={{ maxWidth: '480px', margin: '0 auto' }}>
                  <h3 className="admin-form-title">
                    <span>{editingProduct ? 'Editar Plato/Sabor' : 'Cargar Plato/Sabor'}</span>
                    {editingProduct && (
                      <span style={{fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary-dark)'}}>
                        [Editando]
                      </span>
                    )}
                  </h3>

                  <div className="form-group">
                    <label className="form-label">Nombre del Plato/Sabor</label>
                    <input 
                      type="text" 
                      required
                      placeholder={activeShopDetail === 'rompesol' ? "Ej. Dulce de Leche Tentación" : "Ej. Milanesa Completa"}
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
                      placeholder="Ej. 1500"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Categoría del Local</label>
                    <select 
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="form-select"
                    >
                      {activeTheme.categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Foto de Comida (Opcional - carga local o deja por defecto)</label>
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

                  <button type="submit" className="submit-form-btn" style={{ backgroundColor: activeTheme.colorDark }}>
                    {editingProduct ? 'Guardar Cambios' : `Cargar a ${activeTheme.title}`}
                  </button>

                  {editingProduct && (
                    <button type="button" onClick={handleCancelEdit} className="cancel-edit-btn">
                      Cancelar Edición
                    </button>
                  )}
                </form>
              </div>
            )}

            {/* Interactive Food Menu Listing grouped by category */}
            <div className="shop-menu-catalog" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {activeShopProducts.length === 0 ? (
                <div className="empty-state" style={{ padding: '4rem 2rem' }}>
                  <span style={{ fontSize: '3rem' }}>{activeTheme.icon}</span>
                  <h3 className="empty-state-title" style={{ marginTop: '1rem' }}>No hay platos en la carta</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Intenta cargando platos desde el botón Admin de la cabecera.</p>
                </div>
              ) : (
                Object.keys(getGroupedShopProducts()).map((categoryName) => {
                  const items = getGroupedShopProducts()[categoryName] || [];
                  if (items.length === 0 && !isCurrentShopAdmin) return null; // Hide empty sections for clients
                  
                  return (
                    <div key={categoryName} className="menu-category-section">
                      <h3 style={{
                        fontFamily: 'var(--font-title)',
                        fontWeight: 800,
                        fontSize: '1.25rem',
                        color: 'var(--text-main)',
                        borderBottom: `2px solid ${activeTheme.color}44`,
                        paddingBottom: '0.4rem',
                        marginBottom: '1.25rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {categoryName}
                      </h3>

                      <div className="product-grid">
                        {items.map((prod) => {
                          const cartItem = cart.find(item => item.id === prod.id);
                          return (
                            <article key={prod.id} className="product-card" style={{ border: `1px solid ${activeTheme.color}1a` }}>
                              <div className="product-image-wrapper">
                                <img src={prod.image} alt={prod.name} className="product-card-image" loading="lazy" />
                                <span className="product-card-badge" style={{ backgroundColor: activeTheme.colorLight, color: activeTheme.colorDark, borderColor: `${activeTheme.color}33` }}>
                                  {prod.category}
                                </span>
                              </div>
                              <div className="product-details">
                                <div className="product-price">
                                  ${prod.price.toLocaleString('es-AR')}
                                </div>
                                <h4 className="product-title" title={prod.name}>
                                  {prod.name}
                                </h4>
                                <div className="product-card-footer">
                                  {cartItem ? (
                                    <div className="quantity-selector" style={{ backgroundColor: activeTheme.colorLight, borderColor: `${activeTheme.color}33` }}>
                                      <button 
                                        onClick={() => updateQuantity(prod.id, -1)} 
                                        className="qty-btn"
                                        style={{ color: activeTheme.colorDark }}
                                        aria-label="Disminuir cantidad"
                                      >
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                          <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                      </button>
                                      <span className="qty-value" style={{ color: activeTheme.colorDark }}>{cartItem.quantity}</span>
                                      <button 
                                        onClick={() => addToCart(prod.id)} 
                                        className="qty-btn"
                                        style={{ color: activeTheme.colorDark }}
                                        aria-label="Aumentar cantidad"
                                      >
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                          <line x1="12" y1="5" x2="12" y2="19"></line>
                                          <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                      </button>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => addToCart(prod.id)} 
                                      className="add-to-cart-btn"
                                      style={{ backgroundColor: activeTheme.colorDark }}
                                    >
                                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                      </svg>
                                      <span>Agregar</span>
                                    </button>
                                  )}
                                </div>

                                {/* Edit/Delete actions in Local Admin Mode */}
                                {isCurrentShopAdmin && (
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderTop: '1px solid var(--light-border)',
                                    marginTop: '0.75rem',
                                    paddingTop: '0.5rem'
                                  }}>
                                    <button 
                                      onClick={() => handleEditClick(prod)} 
                                      style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                                    >
                                      ✏️ Editar
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteProduct(prod.id)} 
                                      style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e53e3e', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                                    >
                                      🗑️ Borrar
                                    </button>
                                  </div>
                                )}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : isAdminMode ? (
          /* --------------------------------------------------------
             VIEW 2: MAIN GLOBAL ADMINISTRATIVE CONTROL PANEL
             -------------------------------------------------------- */
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
                  {/* Left Form: Add / Edit product */}
                  <form onSubmit={handleAddProduct} className="admin-form-card">
                    <h3 className="admin-form-title">
                      <span>{editingProduct ? 'Editar Producto' : 'Cargar Producto'}</span>
                      {editingProduct && (
                        <span style={{fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-dark)'}}>
                          [Editando]
                        </span>
                      )}
                    </h3>
                    
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
                      {editingProduct ? 'Guardar Cambios' : 'Guardar Producto'}
                    </button>

                    {editingProduct && (
                      <button type="button" onClick={handleCancelEdit} className="cancel-edit-btn">
                        Cancelar Edición
                      </button>
                    )}
                  </form>

                  {/* Right List: Display products */}
                  <div className="admin-list-card">
                    <h3 className="admin-form-title" style={{marginBottom: '1rem'}}>
                      Inventario de Productos ({products.filter(p => !p.shop_id || p.shop_id === 'main').length})
                    </h3>

                    {products.filter(p => !p.shop_id || p.shop_id === 'main').length === 0 ? (
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
                            {products.filter(p => !p.shop_id || p.shop_id === 'main').map((prod) => (
                              <tr key={prod.id}>
                                <td>
                                  <div className="admin-table-image-wrapper">
                                    <img src={prod.image} alt={prod.name} className="admin-table-image" />
                                  </div>
                                </td>
                                <td style={{fontWeight: 600}}>{prod.name}</td>
                                <td>
                                  <span style={{
                                    backgroundColor: 'var(--primary-light)',
                                    color: 'var(--primary-dark)',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.8rem',
                                    fontWeight: 700
                                  }}>
                                    {prod.category}
                                  </span>
                                </td>
                                <td style={{fontFamily: 'var(--font-title)', fontWeight: 800}}>
                                  ${prod.price.toLocaleString('es-AR')}
                                </td>
                                <td>
                                  <div className="admin-table-actions">
                                    <button 
                                      type="button"
                                      onClick={() => handleEditClick(prod)}
                                      className="edit-action-btn"
                                      title="Editar producto"
                                    >
                                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                      </svg>
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => handleDeleteProduct(prod.id)} 
                                      className="delete-action-btn"
                                      title="Eliminar producto"
                                    >
                                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                      </svg>
                                    </button>
                                  </div>
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
          /* --------------------------------------------------------
             VIEW 3: CLIENT AGGREGATOR HUB + JOACO MARKET (MAIN PAGE)
             -------------------------------------------------------- */
          <>
            {/* 1. PEDIDOSYA STYLE CATEGORIES GRID */}
            <section className="hub-section">
              <h2 className="hub-title">Categorías de Pedido</h2>
              
              <div className="category-cards-grid">
                {/* ROW 1: Large Cards (Restaurantes, Supermercados) - Vertically Stacked Content like Mockup */}
                <div className="category-row-large">
                  <div 
                    onClick={() => handleHubCategoryToggle('restaurantes')}
                    className={`category-card ${activeHubCategory === 'restaurantes' ? 'active' : ''}`}
                  >
                    <div className="category-card-illustration">🍔</div>
                    <div className="category-card-info">
                      <span className="category-card-name">RESTAURANTES</span>
                      <div className="category-card-icons">
                        <span className="mini-icon-box" title="Tacos">🌮</span>
                        <span className="mini-icon-box" title="Pizzas">🍕</span>
                        <span className="mini-icon-box" title="Bebidas">🥤</span>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleHubCategoryToggle('supermercados')}
                    className={`category-card ${activeHubCategory === 'supermercados' ? 'active' : ''}`}
                  >
                    {/* Shopping cart with custom absolute Jumbo circular badge as seen on mockup */}
                    <div className="category-card-illustration" style={{ position: 'relative' }}>
                      <span>🛒</span>
                      <span style={{
                        position: 'absolute',
                        top: '4px',
                        right: '-8px',
                        background: '#248a3d',
                        color: '#ffffff',
                        fontSize: '8px',
                        fontWeight: 900,
                        padding: '2px 5px',
                        borderRadius: '12px',
                        border: '2px solid #ffffff',
                        lineHeight: 1,
                        boxShadow: 'var(--shadow-sm)',
                        fontFamily: 'Outfit, sans-serif'
                      }}>JUMBO</span>
                    </div>
                    
                    <div className="category-card-info">
                      <span className="category-card-name">SUPERMERCADOS</span>
                      <div className="category-card-icons">
                        <span className="mini-icon-box" title="Frutas">🍎</span>
                        <span className="mini-icon-box" title="Lácteos">🥛</span>
                        <span className="mini-icon-box" title="Limpieza">🧴</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* OFERTAS DE ALMACÉN SUBTITLE */}
                <div style={{ textAlign: 'center', margin: '1.75rem 0 0.75rem 0' }}>
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Ofertas de Almacén
                  </h3>
                </div>

                {/* ROW 2: Medium Cards (Helados, Kioscos, Farmacias) with illustrations on the left */}
                <div className="category-row-medium">
                  <div 
                    onClick={() => handleHubCategoryToggle('heladerias')}
                    className={`category-card medium ${activeHubCategory === 'heladerias' ? 'active' : ''}`}
                  >
                    <div className="category-card-illustration">🍧</div>
                    <div className="category-card-info">
                      <span className="category-card-name">HELADOS</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleHubCategoryToggle('kioscos')}
                    className={`category-card medium ${activeHubCategory === 'kioscos' ? 'active' : ''}`}
                  >
                    <div className="category-card-illustration">🍫</div>
                    <div className="category-card-info">
                      <span className="category-card-name">KIOSCOS</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleHubCategoryToggle('farmacias')}
                    className={`category-card medium ${activeHubCategory === 'farmacias' ? 'active' : ''}`}
                  >
                    <div className="category-card-illustration">💊</div>
                    <div className="category-card-info">
                      <span className="category-card-name">FARMACIAS</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. DYNAMIC SHOPS LOGO GRID (Expands below when a category is active) */}
            {activeHubCategory && (
              <section className="active-shops-section">
                <div className="active-shops-title">
                  <span>Locales de {activeHubCategory.replace(/^\w/, c => c.toUpperCase())}</span>
                  <button onClick={() => setActiveHubCategory(null)} className="close-shops-btn">
                    Cerrar
                  </button>
                </div>

                {getFilteredShops().length === 0 ? (
                  <div style={{textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                    No se encontraron locales que coincidan con la búsqueda.
                  </div>
                ) : (
                  <div className="shops-grid">
                    {getFilteredShops().map((shop, index) => (
                      <div 
                        key={index} 
                        onClick={() => handleShopClick(shop)}
                        className="shop-circle-card"
                        title={shop.name}
                      >
                        <div className="shop-logo-circle">
                          <ShopLogo type={shop.type} />
                        </div>
                        <span className="shop-name-label">{shop.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* 3. JOACO MARKET (BOTTOM SECTION - Catalog with database products) */}
            <section className="joaco-market-section">
              <div className="joaco-market-header">
                <h2 className="joaco-market-title">Joaco Market</h2>
                <div className="joaco-market-subtitle">Nuestros Productos</div>
              </div>

              {/* JOACO MARKET CATEGORIES TAB BAR */}
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

              {/* RESULTS BAR */}
              <div className="section-header">
                <h3 className="section-title" style={{fontSize: '1.1rem'}}>
                  {selectedCategory === 'Todas' ? 'Todos los productos' : selectedCategory}
                </h3>
                <span className="results-count">
                  Mostrando {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* PRODUCTS LISTING */}
              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{color: 'var(--text-light)'}}>
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                  <h3 className="empty-state-title">No encontramos productos en Joaco Market</h3>
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
                          <h4 className="product-title" title={prod.name}>
                            {prod.name}
                          </h4>
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
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
            </section>
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
                  <path d="M2.28 2.28l19.44 19.44M6 6H4.24l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L21.35 15M16 11.5L20 8M12.5 13H18"></path>
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
                      <h4 className="cart-item-title">{getCartItemDisplayName(prod)}</h4>
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
            <button onClick={() => { setActiveShopDetail(null); handleAdminClick(); }} className="footer-link">
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
                style={{backgroundColor: 'var(--light-bg)', borderColor: 'var(--light-border)', color: 'var(--text-main)'}}
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
