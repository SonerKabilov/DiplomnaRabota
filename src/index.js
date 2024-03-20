const path = require("path");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const sectionsRouter = require('./routes/sectionsRoutes');
const adminRouter = require('./routes/adminRoutes');
const lessonRouter = require('./routes/lessonsRoutes');
const exercisesRouter = require('./routes/exercisesRoutes');

app.use("/section", sectionsRouter);
app.use("/admin", adminRouter);
app.use("/lesson", lessonRouter);
app.use("/exercises", exercisesRouter);

app.get('*', (req, res) => {
    res.redirect("/section/1/lessons");
})

app.listen(3000, () => {
    console.log("ON PORT 3000!");
})
