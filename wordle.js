const letters = document.querySelectorAll('.scoreboard-letter');
const loadingSpiral = document.querySelector('.info-bar');
const title = document.querySelector('.brand');
const ANSWER_LENGTH = 5;
const ROUNDS = 6
let isLoading = true;

async function init() {

    setLoading();
    
    let currentGuess = "";
    let currentRow = 0;
    const wordURL = 'https://words.dev-apis.com/word-of-the-day?random=1';

    const res = await fetch(wordURL);
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = word.split('');
    let done = false;

    setLoading();


    function addLetter(letter) {
        if ( currentGuess.length < ANSWER_LENGTH ) {
            currentGuess += letter;
        } else {
            currentGuess = currentGuess.substring(0, currentGuess.length -1) + letter;
        }
        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }


    async function submit() {

        if (currentGuess.length !== ANSWER_LENGTH) {
            return;
        }

        setLoading();
        const res = await fetch("https://words.dev-apis.com/validate-word", {
            method: "POST",
            body: JSON.stringify({ word: currentGuess }),
        });

        const resObj = await res.json();
        const validWord = resObj.validWord;

        setLoading();

        if (!validWord) {
            markInvalidWord();
            return;
        }
        
        const guessParts = currentGuess.split('')
        const map = makeMap(wordParts);
        
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if ( guessParts[i] === wordParts[i]) {
                letters[ANSWER_LENGTH * currentRow + i].classList.add('correct');
                map[guessParts[i]]--;
            }
        }
        
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if ( guessParts[i] === wordParts[i]) {
                // Already did
            } else if ( wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
                letters[ANSWER_LENGTH * currentRow + i].classList.add('close');
                map[guessParts[i]]--;
            } else {
                letters[ANSWER_LENGTH * currentRow + i].classList.add('wrong')
            }
        }
        
        if ( currentGuess === word ) {
            title.classList.add('winner');
            alert('You WIN!');
            done = true;
            return;
        }
        
        currentRow++;
        currentGuess = '';

        if ( currentRow === ROUNDS ) {
            alert(`You lose, the word was ${word}`)
            done = true;
            return;
        }
    };

    
    function backspace() {
        if (currentGuess !== '') {
            letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = '';
            currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        }
    };
    

    function markInvalidWord() {
        for ( let i = 0; i < ANSWER_LENGTH; i++ ) {
            letters[ANSWER_LENGTH * currentRow + i].classList.remove("invalid");

            setTimeout(function() {
                letters[ANSWER_LENGTH * currentRow + i].classList.add("invalid");
            }, 10);
        }
    };


    document.addEventListener('keydown', function handleKeyDown (event) {        
        if (done || !isLoading) {
            return;
        }

        const action = event.key;

        if ( action === "Enter") {
            submit();
        } else if ( action === "Backspace") {
            backspace();
        } else if ( isLetter(action)) {
            addLetter(action.toUpperCase());
        } else {
            // ignore all other input
        }
    })

};


function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
};


function setLoading() {
    isLoading = !isLoading;
    console.log(isLoading);
    loadingSpiral.classList.toggle('hidden', isLoading);
};


function makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        const letter = array[i];
        if (obj[letter]) {
            obj[letter]++;
        } else {
            obj[letter] = 1;
        }
    }

    return obj;
}

init();