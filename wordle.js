const letters = document.querySelectorAll('.letter');
const keys = document.querySelectorAll('.key');
const keyValueArray = Array.from(keys).map((key) => {
    return key.innerText.toLowerCase();
})

console.log(keyValueArray);

async function init() {

    document.addEventListener('keyup', function handleKeyup (event) {
        
        if ( !isLetter(event.key)) {
            return
        }
        
        highlight(event.key);

        function addLetter(){

        };

        async function submit() {

        };

        function backspace() {

        };

    })
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