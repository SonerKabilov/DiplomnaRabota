const closeAlertBtn = document.querySelector(".closeAlertBtn");

if(closeAlertBtn) {
    closeAlertBtn.addEventListener("click", function() {
        const alertBox = document.querySelector(".alert");
        alertBox.style.display = "none";
    })
}
