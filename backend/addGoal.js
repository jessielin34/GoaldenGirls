// import { _supabase } from "./client";
const supabaseKey = 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waGViaXJ6eWRlb2dreWprdGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MDY2OTksImV4cCI6MjAyNjE4MjY5OX0.qDac2fiFpZVq-TOfqIDfj9osvHOWpCBb6VIVgypSiMM';

const supabaseUrl = 'https://mphebirzydeogkyjktjr.supabase.co';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
console.log(_supabase);

let doneButton = document.querySelector("#done");
doneButton.addEventListener("click", async(e)=> {
    e.preventDefault();
    let goal = document.querySelector("#goal-title").value;
    let description = document.querySelector("#goal-description").value;
    let checkpoint1 = document.querySelector("#checkpoint1").value;
    let checkpoint2 = document.querySelector("#checkpoint2").value;
    let checkpoint3 = document.querySelector("#checkpoint3").value;
    console.log("why");
    if(goal != "" && description != "" && checkpoint1 != ""){
        const {data, error} = await _supabase.from("Goals").insert({
            goal: goal,
            user_id: auth.uid(),
            description: description,
        });
        console.log(data);
        // get id of goal by checking auth.uid() && 
        // https://www.youtube.com/watch?v=roAJ61sTGIc
        // https://supabase.com/docs/guides/auth/managing-user-data
        const res = await _supabase.from("Checkpoint").insert({
            goal_id: goalID
        });
        console.log(res);
        alert("Your goal has been added!");

    }
    else{
        console.log("Unable to add to database");
        alert("Unable to add goal ;( \nMake sure to fill out all fields and at least 1 checkpoint!");
    }
    
});


function addGoal (goalText){
}