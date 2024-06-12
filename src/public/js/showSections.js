const language = document.currentScript.getAttribute("lang");
const sectionType = document.currentScript.getAttribute("sectionType");

const sectionsDiv = document.querySelector('.sections');
const lessonsDiv = document.querySelector('.lessons');
const sectionTypesSelect = document.querySelector('.sectionTypes');
// const sections = document.querySelectorAll('.section');
// const lessons = document.querySelectorAll('.lesson');

const getSectionsAndLessons = async () => {
    try {
        if (sectionType === "free") {
            const response = await fetch(`/${language}/get-free-sections-and-lessons`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            return await response.json();
        } else if (sectionType === "premium") {
            const response = await fetch(`/${language}/get-premium-sections-and-lessons`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            return await response.json();
        }
    } catch (error) {
        console.error('Error fetching exercises:', error);
    }
}

const showSections = async () => {
    const { sections, lessons, onLesson } = await getSectionsAndLessons();

    if (sectionType === "free") {
        for (const section of sections) {
            const sectionDiv = document.createElement("div");
            sectionDiv.classList.add("section");
            sectionDiv.setAttribute("section-id", section.id);
            sectionsDiv.appendChild(sectionDiv);

            const sectionSequence = document.createElement("h5");
            sectionSequence.textContent = `Раздел ${section.sequence}`;
            sectionDiv.appendChild(sectionSequence);

            const sectionDescription = document.createElement("p");
            sectionDescription.classList.add("description");
            sectionDescription.textContent = section.description;
            sectionDiv.appendChild(sectionDescription);

            const showLessonBtn = document.createElement("button");
            showLessonBtn.classList.add("showLessonsBtn");
            showLessonBtn.textContent = "Начало";
            sectionDiv.appendChild(showLessonBtn);
        }

        for (const lesson of lessons) {
            const lessonDiv = document.createElement("div");
            lessonDiv.classList.add("lesson");
            lessonDiv.setAttribute("lesson-section", lesson.sections_id);
            lessonsDiv.appendChild(lessonDiv);

            const icon = document.createElement("i");
            icon.classList.add("fa-solid", "fa-star");
            icon.id = `popoverBtn${lesson.id}`;
            lessonDiv.appendChild(icon);

            const popoverDiv = document.createElement("div");
            popoverDiv.classList.add("popover");
            popoverDiv.id = `myPopover${lesson.id}`;
            lessonDiv.appendChild(popoverDiv);

            const header = document.createElement("h3");
            header.classList.add("lessonSequence");
            header.textContent = `Урок ${lesson.sequence}`;
            popoverDiv.appendChild(header);

            const startLesson = document.createElement("a");
            startLesson.classList.add("startLesson");
            popoverDiv.appendChild(startLesson);

            if (lesson.sequence <= onLesson) {
                icon.classList.add("completed");
                startLesson.href = `/exercises/${language}/section/${lesson.section_sequence}/lesson/${lesson.sequence}`;
                startLesson.textContent = "Начало";
            } else {
                const lockIcon = document.createElement("i")
                lockIcon.classList.add("fa-solid", "fa-lock");
                startLesson.appendChild(lockIcon);

                startLesson.classList.add("disabled");
                startLesson.href = `/${language}/free/lessons`;
            }
        }
    } else if (sectionType === "premium") {
        for (const section of sections) {
            const sectionDiv = document.createElement("div");
            sectionDiv.classList.add("section");
            sectionDiv.setAttribute("section-id", section.id);
            sectionsDiv.appendChild(sectionDiv);

            const sectionType = document.createElement("h5");
            sectionType.textContent = section.type;
            sectionDiv.appendChild(sectionType);

            const showLessonBtn = document.createElement("button");
            showLessonBtn.classList.add("showLessonsBtn");
            showLessonBtn.textContent = "Начало";
            sectionDiv.appendChild(showLessonBtn);
        }

        if (lessons.length > 0) {
            for (const lesson of lessons) {
                const lessonDiv = document.createElement("div");
                lessonDiv.classList.add("lesson");
                lessonDiv.setAttribute("lesson-section", lesson.premium_sections_id);
                lessonsDiv.appendChild(lessonDiv);

                const icon = document.createElement("i");
                icon.classList.add("fa-solid", "fa-star");
                icon.id = `popoverBtn${lesson.premium_sections_id}`;
                lessonDiv.appendChild(icon);

                const popoverDiv = document.createElement("div");
                popoverDiv.classList.add("popover");
                popoverDiv.id = `myPopover${lesson.premium_sections_id}`;
                lessonDiv.appendChild(popoverDiv);

                const header = document.createElement("h3");
                header.classList.add("lessonSequence");
                header.textContent = `Урок ${lesson.sequence}`;
                popoverDiv.appendChild(header);

                const startLesson = document.createElement("a");
                startLesson.classList.add("startLesson");
                popoverDiv.appendChild(startLesson);

                if (lesson.sequence <= onLesson[lesson.type]) {
                    icon.classList.add("completed");
                    startLesson.textContent = "Начало";
                    startLesson.href = `/exercises/${language}/${lesson.type}/lesson/${lesson.sequence}`;
                } else {
                    const lockIcon = document.createElement("i")
                    lockIcon.classList.add("fa-solid", "fa-lock");
                    startLesson.appendChild(lockIcon);

                    startLesson.classList.add("disabled");
                    startLesson.href = `/${language}/premium/lessons`;
                }
            }
        } else {
            const p = document.createElement("p");
            p.textContent = "Нямате абонамент"
            lessonsDiv.appendChild(p);
        }
    }

    showFirstSectionLessons();
    addLessonToggleListeners();
}

document.addEventListener('DOMContentLoaded', () => {
    showSections();
});

async function showFirstSectionLessons() {
    const sections = document.querySelectorAll('.section');
    const lessons = document.querySelectorAll('.lesson');
    let firstSectionId;

    if (sections.length > 0) {
        firstSectionId = sections[0].getAttribute('section-id');
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

function addLessonToggleListeners() {
    const sections = document.querySelectorAll('.section');
    const lessons = document.querySelectorAll('.lesson');

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

sectionTypesSelect.addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];
    const url = selectedOption.getAttribute("url");

    if (url) {
        window.location.href = url;
    }
})