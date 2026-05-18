const express = require("express");
const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.urlencoded({extended: true})); // для html форм
app.use(express.static("./public")) // для js, css, jpg
app.use(express.json()); // чтение данных JSON

app.get("/", (req, res)=>{res.send("Сервер работает")});

app.listen(3000, ()=>{
    console.log("Сервер запущен на http://localhost:3000")
});