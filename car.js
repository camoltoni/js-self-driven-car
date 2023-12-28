class Car {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.polygon = []
    this.angle = 0.0
    
    this.speed = 0
    this.acceleration = 0.2
    this.maxSpeed = 3.0
    this.friction = 0.05
    this.damaged = false
    this.sensor = new Sensor(this)
    this.controls = new Controls()
  }
  update(roadBorders) {
    if(!this.damaged) {
      this.#move()
      this.polygon = this.#createPolygon()
      this.damaged = this.#assessDamage(roadBorders)
    }
    this.sensor.update(roadBorders)
  }

  #assessDamage(roadBorders) {
    return roadBorders.some(border=>{
      return polysIntersect(this.polygon, border)
    })
  }
  
  #move() {
    const ANGLE_INCREMENT = 0.03
    if(this.controls.forward)
      this.speed += this.acceleration
    else if(this.controls.reverse)
      this.speed -= this.acceleration
    else if (this.speed * this.speed > this.friction * this.friction) {
      this.speed -= (this.friction * ((this.speed > 0.0) - (this.speed < 0.0)))
    } else {
      this.speed = 0.0
    }

    this.speed = Math.max(-this.maxSpeed / 2, Math.min(this.speed, this.maxSpeed))

    if(this.speed != 0.0) {
      const flip = this.speed > 0.0?1.0:-1.0
      if(this.controls.left) {
        this.angle += ANGLE_INCREMENT * flip
      } else if(this.controls.right) {
        this.angle -= ANGLE_INCREMENT * flip
      }
    }
    this.x -= Math.sin(this.angle) * this.speed
    this.y -= Math.cos(this.angle) * this.speed
  }

  #createPolygon() {
    const points = []
    const radious = Math.hypot(this.width, this.height) / 2.0
    const alpha = Math.atan2(this.width, this.height)
    points.push(
      {x: this.x - Math.sin(this.angle-alpha) * radious,
       y: this.y - Math.cos(this.angle-alpha) * radious}
    )
    points.push(
      {x: this.x - Math.sin(this.angle+alpha) * radious,
       y: this.y - Math.cos(this.angle+alpha) * radious}
    )
    points.push(
      {x: this.x - Math.sin(Math.PI + this.angle - alpha) * radious,
       y: this.y - Math.cos(Math.PI + this.angle - alpha) * radious}
    )
    points.push(
      {x: this.x - Math.sin(Math.PI + this.angle + alpha) * radious,
       y: this.y - Math.cos(Math.PI + this.angle + alpha) * radious}
    )
    return points
  }

  
  draw(ctx) {
    ctx.beginPath()
  
    if(this.damaged)
      ctx.fillStyle = "lightblue"
    else
      ctx.fillStyle = "blue"
    const p0 = this.polygon[0]
    ctx.moveTo(p0.x, p0.y)
    this.polygon.slice(1, this.polygon.length).forEach(p=>{
      ctx.lineTo(p.x, p.y)
    })
    ctx.fill()
    this.sensor.draw(ctx)    
  }
}