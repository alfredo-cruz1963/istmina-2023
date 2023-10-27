const ctrlenvios = {};

const pool = require('../database');
const config = require('../config');
const excelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const Extraer = require('../public/js/recorteImg')

//const { createCanvas, loadImage } = require('canvas');
//const jsQR = require('jsqr');


const nameFileExcel = "Preconteo.xlsx";
var criticaFileExcel = "";

// ************* Lista las mesas transmitidas por los testigos por puesto votacion **************
ctrlenvios.list = async (req, res) => {
  const mCodPuesto = req.user.codpuesto;

  const cytes = await pool.query('SELECT codigo, mpio FROM dane WHERE codigo = ?', mCodPuesto.substring(0, 5));
  const puestos = await pool.query("SELECT codigo, nombpuesto, mesas FROM divipol WHERE codigo = ?", mCodPuesto);
  const codPuesto = puestos[0].codigo;
  const nombrePuesto = puestos[0].nombpuesto;
  const totMesas = puestos[0].mesas;
  const municipio = cytes[0].mpio;

  const codigoPuesto = JSON.stringify(codPuesto);
  const mtotMesas = JSON.stringify(totMesas);

  res.render('envios/controlpuesto.hbs', { codigoPuesto, nombrePuesto, mtotMesas, municipio });
}

// ************* Lista las mesas transmitidas por los testigos por puesto votacion **************
ctrlenvios.search = async (req, res) => {
  const mCodPuesto = req.params;
  const myCodPuesto = mCodPuesto.codigo;
  const mcodmpio = myCodPuesto.substring(0, 5);

  const cytes = await pool.query('SELECT codigo, mpio FROM dane WHERE codigo = ?', mcodmpio);
  const puestos = await pool.query("SELECT codigo, nombpuesto, mesas FROM divipol WHERE codigo = ?", myCodPuesto);
  mesaspuesto = await pool.query("SELECT * FROM vtotvotosmesas WHERE SUBSTR(codigo, 1, 9) = ?", [myCodPuesto]);

  const municipio = cytes[0].mpio;
  const nombrePuesto = puestos[0].nombpuesto;
  const totmesas = puestos[0].mesas;

  res.render('envios/consultapuesto.hbs', { mesaspuesto, nombrePuesto, totmesas, municipio });
}

// ************* Lista el numero de mesas transmitidas en cada puesto por municipio *************
ctrlenvios.consulta = async (req, res) => {
  //const roles = req.user.rol;
  //const mCodMpio = req.user.codmpio;
  const { codmpio } = req.params;

  const mesasmpio = await pool.query("SELECT * FROM vconsultmpal WHERE SUBSTR(codigo, 1, 5) = ?", codmpio);
  const cyte = await pool.query("SELECT codigo, mpio FROM dane WHERE codigo = ?", codmpio);
  const numPtos = await pool.query("SELECT * FROM vmesasmpio WHERE codmpio = ?", codmpio);


  const ptosMpio = numPtos[0].puestos;
  const municipio = cyte[0].mpio;

  res.render('envios/controlmunicipio.hbs', { municipio, mesasmpio, ptosMpio });
}

// ************* Lista el numero de mesas transmitidas en cada puesto por municipio *************
ctrlenvios.searchDpto = async (req, res) => {
  const roles = req.user.rol;

  //if (roles == 1) {
    const mesasDpto = await pool.query("SELECT * FROM vconsultdptal");
    res.render('envios/controldepartamento.hbs', { mesasDpto });
  //} else {
  //  const mesasDpto = await pool.query("SELECT * FROM vconsultdptal WHERE codmpio <> '52001");
  //  res.render('envios/controldepartamento.hbs', { mesasDpto });
  //}
}

// ************* Verifica Departamental *************
ctrlenvios.verifyDptal = async (req, res) => {
  res.render('utilidad/verificadptal.hbs');
}

// ************* Verifica Municipal *************
ctrlenvios.verifyMpal = async (req, res) => {
  const { codmpio } = req.params;

  //const mesasmpio = await pool.query("SELECT * FROM vconsultmpal WHERE SUBSTR(codigo, 1, 5) = ?", codmpio);
  const cyte = await pool.query("SELECT codigo, mpio FROM dane WHERE codigo = ?", codmpio);
  const numPtos = await pool.query("SELECT * FROM vmesasmpio WHERE codmpio = ?", codmpio);

  const ptosMpio = numPtos[0].puestos;
  const municipio = cyte[0].mpio;

  res.render('utilidad/verificampal.hbs', { municipio, ptosMpio, codigo: JSON.stringify(codmpio) });

}

ctrlenvios.verifyPuesto = async (req, res) => {
  const { codigo } = req.params;
  //const mCodPuesto = req.user.codpuesto;
  const mCodPuesto = codigo;

  const cytes = await pool.query('SELECT codigo, mpio FROM dane WHERE codigo = ?', mCodPuesto.substring(0, 5));
  const puestos = await pool.query("SELECT codigo, nombpuesto, mesas FROM divipol WHERE codigo = ?", mCodPuesto);
  const codPuesto = puestos[0].codigo;
  const nombrePuesto = puestos[0].nombpuesto;
  const totMesas = puestos[0].mesas;
  const municipio = cytes[0].mpio;

  const codigoPuesto = JSON.stringify(codPuesto);
  const mtotMesas = JSON.stringify(totMesas);

  res.render('utilidad/verificapuesto.hbs', { codigoPuesto, nombrePuesto, mtotMesas, municipio });
}

// ************* Enviar imagenes a la BD *************
ctrlenvios.whatsapp = async (req, res) => {

  //const mesasDpto = await pool.query("SELECT * FROM vconsultdptal");
  res.render('envios/whatsapp');
}

// ************* add  ***********************
ctrlenvios.add = async (req, res) => {
  //const mCodMpio = req.user.codmpio;
  //const mCodPuesto = req.user.codpuesto;
  const mCodMpio = "17019";

  const puestos = await pool.query("SELECT codigo, nombpuesto FROM divipol WHERE codmpio = ?", mCodMpio);
  const mesaspuesto = await pool.query("SELECT codigo, mesas FROM divipol WHERE codmpio = ?", mCodMpio);

  var aCodPuesto = [];
  var aNombPuesto = [];

  for (var i in puestos) {
    aCodPuesto.push(puestos[i].codigo);
    aNombPuesto.push(puestos[i].nombpuesto);
  }

  const jCodPuesto = JSON.stringify(aCodPuesto);
  const jNombPuesto = JSON.stringify(aNombPuesto);
  const jMesasPuesto = JSON.stringify(mesaspuesto);

  res.render('envios/add1.hbs', { puestos, acodpuesto: jCodPuesto, anompuesto: jNombPuesto, mPuestos: jMesasPuesto });
};

// ************* add Testigos ***********************
ctrlenvios.addtest = async (req, res) => {
  const mCodMpio = req.user.codmpio;
  const mCodPuesto = req.user.codpuesto;

  const cytes = await pool.query('SELECT codigo, mpio FROM dane WHERE codigo = ?', mCodMpio);
  const puestos = await pool.query("SELECT codigo, nombpuesto, mesas FROM divipol WHERE codigo = ?", mCodPuesto);

  const myNombCyte = cytes[0].mpio;
  const myCodPuesto = puestos[0].codigo;
  const myNombPuesto = puestos[0].nombpuesto;
  const myMesasPuesto = puestos[0].mesas;

  const codigoPuesto = JSON.stringify(myCodPuesto);
  const mtotMesas = JSON.stringify(myMesasPuesto);

  res.render('envios/addtest.hbs', { myNombCyte, codigoPuesto, myNombPuesto, mtotMesas });
};

// ********** View *************
ctrlenvios.view = async (req, res) => {
  const mCodPuesto = req.user.codpuesto;

  await pool.query(
    "SELECT * FROM vtotvotosmesas WHERE SUBSTR(codigo, 1, 9) = ?",
    [mCodPuesto],
    (error, filas) => {
      if (error) {
        throw error;
      } else {
        res.send(filas);
      }
    }
  );
};

// ********** View para verificar *************
ctrlenvios.verificar = async (req, res) => {
  const { mCodPuesto } = req.params;

  await pool.query(
    "SELECT * FROM vtotvotosmesas WHERE SUBSTR(codigo, 1, 9) = ?",
    [mCodPuesto],
    (error, filas) => {
      if (error) {
        throw error;
      } else {
        res.send(filas);
      }
    }
  );
};

// ********** Envia los datos a tabla departamental *************
ctrlenvios.tablampios = async (req, res) => {

  await pool.query("SELECT * FROM vconsultdptal",
    (error, filas) => {
      if (error) {
        throw error;
      } else {
        res.send(filas);
      }
    }
  );
};

// ********** Muestra los resultados de votos por municipio *************
ctrlenvios.resultmpios = async (req, res) => {
  const { codigo } = req.params;

  await pool.query(
    "SELECT * FROM vvotmpio WHERE mun = ?",
    [codigo],
    (error, filas) => {
      if (error) {
        throw error;
      } else {
        res.send(filas);
      }
    }
  );
};

// ********** Envia los datos a tabla municipal *************
ctrlenvios.tablapuestos = async (req, res) => {
  const { codigo } = req.params;

  await pool.query("SELECT * FROM vconsultmpal WHERE SUBSTR(codigo, 1, 5) = ?", 
  [codigo],
    (error, filas) => {
      if (error) {
        throw error;
      } else {
        res.send(filas);
      }
    }
  );
};

// ********** Muestra los resultados de votos por puesto *************
ctrlenvios.resultpuestos = async (req, res) => {
  const { codigo } = req.params;

  await pool.query(
    "SELECT * FROM vtotvotospuesto WHERE codigo = ?",
    [codigo],
    (error, filas) => {
      if (error) {
        throw error;
      } else {
        res.send(filas);
      }
    }
  );
};

// *********** grabar datos mesa *************************
ctrlenvios.grabar = async (req, res) => {
  const { myllave } = req.params;
  const { registros } = req.body;

  const values = registros.map(reg => [reg.codigo, reg.dep, reg.mun, reg.zona, reg.puesto, reg.mesa, reg.can, reg.votos, reg.sufragos, reg.recuento, reg.reclama]);

  try {
    const datos = await pool.query('SELECT * FROM preconteo WHERE codigo = ?', [myllave]);

    if (datos.length > 0) {
      res.send("Fallo");
    } else {
      try {
        await pool.query(
          `INSERT INTO preconteo (codigo, dep, mun, zona, puesto, mesa, can, votos, sufragos, recuento, reclama) VALUES ?`, [values]
        );
        res.send("Éxito");
      } catch (error) {
        throw error;
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
};

// ************** Exportar Mesas *********************
ctrlenvios.preconteo = async (req, res) => {

  const firmas = await pool.query('SELECT * FROM vpreconteo');

  const workbook = new excelJS.Workbook();
  const sheet = workbook.addWorksheet('Preconteo');
  const reColumns = [
    { header: 'DEP', key: 'dep', width: 10 },
    { header: 'MUN', key: 'mun', width: 10 },
    { header: 'ZONA', key: 'zona', width: 10 },
    { header: 'COMI', key: 'comision', width: 10 },
    { header: 'PUESTO', key: 'puesto', width: 10 },
    { header: 'MESA', key: 'mesa', width: 10 },
    { header: 'CAN', key: 'can', width: 10 },
    { header: 'VOTOS', key: 'votos', width: 10 }
  ]

  sheet.columns = reColumns;
  firmas.forEach(row => {
    sheet.addRow(row);
  });

  workbook.xlsx.writeFile(nameFileExcel).then((e) => {
    console.log('Los Datos se Guardaron Correctamente');
    res.redirect('/envios/descargar');
  })
    .catch(() => {
      console.log('Ocurrio un problema');
    })
};

// ************** Descargar Excel Firmas *********************
ctrlenvios.descargar = (req, res) => {
  res.download(nameFileExcel);
};

// ************** Descargar Excel Firmas *********************
ctrlenvios.donwload = (req, res) => {
  res.download(criticaFileExcel);
};

// ************** Delete *********************
ctrlenvios.delete = async (req, res) => {
  const { codigo } = req.params;

  try {
    const result = await pool.query("DELETE FROM preconteo WHERE codigo = ?", [codigo]);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
};

// ********** update Mesa *************
ctrlenvios.update = async (req, res) => {
  const { myllave } = req.params;
  const { registros } = req.body;

  try {
    // Eliminar registros anteriores
    await pool.query("DELETE FROM preconteo WHERE codigo = ?", [myllave]);

    const values = registros.map(reg => [reg.dep, reg.mun, reg.zona, reg.puesto, reg.mesa, reg.sufragos, reg.can, reg.votos, reg.recuento, reg.reclama, reg.codigo]);

    // Insertar registros actualizados
    await pool.query(
      `INSERT INTO preconteo (dep, mun, zona, puesto, mesa, sufragos, can, votos, recuento, reclama, codigo) VALUES ?`, [values]
    );

    res.send("Éxito");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
};

// ************** Exportar Datos *********************
ctrlenvios.critica = async (req, res) => {
  const { opc } = req.params;

  if (opc === '1') {
    criticaFileExcel = "MesasDivipol.xlsx";
    var preconteogral = await pool.query("SELECT * FROM vcritica");
  } else {
    criticaFileExcel = "MesasComisiones.xlsx";
    const query = "SELECT * FROM vcritica ORDER BY substr(codigo,1,5), comision, right(codigo,5)";
    var preconteogral = await pool.query(query);
  }

  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  // Agregar encabezados de columna
  worksheet.columns = [
    { header: 'DEP', key: 'col1', width: 5 },
    { header: 'MUN', key: 'col2', width: 6 },
    { header: 'MUNICIPIO', key: 'col3', width: 20 },
    { header: 'ZONA', key: 'col4', width: 7 },
    { header: 'COMI', key: 'col33', width: 7 },
    { header: 'PUESTO', key: 'col5', width: 7 },
    { header: 'NOMBRE PUESTO', key: 'col6', width: 40 },
    { header: 'MESA', key: 'col7', width: 7 },
    { header: 'CAN 1', key: 'col8', width: 7 },
    { header: 'CAN 2', key: 'col9', width: 7 },
    { header: 'CAN 3', key: 'col10', width: 7 },
    { header: 'CAN 4', key: 'col11', width: 7 },
    { header: 'CAN 5', key: 'col12', width: 7 },
    { header: 'CAN 6', key: 'col13', width: 7 },
    { header: 'CAN 7', key: 'col14', width: 7 },

    { header: 'BLANCOS', key: 'col15', width: 10 },
    { header: 'NULOS', key: 'col16', width: 8 },
    { header: 'NOMARCADOS', key: 'col17', width: 12 },
    { header: 'VOTOS MESA', key: 'col18', width: 12 },
    { header: 'TOTAL E-11', key: 'col19', width: 12 },
    { header: 'RECUENTO', key: 'col20', width: 10 },
    { header: 'RECLAMA', key: 'col21', width: 10 },
    { header: 'PROMEDIO', key: 'col22', width: 12 },
    { header: 'CRITICA', key: 'col23', width: 8 },
    { header: 'NIVELADA', key: 'col24', width: 10 },
    { header: 'M CERO', key: 'col25', width: 8 },
  ];

  // Generar datos y agregar filas al archivo Excel
  for (let i = 0; i < preconteogral.length; i++) {
    let mmin = 0; mmax = 0;
    let mCritica = "";

    const mcodigo = preconteogral[i].codigo;                //codigo
    const mcol1 = preconteogral[i].codigo.substring(0, 2);  //dep
    const mcol2 = preconteogral[i].codigo.substring(0, 5);  //codmpio
    const mcol3 = preconteogral[i].codigo.substring(2, 5) + "-" + preconteogral[i].municipio;  //municipio
    const mcol4 = preconteogral[i].codigo.substring(5, 7);  //zona
    const mcol5 = preconteogral[i].codigo.substring(7, 9);  //puesto
    const mcol6 = mcol5 + "-" + preconteogral[i].nombpuesto;     //nombre puesto
    const mcol7 = preconteogral[i].mesa;
    const mcol8 = preconteogral[i].can1;
    const mcol9 = preconteogral[i].can2;
    const mcol10 = preconteogral[i].can3;
    const mcol11 = preconteogral[i].can4;
    const mcol12 = preconteogral[i].can5;
    const mcol13 = preconteogral[i].can6;
    const mcol14 = preconteogral[i].can7;


    const mcol15 = preconteogral[i].blancos;
    const mcol16 = preconteogral[i].nulos;
    const mcol17 = preconteogral[i].nomarcado;
    const mcol18 = preconteogral[i].votmesa;
    const mcol19 = preconteogral[i].sufragos;
    const mcol20 = preconteogral[i].recuento;
    const mcol21 = preconteogral[i].reclama;
    const mcol22 = preconteogral[i].promedio;
    const mcol23 = preconteogral[i].balance;
    const mcol26 = preconteogral[i].comision;

    mmin = mcol22 - (mcol22 * 0.3);
    mmax = mcol22 + (mcol22 * 0.3);

    if (mcol18 < mmin || mcol18 > mmax) {
      mCritica = "SI";
    }

    const rowData = {
      col1: mcol1,
      col2: mcol2,
      col3: mcol3,
      col4: mcol4,
      col5: mcol5,
      col6: mcol6,
      col7: mcol7,
      col8: mcol8,
      col9: mcol9,
      col10: mcol10,
      col11: mcol11,
      col12: mcol12,
      col13: mcol13,
      col14: mcol14,
      col15: mcol15,
      col16: mcol16,
      col17: mcol17,
      col18: mcol18,
      col19: mcol19,
      col20: mcol20 === '1' ? "SI" : "",
      col21: mcol21 === '1' ? "SI" : "",
      col22: mcol22,
      col23: mCritica,
      col24: mcol23,
      col25: mcol14 === null ? "ALERTA" : "",
      col26: mcol26,
    };

    worksheet.addRow(rowData);
  }

  // Guardar el archivo Excel
  workbook.xlsx.writeFile(criticaFileExcel).then((e) => {
    console.log('Los Datos se Guardaron Correctamente');
    res.redirect('/envios/donwload');
  })
    .catch(() => {
      console.log('Ocurrio un problema');
    })
};

// ************** Graba la foto del E-14 leyendo el codigo QR *********************
ctrlenvios.grabae14Arch = async (req, res) => {
  const outputDir = '../public/salidas'

  if (!req.files || !req.files.imagen) {
    return res.status(400).json({ error: "No se ha seleccionado ningún archivo." });
  }

  const imagen = req.files.imagen;
  const rutaImagePath = path.join(__dirname, outputDir, 'imagenQR.jpg');

  try {
    const imagenReducida = await sharp(imagen.data) // Usar imagen.data para acceder al buffer
      .jpeg({ quality: 10 }) // Ajusta la calidad según tus preferencias
      .toBuffer();

    const pesoEnBytes = imagenReducida.length;
    //console.log(pesoEnBytes)

    let imagenBase64 = imagenReducida.toString('base64');

    // Esperar a que se guarde la imagen en disco
    await new Promise((resolve, reject) => {
      imagen.mv(rutaImagePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Leer el código QR en la región de interés
    const codigoQR = await Extraer.extraerImagen(rutaImagePath);
    //console.log("Codigo QR: ", codigoQR);
    const codigoE14 = codigoQR.substring(2, 14);
    const caraE14 = codigoQR.substring(15, 16);

    if (caraE14 === '1') {
      newFoto = { foto: imagenBase64 };
      newReg = { codigo: codigoE14, foto: imagenBase64 };
    } else {
      newFoto = { fotob: imagenBase64 };
      newReg = { codigo: codigoE14, fotob: imagenBase64 };
    }

    const myE14 = await pool.query('SELECT * FROM fotoe14 WHERE codigo = ?', [codigoE14]);
  
    if (myE14.length > 0) {
      // Actualizar el registro existente
      await pool.query("UPDATE fotoe14 SET ? WHERE codigo = ?", [newFoto, codigoE14]);
      res.send('OK');
    } else {
      // Insertar un nuevo registro
      await pool.query("INSERT INTO fotoe14 SET ?", [newReg]);
      res.send('OK');
    }
  } catch (error) {
    console.error('Error al procesar y guardar la imagen:', error);
    res.status(500).send('FALLO');
  }
};

// ************** Consulta la foto del E-14 *********************
ctrlenvios.traerE14 = async (req, res) => {
  const { codigo } = req.params;

  try {
    const myE14 = await pool.query('SELECT foto, fotob, fotoc FROM fotoe14 WHERE codigo = ?', [codigo]);

    if (myE14.length > 0) {
      res.send(myE14);    //res.send(myE14[0].foto)
    } else {
      res.send('FALLO');
    }
  } catch (error) {
    console.error('Error al insertar o actualizar el registro:', error);
    res.status(500).send('FALLO');
  }
};

// ************** Consulta la foto de la reclamación *********************
ctrlenvios.traereclama = async (req, res) => {
  const { codigo } = req.params;

  try {
    const myE14 = await pool.query('SELECT reclama FROM fotoe14 WHERE codigo = ?', [codigo]);

    if (myE14.length > 0) {
      res.send(myE14[0].reclama);
    } else {
      res.send('FALLO');
    }
  } catch (error) {
    console.error('Error al insertar o actualizar el registro:', error);
    res.status(500).send('Error Consultar foto de la reclamación');
  }
};

// ************** Graba la foto del E-14 desdela datatable *********************
ctrlenvios.grabae14 = async (req, res) => {
  const { codigo, opcion } = req.params;
  const { imagen } = req.body;
  let newFoto, newReg;

console.log(codigo)
console.log(opcion)


  switch (opcion) {
    case "1":
      newFoto = { foto: imagen };
      newReg = { codigo: codigo, foto: imagen };
      break;

    case "2":
      newFoto = { fotob: imagen };
      newReg = { codigo: codigo, fotob: imagen };
      break;

    case "3":
      newFoto = { fotoc: imagen };
      newReg = { codigo: codigo, fotoc: imagen };
      break;

    case "4":
      newFoto = { reclama: imagen };
      newReg = { codigo, reclama: imagen };
      break;
  }

  try {
    const myE14 = await pool.query('SELECT * FROM fotoe14 WHERE codigo = ?', [codigo]);

    if (myE14.length > 0) {
      // Actualizar el registro existente
      await pool.query("UPDATE fotoe14 SET ? WHERE codigo = ?", [newFoto, codigo]);
      res.send('OK');
    } else {
      // Insertar un nuevo registro
      await pool.query("INSERT INTO fotoe14 SET ?", [newReg]);
      res.send('OK');
    }
  } catch (error) {
    console.error('Error al insertar o actualizar el registro:', error);
    res.status(500).send('FALLO');
  }
};



module.exports = ctrlenvios;