// const supabaseKey = 
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waGViaXJ6eWRlb2dreWprdGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MDY2OTksImV4cCI6MjAyNjE4MjY5OX0.qDac2fiFpZVq-TOfqIDfj9osvHOWpCBb6VIVgypSiMM';

// const supabaseUrl = 'https://mphebirzydeogkyjktjr.supabase.co';

// const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
// console.log(_supabase);

import {_supabase} from './client.js';

let user_id = "a";
let { data: { user }, error } = await _supabase.auth.getUser();
const updateUser = async()=>{
    document.getElementById("user").textContent= user.email;
    user_id = user.id;

}; updateUser();


const checkDB = async()=> {
    let goals = "";
    let {data, error} = await _supabase
    .from("Goals")
    .select("*")
    .eq('user_id', user_id);
    if (data){
        //https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
        //https://youtu.be/4bqKagS5X88?si=VcavSSC0LfeBryZ3
        for (let i in data){
            goals += // line 40 where the edit button is - no logic is there for it to work!
            `<a href="timeline.html" style="color: black !important; ">
                <div class="card card-style" style="width: 20rem; height: 15rem; display: inline-block; ">
                    <div class="card-body">
                        <a id="deletegoal">
                            <button class="btn btn-danger delete_my" value="${data[i].id}" style="align-items: center">
                                x
                            </button>
                        </a>
                        <a id="editgoal">
                            <button class="btn btn-success edit_my" value="${data[i].id}" style="align-items: center" onclick="setGoalId(this)"> 
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                </svg> 
                            </button>
                        </a>
                        <h5 class="card-title">${data[i].goal_name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${data[i].description}</h6>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <button class="btn btn-light" value="${data[i].id}" type="button" onclick="setGoalId(this)">
                            expand
                        </button>
                    </div>
                </div>
            </a>
            `
        };
        const template = document.createElement("a");
        template.innerHTML = goals.trim();
        let sibling = document.getElementById("goal1");
        let parent = sibling.parentNode;
        parent.insertBefore(template, sibling.nextSibling);  

        //add eventListener for deleting own goals
        //add eventListener for delete
        const mine = document.querySelectorAll(".delete_my");
        for (let i =0; i<mine.length; i++){
            let my_goal = parseInt(mine[i].value);
            mine[i].addEventListener('click', async()=>{
                let {data, error} = await _supabase
                .from("Goals")
                .delete({user_id: user_id})
                .eq('id', my_goal);
                if (error){
                    console.log(error);
                }
                let {data_, error_} = await _supabase
                .from("Checkpoint")
                .delete({user_id: user_id})
                .eq('goal_id', my_goal);
                if (error_){
                    console.log(error_);
                    alert("Unable to remove goal :(")
                }
                else{
                    alert("Successfully deleted goal!");
                    window.location.replace("./../profile.html"); 
                }
            })
        }

    }
    else{
        console.log(error);
    };

};

checkDB();
//edit goal
let edit = document.querySelector("#sign_out");


//signout
let signout = document.querySelector("#sign_out");
signout.addEventListener("click", async(e)=>{ 
    e.preventDefault();
    const { error } = await _supabase.auth.signOut();
    if (!error){
        window.location.replace("./../index.html"); 
    }
    else {
        alert("Unable to sign out\n", error);
    }
});




     

