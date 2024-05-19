import { _supabase } from "./client.js";
import { user } from "./user.js";

//display current user information 
async function getInfo(){
    //get username
    try {
        let {data, error} = await _supabase
        .from("user")
        .select()
        .eq('user_id', user.id);
        if (error) throw (error);
        else {
            $('#username').val(data[0].username);
            $('#bio').val(data[0].bio);
        }
    }catch(err){
        console.error(err);
    }
   
}getInfo();


 //make new translate element 
function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
    console.log(google.translate.TranslateElement().g.Fc);

}googleTranslateElementInit();
//


//USER UPDATE EVENT LISTENER
document.getElementById("updateSettings").addEventListener('click', async(e)=>{
    e.preventDefault();
    let newLang = google.translate.TranslateElement().g.Fc;
    let username = $('#username').val();
    let bio = $('#bio').val();
    updateUser(newLang, username, bio);
    
    //await(updateLang());
    // let langs = document.querySelectorAll('.form-check-input');
    // langs.forEach((e)=>{
    //     if (e.checked == true) newLang = e.value;       
    // });
    

});

async function updateUser(newLang, username, bio){
    console.log(newLang);
    //check username is not taken
    if (username != $('#username').val()){
        try {
            let {data, error} = await _supabase
            .from("user")
            .select()
            .eq("username", username);
            if (data.length != 0) throw("username already exists in database");
        } catch (err){
            alert("Username is taken!")
            throw err;
        }
    }
    try {
        let {data, error} = await _supabase
        .from('user')
        .update({
            language: newLang,
            username: username,
            bio: bio
        })
        .eq('user_id', user.id);
        if (!error){
            console.log(newLang);
            console.log("Successfully updated settings!");
            window.location.replace("./../profile.html"); 
        }
        else throw error;
    }catch(err){
        console.error(err);
    }
}


//reset password listener
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