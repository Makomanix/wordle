const ANSWER_LENGTH = 5;
const GUESSES = 6;
const letters = document.querySelectorAll('.letter');
const keys = document.querySelectorAll('.key');
const keyValueArray = Array.from(keys).map((key) => {
    return key.innerText.toLowerCase();
});

// console.log(letters);
// console.log(keys);
// console.log(keyValueArray);


async function init() {
    let currentGuess = '';
    let currentRow = 0;
    
    
    const res = await fetch ('https://words.dev-apis.com/word-of-the-day');
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = word.split('');

    function addLetter(letter) {
        // console.log(letter)
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
        const resObj = await res.json();
        const validWord = resObj.validWord;
        // console.log(validWord);

        if ( !validWord ) {
            markInvalid();
            return;
        }

        let guessParts = currentGuess.split('');
        let map = getMap(word);

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

// let painted = '';

function paintKey(letter, color) {
    
    letter = letter.toLowerCase();
    // if (!painted.includes(letter)) {
    let keyIndex = keyValueArray.indexOf(letter);
    keys[keyIndex].classList.add(`${color}`);
    // painted += letter;
    console.log(letter)
    console.log(keyIndex);
    // }
}


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