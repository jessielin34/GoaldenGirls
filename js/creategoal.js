document.addEventListener('DOMContentLoaded', function () {
    var addButton = document.getElementById('addCP'); // Get the add button by its ID

    // Function to update checkpoint numbers
    function updateCheckpointNumbers() {
        document.querySelectorAll('.input-group-prepend .input-group-text').forEach((span, index) => {
            span.textContent = (index + 1) + '.'; // Update the number
        });
    }

    // Function to add a delete button and its event listener
    function addDeleteButtonToCheckpoint(checkpoint) {
        var deleteBtn = document.createElement('span');
        deleteBtn.classList.add('delete-checkpoint');
        deleteBtn.innerHTML = '&times;'; // Using HTML entity for multiplication sign (×) as close button
        checkpoint.appendChild(deleteBtn);

        deleteBtn.addEventListener('click', function() {
            checkpoint.remove(); // Removes the '.input-group.mb-3' div
            updateCheckpointNumbers(); // Update the numbers after deleting
        });
    }

    // Function to create a new checkpoint
    function createNewCheckpoint(counter) {
        var newCheckpoint = document.createElement('div'); // Create a new div for input group
        newCheckpoint.classList.add('input-group', 'mb-3');

        var newPrepend = document.createElement('div');
        newPrepend.classList.add('input-group-prepend');

        var newSpan = document.createElement('span');
        newSpan.classList.add('input-group-text');
        newSpan.id = 'inputGroup-sizing-default';

        var newTextInput = document.createElement('input');
        newTextInput.type = 'text';
        newTextInput.classList.add('form-control', 'text-input');
        newTextInput.style.border = 'solid';
        newTextInput.id = 'checkpoint-text' + counter;

        var newDateInput = document.createElement('input');
        newDateInput.type = 'date';
        newDateInput.classList.add('form-control', 'date-input');
        newDateInput.style.border = 'solid';
        newDateInput.id = 'checkpoint-date' + counter;

        newPrepend.appendChild(newSpan);
        newCheckpoint.appendChild(newPrepend);
        newCheckpoint.appendChild(newTextInput);
        newCheckpoint.appendChild(newDateInput);
        addDeleteButtonToCheckpoint(newCheckpoint); // Add delete button to the checkpoint

        var form = document.getElementById('goal-form');
        form.insertBefore(newCheckpoint, addButton); // Insert new input before the add button

        updateCheckpointNumbers(); // Update the numbers after adding
    }

    // Add event listener to the existing checkpoints
    document.querySelectorAll('.input-group.mb-3').forEach(addDeleteButtonToCheckpoint);

    addButton.onclick = function () {
        let checkpoints = document.querySelectorAll('.input-group.mb-3');
        createNewCheckpoint(checkpoints.length + 1);
    };
});
/*
document.addEventListener('DOMContentLoaded', function () {
    var addButton = document.getElementById('addCP'); // Get the button by its ID

    addButton.onclick = function () {
        let checkpoints = document.querySelectorAll("input");
        var counter = checkpoints.length - 1;
        var newCheckpoint = document.createElement('div'); // Create a new div for input group
        newCheckpoint.classList.add('input-group', 'mb-3');

        var newPrepend = document.createElement('div');
        newPrepend.classList.add('input-group-prepend');

        var newSpan = document.createElement('span');
        newSpan.classList.add('input-group-text');
        newSpan.id = 'inputGroup-sizing-default';
        newSpan.textContent = counter + '.';

        var newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.classList.add('form-control');
        newInput.id = 'checkpoint' + counter;
        newInput.setAttribute('aria-label', 'Default');
        newInput.setAttribute('aria-describedby', 'inputGroup-sizing-default');
        newInput.style.border = 'solid';

        newPrepend.appendChild(newSpan);
        newCheckpoint.appendChild(newPrepend);
        newCheckpoint.appendChild(newInput);

        var form = document.getElementById('goal-form');
        form.insertBefore(newCheckpoint, addButton); // Insert new input before the button

        //counter++; // Increment the counter
    };
});
*/