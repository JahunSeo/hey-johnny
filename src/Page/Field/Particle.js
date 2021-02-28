import Vector2D from "./Tool/Vector2D";

export default class Particle {
  constructor(location, angle) {
    this.location = location.clone();
    this.angle = angle;

    let mag = 0.5;

    let xVel = -1 * Math.cos(angle) * mag + (Math.random() - 0.5) * 2.0;
    let yVel = -1 * Math.sin(angle) * mag + (Math.random() - 0.5) * 2.0;

    this.velocity = new Vector2D(xVel, yVel);
    this.acceleration = new Vector2D(0, 0);
    this.radius = 2;
    this.lifespan = 20;
  }

  run(ctx) {
    this.update(ctx);
    this.display(ctx);
  }

  update(ctx) {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.lifespan -= 1;
  }

  display(ctx) {
    ctx.save();
    ctx.fillStyle = `rgba(255,90,0, ${this.lifespan / 20})`;
    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  isDead() {
    return this.lifespan < 0;
  }
}
