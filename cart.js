// cart functions

let cart =[]; // warning variable globale


// get cart

function getCart() {
  cart = JSON.parse(localStorage.getItem("cart"));
  console.log(cart);
}


// store cart

function storeCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}




// -- cart functions


// find item names

let teddy = 0;
let i = 0;

function findName(obj) {
  teddy = obj.find((item) => item._id == cart[i]);
  return teddy.name;
}

let cartNames;

function findAllNames(arg) {
  cartNames = [];
  for (i = 0; i < cart.length; i++) {
    findName(arg);
    cartNames.push(teddy.name);
    console.log(cartNames);
  }
  return cartNames;
}


// displayCart

function displayCart() {
    if (!cart.length) {
        document.getElementById("cart-items").textContent = "is empty";
    } else {
        document.getElementById("cart-items").textContent = "has" + " " + cartNames.length + " " + "items" + "," + " " + cartNames.join(", ");
    }
}


// find price and total price

// let teddy = 0; declared before
// let i = 0; declared before

function findPrice(obj) {
  teddy = obj.find((item) => item._id == cart[i]);
  return teddy.price;
}

let total;

function findTotal(arg) {
  total = 0;
  for (i = 0; i < cart.length; i++) {
    findPrice(arg);
    total = total + teddy.price;

    console.log(teddy.price + " " + total);
  }
  return total;
}

function displayTotal() {
  document.getElementById("total-price").textContent = total + ' ' + '\u20AC';
}

// getOject

function getObject() {
  fetch("http://localhost:3000/api/teddies")
    .then(function (result) {
      if (result.ok) {
        return result.json();
      }
    })
    .then(function (data) {
        getCart();
        findAllNames(data);
        displayCart();
        findTotal(data);
        displayTotal();
    })
    .catch(function (error) {
        console.log("Une erreur s'est produite");
    });
}

getObject();