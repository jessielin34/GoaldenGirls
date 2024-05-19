import { _supabase } from "./client.js"
import { user } from "./user.js"


const currentDate = new Date();
const user_id = user.id;
//check user is signed in
const updateUser = async()=>{
    //username
    try {
        let {data, error} = await _supabase
        .from("user")
        .select()
        .eq('user_id', user_id);
        if (error) throw (error);
        else {
            document.getElementById("user").textContent= '@' + data[0].username;
            $('#bio').val(data[0].bio);
            $('#profile-img').attr('src', data[0].pro_pic);
            $('.img-bg').css('background-image', 'url(../'+data[0].bg_pic+')')
        }
    }catch(err){
        console.error(err);
    }
}; updateUser();

//
let doneButton = document.querySelector("#done");
doneButton.addEventListener("click", async(e)=> {
    e.preventDefault();
    //get all checkpoints (text)
    let start_date = $('#start-date').val();
    if (new Date(start_date) <= currentDate) {
        alert("Goal must start at least tomorrow :)");
        return;
    }
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
            //make sure cp has text
            if (check.value && checkList[dateCounter-1] != null) {
                //make a separate function to check entire date arrray!
                if (!checkDates(start_date, dateList, check.value)){
                    alert("Dates must be in chronological order");
                    return;
                }
                dateList.push(check.value);
                dateCounter++; 
            }
            else {
                alert("Each checkpoint must have a date and description!")
                return;
            }
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
    if(goal != "" && description != "" && start_date != undefined && checkpoints.length >= 3 && category != ""){
        const {data, error} = await _supabase
        .from("Goals")
        .insert({
            user_id: user_id,
            goal_name: goal,
            description: description,
            category: category,
            start_date: start_date,
            status: 0,
            cp_num: checkList.length,
            ppl_num: 1
        }).select();
        if (error){
            alert(error.message);
        }
        goal_id = data[0].id;
        console.log(goal_id);

        //insert to checkpoint table
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
        window.location.replace("./../profile.html"); //hard-coded
    }
    else{
        console.log("Unable to add to database");
        alert("Unable to add goal ;( \nMake sure to fill out all fields and at least 3 checkpoints!");
    }
    
});

function checkDates(start_date, cpDates, newDate){
    if (cpDates.length == 0) return true;
    else{
        for (let date of cpDates){
            if ((newDate <= date || newDate <= start_date)){
                console.log(newDate, date);
                return false;
            }
            if (date <= currentDate) {
                console.log(newDate, date, cpDates);
                return false;
            }
        }
    }
    return true;
}