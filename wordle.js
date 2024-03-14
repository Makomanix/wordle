const ANSWER_LENGTH = 5;
const GUESSES = 6;
const announcement = document.querySelector('.announcement');
const loading = document.querySelector('.loadingDiv');
const letters = document.querySelectorAll('.letter');
const keys = document.querySelectorAll('.key');
const keyValueArray = Array.from(keys).map((key) => {
    return key.innerText.toLowerCase();
});


async function init() {

    let gameOver = false;
    let currentGuess = '';
    let currentRow = 0;

    toggleLoading();
    
    const res = await fetch ('https://words.dev-apis.com/word-of-the-day');
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = word.split('');

    toggleLoading();

    function addLetter(letter) {
        if ( currentGuess.length === ANSWER_LENGTH ) {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        } else {
            currentGuess += letter;
        }
        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }

    async function submit() {

        if ( currentGuess.length !== ANSWER_LENGTH ) {
            return;
        }

        toggleLoading();

        // validate word
        const res = await fetch ('https://words.dev-apis.com/validate-word', {
            method: "POST",
            body: JSON.stringify({ word: currentGuess }),
        });
        const resObj = await res.json();
        const validWord = resObj.validWord;

        toggleLoading();

        if ( !validWord ) {
            markInvalid();
            return;
        }

        let guessParts = currentGuess.split('');
        let map = getMap(word);

        if (currentGuess === word) {
            gameOver = true;
            announcement.classList.add('announceWinner');
        }

        // compare guess to word
        for ( let i = 0; i < ANSWER_LENGTH; i++ ) {
            if ( wordParts[i] === guessParts[i] ) {
                letters[ANSWER_LENGTH * currentRow + i].classList.add('correct');
                map[wordParts[i]]--;
                paintKey(guessParts[i], 'correct')
            }
        }
        
        for ( let i = 0; i < ANSWER_LENGTH; i++ ) {
            if ( wordParts[i] === guessParts[i] ) {
                // do nothing
            } else if ( wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0 ) {
                letters[ANSWER_LENGTH * currentRow + i].classList.add('close');
                map[guessParts[i]]--;
                paintKey(guessParts[i], 'close');
                // console.log('YELLOW');
            } else if ( !wordParts.includes(guessParts[i]) || map[guessParts[i]] === 0 ) {
                letters[ANSWER_LENGTH * currentRow + i].classList.add('wrong');
                paintKey(guessParts[i], 'wrong');
                // console.log(map[wordParts[i]]);
                // console.log('gray');
            }
        }



        // end games after 6 guesses
        if ( currentRow === 5){
            gameOver = true;
            announcement.innerText = `THE WORD WAS ${word}`;
            announcement.classList.add('announceFailed');
        }

        currentRow += 1;
        currentGuess = '';
    }

    function backspace() {
        if ( currentGuess === '') {
            return;
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
            }, 200);
        }
    }


    document.addEventListener("keydown", function handleKeydown(event) {

        if ( gameOver ) {
            return;
        }
        
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

// flashes keyboard letters corresponding to typing
function highlight(key) {
    let keyIndex = keyValueArray.indexOf(key);
    keys[keyIndex].classList.toggle("target");

    setTimeout(() => {
        keys[keyIndex].classList.toggle("target");
    }, 150);
};

// adds color to the keyboard icons, css cascade order to prioritize correct color
function paintKey(letter, color) {   
    letter = letter.toLowerCase();
    let keyIndex = keyValueArray.indexOf(letter);
    keys[keyIndex].classList.add(`${color}`);
}

// creating a count of each letter in word
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

function toggleLoading(){
    loading.classList.toggle('show');
}

init();