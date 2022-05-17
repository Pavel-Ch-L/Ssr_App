const private = require('./private')
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const ordersRoutes = require('./routes/orders')
const User = require('./models/user')
const authRoutes = require('./routes/auth')
const varMiddleware = require('./middleware/variables')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

/* 
app.use(async (req, res, next) => {
  try {
    const user = await User.findById('626e94c0d0e1b3f5e039733a')
    req.user = user
    next()
  } catch (e) {
    console.log(e);
  }
})
 */

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
  secret: private.secret,
  resave: false,
  saveUninitialized: false
}))
app.use(varMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

async function start() {
  try {
    const url = private.mongoUrl
    await mongoose.connect(url, {useNewUrlParser: true})
    /* const candidate = await User.findOne()
    if(!candidate) {
      const user = new User({
        email: 'pavel@mail.ru',
        name: 'Pavel',
        cart: {items: []}
      })
      await user.save()
    } */
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log(`Mangoose connect error: ${e}`);
  }
}

start()

