const express = require('express');

const controlador = require('./controladores/mainControler.js');


const router = express.Router();
const path = require('path');
const multer = require('multer');

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // Usa una ruta absoluta para la carpeta de destino
      const destinationPath = path.join(__dirname, 'publicos', 'img', 'fotos');
      cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
      // Genera un nombre único para el archivo
      cb(null, Date.now() + path.extname(file.originalname));
    }
  })
});


// Rutas de escuela
router.get('/', controlador.index);


router.get('/plan', controlador.plan);
router.get('/album', controlador.album);

router.get('/textos', controlador.textos);
router.get('/notificaciones', controlador.notificaciones);


router.post('/subir-foto', upload.single('photo'), controlador.uploadFoto);
router.post('/guardar-texto', controlador.saveText);


router.post('/save-subscription', controlador.savePushSubscription);
router.post('/send-notification', controlador.sendPushToAll);
router.post('/check-subscription', controlador.checkSubscription);

// Ruta para consultar la hora del servidor
router.get('/hora', (req, res) => {
  const fechaActual = new Date();
  res.json({
    fecha: fechaActual.toLocaleDateString('es-MX'),
    hora: fechaActual.toLocaleTimeString('es-MX'),
    fechaISO: fechaActual.toISOString(),
    timestamp: fechaActual.getTime()
  });
});






module.exports = router;
