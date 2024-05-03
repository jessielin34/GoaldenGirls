import { _supabase } from "./client.js";

const userList = document.getElementById('user-list');

async function getUsersAndRender() {
    const {data, error} = await _supabase.from('user').select('*');

    if (error) {
        console.error('Error fetching users:', error.message);
        return;
    }

    userList.innerHTML = '';

    data.forEach(user=> {
        const li = document.createElement('li');
        li.innerHTML =  `
        <span>${user.name}</span>
        <button onclick="toggleFollow('${user.id}')">${user.following ? 'Unfollow' : 'Follow'}</button>
        `;
        userList.appendChild(li);
    });
}

async function toggleFollow(userID) {
    const {data, error} = await _supabase.from('user_relationships').select('*').eq('follower_id', userID).single();

    if (error) {
        console.error('Error fetching user relationship:', error.message);
        return;
    }

    if (data) {
        await _supabase.from('user_relationships').delete().eq('id', data.id);
    }
    else {
        await _supabase.from('user_relationships').insert({follower_id: userID});
    }
    await getUsersAndRender();
}
getUsersAndRender();