import { _supabase } from "./client.js";
//check user is signed in

let user_id = "a";
const { data: { user },error } = await _supabase.auth.getUser();

const updateUser = async()=>{
    document.getElementById("user").textContent= user.email;
    user_id = user.id;

}; updateUser();
console.log(user);

const checkDB = async()=> {
    let goal = "";
    const {data, error} = await _supabase
    .from("Goals")
    .select("*")
    .neq('user_id', user_id);
    if (data){
        //https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
        //https://youtu.be/4bqKagS5X88?si=VcavSSC0LfeBryZ3
        for (let i in data){
            // console.log(data[i]);
            goal += 
            `<a style="color: black !important; ">
            <div class="card card-style" style="width: 18rem; height: 12rem; display: inline-block; ">
                <div class="card-body">
                    <h5 class="card-title">${data[i].goal_name}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${data[i].description}</h6>
                    <button type="button" class="btn btn-warning" value="${data[i].id}">Join</button>
                </div>
            </div>
        </a>`
        //     `<a href="timeline.html" style="color: black !important; ">
        //     <div class="card card-style" style="width: 18rem; height: 10rem; display: inline-block;">
        //         <div class="card-body">
        //             <h5 class="card-title">${data[i].goal_name}</h5>
        //             <h6 class="card-subtitle mb-2 text-muted">${data[i].description}</h6>
        //             <div class="progress">
        //                 <div class="progress-bar progress-bar-striped bg-warning" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
        //             </div>
        //         </div>
        //     </div>
        // </a>`
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

async function joinGoal() {
    const join = document.querySelectorAll('.btn');
    console.log(join);
    // val.preventDefault();
    // const {data, error} = await _supabase
    // .from("Join")
    // .insert({
    //     user_id: user.id,
    //     goal_id: val,
    // });
    // if (error){
    //     console.log(error);
    // }
    // console.log(val);

};
joinGoal();