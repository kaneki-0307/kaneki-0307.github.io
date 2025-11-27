import { DrawingCore } from './drawing_core.js';
import { UIManager } from './ui.js';

class App {
    constructor() {
        this.init();
    }

    init() {

        lucide.createIcons();


        this.introView = document.getElementById('intro-view');
        this.appView = document.getElementById('app-view');
        this.startBtn = document.getElementById('start-btn');
        this.backBtn = document.getElementById('back-btn');
        this.canvas = document.getElementById('main-canvas');


        this.drawingCore = new DrawingCore(this.canvas);
        this.ui = new UIManager(this.drawingCore);


        this.startBtn.addEventListener('click', () => this.enterApp());
        this.backBtn.addEventListener('click', () => this.leaveApp());


        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }

    enterApp() {

        const tl = gsap.timeline();

        tl.to(this.introView, {
            opacity: 0,
            y: -20,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
                this.introView.style.display = 'none';
                this.appView.style.display = 'block';

                this.drawingCore.resize();
            }
        })
        .to(this.appView, {
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
        })
        .from("#app-view header", {
            y: -20,
            opacity: 0,
            duration: 0.6,
            delay: -0.4
        })
        .from(".glass-panel", {
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: -0.4
        });
    }

    leaveApp() {
        const tl = gsap.timeline();

        tl.to(this.appView, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                this.appView.style.display = 'none';
                this.introView.style.display = 'flex';
            }
        })
        .to(this.introView, {
            opacity: 1,
            y: 0,
            duration: 0.6
        });
    }

    handleResize() {


        this.drawingCore.resize();
    }
}


window.addEventListener('DOMContentLoaded', () => {
    new App();
});
