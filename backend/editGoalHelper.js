
export function addCheckpoint (counter) {
    var addButton = document.getElementById('addCP');
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
};
