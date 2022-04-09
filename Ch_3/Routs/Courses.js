const {Roter, Router} = require('express')
const Course = require('../Models/course')
const router = Router()

router.get('/', async (req, res) => {
  const courses = await Course.getAll()
  res.render('Courses', {
    title: 'Курсы',
    isCourses: true,
    courses
  })
})

module.exports = router