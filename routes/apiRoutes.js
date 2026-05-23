// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/data', apiController.getWarehouseData);
router.post('/operation', apiController.addOperation);

module.exports = router;

