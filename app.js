const express = require('express');
const pageRoutes = require('./routes/pageRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', pageRoutes);
app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  console.error('Логирование ошибки:', err.message);
  const status = err.statusCode || 500;
  res.status(status).json({ 
    error: err.message || 'Внутренняя ошибка сервера' 
  });
});

app.listen(3000, () => {
  console.log(`Сервер запущен: http://localhost:3000`);
});