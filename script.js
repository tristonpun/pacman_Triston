let score = document.querySelector('.Score')
let s = 0
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
        this.radius = 20
        this.speed = 3
        this.direction = 'right'
        this.nextDirection = ''
    }
    draw()
    {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'orange'
        ctx.fill()
        ctx.closePath()
    }
    move()
    {
        this.previousX = this.pos.x
        this.previousY = this.pos.y
        if(this.direction == 'up'){this.pos.y -= this.speed}
        else if (this.direction == 'down'){this.pos.y += this.speed}
        else if (this.direction == 'left'){this.pos.x -= this.speed}
        else if (this.direction == 'right'){this.pos.x += this.speed}
        for (let i in boundaries)
        {
            if(hit(this.pos.x - this.radius, this.pos.x + this.radius, boundaries[i].pos.x, boundaries[i].pos.x + blockSize, 
                   this.pos.y - this.radius, this.pos.y + this.radius, boundaries[i].pos.y, boundaries[i].pos.y + blockSize))
                   {
                    console.log('hit')
                    this.pos.x = this.previousX
                    this.pos.y = this.previousY

        }}
        for (let i in foods)
        {
            if(hit(this.pos.x - this.radius, this.pos.x + this.radius, foods[i].pos.x - foods[i].radius, foods[i].pos.x + foods[i].radius, 
                this.pos.y - this.radius, this.pos.y + this.radius, foods[i].pos.y - foods[i].radius, foods[i].pos.y + foods[i].radius))
            {
                foods.splice(i, 1)      
                s += 1
                score.textContent = 'Score: ' + s    
            }
        }
    }
    changeDirection()
    {
        if(this.nextDirection != '' && this.nextDirection != this.direction)
        {
            if (this.nextDirection == 'up')
            {
                this.canChange(0, 0 - 10)
            }
            else if (this.nextDirection == 'down')
            {
                this.canChange(0, 10)
            }
            else if (this.nextDirection == 'left')
            {
                this.canChange(0 - 10, 0)
            }
            else
            {
                this.canChange(10, 0)
            }
        }
    }
    canChange(x,y)
    {
        for (let i in boundaries)
                {
                if(hit(this.pos.x - this.radius + x, this.pos.x + this.radius + x, boundaries[i].pos.x, boundaries[i].pos.x + blockSize, 
                    this.pos.y - this.radius + y, this.pos.y + this.radius + y, boundaries[i].pos.y, boundaries[i].pos.y + blockSize))
                    {
                        return
                    }
                
                }
                this.direction = this.nextDirection
                this.nextDirection = ''
                return
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
    player.changeDirection()
}

function hit(x1, x2, x3, x4, y1, y2, y3, y4)
{
    return x2 >= x3 && x1 <= x4 && y2 >= y3 && y1 <= y4
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

const player = new Player({x:blockSize + blockSize/2, y:blockSize + blockSize/2})

document.addEventListener('keydown', (e) => {
    if(e.key=='w'){player.nextDirection = 'up'}
    else if (e.key=='a'){player.nextDirection = 'left'}
    else if (e.key=='s'){player.nextDirection = 'down'}
    else if (e.key=='d'){player.nextDirection = 'right'}
})

setInterval(draw, 1000 / fps)