const textarea = document.querySelector('#lessonPreview');

document.querySelector('.addNewlineButton').addEventListener('click', () => {
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = textarea.value.substring(0, cursorPosition);
    const textAfterCursor = textarea.value.substring(cursorPosition);

    textarea.value = textBeforeCursor + ' <br>' + textAfterCursor;
    textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1;
    textarea.focus();
});

document.querySelector('.boldText').addEventListener('click', () => {
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = textarea.value.substring(0, cursorPosition);
    const textAfterCursor = textarea.value.substring(cursorPosition);

    textarea.value = textBeforeCursor + '<b> </b>' + textAfterCursor;
    textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1;
    textarea.focus();
});