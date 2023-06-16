const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminLayout = '../layout/admin'
const jwtSecret = process.env.JWT_SECRET

const checkAuth = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized' })
    }
    try {
        const decoded = jwt.verify(token, jwtSecret)
        req.userId = decoded.userId
        next()
    }
    catch(err) {
        console.log(err);
        return res.status(401).json({ msg: 'internal server err' })
    }
}

router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            desc: "Admin Panel"
        }
        res.render('admin/index', { locals, layout: adminLayout })
    } catch (err) {
        console.log(err)
    }
})

router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({username})
        if (!user) {
            return res.status(401).json({message:'invalid username or password'})
        }
        const checkPass = await bcrypt.compare(password, user.password);
        if (!checkPass) {
            return res.status(401).json({message:'invalid username or password'})
        }
        const token = jwt.sign({ userId: user._id }, jwtSecret)
        res.cookie('token', token, { httpOnly: true })
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
    }
})

router.get('/dashboard', checkAuth, async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            desc: "Admin Panel"
        }
        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        })
    } catch (err) {
        console.log(err);
    }
})

router.get('/add-post', checkAuth, async (req, res) => {
    try {
        const locals = {
            title: "Add Post",
            desc: "Admin Panel"
        }
        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            data,
            layout: adminLayout
        })
    } catch (err) {
        console.log(err);
    }
})

router.get('/edit-post/:id', checkAuth, async (req, res) => {
    try {
        const locals = {
            title: "Edit Post",
            desc: "Admin Panel"
        }
        const data = await Post.findOne({
            _id: req.params.id
        })
        res.render('admin/edit-post', {
            locals,
            data,
            layout : adminLayout
        })
    } catch (err) {
        console.log(err);
    }
})

router.put('/edit-post/:id', checkAuth, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        })
        res.redirect(`/edit-post/${req.params.id}`)
    } catch (err) {
        console.log(err);
    }
})

router.delete('/delete-post/:id', checkAuth, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err);
    }
})

router.post('/add-post', checkAuth, async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            body: req.body.body
        })
        await Post.create(newPost)
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err);
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/admin')
})

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body
        const hashedPass = await bcrypt.hash(password, 10)
        try {
            const checkUser = await User.create({
                username, password:hashedPass
            })
            res.status(201).json({ msg: 'user has been created', checkUser })
        } catch (err) {
            if(err.code === 11000) {
                return res.status(409).json({ msg: 'user already exists!' })
            }
            res.status(500).json({ msg: 'Internal server error!' })
            console.log(err)
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router