import { _supabase } from "./client.js";

let user_id = "";
//check user is signed in
const updateUser = async()=>{
    const { data: { user }, error } = await _supabase.auth.getUser();
    document.getElementById("user").textContent= user.email;
    user_id = user.id;
}; updateUser();
console.log(user);
//
let doneButton = document.querySelector("#done");
doneButton.addEventListener("click", async(e)=> {
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
    
    // for (let cp of checkList){
    //     console.log(cp);
    // }
    let goal = document.querySelector("#goal-title").value;
    
    let description = document.querySelector("#goal-description").value;
    // let checkpoint1 = document.querySelector("#checkpoint1").value;
    // if (checkpoint1 != ""){
    //     checkpoints.push(checkpoint1);
    // }
    // let checkpoint2 = document.querySelector("#checkpoint2").value;
    // if (checkpoint2 != ""){
    //     checkpoints.push(checkpoint2);
    // }
    // let checkpoint3 = document.querySelector("#checkpoint3").value;
    // if (checkpoint3 != ""){
    //     checkpoints.push(checkpoint3);
    // }
    // let checkpoint4 = document.querySelector("#checkpoint4").value;
    // if (checkpoint4 != ""){
    //     checkpoints.push(checkpoint4);
    // }
    // let checkpoint5 = document.querySelector("#checkpoint5").value;
    // if (checkpoint5 != ""){
    //     checkpoints.push(checkpoint5);
    // }
    let goal_id = 0;
    console.log("woking..");
    if(goal != "" && description != "" && checkpoints.length >= 2){
        const {data, error} = await _supabase
        .from("Goals")
        .insert({
            user_id: user_id,
            goal_name: goal,
            description: description,
        }).select();
        if (error){
            alert(error.message);
        }
        goal_id = data[0].id;
        console.log(goal_id);

        let order_counter =1;
        for (let cp_name of checkList){
            const {data2, error2} = await _supabase
            .from("Checkpoint")
            .insert([
            {name: cp_name, goal_id: goal_id, checkpoint_order: order_counter}
            ]);
            order_counter++;
        }
        
        // get id of goal by checking auth.uid() && 
        // https://www.youtube.com/watch?v=roAJ61sTGIc
        // https://supabase.com/docs/guides/auth/managing-user-data
        alert("Your goal has been added!");
        window.location.replace("./../profile.html"); //hard-coded
    }
    else{
        console.log("Unable to add to database");
        alert("Unable to add goal ;( \nMake sure to fill out all fields and at least 2 checkpoints!");
    }
    
});