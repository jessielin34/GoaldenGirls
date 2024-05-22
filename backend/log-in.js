import { _supabase } from "./client.js";

//send login info to the sign-in auth Supabase endpoints
let login = document.querySelector("#submit");
login.addEventListener("click", async(e)=>{
    e.preventDefault();
    let email = document.querySelector("#inputemail").value;
    let password = document.querySelector("#inputpassword").value;
    //make sure fields are not empty
    if (email != "" && password != ""){
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        console.log(data); 
        if (error){
            alert("Input valid credentials!");
        }
        else {
            window.location.replace("profile.html"); 
        }
    }
    else{
        alert("Input fields missing!");
    }
});


//add same functionality to when the user presses the enter key
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
            console.log(data); 
            if (error){
                alert("Input valid credentials!");
            }
            else {
                window.location.replace("./profile.html");
            }
        }
        else{
            alert("Input fields missing!");
        }
    }
}