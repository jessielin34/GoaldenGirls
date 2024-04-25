import { _supabase } from "./client.js";

try {
    var { data: { user }, error } = await _supabase.auth.getUser();
    console.log(user);
}
catch(error){
    console.log(error);
}
//console.log(user);

export {user};

//https://supabase.com/docs/reference/javascript/auth-onauthstatechange