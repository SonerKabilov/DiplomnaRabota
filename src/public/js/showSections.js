const sectionTypesSelect = document.querySelector('.sectionTypes');
const sections = document.querySelectorAll('.section');
const lessons = document.querySelectorAll('.lesson');

for (const section of sections) {
    const sectionType = section.getAttribute('section-type');
    if (sectionType === "2") {
        section.style.display = 'none';
    }
}

function showSections() {
    sectionTypesSelect.addEventListener('change', function () {
        const selectedType = this.value;

        for (const section of sections) {
            const sectionType = section.getAttribute('section-type');
            if (selectedType === '1' && sectionType === "1") {
                section.style.display = 'block';
            } else if (selectedType === '2' && sectionType === "2") {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        }
    });
}


function showFirstSectionLessons(selectedType) {
    let firstSectionId;

    for (const section of sections) {
        const sectionType = section.getAttribute('section-type');
        if (sectionType === selectedType) {
            firstSectionId = section.getAttribute('section-id');
            break;
        }
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

showSections();

// Show lessons of the first section when page loads
showFirstSectionLessons(sectionTypesSelect.value);

sectionTypesSelect.addEventListener('change', function () {
    const selectedType = this.value;
    
    showFirstSectionLessons(selectedType); // Show lessons of the first section when select changes
});

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