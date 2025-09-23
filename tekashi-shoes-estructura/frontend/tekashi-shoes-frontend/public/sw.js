// Service Worker para Tekashi Shoes PWA
const CACHE_NAME = "tekashi-shoes-v1.0.0";
const API_CACHE_NAME = "tekashi-shoes-api-v1.0.0";

// Archivos estáticos para cache
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/logo.png",
  "/manifest.json",
  // CSS files
  "/src/styles/MobileOptimized.css",
  "/src/styles/Futuristic2025.css",
  "/src/styles/Chatbot.css",
  // JS files
  "/src/main.tsx",
  "/src/App.tsx",
];

// URLs de API para cache
const API_URLS = [
  "https://backend-ecommerce-6vi3.onrender.com/api/producto",
  "https://backend-ecommerce-6vi3.onrender.com/api/tipo_producto",
  "https://backend-ecommerce-6vi3.onrender.com/api/usuarios",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker: Instalando...");

  event.waitUntil(
    Promise.all([
      // Cache de assets estáticos
      caches.open(CACHE_NAME).then((cache) => {
        console.log("📦 Cacheando assets estáticos...");
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache de API
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log("🌐 Cacheando endpoints de API...");
        return cache.addAll(API_URLS);
      }),
    ]).then(() => {
      console.log("✅ Service Worker: Instalación completada");
      return self.skipWaiting();
    })
  );
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker: Activando...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
              console.log("🗑️ Eliminando cache antiguo:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("✅ Service Worker: Activación completada");
        return self.clients.claim();
      })
  );
});

// Interceptación de requests
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estrategia para assets estáticos
  if (
    request.destination === "document" ||
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image"
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log("📦 Sirviendo desde cache:", request.url);
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Solo cachear respuestas exitosas
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Fallback para páginas HTML
            if (request.destination === "document") {
              return caches.match("/index.html");
            }
          });
      })
    );
  }

  // Estrategia para API calls
  else if (url.hostname === "backend-ecommerce-6vi3.onrender.com") {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log("🌐 API desde cache:", request.url);
            // Actualizar en background
            fetch(request).then((response) => {
              if (response.status === 200) {
                cache.put(request, response.clone());
              }
            });
            return cachedResponse;
          }

          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => {
              // Fallback para errores de red
              return new Response(
                JSON.stringify({
                  error: "Sin conexión",
                  message: "No se pudo conectar al servidor",
                }),
                {
                  status: 503,
                  headers: { "Content-Type": "application/json" },
                }
              );
            });
        });
      })
    );
  }

  // Estrategia para otros recursos
  else {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
  }
});

// Manejo de mensajes del cliente
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Sincronización en background
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("🔄 Sincronización en background...");
    event.waitUntil(doBackgroundSync());
  }
});

// Notificaciones push
self.addEventListener("push", (event) => {
  console.log("📱 Push notification recibida");

  const options = {
    body: event.data
      ? event.data.text()
      : "Nueva notificación de Tekashi Shoes",
    icon: "/logo.png",
    badge: "/logo.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Ver ofertas",
        icon: "/logo.png",
      },
      {
        action: "close",
        title: "Cerrar",
        icon: "/logo.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("Tekashi Shoes", options));
});

// Click en notificaciones
self.addEventListener("notificationclick", (event) => {
  console.log("🔔 Notificación clickeada");

  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/?action=offers"));
  } else if (event.action === "close") {
    // Solo cerrar la notificación
  } else {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Función de sincronización en background
async function doBackgroundSync() {
  try {
    // Sincronizar datos del carrito
    const cartData = await getCartData();
    if (cartData && cartData.length > 0) {
      await syncCartData(cartData);
    }

    // Sincronizar favoritos
    const favoritesData = await getFavoritesData();
    if (favoritesData && favoritesData.length > 0) {
      await syncFavoritesData(favoritesData);
    }

    console.log("✅ Sincronización completada");
  } catch (error) {
    console.error("❌ Error en sincronización:", error);
  }
}

// Funciones auxiliares para sincronización
async function getCartData() {
  // Obtener datos del carrito desde IndexedDB o localStorage
  return new Promise((resolve) => {
    if ("indexedDB" in self) {
      const request = indexedDB.open("tekashi-shoes", 1);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(["cart"], "readonly");
        const store = transaction.objectStore("cart");
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => {
          resolve(getAllRequest.result);
        };
        getAllRequest.onerror = () => resolve([]);
      };
      request.onerror = () => resolve([]);
    } else {
      resolve([]);
    }
  });
}

async function syncCartData(cartData) {
  // Sincronizar carrito con el servidor
  try {
    const response = await fetch(
      "https://backend-ecommerce-6vi3.onrender.com/api/cart/sync",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartData),
      }
    );

    if (response.ok) {
      console.log("✅ Carrito sincronizado");
    }
  } catch (error) {
    console.error("❌ Error sincronizando carrito:", error);
  }
}

async function getFavoritesData() {
  // Obtener favoritos desde IndexedDB o localStorage
  return new Promise((resolve) => {
    if ("indexedDB" in self) {
      const request = indexedDB.open("tekashi-shoes", 1);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(["favorites"], "readonly");
        const store = transaction.objectStore("favorites");
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => {
          resolve(getAllRequest.result);
        };
        getAllRequest.onerror = () => resolve([]);
      };
      request.onerror = () => resolve([]);
    } else {
      resolve([]);
    }
  });
}

async function syncFavoritesData(favoritesData) {
  // Sincronizar favoritos con el servidor
  try {
    const response = await fetch(
      "https://backend-ecommerce-6vi3.onrender.com/api/favoritos/sync",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(favoritesData),
      }
    );

    if (response.ok) {
      console.log("✅ Favoritos sincronizados");
    }
  } catch (error) {
    console.error("❌ Error sincronizando favoritos:", error);
  }
}

console.log("🎉 Service Worker cargado correctamente");
