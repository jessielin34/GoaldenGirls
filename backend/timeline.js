// const supabaseKey = 
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waGViaXJ6eWRlb2dreWprdGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MDY2OTksImV4cCI6MjAyNjE4MjY5OX0.qDac2fiFpZVq-TOfqIDfj9osvHOWpCBb6VIVgypSiMM';

// const supabaseUrl = 'https://mphebirzydeogkyjktjr.supabase.co';

// const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
// console.log(_supabase);

import {_supabase} from './client.js';

// const { data: { user }, error } = await _supabase.auth.getUser();
// if (error){
//     window.location.replace("http://127.0.0.1:3000/index.html");
// }

const getCheckPoints = async()=> {
    let goal_id = parseInt(localStorage.getItem("goal_id"));
    console.log(goal_id);
    let goal_name = "";
    const { data: goal, error_}  = await _supabase.from("Goals").select("*").eq("id", goal_id);
    if (!error_){
        let title = document.getElementById("cp_title");
        goal_name = goal[0].goal_name;
        title.innerText = "Goal: " + goal_name;
    }
    else {
        console.log(error_);
    }
    let checkpoints = ``;
    const {data, error} = await _supabase
    .from("Checkpoint")
    .select("*")
    .eq("goal_id", goal_id);
    if (data){
        for (let i in data){
            checkpoints += `<li>
            <div class="left">
                <div class="icon animate fadeInLeft" data-wow-delay="1.2s">
                    <img src="images/first.png" alt="" />
                </div>
            </div>
            <div class="media-body">
                <h4>${data[i].name}</h4>
            </div>
        </li>`
        }
        const template = document.createElement("li");
        template.innerHTML = checkpoints.trim();
        let sibling = document.getElementById("cp1");
        let parent = sibling.parentNode;
        parent.insertBefore(template, sibling);
    }  
    else{
        console.log(error);
    } 
};

getCheckPoints();