let isEditMode = false;

document.getElementById('employee-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const role = document.getElementById('role').value;
  const editIndex = document.getElementById('edit-index').value;

  if (isEditMode) {
    // Update employee
    await fetch(`/api/employees/${editIndex}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role })
    });
    isEditMode = false;
    document.getElementById('submit-button').innerText = 'Add Employee';
  } else {
    // Add employee
    await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role })
    });
  }

  document.getElementById('employee-form').reset();
  document.getElementById('edit-index').value = '';
  loadEmployees();
});

async function loadEmployees() {
  const res = await fetch('/api/employees');
  const employees = await res.json();

  const tbody = document.querySelector('#employee-table tbody');
  tbody.innerHTML = '';
  employees.forEach((emp, i) => {
    const row = `
      <tr>
        <td>${emp.name}</td>
        <td>${emp.email}</td>
        <td>${emp.role}</td>
        <td class="actions">
          <button onclick="editEmployee(${i})">Edit</button>
          <button onclick="deleteEmployee(${i})">Delete</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

async function deleteEmployee(index) {
  await fetch(`/api/employees/${index}`, { method: 'DELETE' });
  loadEmployees();
}

function editEmployee(index) {
  fetch('/api/employees')
    .then(res => res.json())
    .then(data => {
      const emp = data[index];
      document.getElementById('name').value = emp.name;
      document.getElementById('email').value = emp.email;
      document.getElementById('role').value = emp.role;
      document.getElementById('edit-index').value = index;
      isEditMode = true;
      document.getElementById('submit-button').innerText = 'Update Employee';
    });
}

loadEmployees();
