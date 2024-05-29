const path = require("path");
const express = require("express");
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

require("dotenv").config();

const app = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(session(
    { 
        name: process.env.SESSION_NAME,
        resave: false,
        saveUninitialized: false, //Will not save empty sessions
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, //One week
            httpOnly: true,
            sameSite: true
        }
    }
));
app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const coursesRouter = require('./routes/coursesRoutes');
const sectionsRouter = require('./routes/sectionsRoutes');
const adminRouter = require('./routes/adminRoutes');
const lessonRouter = require('./routes/lessonsRoutes');
const exercisesRouter = require('./routes/exercisesRoutes');
const accountRouter = require('./routes/accountRoutes');
const flashCardRouter = require('./routes/flashcardRoutes');

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/", accountRouter);
app.use("/courses", coursesRouter);
app.use("/", sectionsRouter);
app.use("/admin", adminRouter);
app.use("/lesson", lessonRouter);
app.use("/exercises", exercisesRouter);
app.use("/flashcards", flashCardRouter);

app.get('*', (req, res) => {
    res.send("404 NOT FOUND");
})

app.listen(3000, () => {
    console.log("ON PORT 3000!");
})
