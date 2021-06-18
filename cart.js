// -- summary cart functions

const localStorageCartKey = "cart";

/* get cart -- load the cart from the storage */ 

function getCart() {
  return JSON.parse(localStorage.getItem(localStorageCartKey)); 
}

console.log(getCart());

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
  console.log(cartNames);
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
  console.log(total);
}


// get data from API

function getData() {
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

getData();




// -- submit order functions

const contact = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  email: ""
};

const products = getCart();
console.log(products);


// security on submit button

function disableSubmit(disabled) {
  if (disabled) {
    document.getElementById("submit").setAttribute("disabled", true);
  } else {
    document.getElementById("submit").removeAttribute("disabled");
  }
}


/* check inputs values, return a true/false signal about
the inputs validity and handle the submit button accordingly */

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
  console.log(contact);
  return formIsValid;
}

checkForm();


/* event on the form input, update the contact object
and check the input */

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


/* check the email input and notice to the user if the email
is not valid */

document.getElementById("email").addEventListener("change", function (e) {
  const regex = /[a-zA-Z0-9][a-zA-Z0-9_\-\.]*@[a-zA-Z0-9][a-zA-Z0-9_\-\.]*\.[a-zA-Z]{2,5}/;
  if (regex.test(e.target.value)) {
    contact.email = e.target.value;
  } else {
    alert("Please fill a valid email id (e.g : user@domain.com )");
  }
  checkForm();
});


/* assign the cart value to the products variable 
and check if products is an array */

function checkProductsArray() {
  const products = getCart();
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


/* check order validity, both form and
products array must be valid */

function checkOrder() {
  const formIsValid = checkForm();
  const arrayIsValid = checkProductsArray();
  let orderIsValid;
  if (!formIsValid || !arrayIsValid) {
    alert("Order has failed, please check out your informations");
    orderIsValid = false;
  } else {
    orderIsValid = true;
  }
  return orderIsValid;
}


// store order id in the local storage

function storeOrderId(arg) {
  const orderId = arg.orderId;
  console.log(orderId);
  localStorage.setItem("orderId", orderId);
}


/* API request to send the contact object and
the products array */

function sendOrder() {
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
    storeOrderId(value);
    location.href="confirmation.html";
  })
  .catch(function (error) {
    alert("There was a server issue, the order has failed");
  });
}


/* event on the submit button, check the order
validity and send the order accordingly */

document.getElementById("submit").addEventListener("click", function (e) {
  e.preventDefault();
  const orderIsValid = checkOrder();
  console.log(orderIsValid);
  if (orderIsValid == true) {
    sendOrder();
  }
});