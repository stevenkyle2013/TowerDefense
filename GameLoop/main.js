let monsterImg = document.getElementById("monsterImg")
let sandImg = document.getElementById("sandImg")
let cactusImg = document.getElementById("cactusImg")
let eiffelTowerImg = document.getElementById("eiffelTowerImg")
let displayedHealth = document.getElementById("health")
let htmlCanvas = document.querySelector("canvas")
let turretPurchaseTest = document.getElementById("TestTurretPurchase")

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
}

function purchaseTower() {

}

class canvas {
    constructor(canvas) {
        this.canvas = canvas
        this.canvas.width = 1000
        this.canvas.height = 1000
        this.map = this.canvas.getContext("2d")
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
        this.towerPlots = [
            {
                "TowerPlot": 1,
                "image": eiffelTowerImg,
                "xPos": 250,
                "yPos": 200
            },
            {
                "TowerPlot": 2,
                "image": eiffelTowerImg,
                "xPos": 350,
                "yPos": 650
            },
            {
                "TowerPlot": 3,
                "image": eiffelTowerImg,
                "xPos": 700,
                "yPos": 300
            },
            {
                "TowerPlot": 4,
                "image": eiffelTowerImg,
                "xPos": 700,
                "yPos": 750
            }
        ]
        this.towersPurchased = []
    }

    addTower(){

        
        this.towersPurchased.push(this.towerPlots[0])
    }

    drawMap(image, imageWidth, imageHeight) {
        for (let xPos=0; xPos < this.canvas.width; xPos += imageWidth) {
            for (let yPos = 0; yPos < this.canvas.height; yPos += imageHeight) {
                this.map.drawImage(image, xPos, yPos)
            }
        }

        this.towerPlots.forEach(plot => {
            this.map.beginPath()
            this.map.arc(plot.xPos, plot.yPos, 40, 0, 2 * Math.PI)
            this.map.fillStyle = "blue"
            this.map.fill()
            this.map.stroke()
        })


        this.towersPurchased.forEach(tower => {
            this.map.drawImage(tower.image, tower.xPos, tower.yPos)
        })
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
let width = 50 //50
let height = 50 //50
let traveled = 0
let pathToFollow
let pathNumber = 1
let iterator = 60
let monsterList = []

//Testing Turret Generation
let createTurret1 = false

function gameLoop() {

    gameCanvas.drawMap(sandImg, 8, 8)

    if (iterator >= 60) {
        monsterList.push(new monsters(health=100, strength = 5, monsterImg, width, height, xPos, yPos, traveled, 1))
        iterator -= 60
    }
    iterator ++

    let killList = []

    if(createTurret1) {
        gameCanvas.addTower()
        createTurret1 = false
    }

    monsterList.forEach(monster => {

        pathToFollow = gameCanvas.mapPath[`Path${monster.pathNumber}`]

        if (!pathToFollow) {
            let monsterIndex = monsterList.indexOf(monster)
            killList.push(monsterIndex)
            player1.takeDamage(monster.strength)
            displayedHealth.textContent = `Health: ${player1.health}` 
            console.log(player1.health)
        } else {

            monster.moveForward(gameCanvas.map, pathToFollow)

            if (monster.traveled > pathToFollow.travel) {
                monster.pathNumber++
                monster.traveled = 0
            }
        }
    })

    killList.forEach(killed => {
        monsterList.splice(killed,1)
    })

    if(player1.health <= 0) {
        return
    }
    
    requestAnimationFrame(gameLoop)
}


let player1 = new player(health = 100)
let gameCanvas = new canvas(htmlCanvas)

//For checking placement/position
htmlCanvas.addEventListener("mousemove", (e)=>{
    console.log("X Position", e.offsetX)
    console.log("Y Position", e.offsetY)
})

//Add event listener to button to test purchasing
turretPurchaseTest.addEventListener("click", function (){
    createTurret1 = !createTurret1
})

gameLoop();

