const letters = document.querySelectorAll('.letter');
const keys = document.querySelectorAll('.key');
const keyValueArray = Array.from(keys).map((key) => {
    return key.innerText.toLowerCase();
});

const ANSWER_LENGTH = 5;

// console.log(letters[1].innerText = "K");

async function init() {
    let currentGuess = '';
    let currentRow = 0;

    function addLetter(letter) {
        console.log(letter)
        if ( currentGuess.length === ANSWER_LENGTH ) {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
            // letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1] = letter;
        } else {
            currentGuess += letter;
            // letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1] = letter;
        }
        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }

    async function submit() {
        // end games after 6 guesses
        currentRow += 1;
        currentGuess = '';
    }

    function backspace() {
        if ( currentGuess === '') {
            return;
        } else {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1)
            letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
            console.log(currentGuess.length);
            console.log(currentGuess);
            
        }
    }

    document.addEventListener("keydown", function handleKeydown(event) {
        let key = event.key;

        console.log(key);
        
        if (key === 'Enter') {
            submit();
        } else if (key === 'Backspace') {
            backspace();
        } else if (isLetter(key)) {
            addLetter(key.toUpperCase())
            highlight(key);
        }

        // if (!isLetter(key)) {
        //     return;
        // }

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
    }, 150);
};


init();