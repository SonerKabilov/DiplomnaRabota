const container = document.querySelector('.lessons');

const showPopover = () => {
    container.addEventListener('click', function (event) {
        const targetButton = event.target.closest('i');

        if (targetButton) {
            const popovers = document.querySelectorAll(".popover");
            let popover = null;

            for (const p of popovers) {
                if (p.parentNode === targetButton.parentNode) {
                    popover = p;
                }
            }

            if (popover) {
                const computerStyle = window.getComputedStyle(popover);
                const displayPropertyValue = computerStyle.getPropertyValue('display');

                if (displayPropertyValue === 'block') {
                    popover.style.display = 'none';
                } else if (displayPropertyValue === 'none') {
                    
                    const hideAllPopovers = (e) => {
                        if (!popover.contains(e.target) && e.target !== targetButton) {
                            popover.style.display = 'none';
                            document.removeEventListener('click', hideAllPopovers);
                        }
                    }

                    document.addEventListener('click', hideAllPopovers);

                    const rect = targetButton.getBoundingClientRect();
                    const top = rect.top + window.scrollY + targetButton.offsetHeight;
                    const left = rect.left + window.scrollX + (targetButton.offsetWidth - popover.offsetWidth) / 2;

                    popover.style.top = `${top}px`;
                    popover.style.left = `${left}px`;
                    popover.style.display = 'block';
                    popover.style.opacity = 0;

                    setTimeout(() => {
                        popover.style.opacity = 1;
                    }, 50);
                }
            }
        }
    });
}

showPopover();
