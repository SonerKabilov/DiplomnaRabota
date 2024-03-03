const btns = document.querySelectorAll("button");
id = document.currentScript.getAttribute('id');
const body = document.querySelector("body");

for(let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
        let popover = document.querySelector("#myPopover" + (i + 1));
        let popovers = document.querySelectorAll(".popover");

        if (popover.style.display === "none" || popover.style.display === "") {
            popover.style.display = "block";
        } else {
            popover.style.display = "none";
        }

        for (let j = 0; j < popovers.length; j++) {
            if (j !== i) {
                popovers[j].style.display = "none";
            }
        }
    })
}