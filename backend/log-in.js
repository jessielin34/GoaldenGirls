import { _supabase } from "./client.js";

let login = document.querySelector("#submit");
login.addEventListener("click", async(e)=>{
    e.preventDefault();
    let email = document.querySelector("#inputemail").value;
    let password = document.querySelector("#inputpassword").value;
    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
    console.log(data);
    window.location.replace("http://127.0.0.1:3000/profile.html"); //hard-coded
    localStorage.setItem('token', data[0].access_token);
    const token = localStorage.getItem('token');
});