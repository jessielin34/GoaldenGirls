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
            window.location.replace("./profile.html"); //hard-coded
            // window.history.replaceState({ additionalInformation: 'Updated the URL with JS' }, 'Profile', '../profile.html');
        }
    }
    else{
        alert("Input fields missing!");
    }
});

//https://stackoverflow.com/questions/65818674/how-to-pass-token-to-verify-user-across-html-pages-using-node-js
//session:
// access_token: "eyJhbGciOiJIUzI1NiIsImtpZCI6IkgvWWZVQk45WkdGTnJlSVQiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzExNzYzNzI0LCJpYXQiOjE3MTE3N…"


//Forgot Password:





document.addEventListener("keydown", addKeyLogin);
async function addKeyLogin(event){
    let key = event.key;
    console.log(key);
    if (key == "Enter"){ //if key pressed is a valid key
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
                window.location.replace("./../profile.html"); //hard-coded
                // window.history.replaceState({ additionalInformation: 'Updated the URL with JS' }, 'Profile', '../profile.html');
            }
        }
        else{
            alert("Input fields missing!");
        }
    }
}