// cart functions

let cart =[]; // warning variable globale


// get cart

function getCart() {
  cart = JSON.parse(localStorage.getItem("cart"));
}


// store cart

function storeCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}




// -- cart functions


// find names of items in the cart

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
  }
  return cartNames;
}


// display cart items

function displayCart() {
  if (!cart.length) {
    document.getElementById("cart-items").textContent = "is empty";
  } else if (cart.length > 1) {
    document.getElementById("cart-items").textContent = "has" + " " + cartNames.length + " " + "items" + "," + " " + cartNames.join(", ");
  } else {
    document.getElementById("cart-items").textContent = "has" + " " + cartNames.length + " " + "item" + "," + " " + cartNames.join(", ");
  }
}


// find price, find total price, display total

function findPrice(obj) {
  teddy = obj.find((item) => item._id == cart[i]);
  return teddy.price;
}

let total;

function findTotal(arg) {
  sum = 0;
  for (i = 0; i < cart.length; i++) {
    findPrice(arg);
    sum = sum + teddy.price;
  }
  return total = sum / 100;
}

function displayTotal() {
  document.getElementById("total-price").textContent = total + ' ' + '\u20AC';
}


// get oject from API

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
        return;
    })
    .catch(function (error) {
        console.log("Une erreur s'est produite");
    });
}

getObject();


// -- contact form functions

const contact = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  email: ""
};


// security on submit button

function disableSubmit(disabled) {
  if (disabled) {
    document.getElementById("submit").setAttribute("disabled", true);
  } else {
    document.getElementById("submit").removeAttribute("disabled");
  }
}


// check inputs values

function checkForm() {
  const fn = document.getElementById("firstname").checkValidity();
  const ln = document.getElementById("lastname").checkValidity();
  const c = document.getElementById("city").checkValidity();
  const a = document.getElementById("address").checkValidity();
  const e = document.getElementById("email").checkValidity();
  if (!fn || !ln || !a || !c || !e) {
    formIsValid = false;
    disableSubmit(true);
  } else {
    formIsValid = true;
    disableSubmit(false);
  }
}


document.getElementById("firstname").addEventListener("change", function (e) {
  contact.firstName = e.target.value;
  checkForm();
});

document.getElementById("lastname").addEventListener("change", function (e) {
  contact.lastName = e.target.value;
  checkForm();
});

document.getElementById("address").addEventListener("change", function (e) {
  contact.address = e.target.value;
  checkForm();
});

document.getElementById("city").addEventListener("change", function (e) {
  contact.city = e.target.value;
  checkForm();
});


// check email data

document.getElementById("email").addEventListener("change", function (e) {
  regex = /[a-zA-Z0-9][a-zA-Z0-9_\-\.]*@[a-zA-Z0-9][a-zA-Z0-9_\-\.]*\.[a-zA-Z]{2,5}/;
  if (regex.test(e.target.value)) {
    contact.email = e.target.value;
  } else {
    alert("Please fill a valid email id (e.g : user@domain.com )");
  }
  checkForm();
});


// assign cart value to products array

function getProductsArray() {
  getCart();
  products = cart;
  return products;
}

function checkProductsArray() {
  getProductsArray();
  if (Array.isArray(products)) {
    arrayIsValid = true;
  } else {
    arrayIsValid = false;
  }
}


// check order validity

function checkOrder() {
  if (!formIsValid || !arrayIsValid) {
    alert("Order has failed, please check out your informations");
    orderIsValid = false;
  } else {
    orderIsValid = true;
  }
}


// store order id and total price for confirmation page

function storeOrder(arg) {
  const orderId = arg.orderId;
  localStorage.setItem("orderId", orderId);
  localStorage.setItem("total", JSON.stringify(total));
}


// API request to send the contact object

function sendContact() {
  fetch("http://localhost:3000/api/teddies/order", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'contact': contact, 'products': products})
  })
  .then(function(result) {
    if (result.ok) {
      return result.json();
    }
  })
  .then(function (value) {
    console.log(value);
    console.log(value.orderId);
    storeOrder(value);
    location.href="confirmation.html";
  })
  .catch(function (error) {
    alert("The order has failed");
  });
}

document.getElementById("submit").addEventListener("click", function (e) {
  e.preventDefault();
  checkForm();
  checkProductsArray();
  checkOrder();
  if (orderIsValid == true) {
    sendContact();
  }
});