const path = require("path");
const express = require("express");
const app = express();

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let lessons = [
    {
        id: 1,
        description: "This is lesson 1"
    },
    {
        id: 2,
        description: "This is lesson 2"
    },
    {
        id: 3,
        description: "This is lesson 3"
    }
]

let exercises = [
    {
        id: 1,
        task: "Преведете dog",
        options: ["куче", "котка", "риба", "жираф"],
        correct_answer : "куче",
        lesson_id: 1
    },
    {
        id: 2,
        task: "Преведете apple",
        options: ["банан", "ананас", "ябълка", "портокал"],
        correct_answer : "ябълка",
        lesson_id: 2
    },
    {
        id: 3,
        task: "Преведете house",
        options: ["блок", "къща", "училище", "болница"],
        correct_answer : "къща",
        lesson_id: 2
    },
    {
        id: 4,
        task: "Преведете училище",
        options: ["school", "hospital", "hotel", "hostel"],
        correct_answer : "school",
        lesson_id: 2
    },
    {
        id: 5,
        task: "Преведете elephant",
        options: ["слон", "кон", "крава", "риба"],
        correct_answer : "слон",
        lesson_id: 2
    }
]

app.get('/home', (req, res) => {
    res.render("home", { lessons });
})

app.get('/lesson/:id', (req, res) => {
    const { id } = req.params;
    const lessonExercises = exercises.filter(e => e.lesson_id === parseInt(id, 10));
    res.render("lesson", { id, lessonExercises });
})


app.listen(3000, () => {
    console.log("ON PORT 3000!");
})
