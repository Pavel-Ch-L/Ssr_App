const {Router} = require('express')
const User = require('../models/user')
const router = Router()

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Аваторизация',
    isLogin: true
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', async (req, res) => {
  const user = await User.findById('626e94c0d0e1b3f5e039733a')
  req.session.user = user
  req.session.isAuthenticate = true
  req.session.save(err => {
    if(err) throw err
    res.redirect('/')
  })
})

module.exports = router