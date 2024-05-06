import { _supabase } from "../backend/client.js";
import { user } from "../backend/user.js";
// import { google } from "http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
let user_id = user.id;

//https://www.w3schools.com/howto/howto_google_translate.asp
function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}googleTranslateElementInit();



