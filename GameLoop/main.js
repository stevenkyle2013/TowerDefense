let map = document.querySelector("canvas")
let m = map.getContext("2d")
let image = document.querySelector("img")

map.width = window.innerWidth;
map.height = window.innerHeight;

let x = 100
let y = 100
let width = 50
let height = 50


function moveForward() {
    x++;
    m.drawImage(image, x, y, width, height)
}

function progressGame() {
    //clears previous
    m.clearRect(0,0,map.width,map.height)
    moveForward();
    if(x < map.width - 300)requestAnimationFrame(progressGame);
}

progressGame();

