const { Op } = require('sequelize')
const { Category, News, User, Profile, Comment } = require('../models')
const bcrypt = require('bcryptjs')
// const session = require('express-session')

class Controller {

    static async registerForm(req, res) {
        try {

            let errorMessage = req.query.error
            if (errorMessage) {
                errorMessage = errorMessage.split(',')
            } else {
                errorMessage = []
            }

            res.render("registerForm", { errorMessage })
        } catch (error) {
            res.send(error)
        }
    }

    static async register(req, res) {
        try {
            console.log(req.body);
            await User.create({
                username: req.body.username,
                password: req.body.password
            })

            res.redirect('/')
            // res.render("registerForm")
        } catch (error) {

            let errors = []
            if (error.name === "SequelizeValidationError") {
                errors = error.errors.map((item) => {
                    return item.message
                })
            }
            res.redirect(`/register?error=${errors}`)
        }
    }

    static async loginForm(req, res) {
        try {
            // console.log(req.query.error);
            let error = req.query.error
            res.render("loginPage", { error })
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
                    req.session.role = user.role

                    res.redirect('/')
                } else {
                    const error = "invalid username/error"
                    res.redirect(`/login?error=${error}`)
                }
            } else {
                const error = "invalid username/error"
                res.redirect(`/login?error=${error}`)
            }

            // res.redirect('/')
            // console.log();
        } catch (error) {
            res.send(error)
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy()
            res.redirect('/')
        } catch (error) {
            res.send(error)
        }
    }

    //SESUDAH ADA SESSION

    static async homePage(req, res) {
        try {

            // console.log(user.username,"<<<<<<<");
            // res.send(data)
            

                // console.log(req.session.userId);
                let user = await User.findByPk(req.session.userId)
                let category = await Category.findAll()


                let filter = req.query.filter;

                let option = { include: Category }

                if (filter) {
                    option.where = {
                        CategoryId: {
                            [Op.eq]: filter
                        }
                    }
                }

                let data = await News.findAll(option)

                if (req.session.role === "admin") {
                    res.render("adminPage", { data })
                }else{

                    res.render("homePage", { data, user, category })
                }
            
        } catch (error) {
            res.send(error.message)
        }
    }

    static async profileUser(req, res) {
        try {
            let userId = req.session.userId;

            // let data = await Profile.findAll()

            let data = await Profile.findOne({
                where: {
                    UserId: req.session.userId
                }
            })
            console.log(data);

            res.render("profileUser", { data })
        } catch (error) {
            res.send(error)
        }
    }

    static async detailNews(req, res) {
        try {
            let userId = req.session.userId;
            // console.log(userId);
            let data = await News.findOne({
                include: {
                    model: Comment,
                    include: {
                        model: User,
                        include: Profile
                    }
                },
                where: {
                    id: req.params.id
                }
            })
            // res.send(data)
            let errorMessage = req.query.error
            if (errorMessage) {
                errorMessage = errorMessage.split(',')
            } else {
                errorMessage = []
            }

            res.render("detailPage", { data, userId, errorMessage })
        } catch (error) {
            res.send(error)
        }
    }

    static async Commenting(req, res) {
        try {
            // console.log(req.params.id,"<<<id news");
            // console.log(req.params.userId,"<<<<id user");
            // console.log(req.body);

            await Comment.create({
                content: req.body.content,
                UserId: req.params.userId,
                NewsId: req.params.id
            })

            res.redirect(`/berita/${req.params.id}/detail`)
        } catch (error) {
            let errors = []
            if (error.name === "SequelizeValidationError") {
                errors = error.errors.map((item) => {
                    return item.message
                })
            }
            // res.send(errors)
            res.redirect(`/berita/${req.params.id}/detail?error=${errors}`)
        }
    }


    //ADMIN
    static async addNewsForm(req, res) {
        try {

            
            let dataCategory = await Category.cariCategory()
            // console.log(dataCategory);
            res.render("addNewsForm", { dataCategory })
        } catch (error) {
            res.send(error.message)
        }
    }

    static async addNews(req, res) {
        try {
            // console.log(req.body);
            let buffer = req.file.buffer;
            let decodeBuffer = Buffer.from(buffer).toString("base64");
            let imageUrl = `data:${req.file.mimetype};base64,${decodeBuffer}`;

            await News.create({
                title: req.body.title,
                content: req.body.content,
                imageUrl: imageUrl,
                CategoryId: req.body.CategoryId,
            });
            res.redirect("/");
        } catch (error) {
            res.send(error.message)
        }
    }

    static async deleteNews(req, res) {
        try {

            // console.log(req.params.id);

            await News.destroy({
                where: {
                    id: req.params.id
                }
            })

            res.redirect('/')
        } catch (error) {
            res.send(error.message)
        }
    }

    static async editNewsForm(req, res) {
        try {

            let data = await News.findByPk(req.params.id)
            let dataCategory = await Category.findAll()

            res.render("editNewsForm", { data, dataCategory })

        } catch (error) {
            res.send(error.message)
        }
    }

    static async editNews(req, res) {
        try {
            // console.log(req.body);
            // console.log(req.params.id);

            await News.update({
                title: req.body.title,
                content: req.body.content,
                imageUrl: req.body.imageUrl,
                CategoryId: req.body.CategoryId,
            }, {
                where: {
                    id: req.params.id
                }
            })

            res.redirect('/')
        } catch (error) {
            res.send(error.message)
        }
    }

}

module.exports = Controller