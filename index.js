const express = require('express');
const path = require('path');
const userRoutes = require('./rutas');
const webPush = require('web-push');
const fs = require('fs');
const schedule = require('node-schedule');

const app = express();
const port = process.env.PORT || 3000;

// Configuración VAPID para notificaciones push
const vapidKeys = {
  publicKey: 'BC-d2euHb147bF7av1kpDwH84fswmN0_8zjODcQptU63P5q-FNVWa9Tuc_2GBofCc1SgDdbS8c_aHdDXiWfCYyo',
  privateKey: 'SbrIGm6fNYR3jW_-khzghnkOc-pGEWPZvzdchPIgp_U'
};
webPush.setVapidDetails('mailto:tu-email@example.com', vapidKeys.publicKey, vapidKeys.privateKey);

// Inicializar archivos si no existen
const suscripcionesPath = path.join(__dirname, 'publicos', 'suscripciones.json');
if (!fs.existsSync(suscripcionesPath)) fs.writeFileSync(suscripcionesPath, '[]');

// Configuración Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vistas'));
app.use(express.static(path.join(__dirname, 'publicos')));

// Rutas para PWA
app.get('/service-worker.js', (req, res) => res.sendFile(path.join(__dirname, 'publicos', 'service-worker.js')));
app.get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, 'publicos', 'manifest.json')));

// Rutas de la aplicación
app.use('/', userRoutes);

// Programar notificaciones
const notificacionesPath = path.join(__dirname, 'publicos', 'notificaciones_programadas.json');
if (fs.existsSync(notificacionesPath)) {
  const notificaciones = JSON.parse(fs.readFileSync(notificacionesPath, 'utf-8'));
  notificaciones.forEach(({ id, title, body, scheduledDateTime, image }) => {
    const fechaNotificacion = new Date(scheduledDateTime);
    if (fechaNotificacion > new Date()) {
      schedule.scheduleJob(fechaNotificacion, async () => {
        const subscriptions = JSON.parse(await fs.promises.readFile(suscripcionesPath, 'utf-8'));
        if (subscriptions.length) {
          const payload = JSON.stringify({
            title, body, icon: image || '/img/icon-192x192.png', badge: image || '/img/icon-192x192.png',
            vibrate: [100, 50, 100], data: { dateOfArrival: Date.now(), primaryKey: id || 1 }
          });
          subscriptions.forEach(subscription => {
            webPush.sendNotification(subscription, payload).catch(console.error);
          });
        }
      });
    }
  });
}

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});
