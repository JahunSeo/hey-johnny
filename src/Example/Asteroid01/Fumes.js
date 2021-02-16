// import Vector2D from "../../Tool/Vector2D";
import Particle from "./Particle";

export default class Fumes {
  constructor(origin, angle) {
    this.origin = origin.clone();
    this.angle = angle;
    this.particles = [];
  }

  addParticle() {
    this.particles.push(new Particle(this.origin, this.angle));
  }

  setLocation(x, y, angle) {
    this.origin.x = x;
    this.origin.y = y;
    this.angle = angle;
  }

  run(ctx) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.run(ctx);
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
}
