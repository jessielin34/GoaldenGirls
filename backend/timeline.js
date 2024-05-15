// const supabaseKey = 
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waGViaXJ6eWRlb2dreWprdGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MDY2OTksImV4cCI6MjAyNjE4MjY5OX0.qDac2fiFpZVq-TOfqIDfj9osvHOWpCBb6VIVgypSiMM';

// const supabaseUrl = 'https://mphebirzydeogkyjktjr.supabase.co';

// const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
// console.log(_supabase);

import {_supabase} from './client.js';
const categoryPaths = {
    Other:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" style="margin-right: -10px;" class="bi bi-tag-fill" viewBox="0 0 16 16">
<path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
</svg>`, 
    Lifestyle: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" style="margin-right: -10px;" class="bi bi-person-arms-up" viewBox="0 0 16 16">
    <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
    <path d="m5.93 6.704-.846 8.451a.768.768 0 0 0 1.523.203l.81-4.865a.59.59 0 0 1 1.165 0l.81 4.865a.768.768 0 0 0 1.523-.203l-.845-8.451A1.5 1.5 0 0 1 10.5 5.5L13 2.284a.796.796 0 0 0-1.239-.998L9.634 3.84a.7.7 0 0 1-.33.235c-.23.074-.665.176-1.304.176-.64 0-1.074-.102-1.305-.176a.7.7 0 0 1-.329-.235L4.239 1.286a.796.796 0 0 0-1.24.998l2.5 3.216c.317.316.475.758.43 1.204Z"/>
  </svg>`
};
const setTimeline = async()=> {
    let goal_id = parseInt(localStorage.getItem("goal_id"));
    console.log(goal_id);
    try{
        let { data: goal, error_}  = await _supabase
        .from("Goals")
        .select("")
        .eq("id", goal_id);
        if (!error_){
            $('#cp_title').text(goal[0].goal_name);
            $('#cp_description').text(goal[0].description);
            $('.category').html(
                `${categoryPaths[goal[0].category]} ${goal[0].category}`
            );
            $('.category').addClass(goal[0].category+'-category');
            let username = await getUsername(goal[0].user_id);
            $('.owner-name').text('@'+username);
            await setJoinedUsers(goal_id);
        }
        else throw error;
    }catch(err){
        console.error(err);
    }
   
    await setCheckpoints(goal_id);
}; setTimeline();

async function setCheckpoints(id){
    //$('.row').append($)
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
                        <input type="checkbox" class="mark-complete" id="cp${i+1}" style="display: none;">
                        <label for="cp${i+1}" style="display: none;">click to mark as complete</label>
                    </div>
                    </div>
                    <div class="media-body">
                        <h4 class="checkpoint-date">${new Date(data[i].date).getMonth()}/${new Date(data[i].date).getDate()}/${new Date(data[i].date).getFullYear()}</h4>
                        <p class="checkpoint-text">
                            ${data[i].name}
                        </p>
                    </div>
                    `

                    )
                )
            }
        
        // const template = document.createElement("li");
        // template.innerHTML = checkpoints.trim();
        // let sibling = document.getElementById("cp1");
        // let parent = sibling.parentNode;
        // parent.insertBefore(template, sibling);
        }  
        else throw error;
    }catch(err){
        console.error(err);
    }
    markCompleted();
}
function markCompleted(){
    document.querySelectorAll('.mark-complete').forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            let container = checkbox.closest('li'); // Getting the closest 'li' parent
            let image = container.querySelector('.checkpoint-image');
            let text = container.querySelector('.checkpoint-text'); // Get the description text
            let date = container.querySelector('.checkpoint-date'); // Get the date text
            if (checkbox.checked) {
                image.src = 'images/trophy-cp.png'; // Path to trophy image
                image.classList.add('completed');
                text.classList.add('completed'); // Apply strike-through to description text
                date.classList.add('completed'); // Apply strike-through to date
            } else {
                image.src = 'images/colorwheel-unscreen.gif'; // Path to original image
                image.classList.remove('completed');
                text.classList.remove('completed'); // Remove strike-through from description text
                date.classList.remove('completed'); // Remove strike-through from date
            }
        });
    });
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
