const API_URL = 'http://localhost:3000/api';
let currentPage = 1;
let currentLimit = 5;

async function loadProducts() {
  const search = document.getElementById('search').value;
  const limit = document.getElementById('limit').value;
  currentLimit = limit;
  
  try {
    const res = await fetch(`${API_URL}/products?page=${currentPage}&limit=${limit}&search=${search}`);
    const data = await res.json();
    
    if (data.success) {
      renderTable(data.products);
      document.getElementById('pageInfo').innerText = `Page ${data.page} of ${data.totalPages}`;
    }
  } catch (error) {
    console.error('Load error:', error);
    alert('Error loading products');
  }
}

function renderTable(products) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = products.map(p => `
    <tr>
      <td><input type="checkbox" class="row-checkbox" value="${p._id}"></td>
      <td>${p.name}</td>
      <td>${p.email}</td>
      <td>${p.phone}</td>
      <td>${p.image ? '<img src="' + p.image + '" alt="Product image">' : 'No image'}</td>
      <td><span class="status-badge status-${p.status ? 'active' : 'inactive'}">${p.status ? 'Active' : 'Inactive'}</span></td>
      <td>${new Date(p.created_date).toLocaleDateString()}</td>
      <td>${new Date(p.updated_date).toLocaleDateString()}</td>
      <td>
        <button class="btn-edit" onclick="editProduct('${p._id}')">Edit</button>
        <button class="btn-delete" onclick="deleteProduct('${p._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
  

  updateBulkActions();
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('productId').value;
  const data = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    image: document.getElementById('image').value,
    status: document.getElementById('status').value === 'true'
  };

  try {
    let url = `${API_URL}/products`;
    let method = 'POST';
    if (id) {
      url += `/${id}`;
      method = 'PUT';
    }
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    
    if (!result.success) {
      alert('Error: ' + result.message);
      return;
    }
    
    resetForm();
    loadProducts();
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

async function editProduct(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    const data = await res.json();
    if (data.success) {
      const p = data.product;
      document.getElementById('productId').value = p._id;
      document.getElementById('name').value = p.name;
      document.getElementById('email').value = p.email;
      document.getElementById('phone').value = p.phone;
      document.getElementById('image').value = p.image || '';
      document.getElementById('status').value = p.status.toString();
      document.getElementById('submitBtn').innerText = 'Update Product';
      
      // Scroll to top of form after edit
      document.querySelector('.section:first-of-type').scrollIntoView({ behavior: 'smooth' });
    }
  } catch (error) {
    alert('Error loading product');
  }
}

async function deleteProduct(id) {
  if (confirm('Delete this product?')) {
    try {
      await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      loadProducts();
    } catch (error) {
      alert('Delete error');
    }
  }
}

function resetForm() {
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  document.getElementById('submitBtn').innerText = 'Add Product';
  updateBulkActions();
}

function changePage(delta) {
  currentPage += delta;
  if (currentPage < 1) currentPage = 1;
  loadProducts();
}

// Bulk select handlers
document.getElementById('selectAll').addEventListener('change', (e) => {
  document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = e.target.checked);
  updateBulkActions();
});

document.getElementById('selectAllHeader').addEventListener('change', (e) => {
  document.getElementById('selectAll').checked = e.target.checked;
  document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = e.target.checked);
  updateBulkActions();
});

document.addEventListener('change', (e) => {
  if (e.target.classList.contains('row-checkbox')) {
    updateBulkActions();
  }
});

function updateBulkActions() {
  const checked = document.querySelectorAll('.row-checkbox:checked').length > 0;
  const allChecked = document.querySelectorAll('.row-checkbox').length > 0 &&
    Array.from(document.querySelectorAll('.row-checkbox')).every(cb => cb.checked);
  
  document.getElementById('selectAll').checked = allChecked;
  document.getElementById('selectAllHeader').checked = allChecked;
  document.getElementById('bulkActions').style.display = checked ? 'block' : 'none';
}

async function bulkDelete() {
  const ids = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => cb.value);
  if (ids.length > 0 && confirm(`Delete ${ids.length} products?`)) {
    try {
      await fetch(`${API_URL}/products/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      loadProducts();
    } catch (error) {
      alert('Bulk delete error');
    }
  }
}

// Initial load
loadProducts();
