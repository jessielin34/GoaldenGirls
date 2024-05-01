function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
    changeLang(); //call Supabase
    //google.translate.TranslateElement().g.Fc = '';
}
function changeLang(){
    google.translate.TranslateElement().g.Fc = null;
}