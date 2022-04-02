const {Roter, Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('Courses', {
    title: 'Курсы',
    isCourses: true
  })
})

module.exports = router