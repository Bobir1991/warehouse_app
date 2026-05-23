const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('pages/index', { title: 'Остатки', path: '/' }));
router.get('/operations', (req, res) => res.render('pages/operations', { title: 'Операции', path: '/operations' }));
router.get('/add', (req, res) => res.render('pages/add', { title: 'Новая операция', path: '/add' }));
router.get('/about', (req, res) => res.render('pages/about', { title: 'Контакты', path: '/about' }));

module.exports = router;
