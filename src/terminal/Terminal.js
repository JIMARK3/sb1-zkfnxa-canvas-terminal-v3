import { COLORS, FONT, PADDING, CURSOR_BLINK_RATE } from './constants.js';
import { TextWrapper } from './utils/text-wrapper.js';

export class Terminal {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.lines = ['Welcome to Canvas Terminal'];
    this.currentLine = '';
    this.cursorVisible = true;
    this.prompt = '> ';
    
    this.setupCanvas();
    this.startCursorBlink();
  }

  setupCanvas() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    this.ctx.font = `${FONT.size} ${FONT.family}`;
    this.textWrapper = new TextWrapper(this.ctx, this.canvas.width, PADDING);
    
    this.render();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (this.ctx) {
      this.ctx.font = `${FONT.size} ${FONT.family}`;
      this.textWrapper = new TextWrapper(this.ctx, this.canvas.width, PADDING);
    }
    this.render();
  }

  startCursorBlink() {
    setInterval(() => {
      this.cursorVisible = !this.cursorVisible;
      this.render();
    }, CURSOR_BLINK_RATE);
  }

  addCharacter(char) {
    this.currentLine += char;
    this.render();
  }

  handleEnter() {
    const wrappedLines = this.textWrapper.wrapText(this.prompt + this.currentLine);
    this.lines.push(...wrappedLines);
    this.currentLine = '';
    this.render();
  }

  handleBackspace() {
    if (this.currentLine.length > 0) {
      this.currentLine = this.currentLine.slice(0, -1);
      this.render();
    }
  }

  render() {
    // Clear canvas
    this.ctx.fillStyle = COLORS.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Set text properties
    this.ctx.fillStyle = COLORS.text;
    this.ctx.font = `${FONT.size} ${FONT.family}`;

    // Draw previous lines with wrapping
    let y = PADDING + FONT.lineHeight;
    for (const line of this.lines) {
      const wrappedLines = this.textWrapper.wrapText(line);
      for (const wrappedLine of wrappedLines) {
        this.ctx.fillText(wrappedLine, PADDING, y);
        y += FONT.lineHeight;
      }
    }

    // Draw current line with prompt and handle wrapping
    const { lines: currentWrappedLines, lastLineWidth } = 
      this.textWrapper.getWrappedCurrentLine(this.prompt, this.currentLine);

    this.ctx.fillStyle = COLORS.prompt;
    for (let i = 0; i < currentWrappedLines.length; i++) {
      const wrappedLine = currentWrappedLines[i];
      this.ctx.fillText(wrappedLine, PADDING, y + (i * FONT.lineHeight));
    }

    // Draw cursor at the end of the last wrapped line
    if (this.cursorVisible) {
      const cursorY = y + ((currentWrappedLines.length - 1) * FONT.lineHeight);
      const cursorX = PADDING + lastLineWidth;
      this.ctx.fillStyle = COLORS.cursor;
      this.ctx.fillRect(cursorX, cursorY - FONT.lineHeight + 4, 2, FONT.lineHeight - 4);
    }
  }
}