const line1 = document.querySelector('#line1');
const line2 = document.querySelector('#line2');
const line3 = document.querySelector('#line3');
const checkBtn = document.querySelector('#wuty');
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
window.onload = function(){
    ///requests to open v1 of user_haikus database
    let request = window.indexedDB.open('haikus', 1);
    request.onsuccess = function(){
        console.log('Database opened');
        database = request.result;
        displayUHaikus();
    };
    request.onerror = function(){
        console.log('RIP database did not open')
    }
    request.onupgradeneeded = function(e){
        database = e.target.result;
        ///create an object in the data base,
        /// basically like a table
        let table = database.createObjectStore('user_haikus', {keyPath: 'id', autoIncrement:true});
        table.createIndex('lines', 'line1', {unique: false});
        console.log('Database setup done');
    }

}


////function definitions:
function displayUHaikus(){
    console.log("Consider haikus displayed");
    createBlock(line1.value, line2.value, line3.value);
};
function createBlock(a, b, c){
    const block = document.createElement('div');
    const l1 = document.createElement('p');
    const l2 = document.createElement('p');
    const l3 = document.createElement('p');
    l1.textContent = a;
    l2.textContent = b;
    l3.textContent = c;

    block.classList.add("bluck");
    console.log(l1.value);

    block.appendChild(l1);
    block.appendChild(l2);
    block.appendChild(l3);
    main.appendChild(block);
};
function check(){
    return true;
    // return (
    //     (sylbCount(line1.value)=== 5)
    //     &&(sylbCount(line2.value)=== 7)
    //     &&(sylbCount(line3.value)=== 5)
    //     );
}
function sylbCountHelper(i, words){ /// bruh = {i, words}
    if(!(i < words.length)){
        return 0;
    }
    if(words[i].length < 3){
        i++;
        return 1+ sylbCountHelper(i,words);
    }
    console.log("Sending fetch for: "+words[i]);
    return fetch(url1+words[i]+url2+key)
        .then( 
            function(result) {
                return result.json();
            }
        )
            .then(
                function(json) {
                    i++
                    return json.length + window.setTimeout(sylbCountHelper, 15*1000, i, words); // change to 15
                    console.log(words[i] + " json length read, length="+json.length);
                }
            )        
        .catch(
            function(){
            console.log("API request failed")
            }
        )
}

function sylbCount(line){
    line = line.toLowerCase();
    let words = line.split(" ");
    return sylbCountHelper(0, words);
}

function save (e) {
    e.preventDefault();
    //check();
    if(check()){
        let newItem = {lines:[line1.value, line2.value, line3.value]};
        /// open a transaction, get ready to read/write data
        let transaction = database.transaction(['user_haikus'], 'readwrite');
        /// create an object to be stored
        let storeunit = transaction.objectStore('user_haikus');
        let request = storeunit.add(newItem); /// maybe t should be storeunit?
        transaction.onerror = function(){
            console.log('Rip, transaction error');
        }
        transaction.oncomplete = function(){
            console.log("New User Haiku added");
            displayUHaikus();
        }
    }
}

function clear(){
    line1.value = "";
    line2.value = "";
    line3.value = "";
}

checkBtn.addEventListener('click', check);
saveBtn.addEventListener('click', save);
clearBtn.addEventListener('click', clear);


function testing (){
    let apiUrl = 'http://api.wordnik.com/v4';
    let apiKey = '7r89in7oqdhkuoea2xcx1mu9w4rj5eaat3qdlqeyxjobf76n9';
    let client = swagger.ApiClient(apiKey, apiUrl);

    let wordApi = WordApi.WordApi(client);
    let example = wordApi.getTopExample('irony');
    console.log(example);
}
