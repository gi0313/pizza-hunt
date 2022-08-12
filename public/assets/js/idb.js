//we create a variable db that will store the connected database object when the connection is complete
let db;

//establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
//we create the request variable to act as an event listener for the database
const request = indexedDB.open('pizza_hunt', 1);
//That event listener is created when we open the connection to the database using the indexedDB.open() method

//this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc)
request.onupgradeneeded = function(event) {
    //save a reference to the database
    const db = event.target.result;
    //create an object store (table) called 'new_pizza', set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_pizza', {autoIncrement: true});
}

//success
request.onsuccess = function(event) {
    //when db is successfully created with its object store(from onupgradeneeded) or simpply established a connection, save refrence to db in global variable
     db = event.target.result;

     //check if app is online, if yes uploadPizza() function to send all local db data to api
     if(navigator.online) {
        uploadPizza();
     }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
}

// function will be executed if we attempt to submit a new pizza and theres no internet
function saveRecord(record) {
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //add record to your store with aff method
    pizzaObjectStore.add(record);
    //Finally, we use the object store's .add() method to insert data into the new_pizza object store
}

function uploadPizza() {
    //open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access your object store
    const pizzaObjectStore = transaction.objectStore('new_Pizza');

    //get all records from the store and set to a variable
    const getAll = pizzaObjectStore.getAll();

    // upon a successful .getAll() execution, run this function
getAll.onsuccess = function() {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch('/api/pizzas', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(['new_pizza'], 'readwrite');
          // access the new_pizza object store
          const pizzaObjectStore = transaction.objectStore('new_pizza');
          // clear all items in your store
          pizzaObjectStore.clear();

          alert('All saved pizza has been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
        //the getAll.onsuccess event will execute after the .getAll() method completes successfully
    }
};
}

//listen for app coming back online
window.addEventListener('online', uploadPizza);