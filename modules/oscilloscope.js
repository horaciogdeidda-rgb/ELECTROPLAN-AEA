/**
 * ELECTROPLAN.AEA - Módulo de Visualización de Osciloscopio en Canvas
 * Simula una pantalla de tubo de rayos catódicos (CRT) de un osciloscopio de precisión.
 */

export class Oscilloscope {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.animationId = null;
    this.time = 0;
    
    // Parámetros de la onda
    this.frequency = 0.05;
    this.amplitude = 40;
    this.speed = 0.15;
    this.noise = 0;
    
    // Estado
    this.isFault = false;
    this.vDropPercent = 0;
    this.voltage = 220;
    
    // Colores
    this.colorNormal = 'rgba(46, 214, 114, 0.85)'; // Verde neón
    this.colorNormalGlow = 'rgba(46, 214, 114, 0.45)';
    this.colorFault = 'rgba(204, 88, 51, 0.9)';   // Arcilla neón (#CC5833)
    this.colorFaultGlow = 'rgba(204, 88, 51, 0.5)';
    this.colorGrid = 'rgba(46, 64, 54, 0.4)';      // Verde musgo oscuro traslúcido
    
    // Ajustar resolución del canvas para pantallas Retina
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  updateState({ voltage, vDropPercent, isFault, statusMessage }) {
    this.voltage = voltage;
    this.vDropPercent = vDropPercent;
    this.isFault = isFault;
    this.statusMessage = statusMessage || null;

    if (isFault) {
      // Onda distorsionada, mayor frecuencia de ruido visual
      this.amplitude = 25 + Math.min(vDropPercent * 3, 25);
      this.noise = Math.min((vDropPercent - 3) * 1.5, 8); // Mayor caída = más ruido en la onda
    } else {
      // Onda estable y limpia
      this.amplitude = 35 - Math.min(vDropPercent * 3, 15);
      this.noise = 0.05; // Ruido base analógico mínimo
    }
  }

  start() {
    if (this.animationId) return;
    const loop = () => {
      this.draw();
      this.time += this.speed;
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  draw() {
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;
    const ctx = this.ctx;

    // Limpiar con ligero rastro analógico (efecto fósforo persistente)
    ctx.fillStyle = 'rgba(26, 26, 26, 0.25)'; // Carbón general
    ctx.fillRect(0, 0, width, height);

    // 1. Dibujar Rejilla del Osciloscopio
    this.drawGrid(width, height);

    // 2. Dibujar Telemetría OSD (On-Screen Display)
    this.drawOSD(width, height);

    // 3. Dibujar la Onda Sinusoidal
    this.drawWave(width, height);
  }

  drawGrid(width, height) {
    const ctx = this.ctx;
    ctx.strokeStyle = this.colorGrid;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]); // Líneas punteadas

    const divisionsX = 8;
    const divisionsY = 6;
    const stepX = width / divisionsX;
    const stepY = height / divisionsY;

    // Líneas verticales de división
    for (let i = 1; i < divisionsX; i++) {
      ctx.beginPath();
      ctx.moveTo(i * stepX, 0);
      ctx.lineTo(i * stepX, height);
      ctx.stroke();
    }

    // Líneas horizontales de división
    for (let i = 1; i < divisionsY; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * stepY);
      ctx.lineTo(width, i * stepY);
      ctx.stroke();
    }

    // Ejes centrales continuos más fuertes
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(46, 64, 54, 0.8)';
    
    // Eje X Central
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Eje Y Central
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
  }

  drawOSD(width, height) {
    const ctx = this.ctx;
    ctx.fillStyle = this.isFault ? this.colorFault : this.colorNormal;
    ctx.font = '10px "JetBrains Mono", "Fira Code", monospace';
    ctx.textBaseline = 'top';

    // Telemetría Izquierda
    ctx.textAlign = 'left';
    ctx.fillText(`CH1: AC ${this.voltage}V`, 12, 12);
    ctx.fillText(`ΔU: ${this.vDropPercent.toFixed(2)}%`, 12, 26);

    // Telemetría Derecha
    ctx.textAlign = 'right';
    ctx.fillText(`TIME: 5.0ms/DIV`, width - 12, 12);
    ctx.fillText(`FREQ: 50.0 Hz`, width - 12, 26);

    // Indicador de Estado Centro-Inferior
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    
    if (this.isFault) {
      // Parpadeo analógico del cartel de alerta
      if (Math.floor(this.time / 3) % 2 === 0) {
        ctx.fillStyle = this.colorFault;
        ctx.font = 'bold 11px "JetBrains Mono", "Fira Code", monospace';
        ctx.fillText(this.statusMessage || `⚠ CAIDA EXCESIVA (> REG. AEA) ⚠`, width / 2, height - 12);
      }
    } else {
      ctx.fillStyle = 'rgba(46, 214, 114, 0.6)';
      ctx.fillText(this.statusMessage || `ESTADO: LINEA OK`, width / 2, height - 12);
    }
  }

  drawWave(width, height) {
    const ctx = this.ctx;
    const centerY = height / 2;
    
    ctx.save();
    
    // Definir colores y efectos de brillo (glow)
    const color = this.isFault ? this.colorFault : this.colorNormal;
    const glowColor = this.isFault ? this.colorFaultGlow : this.colorNormalGlow;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 8;

    ctx.beginPath();
    
    for (let x = 0; x < width; x++) {
      // Fórmula de onda: y = sin(x * freq - time) * amp
      // Si hay falla, se agrega un componente armónico y ruido analógico
      let noiseVal = 0;
      if (this.noise > 0) {
        noiseVal = (Math.random() - 0.5) * this.noise;
        // Distorsión armónica por sobrecarga
        if (this.isFault) {
          noiseVal += Math.sin(x * 0.15 + this.time * 2) * (this.noise * 0.7);
        }
      }

      const angle = (x * this.frequency) - this.time;
      const y = centerY + Math.sin(angle) * this.amplitude + noiseVal;

      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
    ctx.restore();
  }
}
