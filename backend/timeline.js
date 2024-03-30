// const supabaseKey = 
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waGViaXJ6eWRlb2dreWprdGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MDY2OTksImV4cCI6MjAyNjE4MjY5OX0.qDac2fiFpZVq-TOfqIDfj9osvHOWpCBb6VIVgypSiMM';

// const supabaseUrl = 'https://mphebirzydeogkyjktjr.supabase.co';

// const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
// console.log(_supabase);

import {_supabase} from './client.js';

const getCheckPoints = async()=> {
    let goal_id = 0;
    let goal_name = "";
    const res = await _supabase
    .from('Goals')
    .select('*')
    .eq('goal_name', 'Learn Guitar');
    if (res){
        goal_id = res.goal_id;
        console.log(goal_id);
    }
    else {
        console.log("what");
    }
    let checkpoints = ``;
    const {data, error} = await _supabase
    .from("Checkpoint")
    .select("*")
    .eq("goal_id", 11);
    if (data){
        for (let i in data){
            checkpoints += `<li>
            <div class="left two">
                <div class="icon animate fadeInLeft" data-wow-delay="1.2s">
                    <img src="images/pro-img2.png" alt="" />
                </div>
            </div>
            <div class="media-body">
                <h4>${data[i].name}</h4>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
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