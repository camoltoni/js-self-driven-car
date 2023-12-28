const CAR_Y_PERCENT = 0.4
const canvas = document.getElementById("myCanvas")
canvas.width = 200

const ctx = canvas.getContext("2d")
const road = new Road(canvas.width / 2.0, canvas.width * 0.9)
const car = new Car(road.getLaneCenter(1), 100, 30, 50);
let req

document.addEventListener(
  "keydown",
  (event) => {
    const keyName = event.key;
    // As the user releases the Ctrl key, the key is no longer active,
    // so event.ctrlKey is false.
    if (keyName === "Escape") {
      cancelAnimationFrame(req)
    }
  },
  false,
);

animate();

function animate() {
  car.update(road.borders)
  
  canvas.height = window.innerHeight

  ctx.save()
  ctx.translate(0, -car.y + canvas.height * CAR_Y_PERCENT)
  
  road.draw(ctx)
  car.draw(ctx)
  ctx.restore()
  req = requestAnimationFrame(animate)
}