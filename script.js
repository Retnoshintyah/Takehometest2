// Fetch and display user data
const userTableBody = document.querySelector("#userTable tbody");

// Function to render users in the table
const renderUsers = (users) => {
  userTableBody.innerHTML = ""; // Clear the table
  users.forEach(user => {
    const { name, email, phone } = user;
    userTableBody.innerHTML += `
      <tr>
        <td>${name}</td>
        <td>${email}</td>
        <td>${phone}</td>
      </tr>
    `;
  });
};

// Fetch users from API and localStorage
const fetchUsers = async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const apiUsers = await response.json();

    // Get users from localStorage
    const localUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Combine API users and localStorage users
    const allUsers = [...apiUsers, ...localUsers];

    // Save combined users to a global variable for reuse
    window.allUsers = allUsers;

    // Render users in the table
    renderUsers(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// Call the fetchUsers function
fetchUsers();

// Form validation and adding new user
const userForm = document.querySelector("#userForm");
userForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const phone = document.querySelector("#phone").value.trim();

  let isValid = true;

  // Validate name
  if (!name) {
    document.querySelector("#nameError").textContent = "Name is required.";
    isValid = false;
  } else {
    document.querySelector("#nameError").textContent = "";
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    document.querySelector("#emailError").textContent = "Email is required.";
    isValid = false;
  } else if (!emailRegex.test(email)) {
    document.querySelector("#emailError").textContent = "Invalid email format.";
    isValid = false;
  } else {
    document.querySelector("#emailError").textContent = "";
  }

  if (isValid) {
    // Create new user object
    const newUser = { name, email, phone };

    // Get existing users from localStorage
    const localUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Add the new user to the localStorage array
    localUsers.push(newUser);

    // Save updated users to localStorage
    localStorage.setItem("users", JSON.stringify(localUsers));

    // Update the global allUsers array
    window.allUsers = [...window.allUsers, newUser];

    // Render all users (API + localStorage) in the table
    renderUsers(window.allUsers);

    // Reset form
    userForm.reset();
  }
});