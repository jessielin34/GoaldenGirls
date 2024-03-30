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
    if (error) {
        console.log(error);
        alert("Unable to register!");
    }
    else {
        console.log(data);
        alert("Verify your email!");
        window.location.replace("http://127.0.0.1:3000/index.html");
    }
});

