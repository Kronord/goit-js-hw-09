import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
    myInput: document.querySelector('#datetime-picker'),
    startBtn: document.querySelector('button[data-start]'),
    daysValue: document.querySelector('span[data-days]'),
    hoursValue: document.querySelector('span[data-hours]'),
    minValue: document.querySelector('span[data-minutes]'),
    secValue: document.querySelector('span[data-seconds]'),
    timerDiv: document.querySelector('.timer'),
    valueSpan: document.querySelectorAll('span.value'),
};
refs.timerDiv.style.display = "flex";
refs.timerDiv.style.marginTop = "80px";
refs.timerDiv.style.justifyContent = "space-around";
refs.timerDiv.style.fontSize = "40px";
refs.valueSpan.forEach(el => {
    el.style.color = "#0099ff";
    el.style.fontSize = "50px";
    el.style.fontWeight = "bold";
});


refs.startBtn.setAttribute('disabled', '');

const myFlatPicker = flatpickr(refs.myInput, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        if (Date.now() > selectedDates[0].getTime()) {
            refs.startBtn.setAttribute('disabled', '');
            Notify.failure('Please choose a date in the future');
        } else {
            refs.startBtn.removeAttribute('disabled', '');
        };
    },
});

class Timer {
    constructor({onTick}) {
        this.intervId = null;
        this.btnIsActive = false;
        this.onTick = onTick;
    }

    start() {
        // if (this.btnIsActive) {
        // return;
        // };
        // this.btnIsActive = true;
        refs.startBtn.setAttribute('disabled', '');
        this.intervId = setInterval(() => {
            const currentTime = Date.now();
            const timeDifference = myFlatPicker.selectedDates[0] - currentTime;
            const { days, hours, minutes, seconds } = this.convertMs(timeDifference);
            this.onTick({ days, hours, minutes, seconds });
            if (`${days}:${hours}:${minutes}:${seconds}` === '00:00:00:00') {
                this.stop(this.intervId);
                // this.btnIsActive = false;
            };
        }, 1000);
    }

    convertMs(ms) {
        // Number of milliseconds per unit of time
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        // Remaining days
        const days = this.pad(Math.floor(ms / day));
        // Remaining hours
        const hours = this.pad(Math.floor((ms % day) / hour));
        // Remaining minutes
        const minutes = this.pad(Math.floor(((ms % day) % hour) / minute));
        // Remaining seconds
        const seconds = this.pad(Math.floor((((ms % day) % hour) % minute) / second));

        return { days, hours, minutes, seconds };
    };

    stop(p1) {
        clearInterval(p1);
    };

    pad(value) {
        return String(value).padStart(2, '0');
    };
};

const timer = new Timer({
    onTick: upgradeInterface,
});

refs.startBtn.addEventListener('click', () => {
    timer.start();
});

function upgradeInterface({ days, hours, minutes, seconds }) {
        refs.daysValue.textContent = `${days}`;
        refs.hoursValue.textContent = `${hours}`;
        refs.minValue.textContent = `${minutes}`;
        refs.secValue.textContent = `${seconds}`;
};