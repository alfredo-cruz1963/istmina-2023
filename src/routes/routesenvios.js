const router = require('express').Router();

const { isLoggedIn } = require('../lib/auth');
const enviosctrl = require('../controllers/ctrlenvios');

router.get('/', isLoggedIn, enviosctrl.list);
router.get('/add', isLoggedIn, enviosctrl.add);
router.get('/addtest', isLoggedIn, enviosctrl.addtest);
router.get('/view', isLoggedIn, enviosctrl.view);
router.post('/grabar/:myllave', isLoggedIn, enviosctrl.grabar);
router.get('/preconteo', isLoggedIn, enviosctrl.preconteo);
router.get('/consulta/:codmpio', isLoggedIn, enviosctrl.consulta);
router.get('/consulDpto', isLoggedIn, enviosctrl.searchDpto);
router.get('/descargar', isLoggedIn, enviosctrl.descargar);
router.get('/delete/:codigo', isLoggedIn, enviosctrl.delete);
router.post('/update/:myllave', isLoggedIn, enviosctrl.update);
router.get('/search/:codigo', isLoggedIn, enviosctrl.search);
router.get('/critica/:opc', isLoggedIn, enviosctrl.critica);
router.get('/donwload', isLoggedIn, enviosctrl.donwload);
router.post('/grabae14/:codigo/:opcion', isLoggedIn, enviosctrl.grabae14);
router.post('/grabae14Arch', isLoggedIn, enviosctrl.grabae14Arch);
router.get('/verifyDptal', isLoggedIn, enviosctrl.verifyDptal);
router.get('/verifyMpal/:codmpio', isLoggedIn, enviosctrl.verifyMpal);
router.get('/verifyPuesto/:codigo', isLoggedIn, enviosctrl.verifyPuesto);
router.get('/verificar/:mCodPuesto', isLoggedIn, enviosctrl.verificar);
router.post('/traerE14/:codigo', isLoggedIn, enviosctrl.traerE14);
router.post('/traereclama/:codigo', isLoggedIn, enviosctrl.traereclama);
router.get('/tablampios', isLoggedIn, enviosctrl.tablampios);
router.post('/resultmpios/:codigo', isLoggedIn, enviosctrl.resultmpios);
router.get('/tablapuestos/:codigo', isLoggedIn, enviosctrl.tablapuestos);
router.post('/resultpuestos/:codigo', isLoggedIn, enviosctrl.resultpuestos);
router.get('/whatsapp', isLoggedIn, enviosctrl.whatsapp);

module.exports = router;

//router.post('/grabareclama/:codigo/:opcion', isLoggedIn, enviosctrl.grabareclama);
//router.post('/grabae14/:codigo:opcion', isLoggedIn, enviosctrl.grabae14);