// import { _supabase } from './client.js';
// let goal_id = 0;


// console.log(goals);


// $("button").onclick(function() {
    
// });
// export {goal_id};

function setGoalId(val){
    localStorage.setItem('goal_id', val.value);
    console.log(val.textContent);
    console.log(localStorage.getItem('goal_id'));
    if (val.textContent.includes('expand')) window.location.replace("https://jessielin34.github.io/GoaldenGirls/timeline.html"); 
    else window.location.replace("http://127.0.0.1:3000/editgoal.html")
}