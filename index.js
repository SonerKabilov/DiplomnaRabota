const path = require("path");
const express = require("express");
const app = express();

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const sectionsRouter = require('./routes/sectionsRoutes')

app.use("/section", sectionsRouter);

app.get('/lesson/:id', (req, res) => {
    const { id } = req.params;
    const lessonExercises = exercises.filter(e => e.lesson_id === parseInt(id, 10));
    res.render("lesson", { id, lessonExercises });
})

app.listen(3000, () => {
    console.log("ON PORT 3000!");
})
