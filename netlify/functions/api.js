const { createClient } = require("@libsql/client");

// Fallback in-memory database to keep the app working locally without Turso keys
let memoryCategories = ['Almacén', 'Bebidas', 'Aderezos', 'Bazar'];
let memoryProducts = [
  {
    id: 'cunnington-cola',
    name: 'Gaseosa Cunnington Cola 2.25L',
    price: 1200,
    category: 'Bebidas',
    image: '/cunnington.jpg'
  },
  {
    id: 'ketchup-natura',
    name: 'Ketchup Natura Pouch 250g',
    price: 950,
    category: 'Aderezos',
    image: '/ketchup.jpg'
  },
  {
    id: 'don-satur',
    name: 'Bizcocho Dulce Don Satur 200g',
    price: 800,
    category: 'Almacén',
    image: '/don_satur.jpg'
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
    dbClient = createClient({
      url: process.env.TURSO_DATABASE_URL,
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

  // Seed default products
  const prodCount = await client.execute("SELECT COUNT(*) as count FROM products");
  if (prodCount.rows[0].count === 0) {
    for (const prod of memoryProducts) {
      await client.execute({
        sql: "INSERT INTO products (id, name, price, category, image) VALUES (?, ?, ?, ?, ?)",
        args: [prod.id, prod.name, prod.price, prod.category, prod.image]
      });
    }
  }
};

// Single entry point handler for Netlify Functions (v1 API syntax)
exports.handler = async (event, context) => {
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

  // If Turso is configured, make sure tables are initialized
  if (dbClient) {
    try {
      await initializeDatabase(dbClient);
    } catch (dbInitErr) {
      console.error("Database initialization failed, switching to memory mode:", dbInitErr);
      dbClient = null; // Fallback to memory cache
    }
  }

  try {
    /* ==========================================
       1. ROUTE: GET /data (Stores dashboard data)
       ========================================== */
    if (path === "/data" && method === "GET") {
      if (dbClient) {
        const prodResult = await dbClient.execute("SELECT * FROM products");
        const catResult = await dbClient.execute("SELECT * FROM categories");
        
        const products = prodResult.rows.map(row => ({
          id: row.id,
          name: row.name,
          price: row.price,
          category: row.category,
          image: row.image
        }));
        
        const categories = catResult.rows.map(row => row.name);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ products, categories, database: "Turso Cloud" })
        };
      } else {
        // Return memory values
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            products: memoryProducts,
            categories: memoryCategories,
            database: "In-Memory Local (Configure Turso in .env)"
          })
        };
      }
    }

    /* ==========================================
       2. ROUTE: POST /products (Add new product)
       ========================================== */
    if (path === "/products" && method === "POST") {
      const { id, name, price, category, image } = JSON.parse(event.body);
      
      if (!name || isNaN(price) || price <= 0) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Datos de producto inválidos" }) };
      }

      if (dbClient) {
        await dbClient.execute({
          sql: "INSERT OR REPLACE INTO products (id, name, price, category, image) VALUES (?, ?, ?, ?, ?)",
          args: [id, name, price, category, image]
        });
      } else {
        memoryProducts = [{ id, name, price, category, image }, ...memoryProducts];
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, message: "Producto guardado con éxito" })
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
