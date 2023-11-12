var c = document.getElementById("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
var ctx = c.getContext("2d");
var scaling = 2;
var tileSizeX = 23 * scaling;
var tileSizeY = 21 * scaling;
var wx = 1200;
var wy = 1200;
var seed = 1234;
var noise = new FastNoiseLite();
//noise.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);
noise.SetSeed(seed);
var per = {
    "y": wx,
    "x": wy,
    "dir": 1,
};
function preload() {
    var grass = new Image();
    grass.src = './assets/grass.png';
    var sand = new Image();
    sand.src = './assets/sand.png';
    var dirt = new Image();
    dirt.src = './assets/dirt.png';
    var water = new Image();
    water.src = './assets/water.png';
    var ld = new Image();
    ld.src = './assets/ld.png';
    var lu = new Image();
    lu.src = './assets/lu.png';
    var rd = new Image();
    rd.src = './assets/rd.png';
    var ru = new Image();
    ru.src = './assets/ru.png';
    return {
        "grass": grass,
        "sand": sand,
        "dirt": dirt,
        "water": water,
        "per": { "ld": ld, "lu": lu, "rd": rd, "ru": ru },
    };
}
var sprites = preload();
function randomSeed(x, y) {
    var e = (1 * noise.GetNoise(x, y)) + (0.5 * noise.GetNoise(2 * x, 2 * y)) + (0.25 * noise.GetNoise(4 * x, 4 * y));
    e = e / (1 + 0.5 + 0.25);
    var nx = ((2 * x) / 2400) - 1;
    var ny = ((2 * y) / 2400) - 1;
    var d = Math.min(1, (Math.pow(nx, 2) + Math.pow(ny, 2)) / Math.sqrt(2)); //1 - ((1-Math.pow(nx, 2)) * (1-Math.pow(ny, 2))) //Math.min(1, (Math.pow(x, 2) + Math.pow(y, 2))/Math.sqrt(2))
    e = (e + (1 - d)) / 2;
    return Math.pow(e, 1.25);
}
function drawPosition(x, y, sizeX, sizeY, windowWidth, windowHeight) {
    var xPos = (x * 0.5 * sizeX) + (y * (-0.5) * sizeX) + (windowWidth / 2);
    var yPos = (x * 0.25 * sizeY) + (y * 0.25 * sizeY) + (windowHeight / 2);
    return { xPos: xPos, yPos: yPos };
}
var keyState = {};
window.addEventListener('keydown', function (e) {
    keyState[e.keyCode || e.which] = true;
}, true);
window.addEventListener('keyup', function (e) {
    keyState[e.keyCode || e.which] = false;
}, true);
function loop() {
    ctx.fillStyle = "#d4cdcb";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    if (keyState[65]) {
        per.dir = 0;
        per.x -= 1;
    }
    if (keyState[68]) {
        per.dir = 1;
        per.x += 1;
    }
    if (keyState[87]) {
        per.dir = 2;
        per.y -= 1;
    }
    if (keyState[83]) {
        per.dir = 3;
        per.y += 1;
    }
    for (var i = -20; i < 21; i++) {
        for (var j = -20; j < 21; j++) {
            var yOffset = 0;
            var x = per.x + i;
            var y = per.y + j;
            var groundTile = Math.abs(randomSeed(x, y));
            var img = sprites.water;
            if (groundTile > 0.2) {
                img = sprites.sand;
                yOffset = -10;
            }
            if (groundTile > 0.35) {
                img = sprites.dirt;
            }
            if (groundTile > 0.40) {
                yOffset = -20;
                img = sprites.grass;
            }
            if (groundTile > 0.50)
                yOffset = -30;
            if (groundTile > 0.60)
                yOffset = -40;
            if (groundTile > 0.70)
                yOffset = -50;
            var tilePos = drawPosition(i, j, tileSizeX, tileSizeY, window.innerWidth, window.innerHeight);
            //img.x = tilePos.xPos
            //img.y = tilePos.yPos + yOffset
            //img.width = tileSizeX
            //img.height = tileSizeY
            ctx.drawImage(img, tilePos.xPos, tilePos.yPos + yOffset, tileSizeX, tileSizeY);
            if (i == 0 && j == 0) {
                var perPos = drawPosition(0, 0, tileSizeX, tileSizeY, window.innerWidth, window.innerHeight);
                if (per.dir == 0) {
                    img = sprites.per.lu;
                }
                else if (per.dir == 1) {
                    img = sprites.per.rd;
                }
                else if (per.dir == 2) {
                    img = sprites.per.ru;
                }
                else {
                    img = sprites.per.ld;
                }
                //img.x = perPos.xPos
                //img.y = perPos.yPos + yOffset - 84 + (tileSizeY/2) 
                //img.width = 46
                //img.height = 84
                ctx.drawImage(img, perPos.xPos, perPos.yPos + yOffset - 84 + (tileSizeX / 2), 46, 84);
            }
        }
    }
    setTimeout(function () {
        requestAnimationFrame(function () { loop(); });
    }, 1000 / 60);
}
loop();
