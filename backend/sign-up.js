import {_supabase} from './client.js';

let signup = document.querySelector("#submit");
signup.addEventListener("click", async(e)=>{
    e.preventDefault();
    let email = document.querySelector("#inputemail").value;
    let password = document.querySelector("#inputpassword").value;
    let password2 = document.querySelector("#reenterpassword").value;
    if (email != "" && password != "" && password2 != ""){
        const { data, error } = await _supabase.auth.signUp({
            email: email,
            password: password,
        });
        if (error) {
            console.log(error);
            alert("Unable to register! Make sure password is at least 6 characters.");
        }
        else {
            console.log(data);
            alert("Verify your email!");
            window.location.replace("../index.html");
        }
    }
    else {
        alert("Input fields missing!");
    }
    
});

