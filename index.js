const express = require("express");
const { restart } = require("nodemon");
const app = express();
const mongoose = require('mongoose')
const usersRoutes = require('./routes/user-route')
const path = require('path')

mongoose.connect('mongodb+srv://root:root@cluster0.npvjt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/utilisateur', usersRoutes);

app.listen(3000, () =>{
    console.log('Serveur en écoute')
});