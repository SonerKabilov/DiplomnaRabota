const parentDivs = document.querySelectorAll(".parent");

for(let parent of parentDivs) {
    parent.addEventListener("click", function(event) {
        const targetButton = event.target.closest('button');

        if (targetButton) {
            if(parent.children[1].classList.contains("hidden")) {
                parent.children[1].classList.remove("hidden");
            } else {
                parent.children[1].classList.add("hidden");
            }
        }
    })
}