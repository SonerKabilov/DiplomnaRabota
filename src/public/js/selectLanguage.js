document.querySelector('#languageForm').addEventListener('click', function(event) {
    const target = event.target.closest('.flagButton');

    if (target) {
        const languageData = target.dataset.language;
        document.querySelector('#languageData').value = languageData;
        target.classList.add('selected');
    }
});