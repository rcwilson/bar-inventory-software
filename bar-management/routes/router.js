var express = require('express');
var router = express.Router();

const UserController = require('../controllers/user.controller')
const ProductController = require('../controllers/product.controller');

router.get('/api-connection', (req, res) => {
    res.send({ message: 'Connected to API' });
});


//===================USERS=====================
router.get('/user', UserController.findOne);
router.post('/user/new', UserController.addNewUser);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

//==================PRODUCTS===================
router.get('/products', ProductController.findAll);
router.post('/products/new', ProductController.addNewProduct);
router.delete('/products/:_id', ProductController.deleteProduct);

module.exports = router;