import { _supabase } from "./client.js";

const currentDate = new Date();
let user_id = "";
//check user is signed in
const updateUser = async()=>{
    const { data: { user }, error } = await _supabase.auth.getUser();
    user_id = user.id;
    //username
    let {data, error_} = await _supabase
    .from("user")
    .select()
    .eq('user_id', user_id);
    console.log(data);
    if (error_)  alert(error_);
    else document.getElementById("user").textContent= '@' + data[0].username;
}; updateUser();

//
let doneButton = document.querySelector("#done");
doneButton.addEventListener("click", async(e)=> {
    e.preventDefault();
    //get all checkpoints (text)
    let start_date = $('#start-date').val();
    let checkList = [];
    let dateList = [];
    let checkpoints = document.querySelectorAll("input");
    let textCounter = 1;
    let dateCounter = 1;
    for (let check of checkpoints){
        //check if its cp text
        if (check.id == 'checkpoint-text' + String(textCounter)){
            if (check.value) checkList.push(check.value);
            textCounter++;
        }
        //check if cp has a date
        if (check.id == 'checkpoint-date' + String(dateCounter)){
            if (check.value && checkList[dateCounter-1] != undefined) {
                //make a separate function to check entire date arrray!
                if (check.value < currentDate) {
                    alert("Can't start in the past, must look into the present & the future!");
                    return;
                }
                if (check.value < dateList[dateCounter-2]){
                    alert("Checkpoint dates must be in chronological order");
                    return;
                }
                dateList.push(check.value); 
            }
            else {
                alert("Make sure checkpoints have a description!")
                return;
            }
            dateCounter++;
        }
    }

    if (checkList.length != dateList.length){
        alert("Make sure each checkpoint has a date!")
        return;
    }
    
    console.log(checkList);
    console.log(dateList);
    
    let goal = document.querySelector("#goal-title").value;
    let description = document.querySelector("#goal-description").value;
    let category = document.querySelector("#category-select").value;
    let goal_id = 0;
    console.log("woking..");
    if(goal != "" && description != "" && checkpoints.length >= 3 && category != ""){
        const {data, error} = await _supabase
        .from("Goals")
        .insert({
            user_id: user_id,
            goal_name: goal,
            description: description,
            category: category,
            start_date: start_date,
            owner_status: 0,
            cp_num: checkList.length,
            ppl_num: 1
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
            .insert([{
                name: cp_name, 
                goal_id: goal_id, 
                checkpoint_order: order_counter,
                date: dateList[order_counter-1]
            }]);
            order_counter++;
        }
        
        // get id of goal by checking auth.uid() && 
        // https://www.youtube.com/watch?v=roAJ61sTGIc
        // https://supabase.com/docs/guides/auth/managing-user-data
        alert("Your goal has been added!");
        //window.location.replace("./../profile.html"); //hard-coded
    }
    else{
        console.log("Unable to add to database");
        alert("Unable to add goal ;( \nMake sure to fill out all fields and at least 2 checkpoints!");
    }
    
});