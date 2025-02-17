let image = document.querySelector("img")
let displayedHealth = document.getElementById("health")

class player {
    constructor(health){
        this.health = health
    }

    takeDamage(damage) {
        this.health = this.health - damage
    }
}

class monsters {
    constructor(health, strength, image, width, height, xPos, yPos, traveled, pathNumber) {
        this.health = health;
        this.strength = strength;
        this.image = image;
        this.width = width;
        this.height = height;
        this.xPos = xPos;
        this.yPos = yPos;
        this.traveled = traveled;
        this.pathNumber = pathNumber;
    }

    moveForward(m, pathToFollow) {

        m.fillRect(this.xPos, this.yPos, this.width, this.height)
    
        switch (pathToFollow.orientation) {
            case "Up":
                this.yPos --
                break
            case "Down":
                this.yPos ++
                break
            case "Right":
                this.xPos ++
                break
        }
    
        this.traveled++
        m.drawImage(this.image, this.xPos, this.yPos, this.width, this.height)
    }

    kill(m){
        m.fillRect(this.xPos, this.yPos, this.width, this.height)
    }
}

class canvas {
    constructor(canvas) {
        this.canvas = canvas
        this.canvas.width = 1000
        this.canvas.height = 1000
        this.map = this.canvas.getContext("2d")
        this.map.fillStyle = "green"
        this.mapPath = {
            "Path1": {
                "orientation": "Down",
                "travel": 800
            },
            "Path2": {
                "orientation": "Right",
                "travel": 350
            },
            "Path3": {
                "orientation": "Up",
                "travel": 700
            },
            "Path4": {
                "orientation": "Right",
                "travel": 350
            },
            "Path5": {
                "orientation": "Down",
                "travel": 900
            }
        }
    }
}

class towers {
    constructor(damage, attackSpeed, range){
        this.damage = damage
        this.attackSpeed = attackSpeed
        this.range = range
    }
}


let xPos = 100
let yPos = 0
let width = 50
let height = 50
let traveled = 0
let pathToFollow
let pathNumber = 1
let iterator = 60
let monsterList = []

function gameLoop() {

    if (iterator >= 60) {
        monsterList.push(new monsters(health=100, strength = 5, image, width, height, xPos, yPos, traveled, 1))
        iterator -= 60
    }
    iterator ++

    monsterList.forEach(monster => {

        pathToFollow = gameCanvas.mapPath[`Path${monster.pathNumber}`]

        if (!pathToFollow) {
            let monsterIndex = monsterList.indexOf(monster)
            monsterList.splice(monsterIndex,1)
            monster.kill(gameCanvas.map)
            player1.takeDamage(monster.strength)
            displayedHealth.textContent = `Health: ${player1.health}` 
            console.log(player1.health)
        } else {
            if (monster.traveled > pathToFollow.travel) {
                monster.pathNumber++
                monster.traveled = 0
            }

            monster.moveForward(gameCanvas.map, pathToFollow)

        }
    })

    if(player1.health <= 0) {
        return
    }
    
    requestAnimationFrame(gameLoop)
}


let player1 = new player(health = 100)
let gameCanvas = new canvas(document.querySelector("canvas"))
gameCanvas.map.fillRect(0, 0, gameCanvas.canvas.width, gameCanvas.canvas.height)
gameLoop();

