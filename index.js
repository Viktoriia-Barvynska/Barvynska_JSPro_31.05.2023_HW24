function getUserList() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users;
  }

  function saveUserList(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  function displayUserList() {
    const userListContainer = document.getElementById('userList');
    userListContainer.innerHTML = '';

    const users = getUserList();

    users.forEach(user => {
      const userDiv = document.createElement('div');
      userDiv.innerHTML = `
        

        <p>Name: ${user.name}</p>
        <p>Email: ${user.email}</p>
        <button class="viewBtn" data-id="${user.id}">View</button>
        <button class="editBtn" data-id="${user.id}">Edit</button>
        <button class="removeBtn" data-id="${user.id}">Remove</button>
      `;
      userListContainer.appendChild(userDiv);
    });
  }

  function displayUserDetails(userId) {
    const userDetailsContainer = document.getElementById('userDetails');
    userDetailsContainer.innerHTML = '';

    const users = getUserList();
    const user = users.find(user => user.id === userId);

    if (user) {
      const userDiv = document.createElement('div');
      userDiv.innerHTML = `
        <h2>User Details</h2>
        <p>Name: ${user.name}</p>
        <p>Email: ${user.email}</p>
        <p>Address: ${user.address}</p>
      `;
      userDetailsContainer.appendChild(userDiv);
    }
  }

  function displayEditForm(userId) {
    const userDetailsContainer = document.getElementById('userDetails');
    userDetailsContainer.innerHTML = '';

    const users = getUserList();
    const user = users.find(user => user.id === userId);

    const editForm = document.createElement('form');
    editForm.classList.add('edit-form');
    editForm.innerHTML = `
      <h2>Edit User</h2>
      <label for="editName">Name:</label>
      <input type="text" id="editName" value="${user ? user.name : ''}" required>
      <label for="editEmail">Email:</label>
      <input type="email" id="editEmail" value="${user ? user.email : ''}" required>
      <label for="editAddress">Address:</label>
      <input type="text" id="editAddress" value="${user ? user.address : ''}" required>
      <button id="saveBtn" type="submit">Save</button>
    `;

    userDetailsContainer.appendChild(editForm);

    editForm.addEventListener('submit', event => {
      event.preventDefault();

      const nameInput = document.getElementById('editName');
      const emailInput = document.getElementById('editEmail');
      const addressInput = document.getElementById('editAddress');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const address = addressInput.value.trim();

      if (!name || !email || !address) {
        alert('Please fill in all fields');
        return;
      }

      const users = getUserList();
      const editedUser = user ? { id: user.id, name, email, address } : { id: Date.now(), name, email, address };

      if (user) {
        const index = users.findIndex(user => user.id === editedUser.id);
        if (index !== -1) {
          users[index] = editedUser;
          saveUserList(users);
          displayUserList();
          displayUserDetails(editedUser.id);
          clearEditForm();
        }
      } else {
        users.push(editedUser);
        saveUserList(users);
        displayUserList();
        displayUserDetails(editedUser.id);
        clearEditForm();
      }
    });
  }

  function removeUser(userId) {
    const confirmed = confirm('Are you sure you want to remove this user?');
    if (confirmed) {
      const users = getUserList();
      const filteredUsers = users.filter(user => user.id !== userId);
      saveUserList(filteredUsers);
      displayUserList();
      displayUserDetails(null);
    }
  }

  function clearEditForm() {
    const nameInput = document.getElementById('editName');
    const emailInput = document.getElementById('editEmail');
    const addressInput = document.getElementById('editAddress');

    nameInput.value = '';
    emailInput.value = '';
    addressInput.value = '';
  }

  function initializeApp() {
    displayUserList();

    const userListContainer = document.getElementById('userList');
    userListContainer.addEventListener('click', event => {
      const userId = parseInt(event.target.getAttribute('data-id'));

      if (event.target.classList.contains('viewBtn')) {
        displayUserDetails(userId);
      }

      if (event.target.classList.contains('editBtn')) {
        displayEditForm(userId);
      }

      if (event.target.classList.contains('removeBtn')) {
        removeUser(userId);
      }
    });

    const addUserBtn = document.getElementById('addUserBtn');
    addUserBtn.addEventListener('click', () => {
      displayEditForm(null);
    });
  }

  initializeApp();