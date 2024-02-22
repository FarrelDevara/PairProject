const { Category, News, User } = require('../models')
const bcrypt = require('bcryptjs')
// const session = require('express-session')

class Controller {

    static async registerForm(req, res) {
        try {
            res.render("registerForm")
        } catch (error) {

        }
    }

    static async register(req, res) {
        try {
            console.log(req.body);
            await User.create({
                username: req.body.username,
                password: req.body.password
            })

            res.redirect('/register')
            // res.render("registerForm")
        } catch (error) {

        }
    }

    static async loginForm(req, res) {
        try {
            // console.log(req.query.error);
            let error = req.query.error
            res.render("loginPage",{error})
        } catch (error) {
            res.send(error)
        }
    }

    static async login(req, res) {
        try {
            // console.log(req.body);

            let user = await User.findOne({
                where: {
                    username: req.body.username
                }
            })
            // console.log(user);

            if (user) {
                const isValidPassword = bcrypt.compareSync(req.body.password, user.password)

                if (isValidPassword) {
                    
                    req.session.userId = user.id

                    res.redirect('/')
                }else{
                    const error = "invalid username/error"
                    res.redirect(`/login?error=${error}`)
                }
            }else{
                const error = "invalid username/error"
                res.redirect(`/login?error=${error}`)
            }
        } catch (error) {
            res.send(error.message)
        }

    }

    //SESUDAH ADA SESSION

    static async homePage(req, res) {
        try {
            let data = await News.findAll({
                include: Category
            })

            // res.send(data)
            res.render("homePage", { data })
        } catch (error) {
            res.send(error.message)
        }
    }

    static async profileUser(req, res) {
        try {
            console.log(req.session.userId);

            res.render("profileUser")
        } catch (error) {
            res.send(error)
        }
    }

    static async detailNews(req, res) {
        try {
            console.log(req.params.id);

            let data = await News.findOne({
                include: Category,
                where: {
                    id: req.params.id
                }
            })

            // res.send(data)
            res.render("detailPage", { data })
        } catch (error) {
            res.send(error.message)
        }
    }

    static async logout(req,res){
        try {
            req.session.destroy()

            res.redirect('/login')
        } catch (error) {
            res.send(error.message)
        }
    }
}

module.exports = Controller