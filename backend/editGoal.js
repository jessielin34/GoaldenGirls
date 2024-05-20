import { _supabase } from "./client.js";
import { addCheckpoint } from "./editGoalHelper.js";
import { user } from "./user.js";

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
            $('#profile-img').attr('src', data[0].pro_pic);
            $('.img-bg').css('background-image', 'url(../'+data[0].bg_pic+')');
        }
    }catch(err){
        console.error(err);
    }
}; updateUser();

//console.log(user_id);

//1. select goal name and description
let orig_name = "";
let orig_description = "";
let orig_category = "";
let orig_date = null;
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
    orig_date = goal[0].start_date;
    $('#start-date').val(orig_date);
}
else console.log(error_);

//2. select all checkpoints and display
const cpIdList = [];
const cpNameList = [];
const cpDateList =[];
const {data, error} = await _supabase
.from("Checkpoint")
.select("*")
.eq("goal_id", goal_id);
if (data){
    for (let i in data){
        if (data[i].checkpoint_order > 3){
            console.log(data[i].checkpoint_order);
            addCheckpoint(data[i].checkpoint_order);
        }
        let cp = document.querySelector(`#checkpoint-text${data[i].checkpoint_order}`);
        console.log(cp);
        cp.value = data[i].name;
        let cpDate = document.querySelector(`#checkpoint-date${data[i].checkpoint_order}`);
        cpDate.value = data[i].date;
        cpNameList.push(data[i].name);
        cpIdList.push(data[i].id);
        cpDateList.push(data[i].date);
    }
}

//3. Read the new info + update in Supabase
let doneButton = document.querySelector("#done");
doneButton.addEventListener('click', async(e)=>{
    e.preventDefault();
    let checkList = []; // list of names of all updated checkpoints
    let dateList  = [];
    let checkpoints = document.querySelectorAll("input");
    let start_date = $('#start-date').val();
    if (new Date(start_date) <= currentDate) {
        alert("Goal must start at least tomorrow :)");
        return;
    }
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
   
    let goal = document.querySelector("#goal-title").value;
    let description = document.querySelector("#goal-description").value;
    let category = document.querySelector("#category-select").value;
    console.log(goal, description);

    console.log("woking..");
    if(goal != "" && description != "" && checkpoints.length >= 3 && category!= ""){
        const {data, error} = await _supabase
        .from("Goals")
        .update({
            //user_id: user_id,
            goal_name: goal,
            description: description,
            category: category,
            start_date: start_date
        })
        .eq('id', goal_id);
        if (error){
            alert(error.message);
            return;
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
                date: dateList[cp],
            }])
            .eq('id', cpIdList[cp]);
        }
        if (error){
            alert("unable to modify checkpoints");
            return;
        }

        if (checkList.length > cpIdList.length){
            for (let i = cpNameList.length; i < checkList.length; i++){
                const {data3, error3} = await _supabase
                .from("Checkpoint")
                .insert([{
                    name: checkList[i], 
                    goal_id: goal_id, 
                    checkpoint_order: i+1,
                    date: dateList[i],
                }]);
                if(error3){
                    alert(error3);
                    return;
                }
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
                    return;
                }
            }
            
        }
        
        // get id of goal by checking auth.uid() && 
        // https://www.youtube.com/watch?v=roAJ61sTGIc
        // https://supabase.com/docs/guides/auth/managing-user-data
        //alert("Your goal has been modified!");
        window.location.replace("./profile.html"); //hard-coded
    }
    else{
        console.log("Unable to add to edit");
        alert("Unable to add goal ;( \nMake sure to fill out all fields and at least 2 checkpoints!");
    }
})

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