const {Roter, Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('Add', {
    title: 'Добавить курс',
    isAdd: true
  })
})

module.exports = router