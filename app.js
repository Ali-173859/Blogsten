import {
  auth,
  db,
  signOut,
  getDoc,
  doc,
  onAuthStateChanged,
  getDocs,
  collection,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "./utils/utils.js";

const logoutBtn = document.getElementById("logout_btn");
const loginLink = document.getElementById("login_link");
const userImg = document.getElementById("user_img");
const myEventsBtn = document.getElementById("myevents_btn");
const createEventBtn = document.getElementById("create_event_btn");
const eventsCardsContainer = document.getElementById("events_cards_container");
const productsCardsContainer = document.getElementById("products_cards_container");
const cartContainer = document.getElementById("cart_container");

let cart = []; // Initialize cart as an empty array

// Fetch and display events and products when the page loads
getAllEvents();
getAllProducts();

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const uid = user.uid;
    loginLink.style.display = "none";
    userImg.style.display = "inline-block";
    logoutBtn.style.display = "inline-block";
    myEventsBtn.style.display = "inline-block";
    createEventBtn.style.display = "inline-block";
    cartContainer.style.display = "block"; // Show cart when logged in

    getUserInfo(uid);
  } else {
    // User is signed out
    loginLink.style.display = "inline-block";
    userImg.style.display = "none";
    logoutBtn.style.display = "none";
    myEventsBtn.style.display = "none";
    createEventBtn.style.display = "none";
    cartContainer.style.display = "none"; // Hide cart when logged out
  }
});

// Logout button event listener
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // Clear user data from localStorage
      localStorage.removeItem("userToken");
      // Redirect to the home page
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error during logout:", error);
    });
});

// Function to fetch user information and update UI
function getUserInfo(uid) {
  const userRef = doc(db, "users", uid);
  getDoc(userRef)
    .then((data) => {
      if (data.exists()) {
        const userData = data.data();
        if (userData.img) {
          userImg.src = userData.img;
        }
      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.error("Error getting user info:", error);
    });
}

// Function to fetch and display all events
async function getAllEvents() {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    eventsCardsContainer.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const event = doc.data();
      const { banner, title, createdByEmail, desc, time, date } = event;

      const card = `
        <div class="bg-white shadow-md rounded-lg overflow-hidden mb-4">
          <img src="${banner}" alt="Event Image" class="w-full h-48 object-cover" />
          <div class="p-4">
            <h2 class="text-xl font-bold mb-2">${title}</h2>
            <p class="text-gray-600 mb-2">Creator: ${createdByEmail}</p>
            <p class="text-gray-600 mb-2">${desc}</p>
            <div class="flex justify-between items-center">
              <button id="${doc.id}" onclick="likeEvent(this)" class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                Like
              </button>
            </div>
          </div>
        </div>`;

      eventsCardsContainer.innerHTML += card;
    });
  } catch (err) {
    console.error("Error fetching events:", err);
  }
}

// Function to fetch and display all products
async function getAllProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    productsCardsContainer.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const { image, title, price, description } = product;

      const card = `
        <div class="bg-white shadow-md rounded-lg overflow-hidden mb-4">
          <img src="${image}" alt="Product Image" class="w-full h-48 object-cover" />
          <div class="p-4">
            <h2 class="text-xl font-bold mb-2">${title}</h2>
            <p class="text-gray-600 mb-2">Price: $${price}</p>
            <p class="text-gray-600 mb-2">${description}</p>
            <div class="flex justify-between items-center">
              <button id="${doc.id}" onclick="addToCart(this)" class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                Add to Cart
              </button>
            </div>
          </div>
        </div>`;

      productsCardsContainer.innerHTML += card;
    });
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

// Function to add product to cart
function addToCart(button) {
  const productId = button.id;
  const product = findProductById(productId);

  if (product) {
    cart.push(product);
    updateCartUI();
  }
}

// Function to update cart UI
function updateCartUI() {
  cartContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    total += item.price;
    const cartItem = document.createElement("div");
    cartItem.innerHTML = `<p>${item.title} - $${item.price}</p>`;
    cartContainer.appendChild(cartItem);
  });
  cartContainer.innerHTML += `<p>Total: $${total}</p>`;
  saveCartToLocalStorage(); // Save cart to localStorage
}

// Placeholder function to find product details by ID
function findProductById(productId) {
  // Replace with actual logic to fetch product details from DB or API
  return {
    id: productId,
    title: "Sample Product",
    price: 100.0,
    // Add more fields as needed
  };
}

// Function to save cart to localStorage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to simulate checkout process
function checkout() {
  // Example: Clear cart and proceed to payment page or order confirmation
  cart = [];
  updateCartUI(); // Clear cart UI
  alert("Checkout completed!");
}
