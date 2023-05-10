// import {secret} from "./secrets.js";
const line1 = document.querySelector('#line1');

const saveBtn = document.querySelector('#summarize');
const clearBtn = document.querySelector('#clear');
const main = document.querySelector('main');
const line1hint = document.getElementById('line1hint');


line1.focus();

let api_key;

window.onload = function ()
{
    //load secret key
    fetch('./secret.json')
    .then(response => response.json())
    .then(data => {
        api_key = data.api_key
    })
    .catch(error => console.log(error));
}


function createBlock(content) {
    const spacer = document.createElement('br');
    const block = document.createElement('div');
    const l1 = document.createElement('p');

    l1.textContent = content;

    block.classList.add("bluck");
    console.log(l1.value);

    main.appendChild(spacer);
    block.appendChild(l1);
    main.appendChild(block);
};


function updatehint(){
    let input = line1.value
    var wordCount = input.match(/(\w+)/g).length;
    line1hint.style = "color: rgb(0, 255, 0)";
    if(!check(input)){
        line1hint.style = "color: rgb(255, 0, 0);";
    }
    line1hint.innerHTML = `${wordCount}`;
}

 function clearhint(){
    line1hint.innerHTML = ``;
 };


function setwarning(warning){
    console.log(warning)
}

function OpenaiFetchAPI(input) {
    console.log("Calling GPT3")
    secrete_key = api_key//secret.getKey()

    var url = "https://api.openai.com/v1/completions";
    var bearer = 'Bearer ' + secrete_key
    summary = fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "prompt": "Summarize the following: \n\n"+ input + "\n\nTl;dr",
            "model" : "text-davinci-003", 
            "max_tokens": 150,
            "temperature": 0.7,
            "top_p": 1,
            "n": 1,
            "stream": false,
            "logprobs": null,
            "stop": "\n"
        })


    }).then(response => {
        return response.json()
       
    }).then(data=>{
        console.log(data)
        console.log(typeof data)
        console.log(Object.keys(data))
        console.log(data['choices'][0].text)
        return data['choices'][0].text
    }).catch(error => {
            console.log('Something bad happened ' + error)
     });

    return summary
}

function check(input){
    //TODO: should check if number of tokens is within limit
    var wordCount = input.match(/(\w+)/g).length;
    return wordCount < 750
}

function summarize(e) {
    e.preventDefault();
    input = line1.value
    if (true) { // can add a check here to limit requests that are too large
        summary = OpenaiFetchAPI(input)
        summary.then(summ => {
            createBlock(summ)
        })
    }else{
        setwarning("Input too large!")
    }
}


function clear() {
    line1.value = "";
}

saveBtn.addEventListener('click', summarize);
clearBtn.addEventListener('click', clear);
line1.addEventListener("input", updatehint);
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