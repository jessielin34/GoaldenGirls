import { _supabase } from "./client.js";
import { user } from "./user.js";

const currentDate = new Date();
let user_id = user.id;
//update user information
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
            $('.img-bg').css('background-image', 'url(./'+data[0].bg_pic+')');
        }
    }catch(err){
        console.error(err);
    }
}; updateUser();

let unJoinedGoals = [];//list of unjoind goal objects

//main function to display unjoined goals
async function displayGoals(){
    await getGoals();
    sortGoals(unJoinedGoals);
    await displayCarousel();
    await addJoinListener();
    $('.spinner-border').hide();
}displayGoals();
    
//retrieve all goals which are not joined or created by the user
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
    //get all goals not made by user
    try{
        let {data, error} = await _supabase
        .from("Goals")
        .select("*")
        .neq('user_id', user_id);
        if (!error){
            //check if goal has been joined by the user
            for (let i in data){
                let repeat = false;
                for (let j in goal_ids){
                    if (data[i].id == goal_ids[j]){
                        repeat = true;
                    }  
                }
                if (new Date(data[i].start_date) < new Date()) repeat = true;  
                //if it has not been push an object with all the necessary goal information to unJoinedGoals
                if (!repeat){
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
//get username based on user id
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
//sort goals based on increasing order
function sortGoals(goals){
    goals.sort((a,b) => a.date - b.date);
}
//display all relevant carousel goals
async function displayCarousel(){
    let categories = getCategories();
    for (let category of categories){
        setIndicators(category.category, category.size);
        displayCards(category.category, category.size);
    }
    console.log(categories);
}
//checks the goals of all categories and returns a list with all the categories
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
//sets indicators for each category carousel
function setIndicators(type, size){
    $('#'+type+'Carousel').append(
        $('<ol/>')
        .attr('id', 'ol'+type)
        .addClass('carousel-indicators caro-style')
    )
    //set is the section of the current carousel
    let set = 1;
    if (size/3 > 1) set = Math.ceil(size/3);
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
        let timeline = getTimeline(goal.cp_num, goal.id);
        if (goal.category == type){
            if (counter ==0){//first card make the section active
                $('#carousel-inner-'+type).append(
                    $('<div/>')
                    .attr('id', type+String(counter))
                    .addClass('carousel-item active')
                )
                if(size > 3){
                    $('#'+type+String(counter)).addClass('carousel-static');
                }
            }
            if (counter%3 == 0 && counter != 0){ //else if its the first card of next sections dont make it active
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
            //shorten goal name if itt's too long
            if (goal.name.length > 17) goal.name = goal.name.substr(0,17) + '...';
            //add goals to corresponding section
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
                           <small class="text-muted" style="font-size: xx-small;">${getDatePhrase(goal.date)}</small>
                           <h6>${goal.date.getMonth()+1}/${goal.date.getDate()+1}/${goal.date.getFullYear()}</h6>
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
            //add coursel next and prev buttons
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
    //add spacing between carousels
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
//return timeline html code based on size and goal id
function getTimeline(size, id){
    let timeline =`<a onclick="setTimelineId(${id});" href="javascript:void(0);">
        <div class="mini-timeline">`;
    for (let i =0; i < size; ++i){
        timeline += `<div class="checkpoint"></div>`;
    }
    timeline += `</div></a>`;
    return timeline;
}
//based on the goal date return the appropriate phrase relative to the current date
function getDatePhrase(date){
    if ((date.getMonth() - currentDate.getMonth() == 0) && (date.getDate()+1 - currentDate.getDate() == 0))
        return "Starts Today";
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

//add join button to all cards
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
                    alert("Unable to join goal :(");
                    throw error;
                } 
                else await getNumberOfPpl(join_goal);
            }catch(err){
                console.error(err);
            }
            
            
        });
    }
}
//get total number of people based on the goal_id
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
//update the total number of people based on the id and previous total
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
            window.location.replace("./joingoal.html"); 
        }
    }catch(err){
        console.error(err);
    }
}
