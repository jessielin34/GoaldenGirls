import { _supabase } from "./client.js";
import { user } from "./user.js";

var user_id = user.id;

//display current user information 
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
    await(updateLang(newLang));
    
    //await(updateLang());
    // let langs = document.querySelectorAll('.form-check-input');
    // langs.forEach((e)=>{
    //     if (e.checked == true) newLang = e.value;       
    // });
    

});

async function updateLang(newLang){
    
    console.log(newLang);
    try {
        let {data, error} = await _supabase
        .from('user')
        .update({
            language: newLang,
        })
        .eq('user_id', user_id);
        if (!error){
            console.log(newLang);
            alert("Successfully updated settings!");
            window.location.replace("./../profile.html"); 
        }
        else throw error;
    }catch(err){
        console.error(err);
    }
}