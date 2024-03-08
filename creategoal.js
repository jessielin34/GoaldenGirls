
document.getElementById("addCP").onclick = function() {
    var form = document.getElementById("goal-form");
    var input = document.createElement("textarea");
    input.type = "text";
    var br = document.createElement("br");
    form.appendChild(input);
    form.appendChild(br);
}