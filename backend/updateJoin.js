import { _supabase } from "./client.js";
//check user is signed in

// var script = document.createElement('script');
// script.src = 'https://code.jquery.com/jquery-3.6.3.min.js'; // Check https://jquery.com/ for the current version
// document.getElementsByTagName('head')[0].appendChild(script);

let user_id = "a";
const { data: { user },error } = await _supabase.auth.getUser();

const updateUser = async()=>{
    document.getElementById("user").textContent= user.email;
    user_id = user.id;

}; updateUser();
console.log(user);

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
checkDB();
