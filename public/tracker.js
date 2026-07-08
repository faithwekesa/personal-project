const statusButtons = document.querySelectorAll('.status-btn');
const assistantStatus = document.getElementById('assistant-status');
const assistantBubble = document.getElementById('assistant-bubble');
const totalPercentageBadge = document.getElementById('total-percentage-badge');

const taskInput = document.getElementById('extra-task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksList = document.getElementById('extra-tasks-list');

const waterAmountSpan = document.getElementById('water-amount');
const waterGoalInput = document.getElementById('water-goal');
const btn500ml = document.getElementById('add-500ml');
const btn1liter = document.getElementById('add-1liter');
const btnResetWater = document.getElementById('reset-water');
let totalWater = 0.0;

const routineInputs = document.querySelectorAll('.routine-input');
const mealChecks = document.querySelectorAll('.meal-check');
const mealTargetInputs = document.querySelectorAll('.meal-target-input');
const mealProgressBar = document.getElementById('meal-progress-bar');
const tabButtons = document.querySelectorAll('.tab-button');

const scheduleUpload = document.getElementById('schedule-upload');
const previewPlaceholder = document.getElementById('preview-placeholder');
const timetableImgPreview = document.getElementById('timetable-img-preview');
const globalResetBtn = document.getElementById('global-reset-btn');

const summaryTriggerBtn = document.getElementById('summary-trigger-btn');
const summaryModal = document.getElementById('summary-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const summaryResultsList = document.getElementById('summary-results-list');

const navButtons = document.querySelectorAll('.nav-btn');
const trackerPages = document.querySelectorAll('.tracker-page');

const apiEndpoint = "http://localhost:3000/api/tracker";
let savedImageBase64 = "";

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        trackerPages.forEach(p => p.classList.remove('visible'));
        
        btn.classList.add('active');
        const targetPage = btn.getAttribute('data-page');
        document.getElementById(targetPage).classList.add('visible');
    });
});

function loadData() {
    fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
            totalWater = data.waterAmount || 0.0;
            waterAmountSpan.textContent = totalWater.toFixed(1);
            waterGoalInput.value = data.waterGoal || "4.0";
            
            if (data.routinePlans) {
                routineInputs.forEach((input, index) => {
                    input.value = data.routinePlans[index] || "";
                });
            }

            if (data.buttonStates) {
                statusButtons.forEach((button, index) => {
                    if (data.buttonStates[index] === 'Complete') {
                        button.textContent = 'Complete';
                        button.style.backgroundColor = '#4caf50';
                        button.style.color = 'white';
                    } else {
                        button.textContent = 'Incomplete';
                        button.style.backgroundColor = '#ffb300';
                        button.style.color = '#000';
                    }
                });
            }
            
            if (data.extraTasks) {
                tasksList.innerHTML = '';
                data.extraTasks.forEach(taskText => createTaskElement(taskText));
            }
            
            if (data.meals) {
                mealChecks.forEach((check, index) => {
                    check.checked = data.meals[index] || false;
                });
                updateMealProgress();
            }

            if (data.mealInputs) {
                mealTargetInputs.forEach((input, index) => {
                    input.value = data.mealInputs[index] || "";
                });
            }

            if (data.timetableImage) {
                savedImageBase64 = data.timetableImage;
                timetableImgPreview.src = savedImageBase64;
                timetableImgPreview.style.display = "block";
                previewPlaceholder.style.display = "none";
            } else {
                savedImageBase64 = "";
                timetableImgPreview.src = "";
                timetableImgPreview.style.display = "none";
                previewPlaceholder.style.display = "block";
            }

            calculateOverallProgress();
        });
}

function saveData() {
    const routinePlans = [];
    routineInputs.forEach(input => routinePlans.push(input.value));

    const buttonStates = [];
    statusButtons.forEach(button => buttonStates.push(button.textContent));

    const taskTexts = [];
    tasksList.querySelectorAll('li').forEach(li => taskTexts.push(li.textContent));

    const mealStates = [];
    mealChecks.forEach(check => mealStates.push(check.checked));

    const mealInputs = [];
    mealTargetInputs.forEach(input => mealInputs.push(input.value));

    const payload = {
        waterAmount: totalWater,
        waterGoal: waterGoalInput.value,
        routinePlans: routinePlans,
        buttonStates: buttonStates,
        extraTasks: taskTexts,
        meals: mealStates,
        mealInputs: mealInputs,
        timetableImage: savedImageBase64
    };

    fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
}

function calculateOverallProgress() {
    let totalItems = 0;
    let completedItems = 0;

    statusButtons.forEach(btn => {
        totalItems++;
        if (btn.textContent === 'Complete') completedItems++;
    });

    mealChecks.forEach(check => {
        totalItems++;
        if (check.checked) completedItems++;
    });

    totalItems++; 
    const currentGoal = parseFloat(waterGoalInput.value) || 4.0;
    if (totalWater >= currentGoal) {
        completedItems++;
    } else {
        completedItems += (totalWater / currentGoal);
    }

    const netPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    totalPercentageBadge.textContent = "Day Progress: " + netPercentage + "%";

    if (netPercentage === 100) {
        assistantStatus.textContent = 'Legend';
        assistantStatus.style.backgroundColor = '#9c27b0';
        assistantBubble.textContent = '"Absolute legend. You actually finished everything! Go relax, you earned it."';
    } else if (netPercentage > 50) {
        assistantStatus.textContent = 'Crushing It';
        assistantStatus.style.backgroundColor = '#4caf50';
        assistantBubble.textContent = '"Over halfway there! You are honestly killing it today."';
    } else if (netPercentage > 0) {
        assistantStatus.textContent = 'Locking In';
        assistantStatus.style.backgroundColor = '#007bff';
        assistantBubble.textContent = '"Solid start. One block at a time, no rush."';
    } else {
        assistantStatus.textContent = 'Hey!';
        assistantStatus.style.backgroundColor = '#6c757d';
        assistantBubble.textContent = '"Hey! Ready to get some stuff done today?"';
    }
}

statusButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        if (button.textContent === 'Incomplete') {
            button.textContent = 'Complete';
            button.style.backgroundColor = '#4caf50';
            button.style.color = 'white';
        } else {
            button.textContent = 'Incomplete';
            button.style.backgroundColor = '#ffb300';
            button.style.color = '#000';
        }
        calculateOverallProgress();
        saveData();
    });
});

routineInputs.forEach(input => input.addEventListener('input', saveData));
mealTargetInputs.forEach(input => input.addEventListener('input', saveData));
waterGoalInput.addEventListener('input', () => { calculateOverallProgress(); saveData(); });

function createTaskElement(text) {
    const li = document.createElement('li');
    li.textContent = text;
    li.style.padding = '6px 0';
    li.style.fontSize = '14px';
    li.style.borderBottom = '1px dashed #eee';
    li.style.cursor = 'pointer';
    li.addEventListener('click', function() {
        li.remove();
        saveData();
    });
    tasksList.appendChild(li);
}

addTaskBtn.addEventListener('click', function() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        createTaskElement(taskText);
        taskInput.value = '';
        saveData();
    }
});

taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTaskBtn.click();
});

btn500ml.addEventListener('click', function() {
    totalWater += 0.5;
    waterAmountSpan.textContent = totalWater.toFixed(1);
    calculateOverallProgress();
    saveData();
});

btn1liter.addEventListener('click', function() {
    totalWater += 1.0;
    waterAmountSpan.textContent = totalWater.toFixed(1);
    calculateOverallProgress();
    saveData();
});

btnResetWater.addEventListener('click', function() {
    totalWater = 0.0;
    waterAmountSpan.textContent = totalWater.toFixed(1);
    calculateOverallProgress();
    saveData();
});

function updateMealProgress() {
    let checkedCount = 0;
    mealChecks.forEach(function(check) {
        if (check.checked) checkedCount++;
    });
    const percentage = (checkedCount / mealChecks.length) * 100;
    mealProgressBar.style.width = percentage + '%';
}

mealChecks.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
        updateMealProgress();
        calculateOverallProgress();
        saveData();
    });
});

scheduleUpload.addEventListener('change', function() {
    const file = scheduleUpload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            savedImageBase64 = e.target.result;
            timetableImgPreview.src = savedImageBase64;
            timetableImgPreview.style.display = "block";
            previewPlaceholder.style.display = "none";
            saveData();
        };
        reader.readAsDataURL(file);
    }
});
