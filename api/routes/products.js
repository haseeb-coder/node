const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

//  for the storages of the files.

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, './uploads/');

    },

    filename: function (req, file, cb) {

        cb(null, new Date().toISOString() + file.originalname);

    }
})


const fileFilter = (req, fil, cb) => {
    if (fil.mimetype === 'image/jpeg' || fil.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
    cb(null, false);

};

// creating the object the upload object 
const upload = multer({
    // intilinzing  multer object
    storage: storage,
    limits:
    {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter

});


router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_all);

router.get('/:productId', ProductsController.products_get);

router.patch('/:productId', checkAuth, ProductsController.products_update);

router.delete('/:productId', checkAuth, ProductsController.products_delete);




module.exports = router;