class Car {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.speed = 0
    this.acceleration = 0.2
    this.maxSpeed = 3.0
    this.friction = 0.05
    this.angle = 0.0
    this.sensor = new Sensor(this)
    this.controls = new Controls()
    this.polygon = []
  }
  update(roadBorders) {
    this.#move()
    this.polygon = this.#createPolygon()
    this.sensor.update(roadBorders)
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
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(-this.angle)
    ctx.beginPath()
    ctx.rect(
      -this.width / 2, 
      -this.height / 2, 
      this.width, 
      this.height)
    ctx.fill()
    ctx.restore()
    ctx.beginPath()
    this.polygon.forEach((p)=>{
      ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI, false)
    })
    ctx.stroke()
    this.sensor.draw(ctx)    
  }
}