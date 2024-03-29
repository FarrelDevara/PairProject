const express = require('express')
const session = require('express-session')
const app = express()
const port = 3000

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const Controller = require('./controllers/controller')

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: 'wadidaw wadadidadaw',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true
  }
}))

app.get('/', Controller.homePage)
app.get('/berita/:id/detail', Controller.detailNews)

const isNotLogin = function (req, res, next) {
  console.log(req.session);
  if (!req.session.userId) {
    next()
  } else {
    res.redirect('/')
  }
}

const isLogin = function (req, res, next) {
  console.log(req.session);
  if (req.session.userId) {
    next()
  } else {
    res.redirect('/')
  }
}

const isAdmin = function(req,res,next){
  if (req.session.role === "admin") {
    next()
  }else{
    res.redirect('/')
  }
}
//USER
app.get('/register',isNotLogin, Controller.registerForm)
app.post('/register',isNotLogin, Controller.register)
app.get('/login', isNotLogin, Controller.loginForm)
app.post('/login', isNotLogin, Controller.login)

app.get('/profile', isLogin, Controller.profileUser)
app.get('/logout', isLogin, Controller.logout)

app.post(`/comment/add/:id/:userId`, Controller.Commenting)

//ADMIN
app.get('/berita/add',isAdmin, Controller.addNewsForm)
app.post('/berita/add', isAdmin, upload.single("avatar"), Controller.addNews)

app.get('/berita/delete/:id',isAdmin, Controller.deleteNews)

app.get('/berita/edit/:id',isAdmin, Controller.editNewsForm)
app.post('/berita/edit/:id',isAdmin, Controller.editNews)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})