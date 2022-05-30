const {Router} = require('express')
const path = require('path')
const fs = require('fs')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = Router()

router.get('/', auth, async (req, res) => {
  res.render('profile', {
    title: 'Профиль',
    isProfile: true,
    user: req.user.toObject()
  })
})

router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const toChange = {
      name: req.body.name
    }
    
    if (req.file) {
      if (user.avatarUrl) {
        console.log('Deleteting file ..', user.avatarUrl);
        fs.unlink(path.join(__dirname, '/../' ,user.avatarUrl), (err) => {
          if (err) 
          console.log('ERROR deleting file ', err);
        });
      }
      toChange.avatarUrl = req.file.path
    }
    Object.assign(user, toChange)
    await user.save()
    res.redirect('/profile')
  } catch (error) {
    console.log(error);
  }
})

module.exports = router