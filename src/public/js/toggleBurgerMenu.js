document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('#burgerMenu');
    const sections = document.querySelector('.sections');

    burgerMenu.addEventListener('click', () => {
        sections.classList.toggle('active');
    });
});