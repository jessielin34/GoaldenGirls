import { _supabase } from "./client.js";
import { addCheckpoint } from "./editGoalHelper.js";
//import { user_data } from "./user.js";


const { data: { user }, error1 } = await _supabase.auth.getUser();
let user_id = user.id;
document.getElementById("user").textContent= user.email;

//console.log(user_id);

//1. select goal name and description
let orig_name = "";
let orig_description = "";
let orig_category = "";
let goal_id = parseInt(localStorage.getItem("goal_id"));
console.log(goal_id);
const { data: goal, error_}  = await _supabase
.from("Goals")
.select("*")
.eq("id", goal_id);
if (!error_){
    orig_name = goal[0].goal_name;
    document.querySelector("#goal-title").value = orig_name;
    orig_description = goal[0].description;
    document.querySelector("#goal-description").value = orig_description;
    orig_category = goal[0].category;
    document.querySelector("#category-select").value = orig_category;
}
else console.log(error_);

//2. select all checkpoints and display
const cpIdList = [];
const cpNameList = [];
const {data, error} = await _supabase
.from("Checkpoint")
.select("*")
.eq("goal_id", goal_id);
if (data){
    for (let i in data){
        if (data[i].checkpoint_order > 5){
            addCheckpoint(data[i].checkpoint_order);
        }
        console.log(data[i]);
        let cp = document.querySelector(`#checkpoint${data[i].checkpoint_order}`);
        cp.value = data[i].name;
        cpNameList.push(data[i].name);
        cpIdList.push(data[i].id);
        //add name to the textContent?
    }
}

//3. Read the new info + update in Supabase
let doneButton = document.querySelector("#done");
doneButton.addEventListener('click', async(e)=>{
    e.preventDefault();
    let checkList = []; // list of names of all updated checkpoints
    let checkpoints = document.querySelectorAll("input");
    //let counter = 1;
    for (let check of checkpoints){
        if (check.id.includes("checkpoint")){
            if (check.value) checkList.push(check.value);
            //counter++;
        }
    }
    console.log(checkList);
    //check if lists match
    //const updateCps = checkArrays(cpNameList, checkList);
    //console.log(updateCps);
    //if (array)    
    // if (updateCps.length == 0) {
    //     alert("No changes made!");
    //     return;
    // }
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
        // Supabase takes into account if values are the same (doesnt update if they are)
        for (let cp in cpIdList){
            const {data2, error2} = await _supabase
            .from("Checkpoint")
            .update([{
                name: checkList[cp],
                checkpoint_order: parseInt(cp)+1,
            }])
            .eq('id', cpIdList[cp]);
        }
        if (error){
            alert("unable to modify checkpoints");
        }

        if (checkList.length > cpIdList.length){
            for (let i = cpNameList.length; i < checkList.length; i++){
                const {data3, error3} = await _supabase
                .from("Checkpoint")
                .insert([{
                    name: checkList[i], 
                    goal_id: goal_id, 
                    checkpoint_order: i+1
                }]);
                if(error3) alert(error3);
            }
        }
        if (checkList.length  < cpIdList.length){
            for (let i = checkList.length; i < cpIdList.length; i++){
                console.log(i);
                let {data_, error_} = await _supabase
                .from("Checkpoint")
                .delete({user_id: user_id})
                .eq('id', cpIdList[i]);
                if (error_){
                    console.log(error_);
                    alert("Unable to remove checkpoint :(")
                }
            }
            
        }
        
        // get id of goal by checking auth.uid() && 
        // https://www.youtube.com/watch?v=roAJ61sTGIc
        // https://supabase.com/docs/guides/auth/managing-user-data
        alert("Your goal has been modified!");
        //window.location.replace("./../profile.html"); //hard-coded
    }
    else{
        console.log("Unable to add to edit");
        alert("Unable to add goal ;( \nMake sure to fill out all fields and at least 2 checkpoints!");
    }
})

function checkArrays(list_a, list_b){
    let updateCps = [];
    if (list_a == list_b) console.log("no changes");
    else{
        for (let i = 0; i < list_a.length ; ++i){
            if (list_a[i] != list_b[i]){
                updateCps.push(list_b[i]);
            }
        }
    }
    return updateCps;
}