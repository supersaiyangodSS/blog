require('dotenv').config()

const express = require('express')
const handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const connectDB = require('./config/db')
const path = require('path')
const moment = require('moment')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const session = require('express-session')


const app = express()
const port = 3000 || process.env.PORT
const mainRoute = require('./routes/main')
const adminRoute = require('./routes/admin')
const views_path = path.join(__dirname, '../views')
const partials_path = path.join(__dirname, '../views/partials')
const layout_path = path.join(__dirname, '../views/layout')

app.use(express.static('public'))
connectDB();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(methodOverride('_method'))

let oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: 'dbz ssj', // change later
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_SECRET
    }),
    cookie: { maxAge : oneDay }
}))

handlebars.registerHelper('formatDate', (date) => {
    return moment(date).format('ddd DD MMM YYYY') //formatting date
})

app.set('views', views_path)
const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: layout_path,
    partialsDir: partials_path,
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true
    }
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

app.use('/', mainRoute)
app.use('/', adminRoute)

app.listen(port, () => console.log(`server is running at port: ${port}`))