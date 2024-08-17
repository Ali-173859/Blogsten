// Correct import statement
import {
  ref,
  storage,
  uploadBytes,
  getDownloadURL,
  db,
  collection,
  addDoc,
  getDocs,
} from './utils/utils.js'; // Ensure this path is correct

const blogForm = document.getElementById('blog_form');

// Form submission event listener
blogForm.addEventListener('submit', async function(event) {
  event.preventDefault();

  try {
    // Get form values
    const imageFile = document.getElementById('blogImage').files[0];
    const title = document.getElementById('blogTitle').value;
    const description = document.getElementById('blogDesc').value;
    const category = document.getElementById('blogCategory').value;

    // Validate form data (ensure all fields are filled)
    if (!imageFile || !title || !description || !category) {
      alert('Please fill all fields.');
      return;
    }

    // Upload image to Firebase Storage
    const imageRef = ref(storage, 'blog_images/' + imageFile.name);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    // Create blog object
    const blog = {
      image: imageUrl,
      title: title,
      description: description,
      category: category,
    };

    // Save blog to Firestore database
    const docRef = await addDoc(collection(db, 'blogs'), blog);

    // Redirect to the index page (assuming index.html exists)
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error creating blog:', error);
    alert('Failed to create blog. Please try again later.');
  }
});

// Function to fetch and display blogs on index.html
async function displayBlogs() {
  const blogsContainer = document.getElementById('blogs_container');

  try {
    // Fetch all blogs from Firestore
    const querySnapshot = await getDocs(collection(db, 'blogs'));
    blogsContainer.innerHTML = ''; // Clear previous content

    querySnapshot.forEach((doc) => {
      const blog = doc.data();
      // Create HTML for each blog
      const blogCard = `
        <div class="bg-white shadow-md rounded-lg overflow-hidden mb-4">
          <img src="${blog.image}" alt="Blog Image" class="w-full h-48 object-cover">
          <div class="p-4">
            <h2 class="text-xl font-bold mb-2">${blog.title}</h2>
            <p class="text-gray-600 mb-2">${blog.description}</p>
            <p class="text-gray-600 mb-2">Category: ${blog.category}</p>
          </div>
        </div>
      `;
      // Append blog card to container
      blogsContainer.innerHTML += blogCard;
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    alert('Failed to fetch blogs. Please try again later.');
  }
}

// Call displayBlogs function to load blogs when page loads
displayBlogs();
