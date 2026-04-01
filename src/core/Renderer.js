class Renderer {
  constructor(canvas, context, viewport) {
    this.canvas = canvas;
    this.context = context;
    this.viewport = {
      width: 0,
      height: 0,
      dpr: 1,
    };

    this.resize(viewport);
  }

  resize(viewport) {
    this.viewport = {
      width: viewport.width,
      height: viewport.height,
      dpr: viewport.dpr || 1,
    };

    this.canvas.width = Math.round(this.viewport.width * this.viewport.dpr);
    this.canvas.height = Math.round(this.viewport.height * this.viewport.dpr);

    if (this.canvas.style) {
      this.canvas.style.width = `${this.viewport.width}px`;
      this.canvas.style.height = `${this.viewport.height}px`;
    }

    this.context.imageSmoothingEnabled = true;
  }

  beginFrame() {
    const { dpr, width, height } = this.viewport;

    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.context.clearRect(0, 0, width, height);
  }

  render(draw) {
    this.beginFrame();
    draw(this.context, this.viewport);
  }
}

module.exports = Renderer;
