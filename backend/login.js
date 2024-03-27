const supabaseKey = 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waGViaXJ6eWRlb2dreWprdGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MDY2OTksImV4cCI6MjAyNjE4MjY5OX0.qDac2fiFpZVq-TOfqIDfj9osvHOWpCBb6VIVgypSiMM';

const supabaseUrl = 'https://mphebirzydeogkyjktjr.supabase.co';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
console.log(_supabase);

let login = document.querySelector("#submit");
signup.addEventListener("click", async(e)=>{
    e.preventDefault();
    let username = document.querySelector("#inputemail").value;
    console.log(username);
    let password = document.querySelector("#inputpassword").value;
    const {data, error} = await _supabase
        .from("User")
        .select('password')
        .eq('username', username)
        .eq('password', password)
    if(data){
        console.log(data);
        window.location.replace("http://127.0.0.1:3000/profile.html"); //hard-coded
    }
    else{
        console.log("Unable to add to database");
        alert("We were unable to create your account\nMake sure to fill out all fields!");
    }
    
});