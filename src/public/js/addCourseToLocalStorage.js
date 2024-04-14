document.querySelector('.userCourses').addEventListener('click', function (event) {
    const target = event.target.closest('.course');

    if (target) {
        localStorage.setItem('selectedLanguage', target.textContent.trim());
    }
})