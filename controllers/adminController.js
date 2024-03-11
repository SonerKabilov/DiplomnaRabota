
module.exports = {
    showAdminPage: (req, res) => {
        res.render("admin");
    },
    showAddLessonForm: (req, res) => {
        res.render("addLesson");
    },
    addLesson: (req, res) => {
        // const lesson = req.body;
        res.send(req.body)
    }
}