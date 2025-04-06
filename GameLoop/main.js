let monsterImg = document.getElementById("monsterImg")
let sandImg = document.getElementById("sandImg")
let cactusImg = document.getElementById("cactusImg")
let eiffelTowerImg = document.getElementById("eiffelTowerImg")
let displayedHealth = document.getElementById("health")
let displayedGold = document.getElementById("gold")
let htmlCanvas = document.querySelector("canvas")


/**
 * This class houses the player stats
 */
class player {
    constructor(health, gold){
        this.health = health
        this.gold = gold
    }

    takeDamage(damage) {
        this.health = this.health - damage
    }

    addGold(gold) {
        this.gold = this.gold + gold
    }

    subtractGold(gold) {
        this.gold = this.gold - gold
    }
}

/**
 * This class houses the monster information, also houses the actual movement of the monster
 */
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

/**
 * This class houses the game canvas/map, it will store a bulk of the game information
 * Things like...
 * the monsters pathing
 * where towers can be purchased and for what price
 * towers that were purchased
 * The actual drawing of the game board (minus monsters)
 * 
 */
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
                "yPos": 200,
                "price": 50
            },
            {
                "TowerPlot": 2,
                "image": eiffelTowerImg,
                "xPos": 350,
                "yPos": 650,
                "price": 50,
            },
            {
                "TowerPlot": 3,
                "image": eiffelTowerImg,
                "xPos": 700,
                "yPos": 300,
                "price": 50,
            },
            {
                "TowerPlot": 4,
                "image": eiffelTowerImg,
                "xPos": 700,
                "yPos": 750,
                "price": 50,
            }
        ]
        this.towersPurchased = []
    }

    removeTowerPlot(towerIndex) {
        let tower = this.towerPlots.splice(towerIndex,1)
        return tower[0]
    }

    addTower(tower){
        this.towersPurchased.push(tower)
    }

    drawMap(image, imageWidth, imageHeight) {
        for (let xPos=0; xPos < this.canvas.width; xPos += imageWidth) {
            for (let yPos = 0; yPos < this.canvas.height; yPos += imageHeight) {
                this.map.drawImage(image, xPos, yPos)
            }
        }

        this.towerPlots.forEach(plot => {
            this.map.fillStyle = "blue"
            this.map.fillRect(plot.xPos, plot.yPos, 30, 30)
            this.map.fillText("Purchase Tower", plot.xPos, plot.yPos)
        })

        this.towersPurchased.forEach(tower => {
            this.map.drawImage(tower.image, tower.xPos, tower.yPos)
        })
    }
}

/**
 * This class houses specifics about towers
 */
class towers {
    constructor(towerPlot, xPos, yPos){
        this.damage = 50
        this.attackSpeed = 1
        this.range = 40
        this.towerPlot = towerPlot
        this.xPos = xPos
        this.yPos = yPos
        this.image = eiffelTowerImg
        this.upgradePrice = 100
    }
}

/**
 * This class houses the game operations that will be used in play
 */
class GameOperations {
    purchaseTower(gameCanvas, towerIndex, player) {

        //Stop if player doesn't have enough gold
        if (player.gold < gameCanvas.towerPlots[towerIndex].price) {
            console.log("Not enough gold to purchase")
            return
        }

        //If player has enough gold, remove the plot and add tower
        let towerPlot = gameCanvas.removeTowerPlot(towerIndex)
        let tower = new towers(towerPlot, towerPlot.xPos, towerPlot.yPos)
        gameCanvas.addTower(tower)

        //Decrease Player money
        player.subtractGold(towerPlot.price)
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

    //Monster generator
    if (iterator >= 60) {
        monsterList.push(new monsters(health=100, strength = 5, monsterImg, width, height, xPos, yPos, traveled, 1))
        iterator -= 60
    }
    iterator ++

    let killList = []

    monsterList.forEach(monster => {

        pathToFollow = gameCanvas.mapPath[`Path${monster.pathNumber}`]

        if (!pathToFollow) {
            let monsterIndex = monsterList.indexOf(monster)
            killList.push(monsterIndex)
            player1.takeDamage(monster.strength)
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

    displayedHealth.textContent = `Health: ${player1.health}` 
    displayedGold.textContent = `Gold: ${player1.gold}` 

    if(player1.health <= 0) {
        return
    }
    
    requestAnimationFrame(gameLoop)
}

let player1 = new player(health = 100, gold = 250)
let gameCanvas = new canvas(htmlCanvas)
let gameOperations = new GameOperations


//Add event listener to button to test purchasing
gameCanvas.canvas.addEventListener("click", function (e){
    //console.log("X Position", e.offsetX)
    //console.log("Y Position", e.offsetY)
    
    //When clicked if there are tower plots that are ready to be purchased then buy correct one
    if (gameCanvas.towerPlots.length > 0 ) {
        for (let i=0; i < gameCanvas.towerPlots.length; i++) {
            if(e.offsetX > gameCanvas.towerPlots[i].xPos - 50 &&
                e.offsetX < gameCanvas.towerPlots[i].xPos + 50 &&
                e.offsetY > gameCanvas.towerPlots[i].yPos - 50 && 
                e.offsetY < gameCanvas.towerPlots[i].yPos + 50
            ) {
                //Purchase tower from game operations
                gameOperations.purchaseTower(gameCanvas, i, player1)
            }
        }
    }

})

gameLoop();

