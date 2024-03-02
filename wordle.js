const letters = document.querySelectorAll('.scoreboard-letter');
const loadingSpiral = document.querySelectorAll('.info-bar');
const ANSWER_LENGTH = 5;

async function init() {
    
    let currentGuess = "";
    let row = 0;

    function addLetter(letter) {
        if ( currentGuess.length < ANSWER_LENGTH ) {
            currentGuess += letter;
        } else {
            currentGuess = currentGuess.substring(0, currentGuess.length -1) + letter;
        }
        letters[currentGuess.length - 1].innerText = letter;
    }

    document.addEventListener('keydown', function handleKeyDown (event) {
        const action = event.key;

        console.log(action);

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

init();