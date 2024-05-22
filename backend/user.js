import { _supabase } from "./client.js";

//get information of logged in user and export it
try {
    var { data: { user }, error } = await _supabase.auth.getUser();
    console.log(user);
}
catch(error){
    console.log(error);
}

export {user};

//https://supabase.com/docs/reference/javascript/auth-onauthstatechange