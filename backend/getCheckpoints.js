//store the id of the goal and send user to editgoal
function setEditId(id){
    localStorage.setItem('goal_id', id);
    console.log(id);
    console.log(localStorage.getItem('goal_id'));
    window.location.replace("./editgoal.html")
}
//store the id of the goal and use it to display timeline
function setTimelineId(id){
    localStorage.setItem('goal_id', id);
    console.log(id);
    console.log(localStorage.getItem('goal_id'));
    window.location.replace("./timeline.html");
}