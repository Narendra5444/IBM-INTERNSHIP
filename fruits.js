// Sample product data
const products = [
  { name: "Red Apple", category: "apple", price: 80, rating: 4.5, img: "apple.avif" },
  { name: "Green Apple", category: "apple", price: 60, rating: 4.2, img: "greenapple.jpeg" },
  { name: "Banana", category: "banana", price: 40, rating: 4.0, img: "banana.jpeg" },
  { name: "Orange", category: "citrus", price: 70, rating: 4.3, img: "orange.jpg" },
  { name: "Mango", category: "citrus", price: 120, rating: 4.8, img: "mango.jpg" },
  { name: "Blueberry", category: "berry", price: 150, rating: 4.9, img: "blueberry.jpg" },
  { name: "Strawberry", category: "berry", price: 130, rating: 4.7, img: "strawberries.jpg" },
  { name: "Grapes", category: "berry", price: 90, rating: 4.1, img: "grapes.jpg" },
];

// DOM references
const productGrid = document.getElementById("productGrid");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const sortOptions = document.getElementById("sortOptions");

// Render products
function renderProducts(list) {
  productGrid.innerHTML = "";
  if (list.length === 0) {
    productGrid.innerHTML = "<p>No products found</p>";
    return;
  }
  list.forEach(p => {
    const product = document.createElement("div");
    product.classList.add("product");
    product.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="product-details">
        <h4>${p.name}</h4>
        <p class="price">₹${p.price}</p>
        <p class="rating">⭐ ${p.rating}</p>
      </div>
    `;
    productGrid.appendChild(product);
  });
}

// Apply filters and sorting
function applyFilters() {
  let filtered = [...products];

  // Category filter
  const category = categoryFilter.value;
  if (category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }

  // Price filter
  const price = priceFilter.value;
  if (price !== "all") {
    const [min, max] = price.split("-").map(Number);
    filtered = filtered.filter(p => {
      if (max) return p.price >= min && p.price <= max;
      return p.price < min; // For below 50
    });
  }

  // Sorting
  const sortValue = sortOptions.value;
  if (sortValue === "priceLow") filtered.sort((a, b) => a.price - b.price);
  if (sortValue === "priceHigh") filtered.sort((a, b) => b.price - a.price);
  if (sortValue === "rating") filtered.sort((a, b) => b.rating - a.rating);

  renderProducts(filtered);
}

// Event listeners
categoryFilter.addEventListener("change", applyFilters);
priceFilter.addEventListener("change", applyFilters);
sortOptions.addEventListener("change", applyFilters);

// Initial render
renderProducts(products);
