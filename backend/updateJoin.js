import { _supabase } from "./client.js";
//check user is signed in

let user_id = "a";
const { data: { user },error } = await _supabase.auth.getUser();

const updateUser = async()=>{
    document.getElementById("user").textContent= user.email;
    user_id = user.id;

}; updateUser();
console.log(user);

//check join table
async function noJoin(){
    
};

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
                    console.log(goal_ids[j]);
                    repeat = true;
                }    
            }
            if (!repeat){
                goal += 
                `<a style="color: black !important; ">
                <div class="card card-style" style="width: 18rem; height: 12rem; display: inline-block; ">
                    <div class="card-body">
                        <h5 class="card-title">${data[i].goal_name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${data[i].description}</h6>
                        <button type="button" class="btn btn-warning join" value="${data[i].id}">Join</button>
                    </div>
                </div>
                </a>`
            }
            // console.log(data[i]);
            
        };
        const template = document.createElement("a");
        template.innerHTML = goal.trim();
        let sibling = document.getElementById("goal1");
        let parent = sibling.parentNode;
        parent.insertBefore(template, sibling.nextSibling);   
    }
    else{
        console.log(error);
    };

};
checkDB();

//update Join table

document.querySelectorAll(".join").every(addEventListener('click', async(val)=>{
    let goal_id = val.target.value;
    const {data, error} = await _supabase
    .from("Join")
    .insert({
        user_id: user.id,
        goal_id: goal_id,
    });
    if (error){
        console.log(error);
        alert("Unable to join goal :(")
    }
    else{
        alert("Successfully joined!");
        window.location.replace("http://127.0.0.1:3000/profile.html");
    }  
}));
// console.log(joins);
// async function updateJoin(val){
//     const {data, error} = await _supabase
//     .from("Join")
//     .insert({
//         user_id: user.id,
//         goal_id: val,
//     });
//     if (error){
//         console.log(error);
//     }
//     alert("Goal has been joined!");
// };

// // for (let goal = 0; goal < join.length; goal++){
//     // console.log(join[goal]);
//     // join[goal].addEventListener('click', async(e)=>{
//     //     e.preventDefault();
//     
// }



