const buttons = document.querySelectorAll(".btn");

for (const purchaseButton of buttons) {
    purchaseButton.addEventListener('click', async function () {
        const itemId = purchaseButton.getAttribute("data-id");

        try {
            const response = await fetch('/shop/coins-purchase', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({itemId})
            });

            if (response.ok) {
                window.location.href = "/shop";
            } else {
                const errorResponse = await response.json();
                console.error('Error:', errorResponse);
            }
        } catch (error) {
            console.error('Error purchasing coins:', error);
        }
    })
}