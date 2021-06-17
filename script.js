/* -- product functions -- */


/* get page param -- extract the product id from the url parameters */

function getPageParam() {
  const urlParams = new URL(document.location).searchParams;
  const pageParam = urlParams.get("id");
  return pageParam;
}

const pageParam = getPageParam();


/* get item url -- assign the api url and the product
specific api url to a variable */

const apiUrl = "http://localhost:3000/api/teddies/";
const itemUrl = apiUrl + pageParam;


/* display the product image -- assign the image url from
the api, fit to the responsive rules, handles the off-center
image of product 5beaaa8f1c9d440000a57d95 */

function displayImg(arg) {
  const itemImg = arg.imageUrl;
  const productImg = document.querySelectorAll(".pdt__preview");
  productImg[0].setAttribute("src", itemImg);
  productImg[1].setAttribute("src", itemImg);
  if (pageParam == "5beaaa8f1c9d440000a57d95") {
    productImg[0].style.objectPosition = "left";
    productImg[0].style.minWidth = "350px";
    productImg[1].style.objectPosition = "left";
  }
}


/* display item name */

function displayName(arg) {
  const itemName = arg.name;
  const productName = document.getElementById('product__name');
  productName.textContent = itemName;
}


/* display item price */

function displayPrice(arg) {
  const itemPrice = arg.price;
  const productPrice = document.getElementById('product__price');
  productPrice.textContent = (itemPrice / 100) + ' ' + '\u20AC';
}


/* display item description */

function displayDesc(arg) {
  const itemDesc = arg.description;
  const productDesc = document.getElementById('product__description');
  productDesc.textContent = itemDesc;
}


/* display item options and hide the unused options html elements */

function displayOptions(arg) {
  const itemOptions = arg.colors;
  const optionsList = document.getElementsByClassName("option-list");
  for (let i = 0, j = optionsList.length; i < j; i++) {
    optionsList[i].value = itemOptions[i];
    optionsList[i].textContent = itemOptions[i];
    if (optionsList[i].textContent == "") {
      optionsList[i].setAttribute("hidden", true);
    }
  }
}


/* request to the api the display the product on page load */

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
      displayOptions(value);
    });
}

displayItem();




/* -- cart functions -- */

const localStorageCartKey = "cart";

/* get cart -- load the cart from the storage */ 

function getCart() {
  return JSON.parse(localStorage.getItem(localStorageCartKey)); 
}


/* store cart -- save the cart in the storage, we use
an argument to pass the cart as a local variable */

function storeCart(arg) {
  localStorage.setItem(localStorageCartKey, JSON.stringify(arg));
}


// -- cart icon functions

const cartIconLength = document.querySelector('.header__cart-length');

/* show how many items are in the cart -- we load the cart from storage,
update the cart icon content, if the cart is empty we hide the cart icon, 
otherwise we display it */

function displayCartIcon() {
  const cart = getCart();
  cartIconLength.textContent = cart.length;
  if (!cart.length) {
    cartIconLength.style.visibility = 'hidden';
  } else {
    cartIconLength.style.visibility = 'visible';
  }
}


/* modify the cart icon style to fit the content, according
to number of items in the cart */

function modifyCartIcon() {
  const cart = getCart();
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


/* find product to remove - we search the first cart element
that matches the product id in the url parameters */

function getIndexOfElement() {
  const cart = getCart();
  const ind = cart.indexOf(pageParam);
  return ind;
}


/* handle remove button -- if the cart is empty or the product 
is not in the cart, then we disable the remove button */

function handleRemoveButton() {
  const cart = getCart();
  const ind = getIndexOfElement();
  if (!cart.length || ind == -1) {
    document.getElementById('rmv-btn').setAttribute('disabled', true);
  }
}


/* update the cart icon and remove button according to the number 
of items in the cart */

function checkCart() {
  displayCartIcon();
  modifyCartIcon();
  handleRemoveButton();
}

/* on page load, if a cart entry in the storage does not exist or returns
an error, then create an empty cart entry, otherwise update the cart icon
and remove button */

function cartInit() {
  let cartStorage = localStorage.getItem(localStorageCartKey);
  if(cartStorage == null || !cartStorage || cartStorage == undefined) {
    let cart = [];
    localStorage.setItem(localStorageCartKey, JSON.stringify(cart));
    checkCart();
  } else {
    checkCart();
  }
}

cartInit();


/* event add product to cart - load the cart from the local storage, 
push product id it into the cart, save the cart in the local storage, 
enable the remove button and update the cart icon */

document.getElementById('add-btn').addEventListener('click', function() {
  let cart = getCart();
  console.log(cart);
  cart.push(pageParam);
  console.log(cart);
  storeCart(cart);
  document.getElementById('rmv-btn').removeAttribute('disabled');
  checkCart();
});


/* remove product -- we delete only the first matching product and 
return the cart value to be used by the storeCart function,
if this product is in the cart then ind is greater or
equal to 0, otherwise ind is equal to -1 and we do nothing */

function removeElement() {
  const ind = getIndexOfElement();
  if (ind > -1) {
    let cart = getCart();
    console.log(cart);
    cart.splice(ind, 1);
    console.log(cart);
    return cart;
  }
}


/* event remove from cart - remove the first matching
element from the cart, save the cart, update the cart icon 
and the remove button */

document.getElementById('rmv-btn').addEventListener('click', function(){
  let cart = removeElement();
  storeCart(cart);
  checkCart();
});