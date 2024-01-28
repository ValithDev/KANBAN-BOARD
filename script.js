const ContainerRef = document.querySelector('.Cointainer');
const AddNewTaskRef = document.querySelectorAll('.CreateNewTask');
const CreateNewButtonRef = document.querySelector('.CreateButton');
const NewtaskRef = document.querySelector('.new-task-model')
const CancelButtonRef = document.querySelector('.CancelButton');
const DeleteHeadButtonRef = document.querySelector('.Delete');
const SearchAreaRef = document.querySelector('.Search');

const TaskList =JSON.parse(localStorage.getItem('TaskList') || '[]');
let Task_added_postion = null;  

function renderTaskList() {
    TaskList.forEach((TaskList) => {
        createNewTaskInDOM(TaskList);
    })
}
renderTaskList();

// Add New Task 
ContainerRef.addEventListener('click', function(e){
    const ClickePosition = e.target.classList;

    if (ClickePosition.contains('CreateNewTask')) {

        NewtaskRef.classList.remove('hide');
        
        const status_postion = e.target.closest('.Status');
        Task_added_postion = status_postion.querySelector('.Task');
    }
}); 

// Create New Task
CreateNewButtonRef.addEventListener('click', function(e) {       
    const CreateNewRef = document.querySelector('.new-task-model');

    const Task_Title = (CreateNewRef.querySelector('.Task-Title'));
    const Task_Detail = (CreateNewRef.querySelector('.Task-details'));

    const Task_Title_Value = Task_Title.value;
    const Task_Detail_Value = Task_Detail.value;

    const NewTaskObj = {
        NewTaskStatus : Task_added_postion.dataset.priority,
        NewTaskTitle : Task_Title_Value,
        NewTaskDetail : Task_Detail_Value,
        id: Math.random()
    };

    addTasksInData(NewTaskObj);
    createNewTaskInDOM(NewTaskObj);

    Task_Title.value = '';
    Task_Detail.value = '';
    NewtaskRef.classList.add('hide');
});


//Add New Task in Data
function addTasksInData(NewTaskObj) {
    TaskList.push(NewTaskObj)
}

//Create new task in the DOM Tree
function createNewTaskInDOM (NewTaskObj) {
    const NewTask = document.createElement('div');
    NewTask.setAttribute('draggable', true);
    NewTask.className = 'New_Task';
    NewTask.dataset.id = NewTaskObj.id;

    NewTask.innerHTML =  `
        <div class="New_Task_Title"><textarea>${NewTaskObj.NewTaskTitle}</textarea></div>
        <div class="New_Task_Details"><textarea>${NewTaskObj.NewTaskDetail}</textarea></div>
        <div class="task-delete-icon"><i class="fa-solid fa-trash"></i></div>
    `;

    const newtaskAdded = NewTaskObj.NewTaskStatus;
    //console.log(newtaskAdded);
    const NewTaskAdddedPosition = document.querySelector(`[data-priority= ${newtaskAdded}]`)   
    //console.log(NewTaskAdddedPosition);

    NewTaskAdddedPosition.appendChild(NewTask);
    localStorage.setItem('TaskList', JSON.stringify(TaskList));
    //console.log(TaskList);
}
 


//Cancel button
CancelButtonRef.addEventListener('click', function(e) {
    NewtaskRef.classList.add('hide');
});


//Delete enable & Disable, color change
DeleteHeadButtonRef.addEventListener('click', function(e) {
    const isDeleteEnabled = e.target.classList.contains('enabled');
    if (isDeleteEnabled) {
        e.target.classList.remove('enabled');
        ContainerRef.dataset.delete = true;
        DeleteHeadButtonRef.classList.remove('DeleteColorChange');
        console.log(DeleteHeadButtonRef);

    } else {
        e.target.classList.add('enabled');
        ContainerRef.dataset.delete = false;
        DeleteHeadButtonRef.classList.add('DeleteColorChange');
        console.log(DeleteHeadButtonRef);
    }
});


//Delete Task when delete button is pressed in DOM
ContainerRef.addEventListener('click', function(e){
    const ClickePosition = e.target.classList;
    if (ClickePosition.contains('fa-solid')) {
        const DeleteTask = e.target.closest('.New_Task');
        DeleteTask.remove();
        DeleteFromData(DeleteTask.dataset.id);
    }
});

//Delete Task in Data
function DeleteFromData(DeleteTaskId) {
    const selectedTaskIdx = TaskList.findIndex((TaskList) => Number(TaskList.id) === Number(DeleteTaskId));
    TaskList.splice(selectedTaskIdx, 1);
    localStorage.setItem('TaskList', JSON.stringify(TaskList));
}



// Search task
SearchAreaRef.addEventListener('keyup', function(e) {

    //clearAll all the Task in DOM
    const AllTaskInDOM = document.querySelectorAll('.Task');

    AllTaskInDOM.forEach((Task) => {
        Task.innerHTML = '';
    })

    TaskList.forEach((TaskList) => {
        const CurrentTitle = TaskList.NewTaskTitle.toLowerCase();
        const CurrentDetail = TaskList.NewTaskDetail.toLowerCase();
        const SearchText = e.target.value.toLowerCase();
        if (SearchText.trim() === "" 
            || CurrentTitle.includes(SearchText) 
            || CurrentDetail.includes(SearchText)
        ) {
            createNewTaskInDOM(TaskList);
        }
    })
});



// Drag and drop functionality
ContainerRef.addEventListener('dragstart', function(e) {
    e.dataTransfer.setData('text/plain', null);
    const draggedTask = e.target.closest('.New_Task');
    draggedTask.classList.add('dragging');
});

ContainerRef.addEventListener('dragover', function(e) {
    e.preventDefault();
});

ContainerRef.addEventListener('drop', function(e) {
    e.preventDefault();
    const statusPosition = e.target.closest('.Status');
    if (!statusPosition) return; // If the drop target is not a status container, exit
    const taskContainer = statusPosition.querySelector('.Task');
    const draggingTask = ContainerRef.querySelector('.dragging');
    if (draggingTask) {
        taskContainer.appendChild(draggingTask);
        draggingTask.classList.remove('dragging');

        // need to update that task status in TaskList after 
        const taskPriority = taskContainer.dataset.priority;
        const taskId = draggingTask.dataset.id;
        
        const PriorityChangeTaskIdx = TaskList.findIndex((TaskList) => Number(TaskList.id) === Number(taskId));
        TaskList[PriorityChangeTaskIdx].NewTaskStatus = taskPriority;
        localStorage.setItem('TaskList', JSON.stringify(TaskList));
        
    }
});