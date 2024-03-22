document.addEventListener('DOMContentLoaded', () => {
    const timelineDiv = document.getElementById("timeline");

    //fetch goals from server
    axios.get('/api/Goals')
    .then(response => {
        const goals = response.data;
        goals.forEach(goal => {
            //display each goal in the timeline
            const goalElement = document.createElement('div');
            goalElement.innerHTML = `
                <div class="goal">
                    <h2>${goal.name}</h2>
                    <p>${goal.description}</p>
                    <button onclick="updateProgress(${id}, ${created_at}, ${user_id}, ${goal_name}, ${description})">Update Progress</button>
                </div>
                `;
            timelineDiv.appendChild(goalElement);
        });
    })
    .catch(error => {
        console.error('Error fetching goals:', error);
    });
});
