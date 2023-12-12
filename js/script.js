console.log('Script file loaded');

document.addEventListener('DOMContentLoaded', function () {
  // Bootstrap 5 Tooltip Initialization
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  let itemsList = [];
  
});

// Initialize the item list (empty array to start)
let itemsList = [];

function generateItemCode() {
  const lastItem = itemsList[itemsList.length - 1];
  if (lastItem) {
    const lastCode = parseInt(lastItem.code, 10);
    const newCode = (lastCode + 1).toString().padStart(3, '0');
    return newCode;
  } else {
    return '001';
  }
}

document.getElementById('addNewItemModal').querySelector('form').addEventListener('submit', function (event) {
  event.preventDefault();
  const itemCode = generateItemCode();
  const itemName = document.getElementById('itemName').value;
  const itemPrice = document.getElementById('itemPrice').value;
  const discountPercentage = document.getElementById('discountPercentage').value;

  if (!itemName || !itemPrice) {
    alert('Please fill in all required fields.');
    return;
  }

  const newItem = {
    code: generateItemCode(), // Generate item code after adding the item to itemsList
    name: itemName,
    price: parseFloat(itemPrice),
    discount: parseFloat(discountPercentage) || 0,
  };

  itemsList.push(newItem);

  // Update the item code input after adding the item to itemsList
  const itemCodeInput = document.getElementById('itemCode');
  itemCodeInput.value = generateItemCode();

  const addNewItemModal = new bootstrap.Modal(document.getElementById('addNewItemModal'));
  addNewItemModal.hide();

  // Clear the form fields for the next entry
  document.getElementById('itemName').value = '';
  document.getElementById('itemPrice').value = '';
  document.getElementById('discountPercentage').value = '';

  alert('Item added successfully!');
});
window.onbeforeunload = function () {
  // Clear the form data
  const itemCodeInput = document.getElementById('itemCode');
  const itemNameInput = document.getElementById('itemName');
  const itemPriceInput = document.getElementById('itemPrice');
  const discountPercentageInput = document.getElementById('discountPercentage');

  itemCodeInput.value = '';
  itemNameInput.value = '';
  itemPriceInput.value = '';
  discountPercentageInput.value = '';
};

function loadItems() {
  const itemList = document.getElementById('itemTableBody');
  itemList.innerHTML = '';

  itemsList.forEach((item) => {
    const row = document.createElement('tr');
    row.dataset.code = item.code;
    row.innerHTML = `
      <td>${item.code}</td>
      <td contenteditable="false">${item.name}</td>
      <td contenteditable="false">${item.qty}</td>
      <td>
          <button type="button" class="btn btn-primary" onclick="updateItem('${item.code}')">Update</button>
          <button type="button" class="btn btn-danger" onclick="deleteItem('${item.code}')">Delete</button>
      </td>
    `;
    itemList.appendChild(row);
  });

  const viewItemModal = new bootstrap.Modal(document.getElementById('viewItemModal'));
  viewItemModal.show();
}
function updateItem(itemCode) {
  // Find the row corresponding to the itemCode
  const row = document.querySelector(`#itemTableBody tr[data-code="${itemCode}"]`);

  // Check if the row is found
  if (row) {
    // Highlight the row by adding a CSS class
    row.classList.add('highlighted');

    // Enable editing for all contenteditable fields in the row
    const editableFields = row.querySelectorAll('[contenteditable]');
    editableFields.forEach((field) => {
      field.setAttribute('contenteditable', 'true');
    });

    // Update the button text to "Save" for the updating mode
    const updateButton = row.querySelector('.btn-primary');
    updateButton.textContent = 'Save';

    // Add a click event listener to the button for saving changes
    const saveChangesHandler = function () {
      // Save the changes
      saveChanges(itemCode);

      // Disable editing for all contenteditable fields in the row
      editableFields.forEach((field) => {
        field.setAttribute('contenteditable', 'false');
      });

      // Remove the highlighting from the row
      row.classList.remove('highlighted');

      // Update the button text back to "Update" for normal mode
      updateButton.textContent = 'Update';

      // Remove the click event listener for saving changes
      updateButton.removeEventListener('click', saveChangesHandler);
    };

    updateButton.addEventListener('click', saveChangesHandler);
  }
}

function saveChanges(itemCode) {
    // Implement the logic to save the changes made in the editable fields
    const row = document.querySelector(`#itemTableBody tr[data-code="${itemCode}"]`);
    if (row) {
        // Disable editing for all contenteditable fields in the row
        const editableFields = row.querySelectorAll('[contenteditable="true"]');
        editableFields.forEach((field) => {
            field.setAttribute('contenteditable', 'false');
        });

        // Update the item information based on the changes
        const updatedName = row.querySelector('td:nth-child(2)').textContent;
        const updatedQty = row.querySelector('td:nth-child(3)').textContent;

        // Find the item in the 'items' array and update its values
        const updatedItemIndex = items.findIndex((item) => item.code === itemCode);
        if (updatedItemIndex !== -1) {
            items[updatedItemIndex].name = updatedName;
            items[updatedItemIndex].qty = parseInt(updatedQty, 10); // Parse as integer
        }

        // Remove the highlighting from the row
        row.classList.remove('highlighted');

        // Update the button text back to "Update" for normal mode
        const updateButton = row.querySelector('.btn-primary');
        updateButton.textContent = 'Update';

        // Remove the click event listener for saving changes
        updateButton.removeEventListener('click', () => {});
    }
}

function deleteItem(itemCode) {
    // Implement the logic to delete the item
    console.log(`Delete item with code: ${itemCode}`);
}