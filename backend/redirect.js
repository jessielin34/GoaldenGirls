import { user } from "./user.js";

//redirect user to profile in login and signup page
if (user.id){
    window.location.replace("./profile.html"); 
}

