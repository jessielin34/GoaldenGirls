import {_supabase} from './client.js';

let signup = document.querySelector("#submit");
signup.addEventListener("click", signUp);
async function signUp(e){
    e.preventDefault();
    let username = document.querySelector("#inputusername").value;
    let email = document.querySelector("#inputemail").value;
    //check username is not taken
    try {
        let {data, error} = await _supabase
        .from("user")
        .select()
        .eq("username", username);
        if (data.length != 0) throw("Username already exists in database");
    } catch (err){
        alert("Username is taken!")
        console.error(err);
    }
    //check email is not taken
    try {
        let {data, error} = await _supabase
        .from("user")
        .select()
        .eq("email", email);
        if (data.length != 0) throw("Email already exists in database");
    } catch (err){
        alert("This email has already been registered! Please use a different email or try logging in.")
        console.error(err);
    }
    //check passwords match
    let password = document.querySelector("#inputpassword").value;
    let password2 = document.querySelector("#reenterpassword").value;
    if (password != password2){
        alert("Passwords are not matching!");
        return;
    }
    if (password.length < 6){
        alert("Passwords must be 6 characters or longer");
        return;
    }
    if (username != "" && email != "" && password != "" && password2 != ""){
        const { data, error } = await _supabase.auth.signUp({
            email: email,
            password: password,
        });
        if (error) {
            console.log(error);
            alert(error.message);
        }
        else {
            console.log(data.user);
            await addUserTable({data, username});
            alert("Verify your email!");
            window.location.replace("./login.html"); 
        }
        
    }
    else {
        alert("Input fields missing!");
    }
    
};

document.addEventListener("keydown", checkKey);
function checkKey(event){
    if(event.key == "Enter") signUp(event);
}
//set user information and default fields in user table
async function addUserTable(userData) {
    let {data, error} = await _supabase
    .from("user")
    .insert({
        user_id: userData.data.user.id,
        username: userData.username,
        email: userData.data.user.email,
        bio: "Let's get Goalden!",
        pro_pic: 'images/pro-img2.png',
        bg_pic: 'images/yellow-bg.png'
    })
    if (error) alert(error);
}
