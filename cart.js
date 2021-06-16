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

//let teddy = 0;
//let i = 0;

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
    } else {
        document.getElementById("cart-items").textContent = "has" + " " + cartNames.length + " " + "items" + "," + " " + cartNames.join(", ");
    }
}


// find price, find total price, display total

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
  }
  return total;
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

// check order validity

function checkOrder() {
  if (!formIsValid || !arrayIsValid) {
    alert("Order has failed, please check out your informations");
    orderIsValid = false;
  } else {
    //alert("Order is valid");
    orderIsValid = true;
  }
}


// store order_id

function storeOrderId(arg) {
  const orderId = arg.orderId;
  localStorage.setItem("orderId", JSON.stringify(orderId));
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
    storeOrderId(value);
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