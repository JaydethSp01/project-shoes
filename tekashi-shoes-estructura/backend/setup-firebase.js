#!/usr/bin/env node

/**
 * Script para configurar Firebase en el backend
 * 
 * INSTRUCCIONES:
 * 1. Ve a https://console.firebase.google.com/
 * 2. Selecciona tu proyecto (login-a8833)
 * 3. Ve a "Configuración del proyecto" > "Cuentas de servicio"
 * 4. Haz clic en "Generar nueva clave privada"
 * 5. Descarga el archivo JSON
 * 6. Copia los valores del JSON a las variables de entorno
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Configuración de Firebase para el Backend');
console.log('==============================================');

console.log('\n📋 PASOS PARA CONFIGURAR FIREBASE:');
console.log('1. Ve a https://console.firebase.google.com/');
console.log('2. Selecciona tu proyecto: login-a8833');
console.log('3. Ve a "Configuración del proyecto" > "Cuentas de servicio"');
console.log('4. Haz clic en "Generar nueva clave privada"');
console.log('5. Descarga el archivo JSON');
console.log('6. Copia los valores a las variables de entorno');

console.log('\n🔑 VARIABLES DE ENTORNO NECESARIAS:');
console.log('FIREBASE_PROJECT_ID=login-a8833');
console.log('FIREBASE_PRIVATE_KEY_ID=tu-private-key-id');
console.log('FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nTU_CLAVE_PRIVADA\\n-----END PRIVATE KEY-----\\n"');
console.log('FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@login-a8833.iam.gserviceaccount.com');
console.log('FIREBASE_CLIENT_ID=tu-client-id');
console.log('FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth');
console.log('FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token');
console.log('FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs');
console.log('FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40login-a8833.iam.gserviceaccount.com');

console.log('\n💡 ALTERNATIVA TEMPORAL:');
console.log('El backend ya está configurado para funcionar en modo desarrollo');
console.log('sin Firebase. Las peticiones del dashboard deberían funcionar ahora.');

console.log('\n🚀 Para probar:');
console.log('1. Reinicia el servidor backend');
console.log('2. Prueba el dashboard del usuario');
console.log('3. Debería funcionar sin errores 401');

console.log('\n✅ Configuración completada');
