const router = require('express').Router();
const pool = require('../database');
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const helpers = require('../lib/helpers');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { waterfall } = require("async");
const { validationResult } = require('express-validator/check');
const enviosctrl = require('../controllers/ctrlenvios');

// SIGNUP
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/home',
  failureRedirect: '/signup',
  failureFlash: true
}));

// SINGIN
router.get('/signin', (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
  req.check('username', 'Username is Required').notEmpty();
  req.check('password', 'Password is Required').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  }

  passport.authenticate('local.signin', {
    successRedirect: '/home',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/home', isLoggedIn, async (req, res) => {
  const roles = req.user.rol;
  const mCodMpio = "17019";

  if (roles == 1) {
    var candidato = [];
    var votos = [];
    var myVotosCan;
    var sumVotos = 0;

    const puestos = await pool.query('SELECT codigo, nombpuesto FROM divipol WHERE codmpio =?', [mCodMpio]);
    const resultados = await pool.query('SELECT * FROM vresultados');
    const mesasReport = await pool.query('SELECT DISTINCT codigo FROM preconteo WHERE mun = ?', [mCodMpio]);
    const votPuestos = await pool.query('SELECT * FROM vvotpuestototal WHERE SUBSTR(codigo, 1, 5) =?', [mCodMpio]);

    for (var i in resultados) {
      const numCan = parseInt(resultados[i].candidato);
      votos.push(resultados[i].votos);
      sumVotos = sumVotos + resultados[i].votos;

      if (numCan <= 10) {
        candidato.push("can-" + resultados[i].candidato);
      } else {
        if (resultados[i].candidato === "96") {
          candidato.push("Blanco")
        } else {
          if (resultados[i].candidato === "97") {
            candidato.push("Nulo")
          } else { candidato.push("NoMarcado") }
        }
      }

      if (resultados[i].candidato === "07") {   //codigo de nuestro candidato
        myVotosCan = resultados[i].votos;
      }
    }

    const myPorc = (myVotosCan * 100 / sumVotos).toFixed(2) + '%';
    const namePtosVotacion = JSON.stringify(puestos);

    const myArray = votPuestos.map(row => {
      const { can1, can2, can3, can4, can5, can6, can7, blancos, nulos, nomarcado } = row;
      return [can1, can2, can3, can4, can5, can6, can7, blancos, nulos, nomarcado];
    });
    const resulPuestos = JSON.stringify(myArray);

    const totMesas = mesasReport.length;
    const totEscrutado = ((totMesas * 100 / 79).toFixed(2)) + '%';   //mesas acacias

    const jCandidato = JSON.stringify(candidato);
    const jVotos = JSON.stringify(votos);
    const jTotvotos = JSON.stringify(votPuestos);

    res.render('dashboard.hbs', { puestos, myPorc, sumVotos, totMesas, totEscrutado, jCandidato, jVotos, jTotvotos, resulPuestos, namePtosVotacion });
  } else {
    if (roles >= 2) {
      res.render('profile.hbs');
    } else {
      if (roles == 5) {
        res.redirect('/envios');
      } else { res.redirect('/envios/addtest'); }
    }
  }
});

// CHANGE PASSWORD
router.get('/change', isLoggedIn, (req, res) => {
  //passNew = await helpers.encryptPassword(newpass);
  res.render('auth/change.hbs');
});

router.post('/change/:id', async (req, res) => {
  const { id } = req.params;
  const { oldpass, newpass, repepass } = req.body;
  const newClave = {
    password: ''
  };

  if (newpass !== repepass) {
    req.flash('message', 'Los Password no son iguales.');
    res.redirect('/change');
  }

  newClave.password = await helpers.encryptPassword(newpass);
  await pool.query('UPDATE users set ? WHERE id = ?', [newClave, id]);
  req.flash('success', 'Se Cambio el Password Correctamente');
  res.redirect('/home');
});

// CHANGE PERFIL
router.get('/perfil', isLoggedIn, (req, res) => {
  res.render('auth/perfil.hbs');
});

router.post('/perfil/:id', async (req, res) => {
  const { id } = req.params;
  const { fullname, username, cel, email } = req.body;
  const newUser = {
    fullname,
    username,
    cel,
    email
  };

  newUser.fullname = newUser.fullname.toUpperCase();
  await pool.query('UPDATE users set ? WHERE id = ?', [newUser, id]);
  req.flash('success', 'Se Actualizo los datos Correctamente');
  res.redirect('/home');
});


// FORGOT
router.get('/forgot', (req, res) => {
  res.render('auth/forgot.hbs');
});

router.post('/forgot', async function (req, res, next) {
  const email = req.body.email;
  memail = email;
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        mtoken = token;
        done(err, token);
      });
    },
    async function (token, done) {
      const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      var filas = rows.length;

      if (filas != 1) {
        console.log('No existe una cuenta con esa dirección de correo electrónico.');
        req.flash('message', 'No existe una cuenta con esa dirección de correo electrónico.');
        return res.redirect('/forgot');
      }

      const newToken = {
        token: token,
        expira: Date.now() + 3600000
      };
      pool.query('UPDATE users set ? WHERE email = ?', [newToken, memail]);
    },
    async function (token, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'alfredogutierrezcruz63@gmail.com',
          pass: '17cruz632411'
        }
      });
      //console.log(smtpTransport);
      const mailOptions = {
        to: memail,
        from: 'alfredogutierrezcruz63@gmail.com',
        subject: 'Restablecimiento de la contraseña',
        text: 'Está recibiendo esto porque usted (u otra persona) ha solicitado restablecer la contraseña de su cuenta.\n\n' + 'Haga clic en el siguiente enlace o péguelo en su navegador para completar el proceso:\n\n' +
          'http://' + req.headers.host + '/reset/' + mtoken + '\n\n' +
          'Si no solicitó esto, ignore este correo electrónico y su contraseña permanecerá sin cambios.\n'
      };

      //console.log(mailOptions); 
      smtpTransport.sendMail(mailOptions, function (err) {
        req.flash('message', 'Se ha enviado un correo electrónico a ' + memail + ' con más instrucciones');
        console.log('send');
        res.redirect('/forgot');
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});


router.get('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const rows = await pool.query('SELECT * FROM users WHERE token = ?', [token]);
  idusr = rows[0].id;

  if (token.length > 0) {
    if (Date.now() > rows[0].expira) {
      req.flash('message', 'El token de restablecimiento de contraseña no es válido o ha expirado.');
      return res.redirect('/forgot');
    }
  }

  res.render('auth/reset.hbs', { id: idusr });
});


router.post('/reset/:id', function (req, res) {
  const { id } = req.params;
  const { password, repepass } = req.body;
  async.waterfall([
    async function (done) {
      const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      memail = rows[0].email;

      if (Date.now() > rows[0].expira) {
        req.flash('message', 'El token de restablecimiento de contraseña no es válido o ha expirado.');
        return res.redirect('back');
      }

      if (password !== repepass) {
        req.flash('message', 'Los Password no son iguales.');
        res.redirect('/reset/:id');
      }

      if (rows.length > 0) {
        const newToken = {
          password: req.body.password,
          token: null,
          expira: null
        };

        newToken.password = await helpers.encryptPassword(req.body.password);
        await pool.query('UPDATE users set ? WHERE id = ?', [newToken, id]);
      }
    },
    async function (done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'alfredogutierrezcruz63@gmail.com',
          pass: '17cruz632411'
        }
      });
      //console.log(smtpTransport);
      var mailOptions = {
        to: memail,
        from: 'alfredogutierrezcruz63@gmail.com',
        subject: 'Su password fue cambiado',
        text: 'Hola,\n\n' +
          'Esta es una confirmación de que la contraseña de su cuenta. ' + memail + ' acaba de ser cambiada.\n'
      };
      //console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function (err) {
        req.flash('success', 'Éxito! Tu contraseña ha sido cambiada.');
        done(err);
      });
    }
  ], function (err) {
    res.redirect('/');
  });
});

module.exports = router;





// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
/* const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'test@example.com',
  from: 'test@example.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg); */