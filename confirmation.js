// get order details and display it

function getOrder() {
    confirmTotal = JSON.parse(localStorage.getItem("total"));
    confirmId = localStorage.getItem("orderId");
}

function displayConfirm() {
    getOrder();
    document.getElementsByClassName('confirm_total')[0].textContent = "Total price of your order : " + confirmTotal + " \u20ac";
    document.getElementsByClassName('confirm_id')[0].textContent = "You order id is : " + confirmId;
}

displayConfirm();