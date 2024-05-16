// import { _supabase } from './client.js';
// let goal_id = 0;


// console.log(goals);


// $("button").onclick(function() {
    
// });
// export {goal_id};

function setEditId(id){
    localStorage.setItem('goal_id', id);
    console.log(id);
    console.log(localStorage.getItem('goal_id'));
    window.location.replace("./../editgoal.html")
}

function setTimelineId(id){
    localStorage.setItem('goal_id', id);
    console.log(id);
    console.log(localStorage.getItem('goal_id'));
    window.location.replace("./../timeline.html");
    // if (val.textContent.includes('expand')) window.location.replace("./../timeline.html"); 
    // else window.location.replace("./../editgoal.html")
}