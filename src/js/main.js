import '/styles/style.scss';
import '@google/model-viewer';
import { animate } from 'motion';
import confetti from 'canvas-confetti';

const sections = {
    pred: document.querySelector('#pred'),
    done: document.querySelector('#done')
};

const elements = {
    pred: {
        title: document.querySelectorAll('#predTitle'),
        text: document.querySelectorAll('#predText'),
        btn: document.querySelector('#startBtn')
    },
    done: {
        title: document.querySelectorAll('#doneTitle'),
        text: document.querySelectorAll('#doneText'),
        model: document.querySelectorAll('#doneModel')
    }
};

const showConfetti = () =>
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0080', '#00ff87', '#8000ff', '#ffff00']
    });

const animateIn = (targets, opts = {}) => {
    animate(
        targets,
        { opacity: [0, 1], y: [20, 0], ...opts.styles },
        { duration: 0.8, ...opts.options }
    );
};

const animateOut = (targets, opts = {}) => {
    animate(
        targets,
        { opacity: [1, 0], y: [0, -40], scale: 0.9, ...opts.styles },
        { duration: 0.4, ...opts.options }
    );
};

const showSection = (section, callback) => {
    setTimeout(()=>{
        Object.values(sections).forEach(sec => (sec.style.display = 'none'));
        sections[section].style.display = '';
        if (callback) setTimeout(callback, 50);
    }, 1000)
};

const isDone = localStorage.getItem('isDone');

const sendNotification = async () => {
    console.log('Отправка уведомления');
    try {
        await fetch('https://recognition.jahor-sykaviec.workers.dev/',  {
            method: 'POST'
        });
        console.log('Уведомление отправлено');
    } catch (error) {
        console.error('Ошибка:', error);
    }
};

if (isDone) {
    showConfetti();
    showSection('done', () => {
        animateIn(elements.done.title);
        animateIn(elements.done.text, { options: { delay: 0.2 } });
        animateIn(elements.done.model, {
            styles: { scale: [0, 1] },
            options: { duration: 1.6, delay: 0.6 }
        });
    });
    sendNotification();
} else {
    showSection('pred', () => {
        animateIn(elements.pred.title);
        animateIn(elements.pred.text, { options: { ease: 'easeOut', delay: 0.4 } });
        animateIn(elements.pred.btn, { options: { delay: 1, duration: 0.8 } });
    });
}

elements.pred.btn?.addEventListener('click', () => {
    animateOut(elements.pred.title);
    animateOut(elements.pred.text, { options: { delay: 0.1 } });
    animateOut(elements.pred.btn, { options: { delay: 0.2 } });
    showConfetti();

    showSection('done', () => {

        animateIn(elements.done.title);
        animateIn(elements.done.text, { options: { delay: 0.2 } });
        animateIn(elements.done.model, {
            styles: { scale: [0, 1] },
            options: { duration: 1.6, delay: 0.6 }
        });

        localStorage.setItem('isDone', true);
    });
    sendNotification();
});