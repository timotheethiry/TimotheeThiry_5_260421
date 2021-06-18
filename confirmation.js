// get order details and display it

function displayConfirm() {
    const confirmTotal = JSON.parse(localStorage.getItem("total"));
    const confirmId = localStorage.getItem("orderId");
    document.getElementsByClassName('confirm__total')[0]
    .textContent = "Total price of your order : " + confirmTotal + " \u20ac";
    document.getElementsByClassName('confirm__id')[0]
    .textContent = "Your order id : " + confirmId;
  }
  
  displayConfirm();