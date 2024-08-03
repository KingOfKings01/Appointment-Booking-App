window.addEventListener("DOMContentLoaded", DisplayAll);

async function handleFormSubmit(event, id = null) {
  event.preventDefault();

  let username = event.target.username.value;
  let email = event.target.email.value;
  let phone = event.target.phone.value;

  try {
    const data = {
      username: username,
      email: email,
      phone: phone,
    };
    if (!id) {
      await axios.post("http://localhost:3000/api/users", data);
    } else {
      await axios.put(`http://localhost:3000/api/users/${id}`, data);

      const modal = document.getElementById("modal");
      modal.close();
    }
  } catch (error) {
    console.log(error);
  }

  // Reseat the form
  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";

  DisplayAll()
}

async function DisplayAll() {
  const UserList = document.getElementById("UserList"); // ?
  const response = await axios.get(`http://localhost:3000/api/users`);
  const existingUsers = response.data;
  let htmlCode = "";

  existingUsers.forEach((user, id) => {
    htmlCode += `
        <tr>
            <th scope="row">${id + 1}</th>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td class="d-flex justify-content-evenly">
                <button onclick="editUser(${
                  user.id
                })" class="btn btn-success">Edit</button>
                <button onclick="deleteUser(${
                  user.id
                })" class="btn btn-danger">Delete</button> 
            </td>
        </tr>
    `;
  });
  UserList.innerHTML = htmlCode;
}

async function deleteUser(id) {
  await axios.delete(`http://localhost:3000/api/users/${id}`);
  // Reload
  DisplayAll();
}

async function editUser(id) {
  const modal = document.getElementById("modal");
  modal.showModal();
  try {
    const response = await axios.get(`http://localhost:3000/api/users/${id}`);
    const user = response.data;


    modal.innerHTML = `<form onsubmit="handleFormSubmit(event, ${id})">
            <legend>Appointment Booking App</legend>
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input class="form-control" type="text" name="username" id="username" value="${user.username}">
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input class="form-control" type="email" id="email" value="${user.email}">
            </div>
            <div class="mb-3">
              <label for="phone" class="form-label">Phone Number.</label>
              <input class="form-control" type="tel" id="phone" value="${user.phone}">
            </div>
            
            <button class="btn btn-primary">Update</button>
        </form>`;
  } catch (error) {
    console.log(error);
  }
}

