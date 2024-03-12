const background = document.getElementsByClassName("profile-bg")[0];
const edit = document.querySelector('#edit');

background.addEventListener("mouseover", e =>{
    edit.style.visibility = "visible";

});
background.addEventListener("mouseout", e =>{
    edit.style.visibility = "hidden";
});