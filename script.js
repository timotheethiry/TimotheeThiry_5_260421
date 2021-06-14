// -- product functions 

// display item img

const productImg = document.getElementById("product__img");
let itemImg;

function displayImg(arg) {
  itemImg = arg.imageUrl;
  productImg.setAttribute("src", itemImg);
}

// display item name

const productName = document.getElementById('product__name');
let itemName;

function displayName(arg) {
  itemName = arg.name;
  productName.textContent = itemName;
}

// display item price

const productPrice = document.getElementById('product__price');
let itemPrice;

function displayPrice(arg) {
  itemPrice = arg.price;
  productPrice.textContent = itemPrice + ' ' + '\u20AC';
}


//display item description

const productDesc = document.getElementById('product__description');
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


// handle cart length

const cartIconLength = document.querySelector('.header__cart-length');

function displayCartIcon() {
  if (!cart.length) {
    cartIconLength.style.visibility = 'hidden';
  } else {
    cartIconLength.style.visibility = 'visible';
  }
}

function modifyCartIcon() {
  if (cart.length < 10) {
    cartIconLength.style.borderRadius = "10px";
    cartIconLength.style.height = "$hg-cart";
    cartIconLength.style.padding = "1.5px 0 0 5px";
  } else if (cart.length >= 10) {
    cartIconLength.style.borderRadius = '4px';
    cartIconLength.style.padding = '1px 0 0 2px';
  } else if (cart.length >= 100) {
    cartIconLength.style.heigth = '20px';
    cartIconLength.style.padding = '3.5px 5px 0 5px';
    cartIconLength.style.borderRadius = '4px';
  }
}

function checkCart() {
  getCart();
  cartIconLength.textContent = cart.length;
  displayCartIcon();
  modifyCartIcon();
  handleRemoveButton();
}

checkCart();


// handle remove button


function getIndexOfElement() {
  return ind = cart.indexOf(pageParam);
}

function handleRemoveButton() {
  getCart();
  getIndexOfElement();
  if (document.getElementById('rmv-btn') != null && !cart.length || ind == -1) {
    document.getElementById('rmv-btn').setAttribute('disabled', true);
  }
}

// remove 1 element

function removeElement() {
  getIndexOfElement();
  if (ind > -1) {
    cart.splice(ind, 1);
  }
}


// event add to cart

document.getElementById('add-btn').addEventListener('click', function() { 
  getCart();
  getPageParam();
  cart.push(pageParam);
  storeCart();
  document.getElementById('rmv-btn').removeAttribute('disabled');
  checkCart();
});


// event remove from cart

document.getElementById('rmv-btn').addEventListener('click', function(str){
  getCart();
  getPageParam();
  removeElement();
  storeCart();
  handleRemoveButton();
  checkCart();
});