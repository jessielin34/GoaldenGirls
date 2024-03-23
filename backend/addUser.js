const supabaseKey = 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waGViaXJ6eWRlb2dreWprdGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MDY2OTksImV4cCI6MjAyNjE4MjY5OX0.qDac2fiFpZVq-TOfqIDfj9osvHOWpCBb6VIVgypSiMM';

const supabaseUrl = 'https://mphebirzydeogkyjktjr.supabase.co';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
console.log(_supabase);

let signup = document.querySelector("#submit");
signup.addEventListener("click", async(e)=>{
    // e.preventDefault();
    let username = document.querySelector("#inputemail").value;
    let password = document.querySelector("#inputpassword").value;
    let password2 = document.querySelector("#reenterpassword").value;
    if(username != "" && password != "" && password2 != "" && password === password2){
        const {data, error} = await _supabase.from("User").insert({
            username: username,
            password: password,
        });
        console.log(data);
        alert("You have successfully created your Goalden account!");
        window.location.replace("../profile.html");
    }
    else{
        e.preventDefault();
        console.log("Unable to add to database");
        alert("We were unable to create your account\nMake sure to fill out all fields!");
    }
    
});