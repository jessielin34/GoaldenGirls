import { _supabase } from "./client.js";

const userProfileContainer = document.getElementById("user-profile");

async function getUserProfile(userID) {
  try {
    const { data: userData, error } = await _supabase
      .from("user")
      .select("username, email, language, bio")
      .eq("user_id", userID)
      .single();

    if (error) {
      throw error;
    } else {
      return userData;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
  }
}

async function renderUserProfile(userID) {
  const userProfile = await getUserProfile(userID);
  if (userProfile) {
    userProfileContainer.innerHTML = `
      <h1>${userProfile.username}</h1>
      <p>Email: ${userProfile.email}</p>
      <p>Language: ${userProfile.language}</p>
      <p>Bio: ${userProfile.bio}</p>
    `;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const userID = params.get("user_id");

  if (userID) {
    renderUserProfile(userID);
  } else {
    userProfileContainer.innerHTML = "<p>User ID not found</p>";
  }
});

// Get the dropdown menu
const dropdownMenu = document.getElementById("dropdown-menu");

// Simulate fetching user data from server
async function fetchUsers(searchTerm) {
  try {
    const { data: users, error } = await _supabase
      .from("user")
      .select("user_id, username, following")
      .ilike("username", `%${searchTerm}%`)
      .neq("user_id", userID)
      .order("username", { ascending: true });

    if (error) {
      throw error;
    } else {
      return users;
    }
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return [];
  }
}

// Function to render the dropdown
function renderDropdown(filteredUsers) {
  dropdownMenu.innerHTML = ""; // Clear previous dropdown items

  if (filteredUsers.length === 0) {
    const dropdownItem = document.createElement("a");
    dropdownItem.classList.add("dropdown-item", "text-muted");
    dropdownItem.textContent = "No users found";
    dropdownMenu.appendChild(dropdownItem);
  } else {
    filteredUsers.forEach((user) => {
      const dropdownItem = document.createElement("a");
      dropdownItem.classList.add("dropdown-item");
      dropdownItem.href = `searchprofile.html?id=${user.user_id}`; // Link to searchprofile.html
      dropdownItem.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <span>${user.username}</span>
          <button class="btn btn-sm btn-primary">${user.following ? "Unfollow" : "Follow"}</button>
        </div>
      `;
      dropdownMenu.appendChild(dropdownItem);
    });
  }

  // Show dropdown menu
  dropdownMenu.classList.add("show");
}

// Event listener for search input
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", async (event) => {
  const searchTerm = event.target.value;
  const filteredUsers = await fetchUsers(searchTerm);
  renderDropdown(filteredUsers);
});

// Close dropdown when clicking outside of it
document.addEventListener("click", (event) => {
  if (!event.target.matches("#search-input")) {
    dropdownMenu.classList.remove("show");
  }
});


