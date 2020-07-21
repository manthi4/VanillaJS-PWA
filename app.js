const line1 = document.querySelector('#line1');
const line2 = document.querySelector('#line2');
const line3 = document.querySelector('#line3');
const checkBtn = document.querySelector('#check');
const saveBtn = document.querySelector('#save');
const clearBtn = document.querySelector('#clear');
const main = document.querySelector('main');
// const url1 = "https://api.wordnik.com/v4/word.json/";
// const url2 = "/hyphenation?useCanonical=false&limit=50&api_key="
// const key = "70538348db6b42e43a5181e32070feebc0b303e293ed13a97" // some other key
///const key = "7r89in7oqdhkuoea2xcx1mu9w4rj5eaat3qdlqeyxjobf76n9" /// Make sure to remove this !!!!!
line1.focus();
let freeTester;
let freeTester2;

/// indexdb Setup
let database
window.onload = function () {
    ///requests to open v1 of user_haikus database
    let request = window.indexedDB.open('haikus', 1);
    request.onsuccess = function () {
        console.log('Database opened');
        database = request.result;
        showOld();
    };
    request.onerror = function () {
        console.log('RIP database did not open')
    }
    request.onupgradeneeded = function (e) {
        database = e.target.result;
        ///create an object in the data base,
        /// basically like a table
        let table = database.createObjectStore('user_haikus', { keyPath: 'id', autoIncrement: true });
        table.createIndex('lines', 'line1', { unique: false });
        console.log('Database setup done');
    }
}


////function definitions:
async function showOld() {
    console.log("read started")
    let transaction = database.transaction(['user_haikus'], 'readwrite')
    let objectStore = transaction.objectStore('user_haikus')
    objectStore.getAll().onsuccess = function (e) {
        // console.log("got these from the db: " + JSON.stringify(e.target.result))
        e.target.result.map(element => {
            createBlock(element["lines"])
        });
    }
}


function displayUHaikus() {
    console.log("Consider haikus displayed");
    createBlock([line1.value, line2.value, line3.value]);
    clear();
};
function createBlock(lines) {
    const spacer = document.createElement('br');
    const block = document.createElement('div');
    const l1 = document.createElement('p');
    const l2 = document.createElement('p');
    const l3 = document.createElement('p');
    l1.textContent = lines[0];
    l2.textContent = lines[1];
    l3.textContent = lines[2];

    block.classList.add("bluck");
    console.log(l1.value);

    main.appendChild(spacer);
    block.appendChild(l1);
    block.appendChild(l2);
    block.appendChild(l3);
    main.appendChild(block);
};
function check() {
    console.log("checking")
    let yes = (
        (sylbCount(line1.value)=== 5)
        &&(sylbCount(line2.value)=== 7)
        &&(sylbCount(line3.value)=== 5)
        );
    console.log(yes)
    return yes
}
function sylbCountHelper(word) { /// bruh = {i, words}
    ///This code was taken from Blake Tarter
    ///https://codepen.io/blaketarter/pen/hJICz
    if (word.length === 0) { return 0; }
    word = word.toLowerCase();
    if (word.length <= 3) { return 1; }
    word = word.replace(' ', '&#13');
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    return word.match(/[aeiouy]{1,2}/g).length;
}

function sylbCount(line) {
    line = line.toLowerCase();
    let words = line.split(" ");
    let count = 0
    words.forEach(element => {
        count += sylbCountHelper(element)
    });
    return count;
}

function save(e) {
    e.preventDefault();
    //check();
    if (check()) {
        let newItem = { lines: [line1.value, line2.value, line3.value] };
        /// open a transaction, get ready to read/write data
        let transaction = database.transaction(['user_haikus'], 'readwrite');
        /// create an object to be stored
        let storeunit = transaction.objectStore('user_haikus');
        let request = storeunit.add(newItem); /// maybe t should be storeunit?
        transaction.onerror = function () {
            console.log('Rip, transaction error');
        }
        transaction.oncomplete = function () {
            console.log("New User Haiku added");
            displayUHaikus();
        }
        transaction.onerror = function (e) {
            console.log("transaction failed")
            console.log(e)
        }
    }
}

function clear() {
    line1.value = "";
    line2.value = "";
    line3.value = "";
}

checkBtn.addEventListener('click', check);
saveBtn.addEventListener('click', save);
clearBtn.addEventListener('click', clear);


// <!--

// Permission is hereby granted, free of charge, to any person 
// obtaining a copy of this software and associated documentation 
// files (the "Software"), to deal in the Software without restriction,
//  including without limitation the rights to use, copy, modify, 
// merge, publish, distribute, sublicense, and/or sell copies of 
// the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall 
// be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
// DEALINGS IN THE SOFTWARE.

// -->