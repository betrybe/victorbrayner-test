function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {

  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  cartSaved.forEach((item) => {
    if (item.sku === event.target.innerText.split(' ')[1]){
      const index = cartSaved.indexOf(item)
      cartSaved.splice(index, 1)
      localStorage.setItem('cart', JSON.stringify(cartSaved))
    }
  })
  cart.removeChild(event.target)
  totalPriceOfItems(-(event.target.innerText.split('$')[1]))
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchCountries(){
  const keyword = 'computador'
  const res = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${keyword}`);
  const json = await res.json();
  
  allProducts = Array.from(json.results)
  // console.log(allProducts)
  // console.log(Object.keys(localStorage))

  if (localStorage.getItem('cart')) {
    const localProduct = JSON.parse(localStorage.getItem('cart'))
    localProduct.forEach((product) => {
      cart.appendChild(createCartItemElement(product));
      totalPriceOfItems(product.salePrice)
    })
  }

   
  render();
}

function render(){
  allProducts.forEach((product) => {
    let obj = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail
    }
    // console.log(obj)
    items.appendChild(createProductItemElement(obj));

  })
  handleButtons()
}

function handleButtons(){
  const cartBtn = Array.from(items.querySelectorAll('.item__add'));
  
  cartBtn.forEach((button, index) => {
    button.addEventListener('click',() => productToCart(index));
  })
  
  emptyCart.addEventListener('click', removeItemsFromCart)
  
  function removeItemsFromCart(){
    const cItemsArr = Array.from(cart.querySelectorAll('.cart__item'))
    localStorage.removeItem('cart')
    cItemsArr.forEach((item) => {
      cart.removeChild(item)
    })
    cartPrice = 0
  }
}

async function productToCart(index){
  const itemID = allProducts[index].id
  const res = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const json = await res.json();
  
  let obj = {
    sku: json.id,
    name: json.title,
    salePrice: json.price
  }
  cart.appendChild(createCartItemElement(obj));
  cartSaved = [...cartSaved, obj]
  localStorage.setItem('cart', JSON.stringify(cartSaved))
  totalPriceOfItems(obj.salePrice)
} 
function totalPriceOfItems(price){
  cartPrice += price
  totalPrice.innerText = `${cartPrice}`
  // li.className = 'cart__item';
  // li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  // return li;
}

let items = null
let cart = null
let allProducts = null
let emptyCart = null
let cartSaved = []
let cartPrice = 0
let totalPrice = null

window.onload = () => {
  items = document.querySelector(".items")
  cart = document.querySelector(".cart__items")
  emptyCart = document.querySelector(".empty-cart")
  totalPrice = document.querySelector(".total-price")
  fetchCountries()
 };
