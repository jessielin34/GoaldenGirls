import {_supabase} from './client.js';

let user_id = "a";
let { data: { user }, error } = await _supabase.auth.getUser();
user_id = user.id;


const checkJoin = async()=>{
    let goal = "";
    let goal_ids = [];
    let { data: goals, error_} = await _supabase
    .from("Join")
    .select("*")
    .eq("user_id", user_id);
    for (let i =0; i <goals.length; i++){
        goal_ids.push(goals[i].goal_id);
    }

    //add all joined goals
    for (let i in goal_ids){
        let {data, error} = await _supabase
        .from("Goals")
        .select("*")
        .eq('id', goal_ids[i]);
        if (!error){
            goal += 
            `<a href="timeline.html" style="color: black !important; ">
                <div class="card card-style" style="width: 20rem; height: 15rem; display: inline-block; ">
                    <div class="card-body">
                        <a id="deletegoal">
                            <button class="btn btn-danger join" value="${data[0].id}" style="align-items: center">
                                x
                            </button>
                        </a>
                        <h5 class="card-title">${data[0].goal_name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${data[0].description}</h6>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <button class="btn btn-light" value="${data[0].id}" type="button" onclick="setGoalId(this.value)">
                            expand
                        </button>
                    </div>
                </div>
            </a>
            `
        }
        else{
            console.log(error);
        }
    } 
    const template = document.createElement("a");
    template.innerHTML = goal.trim();
    let sibling = document.getElementById("joinGoal");
    let parent = sibling.parentNode;
    parent.insertBefore(template, sibling.nextSibling); 
    //add eventListener for delete joined goals
    const joined = document.querySelectorAll(".join");
    console.log(joined.legnth);
    for (let i =0; i<joined.length; i++){
        let joined_goal = parseInt(joined[i].value);
        joined[i].addEventListener('click', async()=>{
            let {data, error} = await _supabase
            .from("Join")
            .delete({user_id: user_id})
            .eq('goal_id', joined_goal);
            if (error){
                console.log(error);
                alert("Unable to remove goal :(")
            }
            else{
                alert("Successfully unjoined goal!");
                window.location.replace("https://jessielin34.github.io/GoaldenGirls/profile.html"); 
            } 
        })
    }
}; checkJoin();


