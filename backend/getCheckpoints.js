import { _supabase } from './client.js';
let goal_id = 0;

function getGoalID(val) {
    let goal_id = parseInt(val);
    console.log(goal_id);
};


// let buttons = document.getElementsByClassName('btn');
// for (let i=0 ; i < buttons.length ; i++){
//     (function(index){
//         buttons[index].onclick = function(){
//             goal_id = parseInt(buttons[index].value);
//             console.log(goal_id);
//             alert("I am button " + buttons[index].value);
//         };
//     })(i)
// }

export {goal_id};