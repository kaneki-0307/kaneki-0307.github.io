export class UIManager {
    constructor(drawingCore) {
        this.core = drawingCore;
        this.init();
    }

    init() {
        this.bindTools();
        this.bindColors();
        this.bindActions();
    }

    bindTools() {
        const buttons = document.querySelectorAll('.tool-option');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {

                document.querySelector('.tool-option.active').classList.remove('active');
                btn.classList.add('active');
                

                const tool = btn.dataset.tool;
                this.core.setTool(tool);
                if (tool === 'heart-brush') {
                this.createHeartAnimation(btn);
                }
            });
        });

        const sizeSlider = document.getElementById('size-slider');
        sizeSlider.addEventListener('input', (e) => {
            this.core.setSize(parseInt(e.target.value));
        });
    }
    createHeartAnimation(button) {
        const heart = document.createElement('i');
        heart.className = 'lucide heart heart-animation';
        heart.setAttribute('data-lucide', 'heart');

        // 获取按钮位置
        const rect = button.getBoundingClientRect();
        heart.style.left = `${rect.left + rect.width/2}px`;
        heart.style.top = `${rect.top - 20}px`;

        document.body.appendChild(heart);

        // 触发动画
        heart.style.animation = 'heartPopup 0.8s ease-out forwards';

        // 动画结束后移除元素
        setTimeout(() => heart.remove(), 800);
    }
    bindColors() {
        const swatches = document.querySelectorAll('.color-swatch');
        swatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                document.querySelector('.color-swatch.active').classList.remove('active');
                swatch.classList.add('active');
                this.core.setColor(swatch.dataset.color);
            });
        });
    }

    bindActions() {
        document.getElementById('clear-btn').addEventListener('click', () => {
            if(confirm("Clear the canvas, my love?")) {
                this.core.clear();
            }
        });

        document.getElementById('undo-btn').addEventListener('click', () => {
            this.core.undo();
        });

        document.getElementById('download-btn').addEventListener('click', () => {
            this.core.download();
        });
    }
}
