import { _supabase } from "./client.js";

const userList = document.getElementById("user-list");

async function getCurrentUserID() {
  const {data: { session },} = await _supabase.auth.getSession();
  return session ? session.user.id : null;
}

async function getUsers() {
  try {
    const { data: usersData, error } = await _supabase
      .from("user")
      .select("user_id, username, email");

    if (error) {
      throw error;
    }
    else {
      return usersData;
    }

    //users = usersData;
    //console.log("Users:", users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
  }
}

/*async function getUsersAndRender() {
  const currentUserID = await getCurrentUserID();
  console.log("Current User ID:", currentUserID);

  const { data, error } = await _supabase.from("user").select("*");

  
  if (error) {
    console.error("Error fetching users:", error.message);
    return;
  }

  userList.innerHTML = "";
  let user = await getUsers()
  data.forEach((user) => {
    console.log("User ID:", user);
    const li = document.createElement("li");
    li.innerHTML = `
        <span>${user.name}</span>
        <button class="followbutton" onclick="toggleFollow('${user.id}', '${currentUserID}')">${
      user.following ? "Unfollow" : "Follow"
    }</button>
        `;
    userList.appendChild(li);
  });
}*/
async function getUsersAndRender() {
  const currentUserID = await getCurrentUserID();
  console.log("Current User ID:", currentUserID);

  try {
    const { data: followedUsers, error } = await _supabase
      .from("user_relationships")
      .select("followed_id")
      .eq("follower_id", currentUserID);

    if (error) {
      console.error("Error fetching followed users:", error.message);
      return;
    }

    const followedUserIDs = followedUsers.map((row) => row.followed_id);

    const { data: usersData, error: usersError } = await _supabase
      .from("user")
      .select("user_id, username, email, language, bio")
      .in("user_id", followedUserIDs);

    if (usersError) {
      console.error("Error fetching users:", usersError.message);
      return;
    }

    userList.innerHTML = "";
    usersData.forEach((user) => {
      console.log("User ID:", user.user_id);
      const li = document.createElement("li");
      li.innerHTML = `
          <span>${user.username}</span>
          <button class="followbutton" onclick="toggleFollow('${user.user_id}', '${currentUserID}')">${
        user.following ? "Unfollow" : "Follow"
      }</button>
          `;
      userList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching followed users:", error.message);
  }
}

/*async function toggleFollow(userID, currentUserID) {
  console.log("User ID:", userID);
  console.log("Current User ID:", currentUserID);

  const { data: relationship, error } = await _supabase
    .from("user_relationships")
    .select("*")
    .eq("follower_id", currentUserID)
    .eq("followed_id", userID)
    .single();

  console.log("Relationship:", relationship);
  console.log("Error:", error);

  if (error) {
    console.error("Error fetching user relationship:", error.message);
    return;
  }

  if (relationship) {
    console.log("Unfollowing user:", userID);
    await _supabase.from("user_relationships").delete().eq("id", relationship.id);
  } else {
    console.log("Following user:", userID);
    await _supabase
      .from("user_relationships")
      .insert([{ follower_id: currentUserID, followed_id: userID }]);
  }
  await getUsersAndRender();
}*/
async function toggleFollow(userID, currentUserID) {
  console.log("User ID:", userID);
  console.log("Current User ID:", currentUserID);

  const { data: relationship, error } = await _supabase
    .from("user_relationships")
    .select("*")
    .eq("follower_id", currentUserID)
    .eq("followed_id", userID)
    .single();

  console.log("Relationship:", relationship);
  console.log("Error:", error);

  if (error) {
    console.error("Error fetching user relationship:", error.message);
    return;
  }

  if (relationship) {
    console.log("Unfollowing user:", userID);
    await _supabase.from("user_relationships").delete().eq("id", relationship.id);
  } else {
    console.log("Following user:", userID);

    // Log the user ID of the account you are following
    console.log("Followed User ID:", userID);

    await _supabase
      .from("user_relationships")
      .insert([{ follower_id: currentUserID, followed_id: userID }]);
  }

  await getUsersAndRender();
}



getUsersAndRender();

async function searchUsers(query) {
  try {
    const { data: usersData, error } = await _supabase
      .from("user")
      .select("user_id, username, email")
      .ilike("username", `%${query}%`);

    if (error) {
      throw error;
    } else {
      return usersData;
    }
  } catch (error) {
    console.error("Error searching users:", error.message);
  }
}

async function searchUsersAndRender(query) {
  const currentUserID = await getCurrentUserID();
  const users = await searchUsers(query);

  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <span>${user.username}</span>
        <button class="followbutton" onclick="goToUserProfile('${user.user_id}')">View Profile</button>
        `;
    userList.appendChild(li);
  });
}

async function goToUserProfile(userID) {
  // Redirect to user profile page
  window.location.href = `searchprofile.html?user_id=${userID}`;
}