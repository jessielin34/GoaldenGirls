import { _supabase } from "./client.js";

//
let sendReset = document.querySelector("#reset");
sendReset.addEventListener("click", sendEmail);
async function sendEmail(e){
    e.preventDefault();
    let email = document.querySelector("#inputemail").value;
    console.log("working");
    //call the auth API to send the link to reset their password with their associated email
    const { data, error } = await _supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://goalden.netlify.app/reset-password.html'});
    if (error){
        alert(error.messagex);
        console.error(error);
    }
    else alert("Check email to reset password!")
}

//add key listener for "enter"
document.addEventListener("keydown", checkKey);

function checkKey(event){
    if(event.key == "Enter") sendEmail(event);
}