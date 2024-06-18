const parentDivs = document.querySelectorAll(".parent");

for(let parent of parentDivs) {
    parent.addEventListener("click", function(event) {
        const targetButton = event.target.closest('button');

        if (targetButton && (!targetButton.classList.contains("add") && !targetButton.classList.contains("remove"))) {
            const icon = targetButton.querySelector('i');

            if(parent.children[1].classList.contains("hidden")) {
                icon.classList.remove("fa-chevron-right");
                icon.classList.add("fa-chevron-down");
                parent.children[1].classList.remove("hidden");
            } else {
                icon.classList.remove("fa-chevron-down");
                icon.classList.add("fa-chevron-right");
                parent.children[1].classList.add("hidden");
            }
        }
    })
}