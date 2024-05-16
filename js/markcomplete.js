
document.addEventListener("DOMContentLoaded", function (){
    document.querySelector('.progress-bar button').addEventListener('click', function() {
        // Toggle checkboxes visibility
        document.querySelectorAll('.mark-complete, .mark-complete + label').forEach(function(elem) {
            elem.style.display = elem.style.display === 'none' ? 'block' : 'none';
        });
    
        // Toggle button text between "Edit Progress" and "Done"
        if (this.textContent === "Edit Progress") {
            this.textContent = "Done";
            // Additional actions to enable edit mode can be added here
        } else {
            this.textContent = "Edit Progress";
            // Additional actions to disable edit mode can be added here
        }
    });
});
