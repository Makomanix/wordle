const letters = document.querySelectorAll('.scoreboard=letter');
const loadingSpiral = document.querySelectorAll('.info-bar');

async function init() {

    function addLetter(letter) {
        
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
            // nothing to be done
        }
    })
};

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

init();