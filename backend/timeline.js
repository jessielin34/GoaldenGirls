// const supabaseKey = 
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waGViaXJ6eWRlb2dreWprdGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MDY2OTksImV4cCI6MjAyNjE4MjY5OX0.qDac2fiFpZVq-TOfqIDfj9osvHOWpCBb6VIVgypSiMM';

// const supabaseUrl = 'https://mphebirzydeogkyjktjr.supabase.co';

// const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
// console.log(_supabase);

import {_supabase} from './client.js';
import { user } from './user.js';
import { categoryPaths } from './categories.js';


const currentDate = new Date();
const setTimeline = async()=> {
    let goal_id = parseInt(localStorage.getItem("goal_id"));
    let cp_status = 0;
    console.log(goal_id);
    try{
        let { data: goal, error_}  = await _supabase
        .from("Goals")
        .select("")
        .eq("id", goal_id);
        if (!error_){
            //set goal info
            $('#cp_title').text(goal[0].goal_name);
            $('#cp_description').text(goal[0].description);
            $('.category').html(
                `${categoryPaths[goal[0].category]} ${goal[0].category}`
            );
            $('.category').addClass(goal[0].category+'-category');
            let username = await getUsername(goal[0].user_id);
            $('.owner-name').text('@'+username);
            //check if goal has started
            console.log(goal[0].start_date);
            
            // $('.top-bar').eq(1).append(
            //     $('<a/>')
            //     .attr('id', 'joingoal')
            //     .html(
            //     `<button class="btn btn-info join_my unjoin-button border" value="${goal_id}"> 
            //         JOIN 
            //     </button>
            //     `)
            // );
            await setJoinedUsers(goal_id);
            if (goal[0].user_id == user.id){
                cp_status = goal[0].status;
                editButton('Goals', goal_id);
            }
            else {
                cp_status = await getJoinStatus(goal_id);
                if (cp_status != undefined) editButton('Join', goal_id);//if user has joinedd goal add editButtton functionality
                
            }
            if( new Date(goal[0].start_date) > currentDate && cp_status != undefined){
                $('.progress-bar').text('Goal Starts: ' + goal[0].start_date);
                $('.top-bar').eq(1).append(
                $('<div/>').html(`
                <div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
              
                `)
                );
            }
            
        }
        else throw error;
    }catch(err){
        console.error(err);
    }

    await setCheckpoints(goal_id, cp_status);
}; setTimeline();


async function setCheckpoints(id, status){
    console.log(status);
    try{
        let {data, error} = await _supabase
        .from("Checkpoint")
        .select("*")
        .eq("goal_id", id);
        if (data){
            console.log(data.length);
            for (let i in data){
                let addClass = (i%2 == 0) ? "even": "odd";
                if (i == 0) addClass = '';
                console.log(addClass);
                $('.row').append(
                    $('<li/>')
                    .html(`
                    <div class="left ${addClass}">
                    <div class="icon animate fadeInRight" data-wow-delay="1.2s">
                        <img src="images/colorwheel-unscreen.gif" alt="" class="checkpoint-image"/>
                        <input type="checkbox" class="mark-complete" id="cp${parseInt(i)+1}" style="display: none;">
                        <label for="cp${parseInt(i)+1}" style="display: none;">Mark as Completed</label>
                    </div>
                    </div>
                    <div class="media-body">
                        <h4 class="checkpoint-date">${new Date(data[i].date).getMonth()+1}/${new Date(data[i].date).getDate()+1}/${new Date(data[i].date).getFullYear()}</h4>
                        <p class="checkpoint-text">
                            ${data[i].name}
                        </p>
                    </div>
                    
                    `
                    )
                )
            }
            if (status == data.length) {
                $('.progress-bar').text('COMPLETED');
                $('.top-bar').eq(1).css("background-color", "gold");
                setCompleted(status);
            }
            else {
                setCompleted(status);//check off the proper # of cps
                markCompleted(); //allow cps to be edited
            }
        }  
        else throw error;
    }catch(err){
        console.error(err);
    }
}

async function setJoinedUsers(id){
    let joinedUsers = [];
    try{
        let {data, error} = await _supabase
        .from('Join')
        .select('user_id')
        .eq('goal_id', id)
        if (!error){
            for(let goal of data){
                joinedUsers.push(await getUsername(goal.user_id));
            }
        }
        else throw error;
    }catch(err){
        console.error(err);
    }
    $('#num-joined').append(
        $('<small/>')
        .addClass('text-muted')
        .html(
            `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" style="margin-right: -10px;" class="bi bi-person-fill" viewBox="0 0 16 16">
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
          </svg><br>${joinedUsers.length} Users Joined`
        )
    );
    for (let user of joinedUsers){
        $('#joined-users').append(
            $('<li/>')
            .html(
                `<img src="images/pro-img2.png" alt="Description of Image">
                <p>@${user}</p>`
            )
        )
    }
}

async function getUsername(id){
    try{
        let {data, error} = await _supabase
        .from('user')
        .select('username')
        .eq('user_id', id)
        if (!error && data.length!=0)return data[0].username;
        else throw error;
    }catch(err){
        console.error(err);
    }
}

async function getJoinStatus(goal_id){
    try{
        let {data, error} = await _supabase
        .from('Join')
        .select('status')
        .eq('goal_id', goal_id)
        .eq('user_id', user.id)
        if (!error && data.length!=0)return data[0].status;
        else {
            //user has not joined goal -> dont allow them to edit
            $('.progress-bar button')
            .text('Join')
            .attr('id', 'joingoal');
            await addJoinListener(user.id, goal_id);
            updateBack();
            throw error;
        }
    }catch(err){
        console.error(err);
    }
}

function updateBack(){
    $('#back').on('click', function(e){
        e.preventDefault();
        window.location.replace("./../joingoal.html");
    })
}

async function addJoinListener(user_id, goal_id){
    $('#joingoal').on('click', async function(){
        try{
            let {data, error} = await _supabase
            .from("Join")
            .insert({
                user_id: user_id,
                goal_id: goal_id,
                status: 0
            });
            if (error){
                alert("Unable to join goal :(");
                throw error;
            } 
            else await getNumberOfPpl(goal_id);
        }catch(err){
            console.error(err);
        }
    })
    
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
            ppl_num: num + 1
        })
        .eq('id', id)
        if (error) throw error;
        else {
            alert("Successfully joined goal!");
            window.location.replace("./../timeline.html"); 
        }
    }catch(err){
        console.error(err);
    }
}

function editButton(table, id){
    document.querySelector('.progress-bar button').addEventListener('click', function() {
        // Toggle checkboxes visibility
        document.querySelectorAll('.mark-complete, .mark-complete + label').forEach(function(elem) {
            elem.style.display = elem.style.display === 'none' ? 'block' : 'none';
        });
    
        // Toggle button text between "Edit Progress" and "Done"
        if (this.textContent === "Edit Progress") {
            this.textContent = "Done";
            // Additional actions to enable edit mode can be added here
        } else {
            this.textContent = "Edit Progress";
            //check # of checked cbs
            let checkboxes = document.querySelectorAll('.mark-complete');
            let status = 0;
            for (let checkbox of checkboxes){
                if(checkbox.checked) status++;
            }
            console.log(table,id);
            updateStatus(table, id, status)
            // Additional actions to disable edit mode can be added here
        }
    });
}

//
function markCompleted(){
    document.querySelectorAll('.mark-complete').forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            let checkboxLabel = document.querySelector('label[for="'+checkbox.id+'"]'); //get specific label for checkbox
            let container = checkbox.closest('li'); // Getting the closest 'li' parent
            let image = container.querySelector('.checkpoint-image');
            let text = container.querySelector('.checkpoint-text'); // Get the description text
            let date = container.querySelector('.checkpoint-date'); // Get the date text
            if (checkbox.checked) {
                image.src = 'images/trophy-cp.png'; // Path to trophy image
                image.classList.add('completed');
                text.classList.add('completed'); // Apply strike-through to description text
                date.classList.add('completed'); // Apply strike-through to date
                checkboxLabel.textContent = "Completed";
                checkboxLabel.style.backgroundColor = "lightgreen"
            } else {
                image.src = 'images/colorwheel-unscreen.gif'; // Path to original image
                image.classList.remove('completed');
                text.classList.remove('completed'); // Remove strike-through from description text
                date.classList.remove('completed'); // Remove strike-through from date
                checkboxLabel.textContent = "Mark as Completed";
                checkboxLabel.style.backgroundColor = "#ff6e7c"
            }
        });
    });
}


function setCompleted(int){
    for (let i=1; i <= int; i++){
        $('#cp'+String(i)).prop("checked", true); //check the checkbox
        let checkboxLabel = document.querySelector('label[for="'+"cp"+String(i)+'"]'); 
        let container = document.querySelector('#cp'+String(i)).closest('li');
        let image = container.querySelector('.checkpoint-image');
        let text = container.querySelector('.checkpoint-text'); // Get the description text
        let date = container.querySelector('.checkpoint-date'); // Get the date text
        image.src = 'images/trophy-cp.png'; // Path to trophy image
        image.classList.add('completed');
        text.classList.add('completed'); // Apply strike-through to description text
        date.classList.add('completed'); // Apply strike-through to date
        checkboxLabel.textContent = "Completed";
        checkboxLabel.style.backgroundColor = "lightgreen"
    }
}

async function updateStatus(table, id, status){
    let colId = "id";
    if (table == "Join") colId = 'goal_id';
    try{
        let {data, error} = await _supabase
        .from(table)
        .update({status: status})
        .eq(colId, id)
        .eq('user_id', user.id)
        if (error){
            throw error;
        }
    }catch(err){
        console.error(err);
    }
}
