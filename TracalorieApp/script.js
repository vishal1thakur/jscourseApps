//-------------- A) Storage Controller (Get, Set and Delete data in the local storage) ----------------
const StorageCtrl = (function () {
  // Public methods
  return {
    // 1) Store items entered by the user
    storeItem: function (item) {
      let items;
      // Check of any items in LS
      if (localStorage.getItem('items') === null) {
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what is already in LS
        items = JSON.parse(localStorage.getItem('items'));
        // Push the new item
        items.push(item);
        // reset LS
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    // 2) Get the entries stored
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    // 3) Change the updates made by the user on the added entry
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem('items', JSON.stringify(items));
    },

    // 4) Remove the entries deleted by the user
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem('items', JSON.stringify(items));
    },

    // 5) Remove all entries from the LS
    clearItemsFromStorage: function () {
      localStorage.removeItem('items');
    },
  };
})();

//-------------- B) Item Controller (Data structure to store and manipulate the entries made by the user) -------------------
const ItemCtrl = (function () {
  // 1) Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // 2) Data structures / State
  const data = {
    // Fetch item from LS
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  // Public Methods
  return {
    // 3) Get the saved items
    getItems: function () {
      return data.items;
    },

    // 4) Add a new entry in items
    addItem: function (name, calories) {
      let ID;
      // Create Id
      if (data.items.length > 0) {
        // Get id of the last entry, add 1 to its id
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },

    // 5) Find a specific entry
    getItemById: function (id) {
      let found = null;
      // Loop through items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    // 6) Update the changes made on entry
    updateItem: function (name, calories) {
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    // 7) Remove an entry
    deleteItem: function (id) {
      // Get ids
      const ids = data.items.map(function (item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },

    // 8) Remove all entries
    clearAllItems: function () {
      data.items = [];
    },

    // 9) Set the current item
    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    // 10) Fetch the current item
    getCurrentItem: function () {
      return data.currentItem;
    },

    // 11) Calculate the total calories
    getTotalCalories: function () {
      let total = 0;
      // Loop through items and add cals
      data.items.forEach(function (item) {
        total += item.calories;
      });
      // Set total cal in data structure
      data.totalCalories = total;
      // Return total
      return data.totalCalories;
    },

    // 12) Get the entire datastructure
    logData: function () {
      return data;
    },
  };
})();

//-------------------- C) UI Controller (Controller to manipulate what is displayed on the UI) -----------------
const UICtrl = (function () {
  // 1) All the selectors
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    clearBtn: '.clear-btn',
  };
  // Public methods
  return {
    // 2) Display all the stored items
    populateItemList: function (items) {
      let html = '';
      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        </li>`;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    // 3) Get the entered value
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },

    // 4) Add a new entry to display
    addListItem: function (item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
      // Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
    },

    // 5) Make the update on the entry
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node List into array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },

    // 6) Remove from display
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    // 7) Clear display
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    // 8) Add to the input field when the user want to update an entry
    addItemToForm: function () {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;

      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    // 9) Remove items
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn it into an array
      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      });
    },

    // 10) Hide ul underline
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    // 11) Display all calories
    showTotalCalories: function (totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },

    // 12) Remove entries made from the input field
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    // 13) Add entries to input field for update
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    // 14) Get all the selectors
    getSelectors: function () {
      return UISelectors;
    },
  };
})();

//-------------------- D) App Controller (Central controller to tie in the app) ----------------
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // 1) Load event listeners
  const loadEventListeners = function () {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // 1a) Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);

    // #) Disable submit on enter
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // 1b) Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemEditClick);

    // 1c) Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', itemUpdateSubmit);

    // 1d) Delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener('click', itemDeleteSubmit);

    // 1e) Clear button event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener('click', clearAllItemsClick);

    // 1f) Back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener('click', backClick);
  };

  // 2) Callback functions
  // 2a) Add item submit
  const itemAddSubmit = function (e) {
    // Get from input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if (input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem(newItem);
      // Get the total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      // Store in LS
      StorageCtrl.storeItem(newItem);
      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // 2b) Edit item
  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      //
      const listId = e.target.parentNode.parentNode.id;
      // Break into an array
      const listIdArcc = listId.split('-');
      // Get the actual id
      const id = parseInt(listIdArcc[1]);
      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };

  // 2c) Update item submit
  const itemUpdateSubmit = function (e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updateItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update ui
    UICtrl.updateListItem(updateItem);

    // Get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update local storage
    StorageCtrl.updateItemStorage(updateItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // 2d) Back button
  const backClick = function (e) {
    UICtrl.clearEditState();
    e.preventDefault();
  };

  // 2e) Delete button event
  const itemDeleteSubmit = function (e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // 2f) Clear all items
  const clearAllItemsClick = function () {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Remove from LS
    StorageCtrl.clearItemsFromStorage();

    // Hide UL
    UICtrl.hideList();
  };

  // 3) Public methods
  return {
    init: function () {
      // Clear initial set
      UICtrl.clearEditState();
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get the total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// ------------------ E) Initialize App -----------------
App.init();
