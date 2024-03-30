// const supabaseKey = 
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waGViaXJ6eWRlb2dreWprdGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MDY2OTksImV4cCI6MjAyNjE4MjY5OX0.qDac2fiFpZVq-TOfqIDfj9osvHOWpCBb6VIVgypSiMM';

// const supabaseUrl = 'https://mphebirzydeogkyjktjr.supabase.co';

// const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
// console.log(_supabase);

import {_supabase} from './client.js';

let user_id = "a";
const { data: { user }, error } = await _supabase.auth.getUser();
const updateUser = async()=>{
    document.getElementById("user").textContent= user.email;
    user_id = user.id;

}; updateUser();

//set goal_id to local storage
// function setGoalId(val) {
//     // let goal_id = parseInt(val);
//     // localStorage.setItem('goal_id', goal_id);
//     console.log(val);
// };

const checkDB = async()=> {
    
    let goal = "";
    const {data, error} = await _supabase
    .from("Goals")
    .select("*")
    .eq('user_id', user_id);
    if (data){
        //https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
        //https://youtu.be/4bqKagS5X88?si=VcavSSC0LfeBryZ3
        for (let i in data){
            goal += 
            `<a href="timeline.html" style="color: black !important; ">
                <div class="card card-style" style="width: 20rem; height: 15rem; display: inline-block; ">
                    <div class="card-body">
                        <a href="" id="deletegoal">
                            <button class="btn btn-danger" style="align-items: center">
                                x
                            </button>
                        </a>
                        <h5 class="card-title">${data[i].goal_name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Starts Soon!</h6>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <button class="btn btn-light" value="${data[i].id}" type="button" onclick="setGoalId(this.value)">
                            expand
                        </button>
                    </div>
                </div>
            </a>
            `
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
//signout

let signout = document.querySelector("#sign_out");
signout.addEventListener("click", async(e)=>{ 
    e.preventDefault();
    console.log("please");
    const { error } = await _supabase.auth.signOut();
    window.location.replace("http://127.0.0.1:3000/index.html"); //hard-coded
});

//delete goal


