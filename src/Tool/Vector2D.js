class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    if (v instanceof Vector2D) {
      this.x += v.x;
      this.y += v.y;
    } else {
      // v is considered as scalar
      this.x += v;
      this.y += v;
    }
    return this;
  }

  sub(v) {
    if (v instanceof Vector2D) {
      this.x -= v.x;
      this.y -= v.y;
    } else {
      // v is considered as scalar
      this.x -= v;
      this.y -= v;
    }
    return this;
  }

  mult(v) {
    if (v instanceof Vector2D) {
      this.x *= v.x;
      this.y *= v.y;
    } else {
      // v is considered as scalar
      this.x *= v;
      this.y *= v;
    }
    return this;
  }

  div(v) {
    if (v instanceof Vector2D) {
      this.x /= v.x;
      this.y /= v.y;
    } else {
      // v is considered as scalar
      this.x /= v;
      this.y /= v;
    }
    return this;
  }

  equals(v) {
    return this.x === v.x && this.y === v.y;
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  getMag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  setMag(v) {
    this.normalize();
    this.mult(v);
    return this;
  }

  normalize() {
    let m = this.getMag();
    if (m === 0) {
      this.x = 1;
      this.y = 0;
    } else {
      this.div(m);
    }
    return this;
  }

  limit(maximum) {
    if (this.getMag() > maximum) {
      this.setMag(maximum);
    }
    return this;
  }

  clone() {
    return new Vector2D(this.x, this.y);
  }

  static add(a, b) {
    if (b instanceof Vector2D) {
      return new Vector2D(a.x + b.x, a.y + b.y);
    } else {
      return new Vector2D(a.x + b, a.y + b);
    }
  }

  static sub(a, b) {
    if (b instanceof Vector2D) {
      return new Vector2D(a.x - b.x, a.y - b.y);
    } else {
      return new Vector2D(a.x - b, a.y - b);
    }
  }

  static mult(a, b) {
    if (b instanceof Vector2D) {
      return new Vector2D(a.x * b.x, a.y * b.y);
    } else {
      return new Vector2D(a.x * b, a.y * b);
    }
  }

  static div(a, b) {
    if (b instanceof Vector2D) {
      return new Vector2D(a.x / b.x, a.y / b.y);
    } else {
      return new Vector2D(a.x / b, a.y / b);
    }
  }
}

export default Vector2D;
