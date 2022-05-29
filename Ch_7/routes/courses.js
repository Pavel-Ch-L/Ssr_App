const {Router} = require('express')
const {validationResult} = require('express-validator')
const Course = require('../models/course')
const router = Router()
const auth = require('../middleware/auth')
const {courseValidators} = require('../utils/validators')

function isOwner (course, req) {
  return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('userId', 'email name')
      .select('price title img')
    res.render('courses', {
      title: 'Курсы',
      isCourses: true,
      userId: req.user ? req.user._id.toString() : null,
      courses
    })
  } catch (error) {
    console.log('courser router.get (/) ', error);
  }
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }
  try {
    const course = await Course.findById(req.params.id)
    if ( !isOwner(course, req) ) {
      return res.redirect('/courses')
    }
    res.render('course-edit', {
      title: `Редактировать ${course.title}`,
      course
    })
  } catch (error) {
    console.log('courses.js - router.get(/:id/edit) ', error);
  }
})

router.post('/edit', auth, courseValidators, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: `Редактировать`,
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img
      }
    })
  }
  try {
    const {id} = req.body
    delete req.body.id
    const course = await Course.findById(id)
    if ( !isOwner(course, req) ) {
      return res.redirect('/courses')
    }
    Object.assign(course, req.body)
    await course.save()
    res.redirect('/courses')
  } catch (error) {
    console.log('courses.js router.post(/edit)', error);
  }
})

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({_id: req.body.id, userId: req.user._id})
    res.redirect('/courses')
  } catch (e) {
    console.log('courses.js router.get(/remove)', e);
  }
})

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    res.render('course', {
      layout: 'empty',
      title: `Курс ${course.title}`,
      course
    })
  } catch (error) {
    console.log('courses.js router.get(/:id) ', error);
  }
})

module.exports = router