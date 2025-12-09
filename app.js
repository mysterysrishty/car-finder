const cars = [
  {
    id: 1,
    name: "Maruti Swift",
    brand: "Maruti",
    fuel: "Petrol",
    price: 700000,
    img: "images/swift.jpg"
  },
  {
    id: 2,
    name: "Tata Nexon EV",
    brand: "Tata",
    fuel: "Electric",
    price: 1400000,
    img: "images/nexon.jpg"
  },
  {
    id: 3,
    name: "Hyundai Creta",
    brand: "Hyundai",
    fuel: "Diesel",
    price: 1500000,
    img: "images/creta.jpg"
  },
  {
    id: 4,
    name: "Honda City",
    brand: "Honda",
    fuel: "Petrol",
    price: 1200000,
    img: "images/city.jpg"
  }
];

let cart = [];

// Load cart from localStorage
const savedCart = localStorage.getItem("carCart");
if (savedCart) {
  try {
    cart = JSON.parse(savedCart);
  } catch {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem("carCart", JSON.stringify(cart));
}

function displayCars(carArray) {
  const list = document.getElementById("carList");
  list.innerHTML = "";

  carArray.forEach((car) => {
    const div = document.createElement("div");
    div.className = "car-card";

    div.innerHTML = `
      <img src="${car.img}" alt="${car.name}" />
      <h3>${car.name}</h3>
      <p>Brand: ${car.brand}</p>
      <p>Fuel: ${car.fuel}</p>
      <p class="price">₹${car.price.toLocaleString()}</p>
      <button data-id="${car.id}">Add to Cart</button>
    `;

    div.querySelector("button").addEventListener("click", () => addToCart(car.id));
    list.appendChild(div);
  });
}

function addToCart(carId) {
  const car = cars.find(c => c.id === carId);
  if (!car) return;

  if (cart.some(item => item.id === carId)) {
    alert("This car is already in your cart!");
    return;
  }

  cart.push(car);
  saveCart();
  renderCart();
}

function removeFromCart(carId) {
  cart = cart.filter(item => item.id !== carId);
  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById("cartList");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  cartList.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price;
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${item.name}</span>
      <span>₹${item.price.toLocaleString()}
        <button class="remove-btn" data-id="${item.id}">✕</button>
      </span>
    `;

    li.querySelector("button").addEventListener("click", () => removeFromCart(item.id));
    cartList.appendChild(li);
  });

  cartCount.textContent = cart.length;
  cartTotal.textContent = total.toLocaleString();
}

// Filters
document.getElementById("searchInput").addEventListener("input", applyFilters);
document.querySelectorAll(".filters select").forEach(f => f.addEventListener("change", applyFilters));

function applyFilters() {
  const brand = document.getElementById("brandFilter").value;
  const fuel = document.getElementById("fuelFilter").value;
  const searchText = document.getElementById("searchInput").value.toLowerCase();

  let result = cars.filter(c => c.name.toLowerCase().includes(searchText));

  if (brand) result = result.filter(c => c.brand === brand);
  if (fuel) result = result.filter(c => c.fuel === fuel);

  displayCars(result);
}

// Clear cart button
document.getElementById("clearCart").addEventListener("click", () => {
  if (cart.length > 0 && confirm("Clear all selected cars?")) clearCart();
});

// Initial calls
displayCars(cars);
renderCart();
