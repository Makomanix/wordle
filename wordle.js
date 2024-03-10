const ANSWER_LENGTH = 5;
const GUESSES = 6;
const letters = document.querySelectorAll('.letter');
const keys = document.querySelectorAll('.key');
const keyValueArray = Array.from(keys).map((key) => {
    return key.innerText.toLowerCase();
});


async function init() {
    let currentGuess = '';
    let currentRow = 0;
    
    
    const res = await fetch ('https://words.dev-apis.com/word-of-the-day');
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    
    console.log(word);

    let wordParts = getMap(word);
    console.log(wordParts);

    function addLetter(letter) {
        console.log(letter)
        if ( currentGuess.length === ANSWER_LENGTH ) {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        } else {
            currentGuess += letter;
        }
        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }

    async function submit() {
        if ( currentGuess.length !== ANSWER_LENGTH) {
            return;
        }

        // validate word
        const res = await fetch ('https://words.dev-apis.com/validate-word', {
            method: "POST",
            body: JSON.stringify({ word: currentGuess }),
        });
        const resObj = res.json();
        const validWord = resObj.validWord;

        if ( !validWord ) {
            markInvalid();
            // indicate to user word is invalid
            return;
        }
        // compare guess to word
        // end games after 6 guesses
        currentRow += 1;
        currentGuess = '';
    }

    function backspace() {
        if ( currentGuess === '') {
            // do nothing
        } else {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1)
            letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";            
        }
    }

    function markInvalid() {
        for ( let i = 0; i < ANSWER_LENGTH; i++) {
            letters[ANSWER_LENGTH * currentRow + i].classList.toggle('invalid');
    
            setTimeout(() => {
                letters[ANSWER_LENGTH * currentRow + i].classList.toggle('invalid');
            }, 100);
        }
    }

    document.addEventListener("keydown", function handleKeydown(event) {
        let key = event.key;

        if (key === 'Enter') {
            submit();
        } else if (key === 'Backspace') {
            backspace();
        } else if (isLetter(key)) {
            addLetter(key.toUpperCase())
            highlight(key);
        }
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


function getMap(word) {
    const obj = {};
    for ( let i = 0; i < word.length; i ++) {
        const letter = word[i];
        if (obj[letter]) {
            obj[letter] ++;
        } else {
            obj[letter] = 1;
        }
    }
    return obj;
};

init();