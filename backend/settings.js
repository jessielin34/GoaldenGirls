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
            $('.rounded-circle').attr('src', data[0].pro_pic);
            $('.square').attr('src', data[0].bg_pic);
        }
    }catch(err){
        console.error(err);
    }
   
}getInfo();


 //make new translate element DOESNT WORK ON HOSTING SITE
// function googleTranslateElementInit() {
//     new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
//     console.log(google.translate.TranslateElement().g.Fc);

// }googleTranslateElementInit();
//


//USER UPDATE EVENT LISTENER
document.getElementById("updateSettings").addEventListener('click', async(e)=>{
    e.preventDefault();
    //get all input field values
    let username = $('#username').val();
    let bio = $('#bio').val();
    let proPic = $('.rounded-circle').attr('src');
    let bgPic = $('.square').attr('src');
    //send all input fields to be PUT
    updateUser(username, bio, proPic, bgPic);
    
});

async function updateUser(username, bio, proPic, bgPic){
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
    //call supabase API and update the information
    try {
        let {data, error} = await _supabase
        .from('user')
        .update({
            username: username,
            bio: bio,
            pro_pic: proPic,
            bg_pic: bgPic
        })
        .eq('user_id', user.id);
        if (!error){
            console.log("Successfully updated settings!");
            window.location.replace("./profile.html"); 
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
    redirectTo: 'https://goalden.netlify.app/reset-password.html'});
    if (error){
        alert(error);
    }
    else alert("Check email to reset password!")
}