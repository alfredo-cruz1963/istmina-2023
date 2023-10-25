const sharp = require('sharp');
const QrCode = require("qrcode-reader");
//const jsQR = require('jsqr');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const outputDir = '../../public/salidas'
const region = {
  left: 1,   // Posición izquierda
  top: 1,    // Posición superior
  width: 200,  // Ancho
  height: 200  // Altura
};

// Cargar la imagen desde el archivo
function leerQR(imagePath) {
  return new Promise((resolve, reject) => {
    Jimp.read(imagePath)
      .then((image) => {
        // Crear un objeto de QrCode
        const qr = new QrCode();
        // Decodificar el código QR de la imagen
        qr.callback = (err, value) => {
          if (err) {
            // Manejar el error
            console.error(err);
            reject(err); // Rechazar la promesa en caso de error
          } else {
            // Mostrar el resultado
            resolve(value.result); // Resolver la promesa con el valor del código QR
          }
        };
        qr.decode(image.bitmap);
      })
      .catch((err) => {
        // Manejar el error
        console.error(err);
        reject(err); // Rechazar la promesa en caso de error
      });
  });
}

// Función para extraer la región de interés y leer el código QR
async function extraerImagen(imagePath) {
  const outputPath = path.join(__dirname, outputDir, 'codigoQR.jpg');
  try {
    // Extraer la región de interés de la imagen
    await sharp(imagePath)
      .extract(region)
      .toFile(outputPath);

    // Leer el código QR en la región de interés
    const qrCode = await leerQR(outputPath); // Esperar a que la función leerQR resuelva la promesa
    //console.log(qrCode);
    return qrCode;
  } catch (error) {
    console.error('Error al procesar y guardar la imagen:', error);
    throw error; // Lanza el error para que pueda ser manejado en otro lugar si es necesario
  }
}

module.exports = { extraerImagen }

