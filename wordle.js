const letters = document.querySelectorAll('.letter');
const keys = document.querySelectorAll('.key');

async function init() {

    document.addEventListener('keyup', function(event) {
        console.log(event.key);
    })
};

init();