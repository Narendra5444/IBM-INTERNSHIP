const PRODUCTS = [
  { id: 1, name: "Classic White T-Shirt", category: "tshirt", sizes:["S","M","L","XL"], price: 699, rating: 4.4, img: "classicwhitetshirt.webp" },
  { id: 2, name: "Black Graphic Tee", category: "tshirt", sizes:["M","L","XL"], price: 899, rating: 4.2, img: "BlackGraphicTee.jpg" },
  { id: 3, name: "Oxford Blue Shirt", category: "shirt", sizes:["M","L","XL"], price: 1599, rating: 4.6, img: "OxfordBlueShirt.avif" },
  { id: 4, name: "Checked Casual Shirt", category: "shirt", sizes:["S","M","L"], price: 1399, rating: 4.3, img: "CheckedCasualShirt.webp" },
  { id: 5, name: "Slim Fit Jeans", category: "jeans", sizes:["M","L","XL"], price: 2199, rating: 4.5, img: "SlimFitJeans.webp" },
  { id: 6, name: "Distressed Denim", category: "jeans", sizes:["S","M","L","XL"], price: 2799, rating: 4.1, img: "DistressedDenim.jpg" },
  { id: 7, name: "Bomber Jacket", category: "jacket", sizes:["M","L"], price: 3499, rating: 4.7, img: "BomberJacket.avif" },
  { id: 8, name: "Hooded Windcheater", category: "jacket", sizes:["L","XL"], price: 2999, rating: 4.4, img: "HoodedWindcheater.webp" },
  { id: 9, name: "Running Sneakers", category: "shoes", sizes:["9","10","11"], price: 2499, rating: 4.6, img: "RunningSneakers.avif" },
  { id:10, name: "Leather Loafers", category: "shoes", sizes:["9","10"], price: 3999, rating: 4.8, img: "LeatherLoafers.jpg" },
];

let state = {
  search: "",
  category: "all",
  size: "all",
  price: "all",
  sort: "default",
};

const CART_KEY = "menswear_cart_v1";
let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

const grid = document.getElementById("grid");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const categoryFilter = document.getElementById("categoryFilter");
const sizeFilter = document.getElementById("sizeFilter");
const priceFilter = document.getElementById("priceFilter");
const sortOptions = document.getElementById("sortOptions");
const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartCount = document.getElementById("cartCount");
document.getElementById("year").textContent = new Date().getFullYear();

function renderProducts(list){
  grid.innerHTML = "";
  
  if(list.length === 0){
    grid.innerHTML = `<p style="grid-column:1/-1;color:#6b7280">No products found.</p>`;
    return;
  }

  list.forEach(p=>{
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img class="thumb" loading="lazy" src="${p.img}" alt="${p.name}">
      <div class="info">
        <div class="title">${p.name}</div>
        <div class="meta">
          <span class="price">₹${p.price}</span>
          <span class="rating">⭐ ${p.rating}</span>
        </div>
        <div class="sizes">${p.sizes.map(s=>`<span class="size">${s}</span>`).join("")}</div>
      </div>
      <button class="btn" data-id="${p.id}">Add to Cart</button>
    `;
    const btn = card.querySelector(".btn");
    btn.addEventListener("click", ()=> addToCart(p.id));
    grid.appendChild(card);
  });
}

function applyFilters(){
  let list = [...PRODUCTS];

  if(state.search.trim()){
    const q = state.search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q));
  }
  if(state.category !== "all") list = list.filter(p => p.category === state.category);
  if(state.size !== "all") list = list.filter(p => p.sizes.includes(state.size));
  if(state.price !== "all"){
    const [min, max] = state.price.split("-").map(Number);
    list = list.filter(p => p.price >= min && p.price <= max);
  }
  switch(state.sort){
    case "priceLow": list.sort((a,b)=>a.price-b.price); break;
    case "priceHigh": list.sort((a,b)=>b.price-a.price); break;
    case "ratingHigh": list.sort((a,b)=>b.rating-a.rating); break;
    case "nameAZ": list.sort((a,b)=>a.name.localeCompare(b.name)); break;
  }

  renderProducts(list);
}

function addToCart(id){
  id = Number(id); 
  const item = cart.find(i=>i.id === id);
  if(item){
    item.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  persistCart();
  updateCartUI();
  openCart();
}

function removeFromCart(id){
  id = Number(id);
  cart = cart.filter(i => i.id !== id);
  persistCart();
  updateCartUI();
}

function changeQty(id, delta){
  id = Number(id);
  const item = cart.find(i => i.id === id);
  if(!item) return;

  item.qty += delta;
  if(item.qty <= 0){
    removeFromCart(id);
  } else {
    persistCart();
    updateCartUI();
  }
}

function persistCart(){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartUI(){
  cartItems.innerHTML = "";
  let subtotal = 0, count = 0;

  if(cart.length===0){
    cartItems.innerHTML = `<p style="color:#6b7280">Your cart is empty.</p>`;
  } else {
    cart.forEach(({id, qty})=>{
      const p = PRODUCTS.find(x=>x.id===id);
      if(!p) return;
      subtotal += p.price * qty;
      count += qty;

      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div>
          <div style="font-weight:700">${p.name}</div>
          <div style="color:#6b7280">₹${p.price}</div>
          <div class="qty">
            <button aria-label="Decrease">−</button>
            <span>${qty}</span>
            <button aria-label="Increase">+</button>
          </div>
        </div>
        <button class="icon-btn" aria-label="Remove">✕</button>
      `;

      const buttons = el.querySelectorAll(".qty button");
      if(buttons.length === 2){
        const [dec, inc] = buttons;
        dec.addEventListener("click", ()=> changeQty(id, -1));
        inc.addEventListener("click", ()=> changeQty(id, +1));
      }

      const removeBtn = el.querySelector(".icon-btn");
      if(removeBtn){
        removeBtn.addEventListener("click", ()=> removeFromCart(id));
      }

      cartItems.appendChild(el);
    });
  }

  cartSubtotal.textContent = subtotal.toLocaleString();
  cartCount.textContent = count;
}

function openCart(){
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
  cartDrawer.setAttribute("aria-hidden","false");
  overlay.setAttribute("aria-hidden","false");
}

function closeCartDrawer(){
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
  cartDrawer.setAttribute("aria-hidden","true");
  overlay.setAttribute("aria-hidden","true");
}

searchInput.addEventListener("input", e=>{
  state.search = e.target.value;
  applyFilters();
});

clearSearch.addEventListener("click", ()=>{
  searchInput.value="";
  state.search="";
  applyFilters();
});

categoryFilter.addEventListener("change", e=>{
  state.category = e.target.value;
  applyFilters();
});

sizeFilter.addEventListener("change", e=>{
  state.size = e.target.value;
  applyFilters();
});

priceFilter.addEventListener("change", e=>{
  state.price = e.target.value;
  applyFilters();
});

sortOptions.addEventListener("change", e=>{
  state.sort = e.target.value;
  applyFilters();
});

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);
overlay.addEventListener("click", closeCartDrawer);

document.getElementById("checkoutBtn").addEventListener("click", ()=>{
  if(cart.length===0) return alert("Your cart is empty.");
  alert("Thanks for shopping with us! MENS WEAR(NS)");
  cart = [];
  persistCart();
  updateCartUI();
  closeCartDrawer();
});

window.addEventListener("DOMContentLoaded", ()=>{
  applyFilters(); 
  updateCartUI();
});
