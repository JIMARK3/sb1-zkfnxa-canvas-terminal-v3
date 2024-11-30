export class TextWrapper {
  constructor(ctx, maxWidth, padding) {
    this.ctx = ctx;
    this.maxWidth = maxWidth;
    this.padding = padding;
  }

  wrapText(text) {
    const words = text.split('');
    let lines = [];
    let currentLine = '';
    const effectiveWidth = this.maxWidth - (this.padding * 2);

    for (let char of words) {
      const testLine = currentLine + char;
      const metrics = this.ctx.measureText(testLine);
      
      if (metrics.width > effectiveWidth) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  getWrappedCurrentLine(prompt, text) {
    const fullText = prompt + text;
    const effectiveWidth = this.maxWidth - (this.padding * 2);
    const lines = this.wrapText(fullText);
    return {
      lines: lines,
      lastLineWidth: this.ctx.measureText(lines[lines.length - 1]).width
    };
  }
}