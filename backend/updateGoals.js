// const supabaseKey = 
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waGViaXJ6eWRlb2dreWprdGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MDY2OTksImV4cCI6MjAyNjE4MjY5OX0.qDac2fiFpZVq-TOfqIDfj9osvHOWpCBb6VIVgypSiMM';

// const supabaseUrl = 'https://mphebirzydeogkyjktjr.supabase.co';

// const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
// console.log(_supabase);

import {_supabase} from './client.js';
import { user } from './user.js';

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
        }
    }catch(err){
        console.error(err);
    }
}; updateUser();



const updateGoals = async()=> {
    let goals = "";
    let {data, error} = await _supabase
    .from("Goals")
    .select("*")
    .eq('user_id', user_id);
    if (data){
        //https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
        //https://youtu.be/4bqKagS5X88?si=VcavSSC0LfeBryZ3
        for (let i in data){
            goals += 
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
    await setUpcoming();
    await setOngoing();
    await setCompleted();
    await setFailed();
    await addDeleteButtonListener();
    await addUnjoinListener();
    $('.spinner-border').hide();

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
        await checkGoalStatus(goal, goals[goal].start_date, goals[goal].owner_status, goals[goal].id, "owned");
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
        await checkGoalStatus(goals.length - joined.length + parseInt(goal), joined[goal][0].start_date, joinedIds[goal].status, joined[goal][0].id, "joined");
    }
    
}
// consider deleting id param
async function checkGoalStatus(index, start, status, id, type){
    if (id == 22) console.log('learn react', status);
    let numOfCp = 0;
    let startDate = new Date(start);
    //check total number of cps
    try{
        let {data, error} = await _supabase
        .from('Checkpoint')
        .select()
        .eq('goal_id', parseInt(id));
        if (!error){
            numOfCp = data.length;
        }
        else throw error;
    }catch(err){
        console.error(err);
    }
    if (numOfCp == 0) console.log(id);
    //push to appropriate goal status
    if (startDate > currentDate && status == 0){
        upcoming.push({index: parseInt(index), date: startDate, status: status, type: type, cp: numOfCp});
    }
    else if (startDate < currentDate && status == numOfCp)
        completed.push({index: parseInt(index), date: startDate, status: status, type: type, cp: numOfCp});
    else if (startDate < currentDate && status > 0){
        ongoing.push({index: parseInt(index), date: startDate, status: status, type: type, cp: numOfCp});
    }
    else {
        //console.log({index: index, date: start});
        failed.push({index: parseInt(index), date: startDate, status: status, type: type, cp: numOfCp});
    }
}

function sortGoals(goals){
    goals.sort((a,b) => a.date - b.date);
    console.log(goals);
}

async function setUpcoming(){
    if (upcoming.length == 0){
        console.log("No Upcoming Goals")
    } 
    else {
        setIndicators("upcoming", upcoming.length);
        await setCarousel("upcoming", upcoming);
    }
    
}

async function setOngoing(){
    if (upcoming.length == 0){
        console.log("No Ongoing Goals")
    } 
    else {
        setIndicators("ongoing", ongoing.length);
        await setCarousel("ongoing", ongoing);
    }
    //button to delete should be gone 
}

async function setCompleted(){
    if (upcoming.length == 0){
        console.log("No Completed Goals")
    } 
    else {
        setIndicators("completed", completed.length);
        await setCarousel("completed", completed);
    }
}

async function setFailed(){
    if (failed.length == 0){
        console.log("No Failed Goals")
    } 
    else{
        setIndicators("failed", failed.length);
        await setCarousel("failed", failed);
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
    console.log(type, set);
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
async function setCarousel(type, array){
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
        let dayPhrase = '';
        if (obj.type == "joined"){
            color = 'rgb(255, 242, 219)';
            try{
                let {data, error} = await _supabase
                .from('user')
                .select()
                .eq('user_id', goals[obj.index].user_id)
                if (!error) {
                    owner = '@'+data[0].username;
                }
                else throw error;
            }catch(err){
                console.error(err);
            }
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
                <button class="btn btn-success edit_my unjoin-button" value="${goals[obj.index].id}" onclick="setGoalId(this)"> 
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
        if (type == 'upcoming'){
            dayPhrase = `
            <div class="header-part">
                <small class="text-muted" style="font-size: xx-small;">Starting in ${obj.date.getDate() - new Date().getDate()} days</small>
                <h6>${goals[obj.index].start_date}</h6>
            </div>`;
        }
        else if (type == 'ongoing'){
            dayPhrase = `
            <div class="header-part">
                <small class="text-muted" style="font-size: xx-small;">Started ${new Date().getDate() - obj.date.getDate()} days ago</small>
                <h6>${goals[obj.index].start_date}</h6>
            </div>`;
            buttons =``;
        }
        else if (type == 'completed'){
            buttons =``;
        }
        else {
            buttons =``;
        }
        let timeline =`<a href="timeline.html">
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
        if (counter == 0){
            $('#carousel-inner-'+type).append(
                $('<div/>')
                .addClass("carousel-item active")
                .attr('id', type+'-active')
                .html(`
                <div class="card card-style mb-3" style="background-color: ${color};">
                <div class="card-body">
                    <div class="card-header d-flex justify-content-between align-items-center" style="background-color: white;"> 
                        <div class="header-part">
                            <small class="text-muted" style="font-size: small;">${owner}</small>
                            <a href="timeline.html" style="color:black;">
                            <h5 class="card-title">${goals[obj.index].goal_name}</h5>
                            </a>
                        </div>
                        <div class="header-part"> 
                            <h6 class="category other-category">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" style="margin-right: -10px;" class="bi bi-tag-fill" viewBox="0 0 16 16">
                                    <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                  </svg>
                                  ${goals[obj.index].category}</h6>
                        </div>
                        ${dayPhrase}
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
        }
        else if (counter%3 == 0){
            console.log("new slide", counter);
            //add inactive section
            $('#carousel-inner-'+type).append(
                $('<div/>')
                .addClass("carousel-item")
                .attr('id', type+'-'+String(counter))
                .html(`
                <div class="card card-style mb-3" style="background-color: ${color};">
                <div class="card-body">
                    <div class="card-header d-flex justify-content-between align-items-center" style="background-color: white;"> 
                        <div class="header-part">
                            <small class="text-muted" style="font-size: small;">${owner}</small>
                            <a href="timeline.html" style="color:black;">
                            <h5 class="card-title">${goals[obj.index].goal_name}</h5>
                            </a>
                        </div>
                        <div class="header-part"> 
                            <h6 class="category other-category">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" style="margin-right: -10px;" class="bi bi-tag-fill" viewBox="0 0 16 16">
                                    <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                  </svg>
                                  ${goals[obj.index].category}</h6>
                        </div>
                        ${dayPhrase}
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
            );
        }
        else if(counter < 3){
            $('#' + type + '-active').append(
                $('<div/>')
                .addClass("card card-style mb-3")
                .attr('style', `background-color: ${color};`)
                .html(`
                <div class="card-body">
                    <div class="card-header d-flex justify-content-between align-items-center" style="background-color: white;"> 
                        <div class="header-part">
                            <small class="text-muted" style="font-size: small;">${owner}</small>
                            <a href="timeline.html" style="color:black;">
                            <h5 class="card-title">${goals[obj.index].goal_name}</h5>
                            </a>
                        </div>
                        <div class="header-part"> 
                            <h6 class="category other-category">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" style="margin-right: -10px;" class="bi bi-tag-fill" viewBox="0 0 16 16">
                                    <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                  </svg>
                                  ${goals[obj.index].category}</h6>
                        </div>
                        ${dayPhrase}
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
                `)
            )
        }
        else{
            $('#'+type+'-'+String(counter -(counter%3))).append(
                $('<div/>')
                .addClass("card card-style mb-3")
                .attr('style', `background-color: ${color};`)
                .html(`
                <div class="card-body">
                    <div class="card-header d-flex justify-content-between align-items-center" style="background-color: white;"> 
                        <div class="header-part">
                            <small class="text-muted" style="font-size: small;">${owner}</small>
                            <a href="timeline.html" style="color:black;">
                            <h5 class="card-title">${goals[obj.index].goal_name}</h5>
                            </a>
                        </div>
                        <div class="header-part"> 
                            <h6 class="category other-category">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" style="margin-right: -10px;" class="bi bi-tag-fill" viewBox="0 0 16 16">
                                    <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                  </svg>
                                  ${goals[obj.index].category}</h6>
                        </div>
                        ${dayPhrase}
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
                `)
            )
        }
        counter++;
    }
    //add the buttons for carousel
    if (counter > 3){
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
}

async function addDeleteButtonListener(){
    const mine = document.querySelectorAll(".delete_my");
        for (let i =0; i<mine.length; i++){
            console.log(mine[i].value);
            let my_goal = parseInt(mine[i].value);
            mine[i].addEventListener('click', async(e)=>{
                e.preventDefault();
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
                try{
                    let {data, error} = await _supabase
                    .from("Checkpoint")
                    .delete({user_id: user_id})
                    .eq('goal_id', my_goal);
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
                    alert("Successfully unjoined goal!");
                    window.location.replace("./../profile.html"); 
                }
            }catch(err){
                console.error(err);
            }
        })
    }
}
// async function getUser(id){
//     try{
//         let {data, error} = _supabase
//         .from('user')
//         .select()
//         .eq('user_id', id)
//         if (!error) {
//             console.log(data[0].username);
//             return data[0].username;
//         }
//         else throw error;
//     }catch(err){
//         console.error(err);
//     }
// }
// - checkStartDate() --> see checkpoint 1 and compare it to current date // later compare to user_progress_status// start_date!
// have global var that holds Goal status 
// have 3 global lists of objects: html, id, name, description, joined_peeps, 
// check and sort based on date
// - setUpcoming(id, name, description)
// check if its own or joined
// - setOngoing(id, name, description)
// - setCompleted(id, name, description)
// - checkJoined()

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

/*<ol class="carousel-indicators caro-style">
<li data-target="#ongoingCarousel" data-slide-to="0" class="active"></li>
<li data-target="#ongoingCarousel" data-slide-to="1"></li> <!--add more bar indicators if need be-->
<li data-target="#ongoingCarousel" data-slide-to="2"></li>
</ol>
<div class="carousel-inner">
  <div class="carousel-item active">
<!-- Carousel items (sets of cards) will be inserted here - first card starts here-->
<div class="card-set">
<div class="card card-style mb-3" style="background-color: rgb(241, 241, 244);">
  <div class="card-body">
      <div class="card-header d-flex justify-content-between align-items-center" style="background-color: white;"> 
          <div class="header-part">
              <a href="timeline.html" style="color:black;">
              <h5 class="card-title">Interview Practice</h5>
              </a>
          </div>
          <div class="header-part"> 
              <h6 class="category other-category">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" style="margin-right: -10px;" class="bi bi-tag-fill" viewBox="0 0 16 16">
                      <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                    </svg>
                  OTHER</h6>
          </div>
          <div class="header-part">
              <small class="text-muted" style="font-size: xx-small;">Starting in 2 days</small>
              <h6>12/12/2024</h6>
          </div>
          <div class="header-part">
              <small class="text-muted" style="font-size: xx-small;"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" style="margin-right: -10px;" class="bi bi-person-fill" viewBox="0 0 16 16">
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                </svg></small>
              <h6>26</h6>
          </div> <!--number of people joined-->
          <div class="header-part">
              <a id="editgoal">
                  <button class="btn btn-success edit_my unjoin-button" value="${data[i].id}" onclick="setGoalId(this)"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                      </svg> 
                  </button>
              </a>
              <a id="deletegoal">
                  <button class="btn btn-danger delete_my unjoin-button" style="margin-left: -30px;" value="${data[i].id}">
                      x
                  </button>
              </a>
              
          </div>
      </div>
      <!--mini timeline-->
      <a href="timeline.html">
      <div class="mini-timeline">
          <div class="checkpoint active"></div>  <!-- completed checkpoint -->
          <div class="checkpoint active"></div>         
          <div class="checkpoint"></div>         
          <div class="checkpoint"></div>         
          <div class="checkpoint"></div>         
          <div class="checkpoint"></div>         
          <!-- add more checkpoints as needed -->
      </div>
      </a>
  </div>
<!-- one card is done -->
</div>
<div class="card card-style mb-3" style="background-color: rgb(241, 241, 244);">
  <div class="card-body">
      <div class="card-header d-flex justify-content-between align-items-center" style="background-color: white;"> 
          <div class="header-part">
              <a href="timeline.html" style="color:black;">
              <h5 class="card-title">Interview Practice</h5>
              </a>
          </div>
          <div class="header-part"> 
              <h6 class="category lifestyle-category">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" style="margin-right: -10px;" class="bi bi-person-arms-up" viewBox="0 0 16 16">
                      <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                      <path d="m5.93 6.704-.846 8.451a.768.768 0 0 0 1.523.203l.81-4.865a.59.59 0 0 1 1.165 0l.81 4.865a.768.768 0 0 0 1.523-.203l-.845-8.451A1.5 1.5 0 0 1 10.5 5.5L13 2.284a.796.796 0 0 0-1.239-.998L9.634 3.84a.7.7 0 0 1-.33.235c-.23.074-.665.176-1.304.176-.64 0-1.074-.102-1.305-.176a.7.7 0 0 1-.329-.235L4.239 1.286a.796.796 0 0 0-1.24.998l2.5 3.216c.317.316.475.758.43 1.204Z"/>
                    </svg>
                  LIFESTYLE</h6>
          </div>
          <div class="header-part">
              <small class="text-muted" style="font-size: xx-small;">Starting in 2 days</small>
              <h6>12/12/2024</h6>
          </div>
          <div class="header-part">
              <small class="text-muted" style="font-size: xx-small;"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" style="margin-right: -10px;" class="bi bi-person-fill" viewBox="0 0 16 16">
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                </svg></small>
              <h6>26</h6>
          </div> <!--number of people joined-->
          <div class="header-part">
              <a id="editgoal">
                  <button class="btn btn-success edit_my unjoin-button" value="${data[i].id}" onclick="setGoalId(this)"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                      </svg> 
                  </button>
              </a>
              <a id="deletegoal">
                  <button class="btn btn-danger delete_my unjoin-button" style="margin-left: -30px;" value="${data[i].id}">
                      x
                  </button>
              </a>
              
          </div>
      </div>
      <!--mini timeline-->
      <a href="timeline.html">
      <div class="mini-timeline">
          <div class="checkpoint active"></div>  <!-- completed checkpoint -->
          <div class="checkpoint"></div>         
          <div class="checkpoint"></div>         
          <div class="checkpoint"></div>         
          <div class="checkpoint"></div>         
          <div class="checkpoint"></div>         
          <!-- add more checkpoints as needed -->
      </div>
  </a>
  </div>
</div>
<!--joined goal-->
<div class="card card-style mb-3" style="background-color: rgb(255, 242, 219);">
  <div class="card-body">
      <div class="card-header d-flex justify-content-between align-items-center" style="background-color: white;"> 
          <div class="header-part">
              <small class="text-muted" style="font-size: small;">@berry</small> <!--add a link here to go to the profile of this user later-->
              <a href="timeline.html" style="color:black;">
              <h5 class="card-title">Drink more water</h5>
              </a>
          </div>
          <div class="header-part"> 
              <h6 class="category education-category"> 
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" style="margin-right: -10px;" fill="currentColor" class="bi bi-book-half" viewBox="0 0 16 16">
                      <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                    </svg>
                  EDUCATION</h6>
          </div>
          <div class="header-part">
              <small class="text-muted" style="font-size: xx-small;">Starting in 2 days</small>
              <h6>12/12/2024</h6>
          </div>
          <div class="header-part">
              <small class="text-muted" style="font-size: xx-small;"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" style="margin-right: -10px;" class="bi bi-person-fill" viewBox="0 0 16 16">
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                </svg></small>
              <h6>26</h6>
          </div> <!--number of people joined-->
          <div class="header-part">
              <a id="unjoingoal">
                  <button class="btn btn-danger unjoin_my unjoin-button" value="${data[i].id}" onclick="setGoalId(this)"> 
                      UNJOIN 
                  </button>
              </a>
          </div>
      </div>
      <!--mini timeline-->
      <a href="timeline.html">
      <div class="mini-timeline">
          <div class="checkpoint active"></div>  <!-- completed checkpoint -->
          <div class="checkpoint active"></div>         
          <div class="checkpoint active"></div>         
          <div class="checkpoint"></div>         
          <div class="checkpoint"></div>         
          <div class="checkpoint"></div>         
          <!-- add more checkpoints as needed -->
      </div>
      </a>
  </div>
</div>
<!--joined goal done-->
</div>
</div>
<div class="carousel-item"> <!--next slide-->
  <div class="card card-style mb-3" style="background-color: rgb(255, 242, 219);">
      <div class="card-body">
          <div class="card-header d-flex justify-content-between align-items-center" style="background-color: white;"> 
              <div class="header-part">
                  <small class="text-muted" style="font-size: small;">@berry</small> <!--add a link here to go to the profile of this user later-->
                  <a href="timeline.html" style="color:black;">
                  <h5 class="card-title">Drink more water</h5>
                  </a>
              </div>
              <div class="header-part"> 
                  <h6 class="category work-category"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" style="margin-right: -10px;" fill="currentColor" class="bi bi-briefcase-fill" viewBox="0 0 16 16">
                          <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5"/>
                          <path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z"/>
                        </svg>
                      WORK</h6>
              </div>
              <div class="header-part">
                  <small class="text-muted" style="font-size: xx-small;">Starting in 2 days</small>
                  <h6>12/12/2024</h6>
              </div>
              <div class="header-part">
                  <small class="text-muted" style="font-size: xx-small;"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" style="margin-right: -10px;" class="bi bi-person-fill" viewBox="0 0 16 16">
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    </svg></small>
                  <h6>26</h6>
              </div> <!--number of people joined-->
              <div class="header-part">
                  <a id="unjoingoal">
                      <button class="btn btn-danger unjoin_my unjoin-button" value="${data[i].id}" onclick="setGoalId(this)"> 
                          UNJOIN 
                      </button>
                  </a>
              </div>
          </div>
          <!--mini timeline-->
          <a href="timeline.html">
          <div class="mini-timeline">
              <div class="checkpoint active"></div>  <!-- completed checkpoint -->
              <div class="checkpoint active"></div>         
              <div class="checkpoint"></div>         
              <div class="checkpoint"></div>         
              <div class="checkpoint"></div>         
              <div class="checkpoint"></div>         
              <!-- add more checkpoints as needed -->
          </div>
          </a>
      </div>
    </div>
    <div class="card card-style mb-3" style="background-color: rgb(255, 242, 219);">
      <div class="card-body">
          <div class="card-header d-flex justify-content-between align-items-center" style="background-color: white;"> 
              <div class="header-part">
                  <small class="text-muted" style="font-size: small;">@berry</small> <!--add a link here to go to the profile of this user later-->
                  <a href="timeline.html" style="color:black;">
                  <h5 class="card-title">Drink more water</h5>
                  </a>
              </div>
              <div class="header-part"> 
                  <h6 class="category fitness-category"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" style="margin-right: -10px;" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                        </svg>
                      FITNESS</h6>
              </div>
              <div class="header-part">
                  <small class="text-muted" style="font-size: xx-small;">Starting in 2 days</small>
                  <h6>12/12/2024</h6>
              </div>
              <div class="header-part">
                  <small class="text-muted" style="font-size: xx-small;"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" style="margin-right: -10px;" class="bi bi-person-fill" viewBox="0 0 16 16">
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    </svg></small>
                  <h6>26</h6>
              </div> <!--number of people joined-->
              <div class="header-part">
                  <a id="unjoingoal">
                      <button class="btn btn-danger unjoin_my unjoin-button" value="${data[i].id}" onclick="setGoalId(this)"> 
                          UNJOIN 
                      </button>
                  </a>
              </div>
          </div>
          <!--mini timeline-->
          <a href="timeline.html">
          <div class="mini-timeline">
              <div class="checkpoint active"></div>  <!-- completed checkpoint -->
              <div class="checkpoint active"></div>         
              <div class="checkpoint active"></div>         
              <div class="checkpoint"></div>         
              <div class="checkpoint"></div>         
              <div class="checkpoint"></div>         
              <!-- add more checkpoints as needed -->
          </div>
          </a>
      </div>
    </div>
</div>
</div>
<a class="carousel-control-prev" href="#ongoingCarousel" role="button" data-slide="prev">
<span class="carousel-control-prev-icon" aria-hidden="true"></span>
<span class="sr-only">Previous</span>
</a>
<a class="carousel-control-next" href="#ongoingCarousel" role="button" data-slide="next">
<span class="carousel-control-next-icon" aria-hidden="true"></span>
<span class="sr-only">Next</span>
</a> */