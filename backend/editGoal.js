import { _supabase } from "./client.js";
import { addCheckpoint } from "./editGoalHelper.js";

//1. select goal name and description
let user_id = "";
//check user is signed in

const updateUser = async()=>{
    const { data: { user }, error } = await _supabase.auth.getUser();
    document.getElementById("user").textContent= user.email;
    user_id = user.id;
}; updateUser();

let goal_id = parseInt(localStorage.getItem("goal_id"));

const { data: goal, error_}  = await _supabase
.from("Goals")
.select("*")
.eq("id", goal_id);
if (!error_){
    document.querySelector("#goal-title").value = goal[0].goal_name;
    document.querySelector("#goal-description").value = goal[0].description;
}
else console.log(error_);

//2. select all checkpoints and display
const cpIdList = [];
const {data, error} = await _supabase
.from("Checkpoint")
.select("*")
.eq("goal_id", goal_id);
if (data){
    let counter = 1;
    for (let i in data){
        if (counter > 5){
            addCheckpoint(counter);
        }
        console.log(data[i]);
        let cp = document.querySelector(`#checkpoint${counter}`)
        cp.value = data[i].name;
        cpIdList.push(data[i].id);
        //add name to the textContent?

        counter++;
    }
}

//3. Read the new info + update in Supabase
let doneButton = document.querySelector("#done");
doneButton.addEventListener('click', async(e)=>{
    e.preventDefault();
    let checkList = [];
    let checkpoints = document.querySelectorAll("input");
    let counter = 1;
    for (let check of checkpoints){
        if (check.id == 'checkpoint' + counter){
            if (check.value) checkList.push(check.value);
            counter++;
        }
    }
    //check from original to updated --> if diff change push into a new list with the 
    console.log(checkList);
    let goal = document.querySelector("#goal-title").value;
    let description = document.querySelector("#goal-description").value;
    console.log(goal, description);

    console.log("woking..");
    if(goal != "" && description != "" && checkpoints.length >= 2){
        const {data, error} = await _supabase
        .from("Goals")
        .update({
            //user_id: user_id,
            goal_name: goal,
            description: description,
        })
        .eq('id', goal_id);
        if (error){
            alert(error.message);
        }

        // if # of cp < current : delete or 
        // # of cp > : add 
        // or just delete them and add them again to database
        for (let cp in cpIdList){
            const {data2, error2} = await _supabase
            .from("Checkpoint")
            .update([
            {name: checkList[cp]}
            ])
            .eq('id', cpIdList[cp]);
        }
        if (error){
            alert("unable to modify checkpoints");
        }
        
        // get id of goal by checking auth.uid() && 
        // https://www.youtube.com/watch?v=roAJ61sTGIc
        // https://supabase.com/docs/guides/auth/managing-user-data
        alert("Your goal has been modified!");
        window.location.replace("./../profile.html"); //hard-coded
    }
    else{
        console.log("Unable to add to edit");
        alert("Unable to add goal ;( \nMake sure to fill out all fields and at least 2 checkpoints!");
    }
})