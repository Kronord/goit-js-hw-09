const startBtn = document.querySelector('button[data-start]');
const stopBtn = document.querySelector('button[data-stop]');
const body = document.body;

stopBtn.setAttribute('disabled', '');

const clickerSettings = {
    switcherId: null,
    start() {
        startBtn.setAttribute('disabled', '');
        stopBtn.removeAttribute('disabled', '');
        this.switcherId = setInterval(() => {
            body.style.backgroundColor = `${getRandomHexColor()}`;
        }, 1000)
    },

    stop() {
        stopBtn.setAttribute('disabled', '');
        startBtn.removeAttribute('disabled', '');
        clearInterval(this.switcherId);
    },
};

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

startBtn.addEventListener('click', () => {
    clickerSettings.start();
});

stopBtn.addEventListener('click', () => {
    clickerSettings.stop();
});