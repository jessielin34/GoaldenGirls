import { _supabase } from "./client.js";

let reset = document.querySelector("#reset");
reset.addEventListener("click", sendEmail);
async function sendEmail(e){
    e.preventDefault();
    let email = document.querySelector("#inputemail").value;
    console.log("working");
    const { data, error } = await _supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://jessielin34.github.io/GoaldenGirls/reset-password.html'});
    if (error){
        alert(error);
    }
    else alert("Check email to reset password!")
}

document.addEventListener("keydown", checkKey);

function checkKey(event){
    if(event.key == "Enter") sendEmail(event);
}