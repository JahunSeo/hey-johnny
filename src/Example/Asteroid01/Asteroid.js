import Vector2D from "../../Tool/Vector2D";
import Fumes from "./Fumes";

export default class Asteroid {
  constructor(x = 0, y = 0) {
    this.location = new Vector2D(x, y);
    this.velocity = new Vector2D(0, 0);
    this.acceleration = new Vector2D(0, 0);

    this.maxSpeed = 5;
    this.maxForce = 0.2;

    this.defaultAngle = -Math.PI / 2;
    this.angle = this.defaultAngle;
    this.angStep = 0.05;

    this.mouseTracking = true;

    this.isAccelerated = true;
    this.leftFumes = new Fumes(this.location, this.angle);
    this.rightFumes = new Fumes(this.location, this.angle);
  }

  turnLeft() {
    this.angle -= this.angStep;
  }

  turnRight() {
    this.angle += this.angStep;
  }

  moveForward() {
    let mag = 0.1;
    let x = Math.cos(this.angle) * mag;
    let y = Math.sin(this.angle) * mag;
    this.acceleration.x = x;
    this.acceleration.y = y;
  }

  seek(target) {
    let desired = Vector2D.sub(target, this.location);
    let dX = this.location.x - target.x;
    let dY = this.location.y - target.y;
    let angleBase = Math.atan2(dY, dX) - Math.PI;

    let d = desired.getMag();
    desired.normalize();
    let dLimit = 50;
    if (d < dLimit) {
      let m = (d / dLimit) * this.maxSpeed;
      desired.mult(m);
      this.angle =
        this.defaultAngle - (this.defaultAngle - angleBase) * (d / dLimit);
    } else {
      desired.mult(this.maxSpeed);
      this.angle = angleBase;
    }
    desired.sub(this.velocity);
    desired.limit(this.maxForce);
    this.applyForce(desired);
  }

  seekMouse(mouseObj) {
    let target = new Vector2D(mouseObj.mouseX, mouseObj.mouseY);
    this.seek(target);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update(ctx) {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.velocity.mult(0.99);
    this.location.add(this.velocity);
    this.acceleration.mult(0);

    this.checkEdges(ctx);
    this.updateFumes(ctx);
  }

  updateFumes(ctx) {
    let angSize = Math.PI / 5;
    let dist = 10;

    let leftAngle = this.angle + angSize;
    let leftX = this.location.x + -1 * dist * Math.cos(leftAngle);
    let leftY = this.location.y + -1 * dist * Math.sin(leftAngle);
    this.leftFumes.setLocation(leftX, leftY, leftAngle);

    let rightAngle = this.angle - angSize;
    let rightX = this.location.x + -1 * dist * Math.cos(rightAngle);
    let rightY = this.location.y + -1 * dist * Math.sin(rightAngle);
    this.rightFumes.setLocation(rightX, rightY, rightAngle);
  }

  display(ctx, mouseObj) {
    ctx.save();
    ctx.translate(this.location.x, this.location.y);
    ctx.rotate(this.angle);

    // triangle
    ctx.fillStyle = `rgba(255, 255, 255, 1)`;
    ctx.strokeStyle = `rgba(0, 0, 0, 1)`;
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(-5, -15);
    ctx.lineTo(-5, 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    let { mouseX, mouseY } = mouseObj;
    let dX = this.location.x - mouseX;
    let dY = this.location.y - mouseY;
    let eyeAngle = Math.atan2(dY, dX) - this.angle + Math.PI / 2;
    let pupil = 2;
    // console.log((this.angle * 180) / Math.PI, (eyeAngle * 180) / Math.PI);

    // left eyes
    ctx.save();
    ctx.translate(12, -7);
    ctx.rotate(eyeAngle);
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, pupil, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 0, 0, 1)`;
    ctx.fill();
    ctx.restore();

    // right eyes
    ctx.save();
    ctx.translate(12, 7);
    ctx.rotate(eyeAngle);
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, pupil, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 0, 0, 1)`;
    ctx.fill();
    ctx.restore();

    // exhaust
    if (this.isAccelerated) {
      ctx.fillStyle = `rgba(200, 0, 0, 1)`;
    } else {
      ctx.fillStyle = `rgba(255, 255, 255, 1)`;
    }
    ctx.strokeStyle = `rgba(0, 0, 0, 1)`;

    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-6, -6, 3, -Math.PI / 2, Math.PI / 2, true);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-6, 6, 3, -Math.PI / 2, Math.PI / 2, true);
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    if (this.isAccelerated) {
      this.leftFumes.addParticle();
      this.rightFumes.addParticle();
    }
    this.leftFumes.run(ctx);
    this.rightFumes.run(ctx);
  }

  checkEdges(ctx) {
    let canvasWidth = ctx.canvas.width;
    let canvasHeight = ctx.canvas.height;
    let x = this.location.x;
    let y = this.location.y;

    if (x < 0) {
      this.location.x = canvasWidth;
    } else if (x > canvasWidth) {
      this.location.x = 0;
    }

    if (y < 0) {
      this.location.y = canvasHeight;
    } else if (y > canvasHeight) {
      this.location.y = 0;
    }
  }
}
