document.addEventListener('DOMContentLoaded', async () => {
  const currentPath = window.location.pathname;

  if (currentPath === '/' || currentPath === '/operations') {
    await loadDashboardData(currentPath);
  }

  const form = document.querySelector('#operationForm');
  if (form) {
    setupForm();
  }
});

async function loadDashboardData(path) {
  try {
    const [response] = await Promise.all([
      fetch('/api/data')
    ]);

    if (!response.ok) throw new Error('Ошибка сети при получении данных');
    const { stock, operations } = await response.json();

    if (path === '/') renderStock(stock);
    if (path === '/operations') renderOperations(operations);

  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    alert('Не удалось загрузить данные с сервера');
  }
}

function renderStock(stock) {
  const tbody = document.querySelector('#stockTable tbody');
  if (!tbody) return;
  tbody.innerHTML = ''; // Очистка

  Object.entries(stock).forEach(([name, qty]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${name}</td><td>${qty}</td>`;
    tbody.appendChild(tr);
  });
}

function renderOperations(operations) {
  const tbody = document.querySelector('#opsTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const sortedOps = [...operations].reverse();

  sortedOps.forEach(op => {
    const d = new Date(op.date);
    const dateStr = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
    const typeStr = op.type === 'income' ? 'Приход' : 'Расход';
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${dateStr}</td>
      <td class="${op.type}">${typeStr}</td>
      <td>${op.name}</td>
      <td>${op.qty}</td>
      <td>${op.price}</td>
      <td>${op.contact}</td>
    `;
    tbody.appendChild(tr);
  });
}

function setupForm() {
  const form = document.querySelector('#operationForm');
  const typeSelect = document.querySelector('#type');
  const contactLabel = document.querySelector('#contactLabel');
  const qtyInput = document.querySelector('#qty');
  const contactInput = document.querySelector('#contact');
  const errorBox = document.querySelector('#errorMessage');
  const successBox = document.querySelector('#successMessage');

  const savedContact = localStorage.getItem('lastContact');
  if (savedContact) contactInput.value = savedContact;

  typeSelect.addEventListener('change', (e) => {
    contactLabel.textContent = e.target.value === 'income' ? 'От кого:' : 'Кому:';
  });

  qtyInput.addEventListener('input', (e) => {
    if (e.target.value < 1) {
      e.target.setCustomValidity('Количество не может быть меньше 1');
    } else {
      e.target.setCustomValidity('');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';
    successBox.style.display = 'none';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    localStorage.setItem('lastContact', data.contact);

    try {
      const response = await fetch('/api/operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка при сохранении');
      }

      successBox.textContent = 'Успешно сохранено!';
      successBox.style.display = 'block';
      form.reset();
      
      contactInput.value = localStorage.getItem('lastContact');

    } catch (error) {
      errorBox.textContent = error.message;
      errorBox.style.display = 'block';
    }
  });

  form.addEventListener('focusin', () => {
    errorBox.style.display = 'none';
    successBox.style.display = 'none';
  });
}