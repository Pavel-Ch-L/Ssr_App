const {body} = require('express-validator')
const User = require('../models/user')


exports.registerValidators = [
  body('email')
    .isEmail().withMessage('Введите корректный Email')
    .custom( async (value, {req} ) => {
      try {
        const user = await User.findOne({email: value})
        if(user) {
          return Promise.reject('Такой email уже занят')
        }
      } catch (error) {
        console.log(error);
      }
    })
    .normalizeEmail(),
  body('password', 'Пароль должен быть минимум 6 символов')
    .isLength({min: 5, max: 56})
    .isAlphanumeric().withMessage('Пароль должен быть буквенно-цифровой')
    .trim(),
  body('confirm').custom( (value, {req}) => {
    if(value !== req.body.password) {
      throw new Error('Пароли должны совпадать')
    }
    return true
  })
  .trim(),
  body('name')
    .isLength( {min: 3} ).withMessage('Имя должно быть минимум 3 символа')
    .trim()
]

exports.loginValidators = [
  body('email')
    .isEmail().withMessage('Введите корректный Email')
    .custom( async (value, {req} ) => {
      try {
        const user = await User.findOne({email: value})
        if(!user) {
          return Promise.reject('Такой email не найден')
        }
      } catch (error) {
        console.log(error);
      }
    }),
  body('password', 'Пароль должен быть минимум 6 символов')
    .isLength({min: 5, max: 56})
    .isAlphanumeric().withMessage('Пароль должен быть буквенно-цифровой')
    .trim()
]

exports.courseValidators = [
  body('title').isLength( {min: 3} ).withMessage('Минимальная длинна названия 3 символа'),
  body('price').isNumeric().withMessage('Введите корректную цену'),
  body('img', 'Введите корректный URL картинки').isURL()
]