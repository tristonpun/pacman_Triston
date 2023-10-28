const textToImg = {
    '-' : './images/pipeHorizontal.png',
    '|' : './images/pipeVertical.png',
    '1' : './images/pipeCorner1.png',
    '2' : './images/pipeCorner2.png',
    '3' : './images/pipeCorner3.png',
    '4' : './images/pipeCorner4.png',
    'b' : './images/block.png',
    '[' :  './images/capLeft.png',
    ']' : './images/capRight.png',
    '_' : './images/capBottom.png',
    '^' : './images/capTop.png',
    '+' : './images/pipeCross.png',
    '5' : './images/pipeConnectorTop.png',
    '6' : './images/pipeConnectorRight.png',
    '7' : './images/pipeConnectorBottom.png',
    '8' : './images/pipeConnectorLeft.png'
}

const fps = 50
const canvas = document.querySelector('canvas')
const boundaries = []
const foods = []
const ctx = canvas.getContext('2d')
const blockSize = 50
const map = [['1', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
             ['|', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
             ['|', '.', '^', '.', '.', '.', '[', '2', '.', '|'],
             ['|', '[', '+', ']', '.', '.', '.', '|', '.', '|'],
             ['|', '.', '_', '.', '.', '.', '.', '|', '.', '|'],
             ['|', '.', '.', '.', '.', '^', '.', '|', '.', '|'],
             ['|', '.', '[', '7', '-', '3', '.', '|', '.', '|'],
             ['|', '.', '.', '_', '.', '.', '[', '3', '.', '|'],
             ['|', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
             ['4', '-', '-', '-', '-', '-', '-', '-', '-', '3']] 
canvas.width = blockSize * map[0].length
canvas.height = blockSize * map.length

class Boundary
{
    constructor(pos, imagePath)
    {
        this.pos = pos
        this.img = new Image(blockSize, blockSize)
        this.img.src = imagePath
    }
    draw()
    {
        ctx.drawImage(this.img, this.pos.x, this.pos.y, blockSize, blockSize)
    }
}

class Player
{
    constructor(pos)
    {
        this.pos = pos
        this.radius = 10
        this.speed = 3
        this.direction = 'right'
        this.nextDirection = ''
    }
    draw()
    {
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'orange'
        ctx.fill()
    }
    move()
    {
        if(this.direction == 'up'){this.pos.y -= this.speed}
        else if (this.direction == 'down'){this.pos.y += this.speed}
        else if (this.direction == 'left'){this.pos.x -= this.speed}
        else if (this.direction == 'right'){this.pos.x += this.speed}
    }
}

class Food
{
    constructor(pos)
    {
        this.pos = pos
        this.radius = 10
    }
    draw()
    {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'orange'
        ctx.fill()
        ctx.closePath()
    }
}

function draw()
{
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, blockSize * map[0].length, blockSize * map.length)
    for(let i in boundaries)
    {
        boundaries[i].draw()
    }
    for(let i in foods)
    {
        foods[i].draw()
    }
    player.draw()
    player.move()
}

for (let i in map)
{
    for (let j in map[i])
    {
        if(map[i][j]!='.')
        {
        boundaries.push(new Boundary({x:blockSize*j ,y:blockSize*i}, textToImg[map[i][j]]))
        }
        else
        {
            foods.push(new Food({x:blockSize*j + blockSize/2 ,y:blockSize*i + blockSize/2}))
        }
    }
}

const player = new Player({x:0, y:0})

setInterval(draw, 1000 / fps)