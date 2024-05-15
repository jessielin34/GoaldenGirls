import { _supabase } from "./client.js";

const searchInput = document.querySelector("#search");
const dropdownMenu = document.querySelector(".dropdown-menu");

let users = [];

async function getUsers() {
  try {
    const { data: usersData, error } = await _supabase
      .from("user")
      .select("user_id, username, email");

    if (error) {
      throw error;
    }

    users = usersData;
    console.log("Users:", users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
  }
}

function filterUsers(value) {
    return users.filter(
      (user) =>
        (user.email && user.email.toLowerCase().includes(value)) ||
        user.username.toLowerCase().includes(value)
    );
  }

function renderDropdown(filteredUsers) {
    dropdownMenu.innerHTML = ""; // Clear previous dropdown items
  
    if (filteredUsers.length === 0) {
      const dropdownItem = document.createElement("a");
      dropdownItem.classList.add("dropdown-item", "text-muted");
      dropdownItem.textContent = "No users found";
      dropdownMenu.appendChild(dropdownItem);
    } else {
      filteredUsers.forEach((user) => {
        const dropdownItem = document.createElement("div");
        dropdownItem.classList.add("dropdown-item", "d-flex", "justify-content-between", "align-items-center");
        
        const userInfo = document.createElement("span");
        userInfo.textContent = user.username;
        dropdownItem.appendChild(userInfo);
  
        const followButton = document.createElement("button");
        followButton.classList.add("btn", "btn-sm", "btn-primary");
        followButton.textContent = user.following ? "Unfollow" : "Follow";
        followButton.onclick = () => toggleFollow(user.user_id);
        dropdownItem.appendChild(followButton);
  
        dropdownMenu.appendChild(dropdownItem);
      });
    }
  
    // Show dropdown menu
    dropdownMenu.classList.add("show");
  }
  

searchInput.addEventListener("input", async (e) => {
  const value = e.target.value.trim().toLowerCase();
  
  if (!value) {
    // If search input is empty, hide dropdown menu
    dropdownMenu.classList.remove("show");
    return;
  }

  await getUsers(); // Fetch users again to ensure we have the latest data
  const filteredUsers = filterUsers(value);
  renderDropdown(filteredUsers);

  // Show dropdown menu if there are results
  if (filteredUsers.length > 0) {
    dropdownMenu.classList.add("show");
  } else {
    dropdownMenu.classList.remove("show");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  await getUsers();
});