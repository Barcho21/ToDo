let updateMode = false;
let switchMode = false;

const cancelDeleteButton = document.getElementById('cancelDeleteButton')
cancelDeleteButton.addEventListener('click', function () {
    const confirmDeleteDialog = document.getElementById('confirmDeleteDialog')
    confirmDeleteDialog.close();
});

const confirmDeleteButton = document.getElementById('confirmDeleteButton')
confirmDeleteButton.addEventListener('click', () => {
    const id = document.getElementById('idToDelete');

    fetch('http://localhost:9000/TODOapi/delete.php?id=' + id.value)
        .then(() => {
            alert('Registro eliminado');
            showTasks();
        })
});



function insert() {

    const id = document.getElementById('id').value;
    const name = document.getElementById('task_name').value;
    const description = document.getElementById('task_description').value;
    const date = document.getElementById('task_date').value;
    const status = document.getElementById('status').value;
    const task_register = {
        id: id,
        task_name: name,
        task_description: description,
        task_date: date,
        status: status
    };

    let apiFile = 'insert.php';
    if (switchMode == true) apiFile = 'status.php';
    else { if (updateMode == true) apiFile = 'update.php';}
    
    fetch(`http://localhost:9000/TODOapi/${apiFile}`, { method: "post", body: JSON.stringify(task_register) })
        .then(() => {
            showTasks()
            updateMode = false;
        })
        .catch((error) => {
            console.log(error);
            alert("No se pudo registrar la tarea");
        });
}

function showTasks() {
    fetch("http://localhost:9000/TODOapi/lists.php")
        .then(response => data = response.json())
        .then(data => {
            const tasks = data
            renderTasks(tasks)
        })
        .catch(error => {
            console.log(error)
            alert("Error al listar las tareas")
        })
}

function renderTasks(tasks) {

    clearTasks();

    for (let i = 0; i < tasks.length; i++) {

        const colName = document.createElement('td');
        colName.innerHTML = tasks[i].task_name;

        const colDescription = document.createElement('td');
        colDescription.innerHTML = tasks[i].task_description;

        const colDate = document.createElement('td');
        colDate.innerHTML = tasks[i].task_date;

        const colStatus = document.createElement('td');
        colStatus.innerHTML = tasks[i].task_status;

        const updateTd = document.createElement('td');
        const deleteTd = document.createElement('td');

        const changeStatus = document.createElement('td');

        const colUpdate = document.createElement('button');
        colUpdate.innerHTML = 'Editar';

        const colDelete = document.createElement('button');
        colDelete.innerHTML = 'Eliminar';

        const colTaskCompleted = document.createElement('button');
        const colTaskPending = document.createElement('button');

        colTaskCompleted.innerHTML = 'Completada';
        colTaskPending.innerHTML = 'Pendiente';

        colUpdate.setAttribute('onclick', `fillForm('${tasks[i].id}','${tasks[i].task_name}','${tasks[i].task_description}','${tasks[i].task_date}',)`);
        colDelete.setAttribute('onclick', `confirmDelete('${tasks[i].id}','${tasks[i].task_name}','${tasks[i].task_description}','${tasks[i].task_date}',)`);
        colTaskCompleted.setAttribute('onclick', `switchStatus('${tasks[i].id}', 'Completada')`);
        colTaskPending.setAttribute('onclick', `switchStatus('${tasks[i].id}', 'Pendiente')`);
        updateTd.appendChild(colUpdate)
        deleteTd.appendChild(colDelete)
        changeStatus.appendChild(colTaskPending)
        changeStatus.appendChild(colTaskCompleted)
        const table = document.getElementById('task_table');

        row = document.createElement('tr');
        row.setAttribute('class', 'tasks_data');
        row.appendChild(colName);
        row.appendChild(colDescription);
        row.appendChild(colDate);
        row.appendChild(colStatus);
        row.appendChild(colUpdate);
        row.appendChild(colDelete);
        row.appendChild(updateTd);
        row.appendChild(deleteTd);
        row.appendChild(changeStatus);
        table.appendChild(row);
    }
}

function clearTasks() {
    const tasks = document.getElementsByClassName('tasks_data');
    const arrayTasks = [...tasks];
    arrayTasks.map(task => task.remove());
}

function fillForm(id, name, description, date) {

    const txtId = document.getElementById('id');
    txtId.value = id;
    const txtName = document.getElementById('task_name')
    txtName.value = name;
    const txtDescription = document.getElementById('task_description')
    txtDescription.value = description;
    const txtDate = document.getElementById('task_date');
    txtDate.value = date;
    const txtStatus = document.getElementById('status');
    txtStatus.value = status;
    updateMode = true;

}

function confirmDelete(id, name, description, date) {

    const confirmDeleteDialog = document.getElementById('confirmDeleteDialog');
    confirmDeleteDialog.showModal();

    const spanName = document.getElementById('span_name')
    spanName.innerHTML = name;
    const spanDescription = document.getElementById('span_description')
    spanDescription.innerHTML = description;
    const spanDate = document.getElementById('span_date');
    spanDate.innerHTML = date;
    const idDelete = document.getElementById('idToDelete');
    idDelete.value = id;

}

function switchStatus(id, status) {

    const txtId = document.getElementById('id');
    txtId.value = id;
    const txtStatus = document.getElementById('status');
    txtStatus.value = status;
    switchMode = true;
    insert();
}