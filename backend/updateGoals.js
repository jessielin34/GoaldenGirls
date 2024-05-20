// const supabaseKey = 
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waGViaXJ6eWRlb2dreWprdGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MDY2OTksImV4cCI6MjAyNjE4MjY5OX0.qDac2fiFpZVq-TOfqIDfj9osvHOWpCBb6VIVgypSiMM';

// const supabaseUrl = 'https://mphebirzydeogkyjktjr.supabase.co';

// const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
// console.log(_supabase);

import {_supabase} from './client.js';
import { user } from './user.js';
import { categoryPaths } from './categories.js';

const currentDate = new Date();
let user_id = user.id;
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
            $('.img-bg').css('background-image', 'url(../'+data[0].bg_pic+')');
        }
    }catch(err){
        console.error(err);
    }
}; updateUser();


//updateGoals();

//ONGOING, UPCOMING, COMPLETED
// 1 list of objects containing all the goal info
// based on start_date push info to 
// all three categories -> {index & start_date} 
// that sorts the objects based on date 
// https://www.geeksforgeeks.org/sort-an-object-array-by-date-in-javascript/


var upcoming = [];
var ongoing = [];
var completed  = [];
var failed = [];

var goals = null;

async function displayGoals(){
    await checkOwned();
    await checkJoined();
    console.log(goals.length);
    sortGoals(upcoming);
    sortGoals(ongoing);
    sortGoals(completed);
    sortGoals(failed);
    $('.spinner-border').hide();
    await setUpcoming();
    await setOngoing();
    await setCompleted();
    await setFailed();
    await addDeleteButtonListener();
    await addUnjoinListener();
    setLevel(completed.length);

} displayGoals();
async function checkOwned(){
    try{
        let {data, error} = await _supabase
        .from("Goals")
        .select("*")
        .eq('user_id', user_id);
        if (!error) {
            goals = data;
        }
        else throw (error);
    }catch(err){
        console.error(err);
    }
    for (let goal in goals){
        let date = goals[goal].start_date;
        if (goals[goal].completed_date){
            date = goals[goal].completed_date;
            console.log(date);
        }
        await checkGoalStatus(goal, date, goals[goal].status, goals[goal].id, "owned");
    }
    
}

async function checkJoined(){
    let joinedIds = [];
    let joined = [];
    //check Join table for goal ids
    try{
        let {data, error} = await _supabase
        .from("Join")
        .select("*")
        .eq('user_id', user_id);
        if (!error) {
            for (let i in data){
                joinedIds.push({id: data[i].goal_id, status: data[i].status});
            }
        }
        else throw (error);
    }catch(err){
        console.error(err);
    }
    //using the goal ids get info from Goals table
    for (let goal_id of joinedIds){
        try{
            let {data, error} = await _supabase
            .from("Goals")
            .select("*")
            .eq('id', goal_id.id);
            if (!error) {
                for (let goal of data){
                    goals.push(goal);
                }
                joined.push(data);
            }
            else throw (error);
        }catch(err){
            console.error(err);
        }
    }
    console.log(joined);
    for (let goal in joined){
        let date = joined[goal][0].start_date;
        if (joined[goal][0].completed_date){
            date = joined[goal][0].completed_date;
        }
        await checkGoalStatus(goals.length - joined.length + parseInt(goal), date, joinedIds[goal].status, joined[goal][0].id, "joined");
    }
    
}
// consider deleting id param
async function checkGoalStatus(index, start, status, id, type){
    if (id == 22) console.log('learn react', status);
    let numOfCp = 0;
    let startDate = new Date(start);
    let cpDate = null;
    //check total number of cps
    try{
        let {data, error} = await _supabase
        .from('Checkpoint')
        .select()
        .eq('goal_id', parseInt(id));
        if (!error){
            numOfCp = data.length;
            for (let cp of data){
                if (cp.checkpoint_order == status+1) cpDate = new Date(cp.date);
            }
        }
        else throw error;
    }catch(err){
        console.error(err);
    }
    if (numOfCp == 0) console.log(id);
    //push to appropriate goal status
    if (startDate > currentDate && status >= 0){
        upcoming.push({index: parseInt(index), date: startDate, status: status, type: type, cp: numOfCp});
    }
    else if (status == numOfCp)
        completed.push({index: parseInt(index), date: startDate, status: status, type: type, cp: numOfCp});
    else if (startDate <= currentDate && cpDate >= currentDate){
        console.log(cpDate)
        ongoing.push({index: parseInt(index), date: startDate, status: status, type: type, cp: numOfCp});
    }
    else {
        console.log({index: index, date: start});
        failed.push({index: parseInt(index), date: startDate, status: status, type: type, cp: numOfCp});
    }
}

function sortGoals(goals){
    goals.sort((a,b) => b.date.getTime() - a.date.getTime());
    console.log(goals);
}

async function setUpcoming(){
    if (upcoming.length == 0){
        console.log("No Upcoming Goals")
    } 
    else {
        // setIndicators("upcoming", upcoming.length);
        await setCarousel("Upcoming", upcoming, upcoming.length);
    }
    
}

async function setOngoing(){
    if (ongoing.length == 0){
        console.log("No Ongoing Goals")
    } 
    else {
        //setIndicators("ongoing", ongoing.length);
        await setCarousel("Ongoing", ongoing, ongoing.length);
    }
    //button to delete should be gone 
}

async function setCompleted(){
    if (completed.length == 0){
        console.log("No Completed Goals")
    } 
    else {
        //setIndicators("completed", completed.length);
        await setCarousel("Completed", completed, completed.length);
    }
}

async function setFailed(){
    if (failed.length == 0){
        console.log("No Failed Goals")
    } 
    else{
        await setCarousel("Failed", failed, failed.length);
    }
}

function setIndicators(type, size){
    $('#'+type+'Carousel').append(
        $('<ol/>')
        .attr('id', 'ol'+type)
        .addClass('carousel-indicators caro-style')
    )
    let set = 1;
    if (size/3 > 1) set = Math.ceil(size/3);
    //<li data-target="#upcomingCarousel" data-slide-to="0" class="active"></li>
    for (let i =0; i < set; i++){
        if (i == 0){
            $('#'+'ol'+type).append(
                $('<li/>')
                .attr('data-target', '#'+type+'Carousel')
                .attr('data-slide-to', `${i}`)
                .addClass('active')
            );
        }
        else{
            $('#'+'ol'+type).append(
                $('<li/>')
                .attr('data-target', '#'+type+'Carousel')
                .attr('data-slide-to', `${i}`)
            )
        }
    }
    console.log($('#'+'ol'+type));

}

async function getUsername(id){
    try{
        let {data, error} = await _supabase
        .from('user')
        .select()
        .eq('user_id', id)
        if (!error) {
            return '@'+data[0].username;
        }
        else throw error;
    }catch(err){
        console.error(err);
    }
}
async function addDeleteButtonListener(){
    const mine = document.querySelectorAll(".delete_my");
        for (let i =0; i<mine.length; i++){
            console.log(mine[i].value);
            let my_goal = parseInt(mine[i].value);
            mine[i].addEventListener('click', async(e)=>{
                e.preventDefault();
                //removes goal from Goals table
                try{
                    let {data, error} = await _supabase
                    .from("Goals")
                    .delete({user_id: user_id})
                    .eq('id', my_goal);
                    if (!error){
                        console.log("Deleted goal from goal table:", my_goal);
                    }
                    else throw error;
                }catch(err){
                    console.error(err)
                }
                //removes goal checkpoints
                try{
                    let {data, error} = await _supabase
                    .from("Checkpoint")
                    .delete({user_id: user_id})
                    .eq('goal_id', my_goal);
                    if (!error){
                        console.log("Deleted checkpoints");
                    }
                    else throw error;
                }catch(err){
                    console.error(err);
                }
                //removes any users that joined
                try{
                    let {data, error} = await _supabase
                    .from("Join")
                    .delete({user_id: user_id})
                    .eq('goal_id', my_goal)
                    if (!error){
                        alert("Successfully deleted goal!");
                        window.location.replace("./../profile.html"); 
                    }
                    else throw error;
                }catch(err){
                    console.error(err);
                }
                
            })
        }
}

async function addUnjoinListener(){
    const joined = document.querySelectorAll(".unjoin_my");
    for (let i =0; i<joined.length; i++){
        console.log(joined[i].value);
        let joined_goal = parseInt(joined[i].value);
        joined[i].addEventListener('click', async(e)=>{
            e.preventDefault();
            try{
                let {data, error} = await _supabase
                .from("Join")
                .delete({user_id: user_id})
                .eq('goal_id', joined_goal);
                if (!error){
                    await getNumberOfPpl(joined_goal);
                    alert("Successfully unjoined goal!");
                    window.location.replace("./../profile.html"); 
                }
            }catch(err){
                console.error(err);
            }
            tryz
        })
    }
}


async function getNumberOfPpl(id){
    try{
        let {data, error} = await _supabase
        .from("Goals")
        .select('ppl_num')
        .eq('id', id)
        if (error) throw error;
        else{
            await updateNumOfPpl(data[0].ppl_num, id);
        }
    }catch(err){
        console.error(err);
    }
}

async function updateNumOfPpl(num, id){
    try{
        let {data, error} = await _supabase
        .from('Goals')
        .update({
            ppl_num: num - 1
        })
        .eq('id', id)
        if (error) throw error;
        // else {
        //     alert("Successfully unjoined goal!");
        // }
    }catch(err){
        console.error(err);
    }
}


async function setCarousel(type, array, size){
    $('.container').append(
        $('<h2/>')
        .addClass('headline')
        .text(type)
    )
    $('.container').append(
        $('<div/>')
        .addClass('carousel slide')
        .attr('id', type+'Carousel')
        .attr('data-ride', 'carousel')
        .attr('data-interval', 'false')
    )
    setIndicators(type, size);
    $('#'+type+'Carousel').append(
        $('<div/>')
        .attr('id', 'carousel-inner-'+type)
        .addClass('carousel-inner')
    )
    let counter = 0;
    for (let obj of array){
        let owner = '';
        let color = '';
        let buttons ='';
        if (obj.type == "joined"){
            color = 'rgb(255, 242, 219)';
            owner = await getUsername(goals[obj.index].user_id);
            buttons = `
            <div class="header-part">
            <a id="unjoingoal">
                <button class="btn btn-danger unjoin_my unjoin-button" value="${goals[obj.index].id}"> 
                    UNJOIN 
                </button>
            </a>
            </div>`;
        }
        else {
            color = 'rgb(241, 241, 244)';
            buttons = `
            <div class="header-part">
            <a id="editgoal">
                <button class="btn btn-success edit_my unjoin-button" onclick="setEditId(${goals[obj.index].id})"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                    </svg> 
                </button>
            </a>
            <a id="deletegoal">
                <button class="btn btn-danger delete_my unjoin-button" style="margin-left: -30px;" value="${goals[obj.index].id}">
                    x
                </button>
            </a>
            
            </div>`;
        }
        if (type == 'Upcoming'){

        }
        else if (type == 'Ongoing'){
            buttons =``;
        }
        else if (type == 'Completed'){
            buttons =``;
        }
        else {
            buttons =``;
        }
        let timeline =`<a onclick="setTimelineId(${goals[obj.index].id});" href="javascript:void(0);"">
        <div class="mini-timeline">
        `;
        for (let i =0; i < obj.cp; ++i){
            if (obj.status > i){
                timeline += `<div class="checkpoint active"></div>`
            }
            else {
                timeline += `<div class="checkpoint"></div>`;
            }
        }
        timeline += `</div>
        </a>`
        if (counter ==0){//first card
            $('#carousel-inner-'+type).append(
                $('<div/>')
                .attr('id', type+String(counter))
                .addClass('carousel-item active')
            )
            if(size > 3){
                $('#'+type+String(counter)).addClass('carousel-static');
            }
        }
        if (counter%3 == 0 && counter != 0){
            console.log(counter)
            $('#carousel-inner-'+type).append(
                $('<div/>')
                .attr('id', type+String(counter))
                .addClass('carousel-item')
            )
            if(size > 3){
                $('#'+type+String(counter)).addClass('carousel-static');
            }
        }
        let abbr = goals[obj.index].goal_name;
        if (goals[obj.index].goal_name.length > 17) abbr = goals[obj.index].goal_name.substr(0,17) + '...';
        $('#'+type+String(counter - counter%3)).append(
            $('<div/>')
            .addClass('card card-style mb-3')
            .attr('style', 'background-color: '+ color)
            .html(`
            <div class="card-body">
                <div class="card-header d-flex justify-content-between align-items-center" style="background-color: white;"> 
                    <div class="header-part">
                        <small class="text-muted" style="font-size: small;">${owner}</small>
                        <a style="color:black;" onclick="setTimelineId(${goals[obj.index].id});" href="javascript:void(0); title="${goals[obj.index].goal_name}" ">
                        <h5 class="card-title">${abbr}</h5>
                        </a>
                    </div>
                    <div class="header-part"> 
                        <h6 class="category ${goals[obj.index].category}-category">
                            ${categoryPaths[goals[obj.index].category]}
                              ${goals[obj.index].category}</h6>
                    </div>
                    <div class="header-part">
                    <small class="text-muted" style="font-size: xx-small;">${getDatePhrase(type, obj.date)}</small>
                    <h6>${obj.date.getMonth()+1}/${obj.date.getDate()+1}/${obj.date.getFullYear()}</h6>
                    </div>
                    
                    <div class="header-part">
                        <small class="text-muted" style="font-size: xx-small;"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" style="margin-right: -10px;" class="bi bi-person-fill" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                          </svg></small>
                        <h6>${goals[obj.index].ppl_num}</h6>
                    </div> <!--number of people joined-->
                    ${buttons}
                </div>
                <!--mini timeline-->
                ${timeline}
            </div>
        <!-- one card is done -->
          </div>
            `)
        )
        //add carousel prev and next buttons if theres more than 3 goals
        if (counter == size-1 && size > 3){
            $('#'+type+'Carousel').append(
                $('<a/>')
                .addClass("carousel-control-prev")
                .attr('href', `#${type}Carousel`)
                .attr('role', 'button')
                .attr('data-slide', 'prev')
                .html(
                   `
                   <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                   `
                )
            );
            $('#'+type+'Carousel').append(
                $('<a/>')
                .addClass("carousel-control-next")
                .attr('href', `#${type}Carousel`)
                .attr('role', 'button')
                .attr('data-slide', 'next')
                .html(`
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
                `)
            )
        }
        counter++;
    }
    //add the buttons for carousel
    $('#'+type+'Carousel').after(
        $('<br>')
        
    )
    $('#'+type+'Carousel').after(
        $('<hr>')
        
    )
    $('#'+type+'Carousel').after(
        $('<br>')
        
    )
    
}

function getDatePhrase(type, date){
    if (type == "Upcoming"){
        if ((date.getMonth() - currentDate.getMonth() == 0) && (date.getDate()+1 - currentDate.getDate() == 1))
            return "Starts in 1 day";
        else if ((date.getMonth() - currentDate.getMonth() == 0) && (date.getDate()+1 - currentDate.getDate() < 7)) 
            return "Starts in " + String((date.getDate()+1) - currentDate.getDate()) + " days";
        else if ((date.getMonth() - currentDate.getMonth() == 0) && (date.getDate()+1 - currentDate.getDate() < 14))
            return "Starts in 1 week";
        else if ((date.getMonth() - currentDate.getMonth() == 0) && (date.getDate()+1 - currentDate.getDate() > 7)) 
            return "Starts in " + String(Math.floor((date.getDate()+1 - currentDate.getDate())/7)) + " weeks";
        else if ((date.getMonth() - currentDate.getMonth() == 1))
            return "Starts in 1 month";
        else if ((date.getMonth() - currentDate.getMonth() > 1))
            return "Starts in " + String(date.getMonth() - currentDate.getMonth()) + " months";
    }
    else {
        let keyword = "Started";
        if (type == "Completed") keyword = "Completed"
        if ((date.getMonth() - currentDate.getMonth() == 0) && (date.getDate()+1 - currentDate.getDate() == 0))
            return keyword + " Today";
        else if ((currentDate.getMonth() - date.getMonth() == 0) && (currentDate.getDate() - (date.getDate()+1) == 1))
            return keyword + " 1 day ago";
        else if ((currentDate.getMonth() - date.getMonth() == 0) && (currentDate.getDate() - (date.getDate()+1) < 7))
            return keyword + " " + String(currentDate.getDate() - (date.getDate()+1)) + " days ago";
        else if ((currentDate.getMonth() - date.getMonth() == 0) && (currentDate.getDate() - (date.getDate()+1) < 14))
            return keyword + " 1 week ago";
        else if ((currentDate.getMonth() - date.getMonth() == 0) && (currentDate.getDate() - (date.getDate()+1) > 7)) 
            return keyword + " " + String(Math.floor((currentDate.getDate() - date.getDate())/7)) + " weeks ago";
         else if ((currentDate.getMonth() - date.getMonth() == 1) && (currentDate.getDate() - (date.getDate()+1) < 0)){
            if (Math.floor((currentDate.getDate() + (30 - (date.getDate()+1)))/7) == 1) return keyword + " 1 week ago";
            else return keyword + " " + String(Math.floor((currentDate.getDate() + (30 - (date.getDate()+1)))/7)) + " weeks ago";
         } 
        else if ((currentDate.getMonth() - date.getMonth() == 1) && (currentDate.getDate() - (date.getDate()+1) >= 0))
            return keyword + " 1 month ago";
        else if ((currentDate.getMonth() - date.getMonth() > 1))
            return keyword + " " + String(currentDate.getMonth() - date.getMonth()) + " months ago";
        else console.log(currentDate, date);
    }

    
    
}


//signout
let signout = document.getElementById('sign_out');
console.log(signout);
signout.addEventListener("click", async(e)=>{ 
    e.preventDefault();
    console.log(signout);
    try{
        let { data, error } = await _supabase.auth.signOut();
        if (!error){
            window.location.replace("./../index.html"); 
        }
        else throw error;
    }catch(err){
        console.error(err);
    }
});

// Function to calculate user's level based on completed goals
const setLevel = (completedGoals) => {
    let goalsToNextLevel = (completedGoals/3) > 1 ? Math.floor(completedGoals%3): completedGoals;
    let level = Math.floor(completedGoals/3);
    let percent = ((3-goalsToNextLevel)/3)*100 ==0 ? 5: ((3-goalsToNextLevel)/3)*100 ;
    console.log(percent);
    $('.level-box p').text('LEVEL ' + String(level));
    $('.progress-label').text('Progress to Level ' + String(level+1));
    $('.progress-bar-fill').css('width', String(percent)+'%');
    $('.progress-container small').css('font-size', '15px');
    $('.progress-container small').text('Complete ' + String(goalsToNextLevel)+ ' more '+(goalsToNextLevel ==1? ' goal!': ' goals!'));
    // while (completedGoals >= goalsToNextLevel) {
    //     completedGoals -= goalsToNextLevel;
    //     level++;
    //     goalsToNextLevel += 2;
    // }

    // return {
    //     level,
    //     progress: completedGoals / goalsToNextLevel
    // };
};

// Function to update level box
// const updateLevelBox = async () => {
//     try {
//         let { data, error } = await _supabase
//             .from('Goals')
//             .select('*')
//             .eq('user_id', user_id)
//             .eq('status', 'completed');
//         if (error) throw error;

//         const completedGoals = data.length;
//         const { level, progress } = calculateLevel(completedGoals);

//         const levelBox = document.getElementById('level-box');
//         levelBox.innerHTML = `Level ${level} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trophy" viewBox="0 0 16 16">
//             <path d="M3 1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h1v4a4 4 0 0 0 3 3.874V13H5a2 2 0 1 0 4 0h-2v-1.126A4 4 0 0 0 9 8V4h1a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3zm0 1h10v2H3V2zM5 9V4h6v5a3 3 0 0 1-6 0z"/>
//         </svg>`;

//         const progressBox = document.createElement('div');
//         progressBox.className = 'progress-box';
//         progressBox.innerHTML = `
//             <div class="progress-bar-container">
//                 <div class="progress-bar" style="width: ${progress * 100}%"></div>
//             </div>
//             <p>${Math.round(progress * 100)}% to next level</p>
//         `;

//         levelBox.appendChild(progressBox);

//         levelBox.addEventListener('mouseenter', () => {
//             progressBox.style.display = 'block';
//         });

//         levelBox.addEventListener('mouseleave', () => {
//             progressBox.style.display = 'none';
//         });

//     } catch (err) {
//         console.error(err);
//     }
// };

// CSS for progress box
// const style = document.createElement('style');
// style.innerHTML = `
//     .progress-box {
//         display: none;
//         position: absolute;
//         top: 50px;
//         left: 50%;
//         transform: translateX(-50%);
//         padding: 10px;
//         background: white;
//         border: 1px solid black;
//         z-index: 1000;
//         width: 200px;
//         text-align: center;
//     }
//     .progress-bar-container {
//         width: 100%;
//         background: #e0e0e0;
//         border-radius: 5px;
//         overflow: hidden;
//         margin-bottom: 5px;
//     }
//     .progress-bar {
//         height: 10px;
//         background: green;
//     }
// `;
// document.head.appendChild(style);

// Call the function to update level box
// updateLevelBox();
