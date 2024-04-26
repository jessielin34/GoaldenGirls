document.addEventListener('DOMContentLoaded', function () {
    var addButton = document.getElementById('addCP'); // Get the add button by its ID
    var dragSrcEl = null;

    // Reusable function to update checkpoint numbers and ids
    function updateCheckpointIdsAndNumbers() {
        document.querySelectorAll('.input-group.mb-3').forEach((group, index) => {
            group.querySelector('.input-group-text').textContent = `${index + 1}.`;
            group.querySelector('.text-input').id = `checkpoint-text${index + 1}`;
            group.querySelector('.date-input').id = `checkpoint-date${index + 1}`;
            group.querySelector('.text-input').name = `checkpoint-text${index + 1}`;
            group.querySelector('.date-input').name = `checkpoint-date${index + 1}`;
        });
    }

    // Functions for drag and drop
    function handleDragStart(e) {
        // Store data to transfer
        this.style.opacity = '0.4';
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', ''); // For Firefox compatibility
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this.classList.add('over');
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        // this / e.target is the current hover target.
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        this.classList.remove('over');

        if (dragSrcEl !== this) {
            // Swap the DOM elements
            swapElements(dragSrcEl, this);
            updateCheckpointIdsAndNumbers();
        }

        return false;
    }

    function handleDragEnd(e) {
        // Reset the opacity and remove 'over' class from all elements
        this.style.opacity = '1';
        var items = document.querySelectorAll('.input-group.mb-3');
        items.forEach(function (item) {
            item.classList.remove('over');
        });
    }

    function swapElements(src, target) {
        // Create markers in the DOM to mark places for swapping
        var srcNext = src.nextElementSibling;
        var targetNext = target.nextElementSibling;
        var parentNode = src.parentNode;

        if (srcNext === target) {
            parentNode.insertBefore(target, src);
        } else if (targetNext === src) {
            parentNode.insertBefore(src, target);
        } else {
            if (srcNext) parentNode.insertBefore(target, srcNext);
            else parentNode.appendChild(target);

            if (targetNext) parentNode.insertBefore(src, targetNext);
            else parentNode.appendChild(src);
        }
    }

    function addDragAndDropHandlers(element) {
        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragenter', handleDragEnter);
        element.addEventListener('dragover', handleDragOver);
        element.addEventListener('dragleave', handleDragLeave);
        element.addEventListener('drop', handleDrop);
        element.addEventListener('dragend', handleDragEnd);
    }

    // Function to add a delete button and its event listener
    function addDeleteButtonToCheckpoint(checkpoint) {
        var deleteBtn = document.createElement('span');
        deleteBtn.classList.add('delete-checkpoint');
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', function () {
            checkpoint.remove();
            updateCheckpointIdsAndNumbers();
        });
        checkpoint.appendChild(deleteBtn);
    }

    // Function to create a new checkpoint
    function createNewCheckpoint(counter) {
        var newCheckpoint = document.createElement('div');
        newCheckpoint.classList.add('input-group', 'mb-3');
        newCheckpoint.draggable = true;

        var newPrepend = document.createElement('div');
        newPrepend.classList.add('input-group-prepend');

        var newSpan = document.createElement('span');
        newSpan.classList.add('input-group-text');

        var newTextInput = document.createElement('input');
        newTextInput.type = 'text';
        newTextInput.classList.add('form-control', 'text-input');
        newTextInput.style.border = 'solid';

        var newDateInput = document.createElement('input');
        newDateInput.type = 'date';
        newDateInput.classList.add('form-control', 'date-input');
        newDateInput.style.border = 'solid';

        newPrepend.appendChild(newSpan);
        newCheckpoint.appendChild(newPrepend);
        newCheckpoint.appendChild(newTextInput);
        newCheckpoint.appendChild(newDateInput);

        addDeleteButtonToCheckpoint(newCheckpoint);
        addDragAndDropHandlers(newCheckpoint);

        var form = document.getElementById('goal-form');
        form.insertBefore(newCheckpoint, addButton);

        updateCheckpointIdsAndNumbers();
    }

    // Add drag and drop functionality to existing checkpoints
    let items = document.querySelectorAll('.input-group.mb-3');
    items.forEach(function (item) {
        item.draggable = true;
        addDragAndDropHandlers(item);
        addDeleteButtonToCheckpoint(item);
    });

    // Event listener for the Add checkpoint button
    addButton.addEventListener('click', function () {
        let checkpoints = document.querySelectorAll('.input-group.mb-3');
        createNewCheckpoint(checkpoints.length + 1);
    });

    updateCheckpointIdsAndNumbers();
});
