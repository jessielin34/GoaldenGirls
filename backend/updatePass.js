import { _supabase } from "./client.js";
//reset the password of the user based on the inputted passwords
let reset = document.querySelector("#reset");
reset.addEventListener("click", resetPassword);
async function resetPassword(){
    let password = document.querySelector("#inputpassword").value;
    let password2 = document.querySelector("#reenterpassword").value;
    if (password != "" && password2 != "" && password == password2){
        const { data, error } = await _supabase.auth.updateUser({
            password: password
        })
        if (error){
            alert(error);
        }
        else alert("Password successfully updated!");
    }
    else alert("Enter all fields.\nMake sure passwords are matching!");
}