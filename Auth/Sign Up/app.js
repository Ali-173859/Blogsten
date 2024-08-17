import {
    auth,
    createUserWithEmailAndPassword,
    doc,
    setDoc,
    db,
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
  } from "../../Utils/utils.js";
  
  // Select the sign-up form and submit button
  const signup_form = document.getElementById("signup_form");
  const submit_btn = document.getElementById("submit_btn");
  
  // Add event listener to the form submission
  signup_form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission
  
    // Get form values
    const img = e.target[0].files[0];
    const email = e.target[1].value;
    const password = e.target[2].value;
    const firstName = e.target[4].value;
    const lastName = e.target[5].value;
    const phone = e.target[6].value;
    const company = e.target[7].value;
  
    // Create user information object
    const userInfo = {
      img,
      email,
      password,
      firstName,
      lastName,
      phone,
      company,
    };
  
    // Disable submit button and show loading text
    submit_btn.disabled = true;
    submit_btn.innerText = "Loading...";
  
    // Create a new user account with email and password
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userRef = ref(storage, `user/${user.uid}`);
  
        // Upload user image to Firebase Storage
        uploadBytes(userRef, img)
          .then(() => {
            // Get the download URL of the uploaded image
            getDownloadURL(userRef)
              .then((url) => {
                userInfo.img = url; // Update user info with image URL
  
                // Create a document reference for the user in Firestore
                const userDbRef = doc(db, "users", user.uid);
  
                // Set the user information in Firestore
                setDoc(userDbRef, userInfo)
                  .then(() => {
                    console.log("User data saved to Firestore");
                    window.location.href = "/"; // Redirect to home page
                    submit_btn.disabled = false;
                    submit_btn.innerText = "Submit";
                  })
                  .catch((error) => {
                    console.error("Error saving user data to Firestore: ", error);
                    submit_btn.disabled = false;
                    submit_btn.innerText = "Submit";
                  });
              })
              .catch((error) => {
                console.error("Error getting download URL: ", error);
                submit_btn.disabled = false;
                submit_btn.innerText = "Submit";
              });
          })
          .catch((error) => {
            console.error("Error uploading user image: ", error);
            submit_btn.disabled = false;
            submit_btn.innerText = "Submit";
          });
      })
      .catch((error) => {
        alert(error.message);
        submit_btn.disabled = false;
        submit_btn.innerText = "Submit";
      });
  });
  