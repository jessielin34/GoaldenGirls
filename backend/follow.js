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

async function getUsersAndRender() {
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
}

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
    await _supabase
      .from("user_relationships")
      .insert([{ follower_id: currentUserID, followed_id: userID }]);
  }
  await getUsersAndRender();
}

getUsersAndRender();