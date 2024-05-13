import { _supabase } from "./client.js";
import { user } from "./user.js";
//check user is signed in

// var script = document.createElement('script');
// script.src = 'https://code.jquery.com/jquery-3.6.3.min.js'; // Check https://jquery.com/ for the current version
// document.getElementsByTagName('head')[0].appendChild(script);

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

//array with categories
let categories = [];


const checkDB = async()=> {
    let goal_ids = [];
    let { data: goals, error_} = await _supabase
    .from("Join")
    .select("*")
    .eq("user_id", user_id);
    for (let i =0; i <goals.length; i++){
        goal_ids.push(goals[i].goal_id);
    }
    console.log(goals[0]);
    let goal = "";
    const {data, error} = await _supabase
    .from("Goals")
    .select("*")
    .neq('user_id', user_id);
    if (data){
        //https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
        //https://youtu.be/4bqKagS5X88?si=VcavSSC0LfeBryZ3
        for (let i in data){
            let repeat = false;
            for (let j in goal_ids){
                if (data[i].id == goal_ids[j]){
                    repeat = true;
                }    
            }
            if (!repeat){
                let category = data[i].category;
                if (!categories.includes(category)){ //add category sections
                    categories.push(category);
                    $('.list-group').append(
                        $('<li/>')
                        .attr("id", category)
                        .addClass("list-group-item d-flex justify-content-between align-items-start bg-transparent")
                    );
                    $('#'+category).append(
                        $('<div/>')
                        .addClass("ms-2 me-auto")
                        .attr("id", category +"div")
                    )
                    $(`#${category}div`).append(
                        $('<div/>')
                        .addClass('container fw-bold')
                        .text(category)
                    )
                }
                //add goals
                $(`#${category}div`).append(
                    $('<a/>')
                    .html(`<a style="color: black !important; ">
                <div class="card card-style" style="width: 18rem; height: 12rem; display: inline-block; ">
                    <div class="card-body">
                        <h5 class="card-title">${data[i].goal_name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${data[i].description}</h6>
                        <button type="button" class="btn btn-warning join" value="${data[i].id}">Join</button>
                    </div>
                </div>
                </a>`)
                )
            }
            
            };
            console.log(categories);
            
            //add categories
            categories.sort();
            for (let cat of categories){
                
                

            }

            // const template = document.createElement("a");
            // //creat div with category name as textContent
            // template.innerHTML = goal.trim();
            // let sibling = document.getElementById("goal1");
            // let parent = sibling.parentNode;
            // parent.insertBefore(template, sibling.nextSibling); 
        
            //add join Event Listener
            const joined = document.querySelectorAll(".join");
            for (let i =0; i<joined.length; i++){
                let join_goal = parseInt(joined[i].value);
                joined[i].addEventListener('click', async()=>{
                    let {data, error} = await _supabase
                    .from("Join")
                    .insert({
                        user_id: user_id,
                        goal_id: join_goal,
                    });
                    if (error){
                        console.log(error);
                        alert("Unable to join goal :(")
                    }
                    else{
                        alert("Successfully joined!");
                        window.location.replace("./../joingoal.html"); 
                    } 
                });
            }
        }
    else{
        console.log(error);
    };

};

let unJoinedGoals = [];//list of unjoind goal objects

async function displayGoals(){
    await getGoals();
    sortGoals(unJoinedGoals);
    await displayCarousel();
    await addJoinListener();
    $('.spinner-border').hide();
    // await addJoinListener();
    // $('.spinner-border').hide();
}displayGoals();
    

//displayGoals();

async function getGoals(){
    let goal_ids = []; 
    try{
        let { data: goals, error} = await _supabase
        .from("Join")
        .select("goal_id")
        .eq("user_id", user_id);
        if (!error){
            for (let i =0; i <goals.length; i++){
                goal_ids.push(goals[i].goal_id); //get the goals the user has joined
            }
        }
        else throw error;
    }catch(err){
        console.error(err);
    }
    try{
        let {data, error} = await _supabase
        .from("Goals")
        .select("*")
        .neq('user_id', user_id);
        if (!error){
            //https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
            //https://youtu.be/4bqKagS5X88?si=VcavSSC0LfeBryZ3
            for (let i in data){
                let repeat = false;
                for (let j in goal_ids){
                    if (data[i].id == goal_ids[j]){
                        repeat = true;
                    }  
                }
                if (new Date(data[i].start_date) < new Date()) repeat = true;  
                //console.log(new Date(data[i].start_date).getDate());
                if (!repeat){
                    //constructor
                    let username = await getUsername(data[i].user_id);
                    console.log(username);
                    unJoinedGoals.push({
                        id: data[i].id,
                        name: data[i].goal_name, 
                        username: username, 
                        date: new Date(data[i].start_date), 
                        cp_num: data[i].cp_num,
                        ppl_num: data[i].ppl_num,
                        category: data[i].category
                    })
                }
            }
        }
    }catch(err){
        console.error(err);
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

function sortGoals(goals){
    goals.sort((a,b) => a.date - b.date);
    console.log(goals);
}
async function displayCarousel(){
    let categories = getCategories();
    for (let category of categories){
        //indicators
        setIndicators(category.category, category.size);
        displayCards(category.category, category.size);
    }
    console.log(categories);
}

function getCategories(){
    let categories = [];
    for (let goal of unJoinedGoals){
        if (categories.findIndex(x=>x.category == goal.category) == -1) {//make sure it's the first goal of the category
            categories.push({category:goal.category, size: 1});
            //add headline for each category
            $('.container').append(
                $('<h2/>')
                .addClass('headline')
                .text('+' + goal.category+ '+')
            )
            $('.container').append(
                $('<div/>')
                .addClass('carousel slide')
                .attr('id', goal.category+'Carousel')
                .attr('data-ride', 'carousel')
                .attr('data-interval', 'false')
            )
        }
        else{
            categories[categories.findIndex(x=>x.category == goal.category)].size +=1; //add +1 to size
        }
    }
    return categories;
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

function displayCards(type, size){
    let counter = 0;
    //wrapper for cards
    $('#'+type+'Carousel').append(
        $('<div/>')
        .attr('id', 'carousel-inner-'+type)
        .addClass('carousel-inner')
    )
    //add all cards to category
    for(let goal of unJoinedGoals){
        let currentDate = new Date();
        let timeline = getTimeline(goal.cp_num);
        if (goal.category == type){
            let datePhrase = '';
            if (goal.date.getDate() - currentDate.getDate() == 0 && goal.date.getMonth() - currentDate.getMonth == 0 && goal.date.getFullYear() - currentDate.getFullYear() == 0){
                datePhrase = "Starting today!"
            }
            else if (goal.date.getDate() - currentDate.getDate() == 1 && goal.date.getMonth() - currentDate.getMonth == 0 && goal.date.getFullYear() - currentDate.getFullYear() == 0){
                datePhrase = "Starting in 1 day"
            }
            else {
                datePhrase = `Starting in ${goal.date.getDate() - currentDate.getDate()} days`;
            }
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
            //add card
            console.log(goal.name);
            if (goal.name.length > 17) goal.name = goal.name.substr(0,17) + '...';
                $('#'+type+String(counter - counter%3)).append(
                    $('<div/>')
                    .addClass('card card-style mb-3')
                    .attr('style', 'background-color: rgb(255, 242, 219)')
                    .html(`
                    <div class="card-body">
                   <div class="card-header d-flex justify-content-between align-items-center" style="background-color: white;"> 
                       <div class="header-part">
                           <a style="color:black;" onclick="setTimelineId(${goal.id});" href="javascript:void(0);">
                           <h5 class="card-title">${goal.name}</h5>
                           </a>
                       </div>
                       <div class="header-part"> 
                            <small class="text-muted" style="font-size: small;">MADE BY</small> 
                            <h6>@${goal.username}</h6> <!--add a link here to go to the profile of this user later-->
                       </div>
                       <div class="header-part">
                           <small class="text-muted" style="font-size: xx-small;">${datePhrase}</small>
                           <h6>${goal.date.getMonth()}/${goal.date.getDate()}/${goal.date.getFullYear()}</h6>
                       </div>
                       <div class="header-part">
                           <small class="text-muted" style="font-size: xx-small;"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" style="margin-right: -10px;" class="bi bi-person-fill" viewBox="0 0 16 16">
                               <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                             </svg></small>
                           <h6>${goal.ppl_num}</h6>
                       </div> <!--number of people joined-->
                       <div class="header-part">
                        <a id="joingoal">
                            <button class="btn btn-info join_my unjoin-button border" value="${goal.id}"> 
                                JOIN 
                            </button>
                        </a>
                           
                       </div>
                   </div>
                   <!--mini timeline-->
                   ${timeline}
               </div>`)
                )
            
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
    }
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

function getTimeline(size){
    let timeline =`<a href="timeline.html">
        <div class="mini-timeline">`;
    for (let i =0; i < size; ++i){
        timeline += `<div class="checkpoint"></div>`;
    }
    timeline += `</div></a>`;
    return timeline;
}

async function addJoinListener(){
    let joined = document.querySelectorAll(".join_my");
    for (let i =0; i<joined.length; i++){
        let join_goal = parseInt(joined[i].value);
        joined[i].addEventListener('click', async()=>{
            try{
                let {data, error} = await _supabase
                .from("Join")
                .insert({
                    user_id: user_id,
                    goal_id: join_goal,
                    status: 0
                });
                if (error){
                    alert("Unable to join goal :(")
                    throw error;
                } 
                else await getNumberOfPpl(join_goal);
            }catch(err){
                console.error(err);
            }
            
            
        });
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
            ppl_num: num + 1
        })
        .eq('id', id)
        if (error) throw error;
        else {
            alert("Successfully joined goal!");
            window.location.replace("./../join.html"); 
        }
    }catch(err){
        console.error(err);
    }
}

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