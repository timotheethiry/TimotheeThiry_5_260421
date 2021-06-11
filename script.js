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


// add to cart

document.getElementById('add-btn').addEventListener('click', function() { 
  getCart();
  getPageParam();
  cart.push(pageParam);
  console.log(cart);
  storeCart();
});