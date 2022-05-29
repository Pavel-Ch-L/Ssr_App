const {Router} = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const {validationResult} = require('express-validator')
const router = Router()
const private = require('../keys')
const mailTransport = require('../emails/mailTranspot')
const regEmail = require('../emails/registration')
const {registerValidators} = require('../utils/validators')
const resetEmail = require('../emails/reset')

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError')
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body

    const candidate = await User.findOne({ email })
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password)
      if (areSame) {
        req.session.user = candidate
        req.session.isAuthenticate = true
        req.session.save(err => {
          if(err) throw err
          res.redirect('/')
        })
      } else {
        req.flash('loginError', 'Неврный пароль')
        res.redirect('/auth/login#/login')
      }
    } else {
      req.flash('loginError', 'Такой пользователь не найден')
      res.redirect('/auth/login#/login')
    }
  } catch (error) {
    console.log(error);
  }
  
})

router.post('/register', registerValidators, async (req, res) => {
  try {
    const {email, password, confirm, name} = req.body
    const candidate = await User.findOne({email})
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/login#register')
    }
    if (candidate) {
      req.flash('registerError', 'Такой email уже занят')
      res.redirect('/auth/login#register')
    } else {
      const hashPassword = await bcrypt.hash(password, 10)
      const user = new User({
        email, name, password: hashPassword, cart:{items: []}
      })
      await user.save()
      res.redirect('/auth/login#login')
      await mailTransport(regEmail(email, name))
    }
  } catch (e) {
    console.log(e);
  }
})

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Забыли пароль',
    error: req.flash('error')
  })
})

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth/login')
  }

  try {
    const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExp: {$gt: Date.now()}
    })
    if(!user) {
      console.log("Ошибка! Пользователь не найден");
      return res.redirect('/auth/login')
    } else {
      res.render('auth/password', {
        title: 'Восстановить доступ',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token
      })
    }
  } catch (error) {
    console.log(error);
  }
})

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Что-то пошло не так, повторите попытку позже')
        return res.redirect('/auth/reset')
      }
      const token = buffer.toString('hex')
      const candidate = await User.findOne({email: req.body.email})
      if (candidate) {
        candidate.resetToken = token,
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
        await candidate.save()
        await mailTransport( resetEmail(candidate.email, candidate.name, token) )
        res.redirect('/auth/login')
      } else {
        req.flash('error', 'Такого email нет')
        res.redirect('/auth/reset')
      }
    })
  } catch (error) {
    console.log(error);
  }
})

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: {$gt: Date.now()}
    })
    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10)
      user.resetToken = undefined
      user.resetTokenExp = undefined
      await user.save()
      res.redirect('/auth/login')
    } else {
      console.log('Ошибка! Время жизни токена истекло')
      req.flash('loginError', 'Время жизни токена истекло')
      res.redirect('/auth/login')
    }
  } catch (error) {
    console.log(error);
  }
})

module.exports = router