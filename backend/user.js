import { _supabase } from "./client.js";
const user_data = "";
const { data: { user }, error } = await _supabase.auth.getUser();
if (!error){
    user_data = user;
}
else{
    user_data = error;
}

export { user_data };
