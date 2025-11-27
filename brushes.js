export class Brushes {
    static basic(ctx, point, prevPoint, size, color) {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        
        if (prevPoint) {
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
    }

    static marker(ctx, point, prevPoint, size, color) {
        ctx.globalAlpha = 0.6; // Transparency for marker effect
        ctx.beginPath();
        ctx.lineCap = 'square'; // Marker tip
        ctx.lineJoin = 'bevel';
        ctx.strokeStyle = color;
        ctx.lineWidth = size * 1.5;

        if (prevPoint) {
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
        ctx.globalAlpha = 1.0; // Reset
    }

    static eraser(ctx, point, prevPoint, size) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = size * 2;
        
        if (prevPoint) {
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    static heart(ctx, point, prevPoint, size, color) {

        if (!prevPoint) return;

        const dist = Math.hypot(point.x - prevPoint.x, point.y - prevPoint.y);
        const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
        

        if (dist > 10) {
            const heartsToDraw = Math.floor(dist / 10);
            
            for (let i = 0; i < heartsToDraw; i++) {
                const ratio = i / heartsToDraw;
                const x = prevPoint.x + (point.x - prevPoint.x) * ratio;
                const y = prevPoint.y + (point.y - prevPoint.y) * ratio;
                

                const offsetX = (Math.random() - 0.5) * size;
                const offsetY = (Math.random() - 0.5) * size;
                const randomSize = size * (0.8 + Math.random() * 0.6);
                const rotation = (Math.random() - 0.5) * 1;

                this._drawHeartShape(ctx, x + offsetX, y + offsetY, randomSize, rotation, color);
            }
        }
    }

    static _drawHeartShape(ctx, x, y, size, rotation, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.fillStyle = color;
        ctx.beginPath();

        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
        ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 2 + size / 2, 0, size);
        ctx.bezierCurveTo(0, (size + topCurveHeight) / 2 + size / 2, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
        ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}
