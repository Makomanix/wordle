const letters = document.querySelectorAll('.letter');
const keys = document.querySelectorAll('.key');
const keyValueArray = Array.from(keys).map((key) => {
    return key.innerText.toLowerCase();
})

console.log(keyValueArray);

async function init() {

    function addLetter(letter) {

    }

    async function submit() {

    }

    function backspace() {
        
    }

    document.addEventListener("keyup", function handleKeyup(event) {
        let key = event.key;

        console.log(key);
        
        if (key === 'Enter') {
            submit();
        } else if (key === 'Backspace') {
            backspace();
        } else if (isLetter(key)) {
            addLetter(key.toUpperCase)
        }

        // if (!isLetter(key)) {
        //     return;
        // }

        highlight(key);
    });
};


function isLetter(letter){
    return /^[a-zA-Z]$/.test(letter);
};


function highlight(key) {
    let keyIndex = keyValueArray.indexOf(key);
    keys[keyIndex].classList.toggle("target");

    setTimeout(() => {
        keys[keyIndex].classList.toggle("target");
    }, 50);
};


init();