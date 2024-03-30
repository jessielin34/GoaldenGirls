// import { _supabase } from './client.js';
// let goal_id = 0;


// console.log(goals);


// $("button").onclick(function() {
    
// });
// export {goal_id};

function setGoalId(val){
    localStorage.setItem('goal_id', val);
    console.log(localStorage.getItem('goal_id'));
    console.log(val);
    window.location.replace("http://127.0.0.1:3000/timeline.html");
}