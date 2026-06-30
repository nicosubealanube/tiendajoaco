import { createClient } from "@libsql/client/web";

// Fallback in-memory database to keep the app working locally without Turso keys
let memoryCategories = ['Almacén', 'Bebidas', 'Aderezos', 'Bazar'];
let memoryProducts = [
  // Main Store Products
  {
    id: 'cunnington-cola',
    name: 'Gaseosa Cunnington Cola 2.25L',
    price: 1200,
    category: 'Bebidas',
    image: '/cunnington.jpg',
    shop_id: 'main'
  },
  {
    id: 'ketchup-natura',
    name: 'Ketchup Natura Pouch 250g',
    price: 950,
    category: 'Aderezos',
    image: '/ketchup.jpg',
    shop_id: 'main'
  },
  {
    id: 'don-satur',
    name: 'Bizcocho Dulce Don Satur 200g',
    price: 800,
    category: 'Almacén',
    image: '/don_satur.jpg',
    shop_id: 'main'
  },

  // Tinicome (Restaurante)
  {
    id: 'tini-1',
    name: 'Hamburguesa con Queso',
    price: 4500,
    category: 'Hamburguesas',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    shop_id: 'tinicome'
  },
  {
    id: 'tini-2',
    name: 'Hamburguesa Completa',
    price: 5800,
    category: 'Hamburguesas',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    shop_id: 'tinicome'
  },
  {
    id: 'tini-3',
    name: 'Milanesa con Papas Fritas',
    price: 6200,
    category: 'Minutas',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=400&q=80',
    shop_id: 'tinicome'
  },
  {
    id: 'tini-4',
    name: 'Fideos con Salsa Fileto',
    price: 3800,
    category: 'Pastas',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
    shop_id: 'tinicome'
  },

  // Restaurante El Lostan
  {
    id: 'lost-1',
    name: 'Pizza Especial Lostan',
    price: 6500,
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    shop_id: 'lostan'
  },
  {
    id: 'lost-2',
    name: 'Empanadas de Carne (3u)',
    price: 2400,
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=400&q=80',
    shop_id: 'lostan'
  },
  {
    id: 'lost-3',
    name: 'Suprema de Pollo con Puré',
    price: 5500,
    category: 'Minutas',
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca218?auto=format&fit=crop&w=400&q=80',
    shop_id: 'lostan'
  },
  {
    id: 'lost-4',
    name: 'Ravioles de Verdura con Tuco',
    price: 4800,
    category: 'Pastas',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=400&q=80',
    shop_id: 'lostan'
  },

  // Heladería Rompesol
  {
    id: 'romp-1',
    name: 'Kilo de Helado',
    price: 8500,
    category: 'Vasos',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=400&q=80',
    shop_id: 'rompesol'
  },
  {
    id: 'romp-2',
    name: '¼ Kilo de Helado',
    price: 2500,
    category: 'Vasos',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=400&q=80',
    shop_id: 'rompesol'
  },
  {
    id: 'romp-3',
    name: 'Cucurucho Especial',
    price: 1800,
    category: 'Conos',
    image: 'https://images.unsplash.com/photo-1579306193798-1e4c8c54c30c?auto=format&fit=crop&w=400&q=80',
    shop_id: 'rompesol'
  },
  {
    id: 'romp-4',
    name: 'Paleta Bombón de Chocolate',
    price: 1200,
    category: 'Paletas',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80',
    shop_id: 'rompesol'
  }
];

// Helper to check if credentials are configured
const isTursoConfigured = () => {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  return url && token && !url.includes("tu-base-de-datos") && !token.includes("tu-token");
};

// Initialize connection
let dbClient = null;
if (isTursoConfigured()) {
  try {
    let databaseUrl = process.env.TURSO_DATABASE_URL || "";
    if (databaseUrl.startsWith("libsql://")) {
      databaseUrl = databaseUrl.replace("libsql://", "https://");
    }
    dbClient = createClient({
      url: databaseUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  } catch (error) {
    console.error("Failed to initialize Turso client:", error);
  }
}

// Database initializer (creates tables and seeds default items if empty)
const initializeDatabase = async (client) => {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      name TEXT PRIMARY KEY
    )
  `);
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL
    )
  `);

  // Migrate schema to include shop_id column if it doesn't exist yet
  try {
    await client.execute("ALTER TABLE products ADD COLUMN shop_id TEXT DEFAULT 'main'");
  } catch (err) {
    // Ignore error if column already exists
  }

  // Seed default categories
  const catCount = await client.execute("SELECT COUNT(*) as count FROM categories");
  if (catCount.rows[0].count === 0) {
    for (const cat of memoryCategories) {
      await client.execute({
        sql: "INSERT INTO categories (name) VALUES (?)",
        args: [cat]
      });
    }
  }

  // Seed default main products
  const mainProdCount = await client.execute("SELECT COUNT(*) as count FROM products WHERE shop_id = 'main'");
  if (mainProdCount.rows[0].count === 0) {
    const mainDefault = memoryProducts.filter(p => p.shop_id === 'main');
    for (const prod of mainDefault) {
      await client.execute({
        sql: "INSERT INTO products (id, name, price, category, image, shop_id) VALUES (?, ?, ?, ?, ?, 'main')",
        args: [prod.id, prod.name, prod.price, prod.category, prod.image]
      });
    }
  }

  // Seed default restaurant & ice cream shop products
  for (const shop of ['tinicome', 'lostan', 'rompesol']) {
    const shopProdCount = await client.execute({
      sql: "SELECT COUNT(*) as count FROM products WHERE shop_id = ?",
      args: [shop]
    });
    if (shopProdCount.rows[0].count === 0) {
      const shopDefaultProducts = memoryProducts.filter(p => p.shop_id === shop);
      for (const prod of shopDefaultProducts) {
        await client.execute({
          sql: "INSERT INTO products (id, name, price, category, image, shop_id) VALUES (?, ?, ?, ?, ?, ?)",
          args: [prod.id, prod.name, prod.price, prod.category, prod.image, prod.shop_id]
        });
      }
    }
  }
};

// Promise timeout helper to protect from Netlify Lambda timeouts (502 / 504)
const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout de base de datos")), ms))
  ]);
};

// Single initialization cache flag to prevent running setup schema queries on every request
let isInitialized = false;

// Single entry point handler for Netlify Functions (v1 API syntax)
export const handler = async (event, context) => {
  const path = event.path.replace(/\/\.netlify\/functions\/api/, "").replace(/\/api/, "");
  const method = event.httpMethod;
  const authHeader = event.headers.authorization;
  
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Content-Type": "application/json"
  };

  // Handle preflight OPTIONS requests
  if (method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Check admin password for mutating operations
  const isAdminRequest = method === "POST" || method === "DELETE";
  if (isAdminRequest && authHeader !== "joaco2026") {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: "No autorizado. Contraseña incorrecta." })
    };
  }

  // If Turso is configured, make sure tables are initialized (only once per container, with 3s timeout)
  if (dbClient && !isInitialized) {
    try {
      await withTimeout(initializeDatabase(dbClient), 3000);
      isInitialized = true;
    } catch (dbInitErr) {
      console.error("Database initialization failed, switching to memory mode:", dbInitErr);
      dbClient = null; // Fallback to memory cache
    }
  }

  try {
    /* ==========================================
       0. ROUTE: GET /test (Diagnostic endpoint)
       ========================================== */
    if (path === "/test" && method === "GET") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, message: "Serverless function is working!" })
      };
    }

    /* ==========================================
       00. ROUTE: GET /debug (Diagnostic endpoint)
       ========================================== */
    if (path === "/debug" && method === "GET") {
      const debugInfo = {
        hasDbClient: !!dbClient,
        isInitialized,
        tursoUrl: process.env.TURSO_DATABASE_URL ? (process.env.TURSO_DATABASE_URL.length > 20 ? process.env.TURSO_DATABASE_URL.substring(0, 20) + "..." : process.env.TURSO_DATABASE_URL) : "undefined",
        hasToken: !!process.env.TURSO_AUTH_TOKEN,
        nodeVersion: process.version,
      };

      if (dbClient) {
        try {
          const start = Date.now();
          // Test select 1
          const testRes = await dbClient.execute("SELECT 1");
          debugInfo.queryResult = testRes.rows;
          
          // Test products size
          const prodSizeRes = await dbClient.execute("SELECT id, name, category, length(image) as img_len, shop_id FROM products");
          debugInfo.productsList = prodSizeRes.rows;
          
          // Test total database size estimation
          const totalImgLen = prodSizeRes.rows.reduce((sum, row) => sum + (row.img_len || 0), 0);
          debugInfo.totalImageBytes = totalImgLen;
          debugInfo.totalProductsCount = prodSizeRes.rows.length;
          
          debugInfo.queryTimeMs = Date.now() - start;
          debugInfo.success = true;
        } catch (err) {
          debugInfo.success = false;
          debugInfo.error = err.message;
          debugInfo.errorStack = err.stack;
        }
      } else {
        debugInfo.error = "dbClient is null";
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(debugInfo)
      };
    }

    /* ==========================================
       1. ROUTE: GET /data (Stores dashboard data)
       ========================================== */
    if (path === "/data" && method === "GET") {
      if (dbClient) {
        try {
          // Set a 3.5s timeout for fetching data
          const prodResult = await withTimeout(dbClient.execute("SELECT * FROM products"), 3500);
          const catResult = await withTimeout(dbClient.execute("SELECT * FROM categories"), 3500);
          
          const products = prodResult.rows.map(row => {
            let img = row.image;
            // If the base64 image is too large (greater than 120KB), replace it with a placeholder
            // to avoid exceeding Netlify's 6MB payload response limit.
            if (img && img.length > 120000) {
              if (row.shop_id === 'tinicome') {
                img = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80';
              } else if (row.shop_id === 'lostan') {
                img = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80';
              } else if (row.shop_id === 'rompesol') {
                img = 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=400&q=80';
              } else {
                img = '/logo.jpg';
              }
            }
            return {
              id: row.id,
              name: row.name,
              price: row.price,
              category: row.category,
              image: img,
              shop_id: row.shop_id || 'main'
            };
          });
          
          const categories = catResult.rows.map(row => row.name);
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ products, categories, database: "Turso Cloud" })
          };
        } catch (queryErr) {
          console.error("Database queries failed or timed out, using fallback:", queryErr);
          // Return default memory products to avoid crashing page
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              products: memoryProducts,
              categories: memoryCategories,
              database: `Turso Fallback (Alerta: conexión lenta con la nube)`
            })
          };
        }
      } else {
        // Return memory values
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            products: memoryProducts,
            categories: memoryCategories,
            database: "In-Memory Local (Configure Turso en Netlify)"
          })
        };
      }
    }

    /* ==========================================
       2. ROUTE: POST /products (Add new product)
       ========================================== */
    if (path === "/products" && method === "POST") {
      const { id, name, price, category, image, shop_id } = JSON.parse(event.body);
      const activeShop = shop_id || 'main';
      
      if (!name || isNaN(price) || price <= 0) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Datos de producto inválidos" }) };
      }

      if (dbClient) {
        await dbClient.execute({
          sql: "INSERT OR REPLACE INTO products (id, name, price, category, image, shop_id) VALUES (?, ?, ?, ?, ?, ?)",
          args: [id, name, price, category, image, activeShop]
        });
      } else {
        // Check if editing existing product in memory
        const existingIdx = memoryProducts.findIndex(p => p.id === id);
        const productData = { id, name, price, category, image, shop_id: activeShop };
        
        if (existingIdx !== -1) {
          memoryProducts[existingIdx] = productData;
        } else {
          memoryProducts = [productData, ...memoryProducts];
        }
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, message: "Producto guardado con éxito" })
      };
    }
    /* ==========================================
       2b. ROUTE: GET /product (Get single product details, including full-size image)
       ========================================== */
    if (path === "/product" && method === "GET") {
      const id = event.queryStringParameters.id;
      if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Falta ID de producto" }) };
      }

      if (dbClient) {
        const result = await dbClient.execute({
          sql: "SELECT * FROM products WHERE id = ?",
          args: [id]
        });

        if (result.rows.length === 0) {
          return { statusCode: 404, headers, body: JSON.stringify({ error: "Producto no encontrado" }) };
        }

        const row = result.rows[0];
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            id: row.id,
            name: row.name,
            price: row.price,
            category: row.category,
            image: row.image,
            shop_id: row.shop_id || 'main'
          })
        };
      } else {
        const prod = memoryProducts.find(p => p.id === id);
        if (!prod) {
          return { statusCode: 404, headers, body: JSON.stringify({ error: "Producto no encontrado" }) };
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(prod)
        };
      }
    }

    /* ==========================================
       2c. ROUTE: POST /products/update-image (Optimize image directly in DB)
       ========================================== */
    if (path === "/products/update-image" && method === "POST") {
      const { id, image } = JSON.parse(event.body);
      if (!id || !image) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Datos de optimización inválidos" }) };
      }

      if (dbClient) {
        await dbClient.execute({
          sql: "UPDATE products SET image = ? WHERE id = ?",
          args: [image, id]
        });
      } else {
        const prodIdx = memoryProducts.findIndex(p => p.id === id);
        if (prodIdx !== -1) {
          memoryProducts[prodIdx].image = image;
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: "Imagen de producto optimizada con éxito" })
      };
    }

    /* ==========================================
       3. ROUTE: DELETE /products (Delete product)
       ========================================== */
    if (path === "/products" && method === "DELETE") {
      const id = event.queryStringParameters.id;
      if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Falta ID del producto" }) };
      }

      if (dbClient) {
        await dbClient.execute({
          sql: "DELETE FROM products WHERE id = ?",
          args: [id]
        });
      } else {
        memoryProducts = memoryProducts.filter(p => p.id !== id);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: "Producto eliminado con éxito" })
      };
    }

    /* ==========================================
       4. ROUTE: POST /categories (Add category)
       ========================================== */
    if (path === "/categories" && method === "POST") {
      const { name } = JSON.parse(event.body);
      const cleanName = name ? name.trim() : "";
      
      if (!cleanName) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Nombre de categoría inválido" }) };
      }

      if (dbClient) {
        await dbClient.execute({
          sql: "INSERT OR REPLACE INTO categories (name) VALUES (?)",
          args: [cleanName]
        });
      } else {
        if (!memoryCategories.includes(cleanName)) {
          memoryCategories = [...memoryCategories, cleanName];
        }
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, message: "Categoría agregada con éxito" })
      };
    }

    /* ==========================================
       5. ROUTE: DELETE /categories (Delete category)
       ========================================== */
    if (path === "/categories" && method === "DELETE") {
      const name = event.queryStringParameters.name;
      if (!name) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Falta nombre de categoría" }) };
      }

      if (dbClient) {
        // Delete category
        await dbClient.execute({
          sql: "DELETE FROM categories WHERE name = ?",
          args: [name]
        });
        // Re-assign products
        await dbClient.execute({
          sql: "UPDATE products SET category = 'Sin Categoría' WHERE category = ?",
          args: [name]
        });
      } else {
        memoryCategories = memoryCategories.filter(c => c !== name);
        memoryProducts = memoryProducts.map(p => 
          p.category === name ? { ...p, category: 'Sin Categoría' } : p
        );
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: "Categoría eliminada con éxito" })
      };
    }

    // Default 404 Route
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Endpoint no encontrado" })
    };

  } catch (error) {
    console.error("API error handler:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Error interno del servidor", details: error.message })
    };
  }
};
