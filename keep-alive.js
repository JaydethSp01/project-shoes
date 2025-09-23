const https = require('https');

const BACKEND_URL = 'https://project-shoes.onrender.com';
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutos

function pingBackend() {
  console.log(`🔄 Ping a ${BACKEND_URL} - ${new Date().toISOString()}`);
  
  https.get(`${BACKEND_URL}/api/health`, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`✅ Backend activo: ${response.status} - ${response.timestamp}`);
      } catch (error) {
        console.log(`⚠️ Respuesta no válida: ${data}`);
      }
    });
  }).on('error', (error) => {
    console.error(`❌ Error ping: ${error.message}`);
  });
}

// Ping inicial
pingBackend();

// Ping cada 5 minutos
setInterval(pingBackend, PING_INTERVAL);

console.log(`🚀 Keep-alive iniciado. Ping cada ${PING_INTERVAL / 1000 / 60} minutos`);




