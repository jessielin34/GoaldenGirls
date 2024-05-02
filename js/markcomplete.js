
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

document.querySelectorAll('.mark-complete').forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
        let container = checkbox.closest('li'); // Getting the closest 'li' parent
        let image = container.querySelector('.checkpoint-image');
        let text = container.querySelector('.checkpoint-text'); // Get the description text
        let date = container.querySelector('.checkpoint-date'); // Get the date text
        if (checkbox.checked) {
            image.src = 'images/trophy-cp.png'; // Path to trophy image
            image.classList.add('completed');
            text.classList.add('completed'); // Apply strike-through to description text
            date.classList.add('completed'); // Apply strike-through to date
        } else {
            image.src = 'images/colorwheel-unscreen.gif'; // Path to original image
            image.classList.remove('completed');
            text.classList.remove('completed'); // Remove strike-through from description text
            date.classList.remove('completed'); // Remove strike-through from date
        }
    });
});