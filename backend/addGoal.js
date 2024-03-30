import { _supabase } from "./client";
// const supabaseKey = 
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waGViaXJ6eWRlb2dreWprdGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MDY2OTksImV4cCI6MjAyNjE4MjY5OX0.qDac2fiFpZVq-TOfqIDfj9osvHOWpCBb6VIVgypSiMM';

// const supabaseUrl = 'https://mphebirzydeogkyjktjr.supabase.co';

// const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
// console.log(_supabase);

let doneButton = document.querySelector("#done");
doneButton.addEventListener("click", async(e)=> {
    e.preventDefault();
    let goal = document.querySelector("#goal-title").value;
    let checkpoints = [];
    let description = document.querySelector("#goal-description").value;
    let checkpoint1 = document.querySelector("#checkpoint1").value;
    if (checkpoint != ""){
    }
    let checkpoint2 = document.querySelector("#checkpoint2").value;
    let checkpoint3 = document.querySelector("#checkpoint3").value;
    let checkpoint4 = document.querySelector("#checkpoint4").value;
    let checkpoint5 = document.querySelector("#checkpoint5").value;
    console.log(checkpoints);
    let goal_id = 0;
    console.log("woking..");
    if(goal != "" && description != "" && checkpoint1 != ""){
        const {data, error} = await _supabase
        .from("Goals")
        .insert({
            goal_name: goal,
            description: description,
        }).select();
        goal_id = data[0].id;
        console.log(goal_id);

        const {data2, error2} = await _supabase
        .from("Checkpoint")
        .insert([
            {name: checkpoint1, goal_id: goal_id},
            {name: checkpoint2, goal_id: goal_id},
            {name: checkpoint3, goal_id: goal_id},
        ]);
        // get id of goal by checking auth.uid() && 
        // https://www.youtube.com/watch?v=roAJ61sTGIc
        // https://supabase.com/docs/guides/auth/managing-user-data
        console.log(data2);
        alert("Your goal has been added!");
        window.location.replace("http://127.0.0.1:3000/profile.html"); //hard-coded
    }
    else{
        console.log("Unable to add to database");
        alert("Unable to add goal ;( \nMake sure to fill out all fields and at least 1 checkpoint!");
    }
    
});