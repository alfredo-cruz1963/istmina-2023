const ctrlusers = {};

const pool = require('../database');
const helpers = require('../lib/helpers');

// ********** despliega la pagina para adiccionar *************
ctrlusers.add = async (req, res) => {

    const cytes = await pool.query('SELECT codigo, mpio FROM dane');
    const puestos = await pool.query("SELECT codigo, CONCAT(codcom, ' ', nombpuesto) As nombpuesto FROM divipol");
     
    var aCodPto = [];
    var aNomPto = [];
  
    for (var i in puestos) {
      aCodPto.push([puestos[i].codigo]);
      aNomPto.push([puestos[i].nombpuesto]);
    }
  
    const acodpuesto = JSON.stringify(aCodPto);
    const anompuesto = JSON.stringify(aNomPto);
  
    res.render('users/add.hbs', { cytes, acodpuesto, anompuesto });
};

// *********** adicciona a la BD *****************
ctrlusers.new = async (req, res) => {
    const { username, fullname, password, codmpio, codpuesto, rol, especial} = req.body;
    const musuario = req.body.username;
    const valorCheckBox = especial !== undefined ? especial : '0';
  
    const usuario = await pool.query('SELECT username FROM users WHERE username = ?', musuario)

    const newUser = {
        username,
        fullname: req.body.fullname.toLowerCase().trim().split(' ').map( v => v[0].toUpperCase() + v.substr(1) ).join(' '),
        password: await helpers.encryptPassword(req.body.username),
        codmpio,
        codpuesto,
        rol,
        especial:  valorCheckBox
    };

    if (usuario.length > 0) {
      req.flash('message', 'El usuario: ' + musuario + ', YA existe.');
      res.redirect('/users/add');
    }

    await pool.query('INSERT INTO users set ?', [newUser]);
    req.flash('success', 'El Usuario fue Guardado Correctamente');
    res.redirect('/users');   
};

// ************* lista  **********************
ctrlusers.list = async (req, res) => {
        const usuarios = await pool.query('SELECT * FROM vusers');
        const roles = req.user.rol;
        res.render('users/list.hbs', { usuarios });     
};

// ************** Delete *********************
ctrlusers.delete = async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    req.flash('message', 'El Usuario fue Borrado Correctamente');
    res.redirect('/users');
};

// *********** trae el registro que va a editar ***********************
ctrlusers.edit = async (req, res) => {
    const { id } = req.params;

    const usuarios = await pool.query('SELECT * FROM vusers WHERE id = ?', [id]);
    const cytes = await pool.query('SELECT codigo, mpio FROM dane');
    const puestos = await pool.query("SELECT codigo, CONCAT(codcom, ' ', nombpuesto) As nombpuesto FROM divipol");
     
    var aCodPto = [];
    var aNomPto = [];
  
    for (var i in puestos) {
      aCodPto.push([puestos[i].codigo]);
      aNomPto.push([puestos[i].nombpuesto]);
    }
  
    const acodpuesto = JSON.stringify(aCodPto);
    const anompuesto = JSON.stringify(aNomPto);

    res.render('users/edit.hbs', { usuarios: usuarios[0], cytes, acodpuesto, anompuesto });
};

// ****************** actualiza en la BD ********************
ctrlusers.update = async (req, res) => {
    const { id } = req.params;
    const { username, fullname, password, codmpio, codpuesto, rol, especial} = req.body;
    const valorCheckBox = especial !== undefined ? especial : '0';

    const newUser = {
        username,
        fullname: req.body.fullname.toLowerCase().trim().split(' ').map( v => v[0].toUpperCase() + v.substr(1) ).join(' '),
        codmpio,
        codpuesto,
        rol,
        especial:  valorCheckBox
    };

    await pool.query('UPDATE users set ? WHERE id = ?', [newUser, id]);
    //req.flash('success', 'El Usuario se Actualizado Correctamente');
    res.redirect('/users');
};

module.exports = ctrlusers;