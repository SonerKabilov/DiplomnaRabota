const flagButtons = document.querySelectorAll('.flagButton');
const addButton = document.querySelector('.add');

document.querySelector('#addCourseForm').addEventListener('click', function(event) {
    const target = event.target.closest('.flagButton');

    if (target) {
        // Check if the clicked button is already selected
        const isSelected = target.classList.contains('selected');

        // If it's not selected, remove 'selected' class from all flagButtons and add it to the clicked button
        if (!isSelected) {
            for (const btn of flagButtons) {
                btn.classList.remove('selected');
            }

            addButton.classList.remove('disabled');
            target.classList.add('selected');
        } else {
            // If it's already selected, toggle 'selected' class off
            addButton.classList.add('disabled');
            target.classList.remove('selected');
        }

        // Update languageData based on whether 'selected' class is present or not
        const languageData = target.dataset.language;
        document.querySelector('#languageData').value = isSelected ? "" : languageData;
    }
});