const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearButton = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
const removeJoke = document.getElementById("remove-joke");
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // Input validation
  if (itemInput.value === "") {
    alert("Please add an item to the list");
    return;
  }

  //check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  }
  if (checkIfitemExists(newItem)) {
    alert("That item already exists");
    return;
  }

  //Creates item DOM element
  addItemToDOM(newItem);

  //Add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = "";

  removeJoke.remove();
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage;
}

//Creates and returns a button
function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = creatIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

//Creates and return the icon that is then returned and used in the createButton function
function creatIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfitemExists(item) {
  const itemsFromStorage = getItemsFromStorage();

  if (itemsFromStorage.includes(item)) {
    return true;
  } else {
    return false;
  }
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>Update Item';
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm("Are you sure?")) {
    //Remove item from DOM
    item.remove();

    //Remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  //Re-set to localStorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function addItemToDOM(item) {
  //Create list item
  const newLi = document.createElement("li");
  newLi.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  newLi.appendChild(button);

  //li added to the DOM
  itemList.appendChild(newLi);
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  //Add new item to array
  itemsFromStorage.push(item);

  //Convert to JSON string and set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function clearItems(e) {
  const items = document.querySelectorAll("li");
  if (items.length > 0) {
    items.forEach((element) => {
      element.remove();
    });
  } else {
    alert("add items to the list first");
  }
  //Clear from local storage
  localStorage.removeItem("items");
  checkUI();
}

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

//Checks the list - if its empty it removes unnecessary button and filter components
function checkUI() {
  itemInput.value = "";

  const items = itemList.querySelectorAll("li");
  //console.log(items);
  if (items.length === 0) {
    clearButton.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearButton.style.display = "block";
    itemFilter.style.display = "block";
    removeJoke.remove();
  }
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i>Add Item';

  formBtn.style.backgroundColor = "#333";

  isEditMode = false;
}

//Initialize Application
function init() {
  //Event Listeners
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearButton.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

const jokeContainer = document.getElementById("jokeContainer");
const jokeDiv = document.getElementById("jokeDiv");

function newJoke() {
  fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "text/plain",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.text();
    })
    .then((data) => {
      console.log(data);
      jokeContainer.textContent = data;
    })
    .catch((error) => {
      console.log(error);
      jokeContainer.textContent = "Something went wrong (Not Funny)";
    });
}

document.addEventListener("DOMContentLoaded", newJoke);

init();
