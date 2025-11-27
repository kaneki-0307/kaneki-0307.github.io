import { Brushes } from './brushes.js';

export class DrawingCore {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: true });
        

        this.isDrawing = false;
        this.currentTool = 'pen';
        this.currentColor = '#1e293b';
        this.currentSize = 5;
        this.history = [];
        this.historyStep = -1;
        
        this.prevPoint = null;

        this.setupEvents();
    }

    resize() {

        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        if (this.canvas.width > 0) tempCtx.drawImage(this.canvas, 0, 0);


        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        
        this.ctx.scale(dpr, dpr);
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';


        if (tempCanvas.width > 0) {
             this.ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width / dpr, tempCanvas.height / dpr);
        }
    }

    setupEvents() {

        this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this));
        this.canvas.addEventListener('pointerup', this.onPointerUp.bind(this));
        this.canvas.addEventListener('pointerout', this.onPointerUp.bind(this));
    }

    getPoint(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    onPointerDown(e) {
        this.isDrawing = true;
        this.prevPoint = this.getPoint(e);
        this.saveState(); // Save state before starting new stroke
        this.draw(e);
    }

    onPointerMove(e) {
        if (!this.isDrawing) return;
        e.preventDefault(); // Prevent scrolling on touch
        this.draw(e);
    }

    onPointerUp(e) {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.prevPoint = null;
        }
    }

    draw(e) {
        const point = this.getPoint(e);
        

        switch(this.currentTool) {
            case 'pen':
                Brushes.basic(this.ctx, point, this.prevPoint, this.currentSize, this.currentColor);
                break;
            case 'marker':
                Brushes.marker(this.ctx, point, this.prevPoint, this.currentSize * 3, this.currentColor);
                break;
            case 'heart':
                Brushes.heart(this.ctx, point, this.prevPoint, this.currentSize * 3, this.currentColor);
                break;
            case 'eraser':
                Brushes.eraser(this.ctx, point, this.prevPoint, this.currentSize);
                break;
        }

        this.prevPoint = point;
    }

    saveState() {

        if (this.historyStep < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyStep + 1);
        }
        this.history.push(this.canvas.toDataURL());
        if (this.history.length > 20) this.history.shift();
        this.historyStep = this.history.length - 1;
    }

    undo() {
        if (this.historyStep >= 0) {
            const img = new Image();
            img.src = this.history[this.historyStep];
            img.onload = () => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                const dpr = window.devicePixelRatio || 1;
                


                this.ctx.save();
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(img, 0, 0);
                this.ctx.restore();
            };
            this.historyStep--;
        } else {

             this.ctx.clearRect(0, 0, this.canvas.width / window.devicePixelRatio, this.canvas.height / window.devicePixelRatio);
        }
    }

    clear() {
        this.saveState();

        const dpr = window.devicePixelRatio || 1;
        this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
    }

    download() {
        const link = document.createElement('a');
        link.download = `art-for-her-${new Date().toISOString().slice(0,10)}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }
    
    setTool(tool) { this.currentTool = tool; }
    setColor(color) { this.currentColor = color; }
    setSize(size) { this.currentSize = size; }
}
