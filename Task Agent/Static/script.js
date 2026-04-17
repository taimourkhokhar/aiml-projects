async function generateSchedule() {
    const taskInput = document.getElementById('taskInput').value;
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const scheduleList = document.getElementById('scheduleList');
    const error = document.getElementById('error');

    // Reset
    results.classList.add('hidden');
    error.classList.add('hidden');
    scheduleList.innerHTML = '';

    // Validate
    if (!taskInput.trim()) {
        error.textContent = '⚠️ Please enter some tasks first!';
        error.classList.remove('hidden');
        return;
    }

    // Show loading
    loading.classList.remove('hidden');
    generateBtn.disabled = true;
    generateBtn.textContent = '⏳ Thinking...';

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tasks: taskInput })
        });

        const data = await response.json();

        if (data.error) {
            error.textContent = '❌ ' + data.error;
            error.classList.remove('hidden');
            return;
        }

        // Render schedule cards
        data.schedule.forEach(item => {
            const card = document.createElement('div');
            card.className = 'task-card';
            card.innerHTML = `
                <div class="priority-badge ${item.priority}">${item.priority}</div>
                <div class="task-info">
                    <div class="task-name">${item.task}</div>
                    <div class="task-meta">
                        <span>⏱️ ${item.estimated_minutes} min</span>
                    </div>
                    <div class="task-reasoning">💡 ${item.reasoning}</div>
                </div>
            `;
            scheduleList.appendChild(card);
        });

        results.classList.remove('hidden');

    } catch (err) {
        error.textContent = '❌ Something went wrong: ' + err.message;
        error.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
        generateBtn.disabled = false;
        generateBtn.textContent = '✨ Generate Schedule';
    }
}