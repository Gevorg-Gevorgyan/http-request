window.onload = main;

const HOST = 'https://jsonplaceholder.typicode.com';

const END_POINT = {
    USERS: 'users',
    POSTS: 'posts'
}

const METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
}

let currentUser = {
    id: null,
    name: null,
    username: null,
    id: null,
    email: null,
    phone: null
}

let tBody;
let updateUsers;
let editUser;

let nameInput;
let userNameInput;
let emailInput;
let phoneInput;

function doRequest(method, endPoint, body, succesCB, errorCB) {
    const options = {
        method: method,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    }
    fetch(`${HOST}/${endPoint}`, options)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            return succesCB(data)
        })
        .catch((err) => {
            return errorCB(err)
        });
};

const API = {};

API.GET_ACTION = function(endPoint, succesCB, errorCB) {
    return doRequest(METHODS.GET, endPoint, null, succesCB, errorCB);
}
API.POST_ACTION = function(endPoint, body, succesCB, errorCB) {
    return doRequest(METHODS.POST, endPoint, body, succesCB, errorCB);
}
API.PUT_ACTION = function(endPoint, body, succesCB, errorCB) {
    return doRequest(METHODS.PUT, endPoint, body, succesCB, errorCB);
}
API.DELETE_ACTION = function(endPoint, succesCB, errorCB) {
    return doRequest(METHODS.DELETE, endPoint, null, succesCB, errorCB);
}

function main() {
    tBody = document.getElementById('tbodyId');

    nameInput = document.getElementById('nameInputId');
    nameInput.addEventListener('change', ({target: {value}}) => nameInput.value = value);

    userNameInput = document.getElementById('userNameInputId');
    userNameInput.addEventListener('change', ({target: {value}}) => userNameInput.value = value);

    emailInput = document.getElementById('emailInputId');
    emailInput.addEventListener('change', ({target: {value}}) => emailInput.value = value);

    phoneInput = document.getElementById('phoneInputId');
    phoneInput.addEventListener('change', ({target: {value}}) => phoneInput.value = value);

    const createButton = document.getElementById("createButtonId");
    createButton.addEventListener('click', createUser);

    const saveButton = document.getElementById('saveButtonId');
    saveButton.addEventListener('click', onSave);

    const canselButton = document.getElementById('canselButtonId');
    canselButton.addEventListener('click', onCansel);

    getUsers();
}

function getUsers() {

    API.GET_ACTION(`${END_POINT.USERS}`, drawUers, console.error);

}

function drawUers(users) {
    updateUsers = users;
    
    const titleRow = createRow();
    titleRow.classList.add('titleRow');

    titleRow.appendChild(createColumn('Id'));
    titleRow.appendChild(createColumn('Name'));
    titleRow.appendChild(createColumn('Username'));
    titleRow.appendChild(createColumn('Email'));
    titleRow.appendChild(createColumn('Phone'));
    titleRow.appendChild(createColumn('Changing user'));

    tBody.appendChild(titleRow);

    users.forEach((user) => {
        const row = createRow();

        row.appendChild(createColumn(user.id));
        row.appendChild(createColumn(user.name));
        row.appendChild(createColumn(user.username));
        row.appendChild(createColumn(user.email));
        row.appendChild(createColumn(user.phone));
        row.appendChild(createButtonsColumn(users, user));

        tBody.appendChild(row);
    });
}

function createButtonsColumn(users, user) {
    const column = document.createElement('td');

    const EditButton = createButton("Edit", () => onEdit(user));
    const deleteButton = createButton("Delete", () => onDelete(users, user));

    column.appendChild(EditButton);
    column.appendChild(deleteButton);

    return column;
}

function createButton(label, onClick) {
    const button = document.createElement('button');
    button.addEventListener('click', onClick)
    button.innerText = label;

    return button;
}

function createRow() {
    const row = document.createElement('tr');

    return row;
}

function createColumn(text) {
    const column = document.createElement('td');
    column.innerText = text;

    return column;
}

function createUser() {
    openPopup();
 }

 function openPopup() {

    nameInput.value = currentUser.name;
    userNameInput.value = currentUser.username;
    emailInput.value = currentUser.email;
    phoneInput.value = currentUser.phone;

     const popup = document.getElementById('popupId');
     popup.classList.add('show');
 }

 function closePopup() {
    const popup = document.getElementById('popupId');
    popup.classList.remove('show');

    currentUser = {
        id: null,
        name: null,
        username: null,
        email: null,
        phone: null
    };
 }

 function onCansel() {
    closePopup();
 }

function onEdit(user) {
    editUser = user;

    currentUser.id = user.id;
    currentUser.name = user.name;
    currentUser.username = user.username;
    currentUser.email = user.email;
    currentUser.phone = user.phone;

    openPopup();
}

function onDelete(users, user) {
    API.GET_ACTION(`${END_POINT.USERS}/${user.id}`, deleteUser, console.error);

    const index = users.indexOf(user);
    users.splice(index, 1);
    
    tBody.innerHTML = null;
    drawUers(users);
}

function deleteUser() {
    alert('deleted user');
}

function onSave() {
    if (nameInput.value === "" || userNameInput.value === "" || emailInput.value === "" || phoneInput.value === '') {
        alert('fill in the input fildes');
        return;
    }

    currentUser.name = nameInput.value;
    currentUser.username = userNameInput.value;
    currentUser.email = emailInput.value;
    currentUser.phone = phoneInput.value;

    if (currentUser.id) {

        if (JSON.stringify(editUser) === JSON.stringify(currentUser)) {
            alert('not cheked');
            return;
        }
       
        saveEditUser(currentUser.id);
        
    } else {
        saveCreateUser();
    }
    closePopup();
}

function saveCreateUser() {
    API.POST_ACTION(`${END_POINT.USERS}`, currentUser, getSaveCreateUser, console.error);
    const createdUser = currentUser;
    createdUser.id = updateUsers.length + 1;

    updateUsers.push(createdUser);
    tBody.innerHTML = null;
    drawUers(updateUsers);

}

function getSaveCreateUser() {
    alert('created user');
}

function saveEditUser(id) {
 
    API.PUT_ACTION(`${END_POINT.USERS}/${id}`, currentUser, getSaveEditUser, console.error);
    const index = updateUsers.indexOf(editUser);
    updateUsers[index] = currentUser;
    
    tBody.innerHTML = null;
    drawUers(updateUsers);

}

function getSaveEditUser() {
    alert('Updated user');
}








