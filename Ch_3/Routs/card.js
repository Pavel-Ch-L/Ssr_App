const {Router} = require('express')
const router = Router()
const Card = require('../Models/card')
const Course = require('../Models/course')

router.post('/add', async (req, res) => {
  const course = await Course.getById(req.body.id)
  await Card.add(course)
  res.redirect('/card')
})

router.get('/', async (req, res) => {
  const card = await Card.fetch()
  res.render('card', {
    title: 'Корзина',
    card
  })
})

module.exports = router