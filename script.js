// -- product functions 

// display item img

let productImg = document.getElementById("product__img");
let itemImg;

function displayImg(arg) {
  itemImg = arg.imageUrl;
  productImg.setAttribute("src", itemImg);
}

// display item name

let productName = document.getElementById('product__name');
let itemName;

function displayName(arg) {
  itemName = arg.name;
  productName.textContent = itemName;
}

// display item price

let productPrice = document.getElementById('product__price');
let itemPrice;

function displayPrice(arg) {
  itemPrice = arg.price;
  productPrice.textContent = itemPrice + ' ' + '\u20AC';
}


//display item description

let productDesc = document.getElementById('product__description');
let itemDesc;

function displayDesc(arg) {
  itemDesc = arg.description;
  productDesc.textContent = itemDesc;
}


//get page param

let urlParams;
let pageParam;

function getPageParam() {
  urlParams = new URL(document.location).searchParams;
  pageParam = urlParams.get("id");
}

//get item url

getPageParam();
let apiUrl = "http://localhost:3000/api/teddies/";
let itemUrl = apiUrl + pageParam;

// get item details

function displayItem() {
  fetch(itemUrl)
    .then(function (result) {
      if (result.ok) {
        return result.json();
      }
    })
    .then(function (value) {
      displayImg(value);
    displayName(value);
    displayPrice(value);
    displayDesc(value);
    })
    .catch(function (error) {
      // code erreur
    });
}

displayItem();




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


// display cart length

function checkCart() {
  getCart();
  document.querySelector('.header__cart-length').textContent = cart.length;
  if (!cart.length) {
    document.getElementById('rmv-btn').setAttribute('disabled', true);
    document.querySelector('.header__cart-length').style.visibility = 'hidden';
  } else {
    document.querySelector('.header__cart-length').style.visibility = 'visible';
  }
  if (cart.length >= 10) {
    document.querySelector('.header__cart-length').setAttribute('border-radius', '4px');
    document.querySelector('.header__cart-length').setAttribute('padding', '1px 0 0 2px');
  } else if (cart.length >= 100) {
    document.querySelector('.header__cart-length').setAttribute('heigth', '20px');
    document.querySelector('.header__cart-length').setAttribute('padding', '3.5px 5px 0 5px');
    document.querySelector('.header__cart-length').setAttribute('border-radius', '4px');
  }
}

checkCart();


// add to cart

document.getElementById('add-btn').addEventListener('click', function() { 
  getCart();
  getPageParam();
  cart.push(pageParam);
  storeCart();
  document.getElementById('rmv-btn').removeAttribute('disabled');
  checkCart();
});


// remove from cart

let ind;

document.getElementById('rmv-btn').addEventListener('click', function(str){
  getCart();
  getPageParam();
  ind = cart.indexOf(pageParam);
  if (ind > -1) {
    cart.splice(ind, 1);
  }
  storeCart();
  checkCart();
});