import { _supabase } from "./client.js";

let login = document.querySelector("#submit");
login.addEventListener("click", async(e)=>{
    e.preventDefault();
    let email = document.querySelector("#inputemail").value;
    let password = document.querySelector("#inputpassword").value;
    if (email != "" && password != ""){
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        console.log(data); //hard-coded
        if (error){
            alert("Input valid credentials!");
        }
        else {
            window.location.replace("../profile.html"); //hard-coded
        }
    }
});

//https://stackoverflow.com/questions/65818674/how-to-pass-token-to-verify-user-across-html-pages-using-node-js
//session:
// access_token: "eyJhbGciOiJIUzI1NiIsImtpZCI6IkgvWWZVQk45WkdGTnJlSVQiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzExNzYzNzI0LCJpYXQiOjE3MTE3N…"

// expires_at: 1711763724

// expires_in: 3600

// refresh_token: "NcPgGCBssg_mRBo8XzXC-g"

// token_type: "bearer"

// user: {id: "043ec298-ae82-43ba-a