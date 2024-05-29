const sectionTypesSelect = document.querySelector('.sectionTypes');
const sections = document.querySelectorAll('.section');
const lessons = document.querySelectorAll('.lesson');

function showFirstSectionLessons() {
    let firstSectionId;

    for (const section of sections) {
        firstSectionId = section.getAttribute('section-id');
        break;
    }

    for (const lesson of lessons) {
        const lessonSectionId = lesson.getAttribute('lesson-section');

        if (lessonSectionId === firstSectionId) {
            lesson.style.display = 'block';
        } else {
            lesson.style.display = 'none';
        }
    }
}

// Show lessons of the first section when page loads
showFirstSectionLessons();

function showLessons() {
    for (const section of sections) {
        const button = section.querySelector('.showLessonsBtn');

        button.addEventListener('click', function () {
            const sectionId = section.getAttribute('section-id');

            for (const lesson of lessons) {
                const lessonSectionId = lesson.getAttribute('lesson-section');

                if (lessonSectionId === sectionId) {
                    lesson.style.display = 'block';
                } else {
                    lesson.style.display = 'none';
                }
            }
        });
    }
}

showLessons();

sectionTypesSelect.addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];
    const url = selectedOption.getAttribute("url");

    if (url) {
        window.location.href = url;
    }
})