const EXPRESS = require('express')
const PATH = require('path')
const EXPHBS = require('express-handlebars')
const homeRout = require('./Routs/Home')
const cardRout = require('./Routs/card')
const addRout = require('./Routs/Add')
const CoursesRout = require('./Routs/Courses')

const app = EXPRESS()

/*//Без Handlebars
app.get('/', (req, res) => {
  res.sendFile(PATH.join(__dirname, 'views', 'index.html'))
})
app.get('/about', (req, res) => {
  res.sendFile(PATH.join(__dirname, 'views', 'about.html'))
})
*/

//Конфигурация heandlebarse
const HBS = EXPHBS.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

//Регистрация движка
app.engine('HBS', HBS.engine)
//Начинаем использовать движек
app.set('view engine', 'HBS')
//Название папки шаблонов (по умолчанию views)
app.set('views', './views')
//Регистрируем публичную папку
app.use(EXPRESS.static(PATH.join(__dirname, 'public')))
//Разбор req.body (у каждого <input> д.б. атрибут name)
app.use(EXPRESS.urlencoded({extended: true}))

app.use('/', homeRout)
app.use('/add', addRout)
app.use('/courses', CoursesRout)
app.use('/card', cardRout)



const PORT = process.env.Port || 3000

app.listen(3000, () => {
  console.log(`Server is starting on port ${PORT}`)
})

