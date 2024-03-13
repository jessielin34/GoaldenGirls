const background = document.getElementsByClassName("profile-bg")[0];
const edit = document.querySelector('#edit');

background.addEventListener("mouseover", e =>{
    edit.style.visibility = "visible";

});
background.addEventListener("mouseout", e =>{
    edit.style.visibility = "hidden";
});

/* Edit background - can choose a pic but isnt getting replaced */
$(switchBackground);
var oFReader = new FileReader(),
    rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

oFReader.onload = function (oFREvent) {
    localStorage.setItem('b', oFREvent.target.result);
    switchBackground();
};

function switchBackground() {
    var backgroundImage = localStorage.getItem('b');
    if (backgroundImage) {
        $('body').css('background-image', 'url(' + backgroundImage + ')');
    } 
}

function loadImageFile(testEl) {
    if (!testEl.files.length) { return; }
    var oFile = testEl.files[0];
    if (!rFilter.test(oFile.type)) { alert("You must select a valid image file!"); return; }
    oFReader.readAsDataURL(oFile);
}