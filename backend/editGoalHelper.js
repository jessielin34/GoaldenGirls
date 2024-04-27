
export function addCheckpoint (counter) {
    const addButton = document.getElementById('addCP');
    var newCheckpoint = document.createElement('div');
    newCheckpoint.classList.add('input-group', 'mb-3');
    //newCheckpoint.draggable = true;

    var newPrepend = document.createElement('div');
    newPrepend.classList.add('input-group-prepend');

    var newSpan = document.createElement('span');
    newSpan.classList.add('input-group-text');
    newSpan.textContent = counter + '.';

    var newTextInput = document.createElement('input');
    newTextInput.type = 'text';
    newTextInput.id = 'checkpoint-text' + String(counter);
    newTextInput.classList.add('form-control', 'text-input');
    newTextInput.style.border = 'solid';
    

    var newDateInput = document.createElement('input');
    newDateInput.type = 'date';
    newDateInput.classList.add('form-control', 'date-input');
    newDateInput.id = 'checkpoint-date' + String(counter);
    newDateInput.style.border = 'solid';


    newPrepend.appendChild(newSpan);
    newCheckpoint.appendChild(newPrepend);
    newCheckpoint.appendChild(newTextInput);
    newCheckpoint.appendChild(newDateInput);

    addDeleteButtonToCheckpoint(newCheckpoint);
    //addDragAndDropHandlers(newCheckpoint);

    var form = document.getElementById('goal-form');
    form.insertBefore(newCheckpoint, addButton);
    //updateCheckpointIdsAndNumbers();
};


function addDeleteButtonToCheckpoint(checkpoint) {
    var deleteBtn = document.createElement('span');
    deleteBtn.classList.add('delete-checkpoint');
    deleteBtn.innerHTML = '&times;'; // Using HTML entity for multiplication sign (×) as close button
    checkpoint.appendChild(deleteBtn);

    deleteBtn.addEventListener('click', function() {
        checkpoint.remove(); // Removes the '.input-group.mb-3' div
        //updateCheckpointNumbers(); // Update the numbers after deleting
    });
}

