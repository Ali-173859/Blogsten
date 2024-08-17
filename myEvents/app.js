import {
    db,
    collection,
    getDocs,
    ref,
    storage,
    getDownloadURL,
  } from './utils/utils.js'; // Adjust the path as necessary
  
  // DOM elements
  const productsCardsContainer = document.getElementById('products_cards_container');
  
  // Function to fetch and display all products
  async function getAllProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      productsCardsContainer.innerHTML = ''; // Clear existing content
  
      querySnapshot.forEach((doc) => {
        const product = doc.data();
        const { image, title, price, description } = product;
  
        // Create HTML for each product
        const productCard = `
          <div class="bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <img src="${image}" alt="${title}" class="w-full h-48 object-cover">
            <div class="p-4">
              <h2 class="text-xl font-bold mb-2">${title}</h2>
              <p class="text-gray-600 mb-2">Price: $${price.toFixed(2)}</p>
              <p class="text-gray-600 mb-2">${description}</p>
              <div class="flex justify-between items-center">
                <button id="${doc.id}" onclick="addToCart(this)" class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        `;
  
        // Append product card to container
        productsCardsContainer.innerHTML += productCard;
      });
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  }
  
  // Function to add a product to the cart
  function addToCart(button) {
    const productId = button.id;
    // Add your logic to handle adding the product to the cart
    alert(`Product ${productId} added to cart`);
  }
  
  // Initialize the product display on page load
  getAllProducts();
  