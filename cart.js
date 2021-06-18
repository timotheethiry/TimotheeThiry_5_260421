/* -- cart functions -- */

const localStorageCartKey = "cart";

/* get cart -- load the cart from the storage */ 

function getCart() {
  return JSON.parse(localStorage.getItem(localStorageCartKey)); 
}


// find the name of every item in the cart and display it

function findName(obj, i) {
  const cart = getCart();
  const teddy = obj.find((item) => item._id == cart[i]);
  return teddy.name;
}

function findAllNames(arg) {
  const cart = getCart();
  let cartNames = [];
  for (let i = 0, j = cart.length; i < j; i++) {
    const teddyName = findName(arg, i);
    cartNames.push(teddyName);
  }
  return cartNames;
}

function displayCart(arg) {
  const cart = getCart();
  const cartNames = findAllNames(arg);
  if (!cart.length) {
    document.getElementById("cart-items").textContent = "is empty";
  } else if (cart.length > 1) {
    document.getElementById("cart-items").textContent = "has" + " " + 
    cartNames.length + " " + "items" + "," + " " + cartNames.join(", ");
  } else {
    document.getElementById("cart-items").textContent = "has" + " " + 
    cartNames.length + " " + "item" + "," + " " + cartNames.join(", ");
  }
}


/* find the price of every item in the cart, 
calculate and display the total price*/

function findPrice(obj, i) {
  const cart = getCart();
  const teddy = obj.find((item) => item._id == cart[i]);
  return teddy.price;
}

function findTotal(arg) {
  const cart = getCart();
  let sum = 0;
  for (let i = 0, j = cart.length; i < j; i++) {
    const teddyPrice = findPrice(arg, i);
    sum = sum + teddyPrice;
  }
  return sum / 100;
}

function displayTotal(arg) {
  const total = findTotal(arg);
  document.getElementById("total-price").textContent = total + ' ' + '\u20AC';
  localStorage.setItem("total", JSON.stringify(total));
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
    displayCart(data);
    displayTotal(data);
  })
  .catch(function (error) {
console.log("Une erreur s'est produite");
  });
}

getObject();




// -- submit order functions

const contact = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  email: ""
};

const products = getCart();


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
  let formIsValid;
  if (!fn || !ln || !a || !c || !e) {
    formIsValid = false;
    disableSubmit(true);
  } else {
    formIsValid = true;
    disableSubmit(false);
  }
  return formIsValid;
}

checkForm();

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
  const regex = /[a-zA-Z0-9][a-zA-Z0-9_\-\.]*@[a-zA-Z0-9][a-zA-Z0-9_\-\.]*\.[a-zA-Z]{2,5}/;
  if (regex.test(e.target.value)) {
    contact.email = e.target.value;
  } else {
    alert("Please fill a valid email id (e.g : user@domain.com )");
  }
  checkForm();
});


// assign cart value to products array

/* function getProductsArray() {
  const cart = getCart();
  products = cart;
  return products;
} */

function checkProductsArray() {
  const products = getCart();
  console.log(products);
  let arrayIsValid;
  if (Array.isArray(products)) {
    arrayIsValid = true;
    console.log(arrayIsValid);
  } else {
    arrayIsValid = false;
    console.log(arrayIsValid);
  }
  return arrayIsValid;
}


// check order validity

function checkOrder() {
  const formIsValid = checkForm();
  const arrayIsValid = checkProductsArray();
  console.log(formIsValid);
  console.log(arrayIsValid);
  let orderIsValid;
  if (!formIsValid || !arrayIsValid) {
    alert("Order has failed, please check out your informations");
    orderIsValid = false;
  } else {
    orderIsValid = true;
  }
  return orderIsValid;
}


// store order id and total price for confirmation page

function storeOrderId(arg) {
  const orderId = arg.orderId;
  localStorage.setItem("orderId", orderId);
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
    //console.log(value.orderId);
    storeOrderId(value);
    location.href="confirmation.html";
  })
  .catch(function (error) {
    alert("The order has failed");
  });
}

document.getElementById("submit").addEventListener("click", function (e) {
  e.preventDefault();
  const orderIsValid = checkOrder();
  console.log(orderIsValid);
  if (orderIsValid == true) {
    sendContact();
  }
});