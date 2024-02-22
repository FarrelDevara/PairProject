const express = require('express')
const session = require('express-session')
const app = express()
const port = 3000
const Controller = require('./controllers/controller')

app.set("view engine", "ejs")
app.use(express.urlencoded({extended : true}))

app.use(session({
  secret: 'wadidaw wadadidadaw',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    sameSite : true
  }
}))

app.get('/register', Controller.registerForm)
app.post('/register', Controller.register)
app.get('/login', Controller.loginForm)
app.post('/login', Controller.login)


app.use(function (req,res,next){
  // console.log(req.session, "<<<<sesion");
  // console.log(`Time : ${Date.now()}`);
  
  if (req.session.userId) {
    next()
  }else{
    res.redirect('/login')
  }
})

app.get('/', Controller.homePage)

app.get('/profile', Controller.profileUser)

app.get('/berita/:id/detail', Controller.detailNews)

app.get('/logout', Controller.logout)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})