import {_supabase} from './client.js';

let signup = document.querySelector("#submit");
signup.addEventListener("click", async(e)=>{
    e.preventDefault();
    let email = document.querySelector("#inputemail").value;
    let password = document.querySelector("#inputpassword").value;
    console.log("working")
    const { data, error } = await _supabase.auth.signUp({
        email: email,
        password: password,
    });
    if (data)console.log(data);
    else console.log(error);
    window.location.replace("http://127.0.0.1:3000/profile.html"); //hard-coded
});

