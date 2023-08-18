const missile = document.getElementById('missile');
const game = document.getElementById('game');
const startGame = document.getElementById('startGame');
const walls = document.getElementById('walls');
const score = document.getElementById('score');
const result = document.getElementById('result');
const restart = document.getElementById('restart');

var wallInterval
var createWallInterval
var missileInterva

restart.addEventListener('click', () => {
    location.reload();
})

let velocity = -10;
const acceleration = 0.6;

const idWalls = [];

let wallNumber = 0;

const update = () => {
    if (missile.offsetTop <= game.offsetHeight - missile.offsetHeight || velocity < 0) {
        velocity += acceleration;
        missile.style.top = Math.min(missile.offsetTop + velocity, game.offsetHeight - missile.offsetHeight) + 'px';
    } else if (missile.offsetTop >= game.offsetHeight - missile.offsetHeight) {
        velocity = 0;
        missile.style.top = game.offsetHeight - missile.offsetHeight + 'px';
    }

    if (!missile.style.transform) {
        missile.style.transform = `rotate(${velocity * 3}deg)`;
    } else {
        if(missile.style.transform.split('(')[1].split('deg')[0] <= 65) {
            if (velocity * 3 >= 65) {
                missile.style.transform = `rotate(65deg)`;
            } else {
                missile.style.transform = `rotate(${velocity * 3}deg)`;
            }
            
        }
    }
}

startGame.addEventListener("click", () => {
    wallInterval = setInterval(updateWalls, 20);
    createWallInterval = setInterval(createWall, 2500);
    startGame.remove();
    missileInterval = setInterval(update, 20);
})

document.addEventListener('keydown', () => {
    let keypress = null;
    if(event.keyCode == 38) {
        keypress = Date.now();
    }

    this.addEventListener('keyup', () => {
        if(event.keyCode == 38) {
            keypress = Date.now() - keypress;
            if (keypress/10 > 15) {
                velocity = -15;
            } else if (keypress/10 < 9) {
                velocity = -9;
            } else {
                velocity = -keypress/10;
            }
        }
    })  
});

const createWall = () => {
    console.log('creating wall');
    let topParam = (Math.random() * 600) - 400;
    walls.innerHTML += `
        <div id="wall${wallNumber}" style="top: ${topParam}px;" class="wall">
            <div class="block">
            </div>
            <div class="block">
            </div>
        </div>
    `;
    idWalls.push(wallNumber);
    wallNumber++;
}

const updateWalls = () => {


    idWalls.forEach((id) => {
        const wall = document.getElementById(`wall${id}`);
        wall.style.left = wall.offsetLeft - 4 + 'px';

        for (block of wall.children) {
            if (collision(missile, block)) {
                clearInterval(wallInterval);
                clearInterval(createWallInterval);
                clearInterval(missileInterval);
                result.style.display = 'flex';
                score.innerHTML = id;
            }
        }
    })

    if (idWalls.length > 0) {
        if (document.getElementById(`wall${idWalls[0]}`).offsetLeft <= -150) {
            document.getElementById(`wall${idWalls[0]}`).remove();
            idWalls.shift();
        }
    }
}

function collision(div1, div2) {
    const rect1 = div1.getBoundingClientRect();
    const rect2 = div2.getBoundingClientRect();

    return !(
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom ||
        rect1.right < rect2.left ||
        rect1.left > rect2.right
    );
}