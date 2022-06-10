const config = {
    type: Phaser.AUTO,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    background: 0x060403,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: -400 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

const game = new Phaser.Game(config);
const spriteScale = .7;
const spriteSize = 256;
const speed = 1200;

let cheatChosen = [];

let firstColumn = [];
let secondColumn = [];
let thirdColumn = [];
let rollHasStarted = false;

function preload(){
    this.load.image("banana", "./assets/banana.png");
    this.load.image("cherry", "./assets/cherry.png");
    this.load.image("blackberry", "./assets/blackberry.png");
    this.load.image("spin", "./assets/spin.png");
    this.load.image("spinGray", "./assets/spinGray.png");
    this.load.image("win", "./assets/win.png");
    this.load.image("reelBackground", "./assets/reelBackground.png");
    this.load.image("reelForeground", "./assets/reelForeground.png");
}

function create(){
    startNewRoll(this);
    addCheatButtons(this);
}

function update(){
    const centerY = this.cameras.main.centerY;
    
    for(let j = 0; j < 3; j++){
        for(let i = 0; i < this.fruits[j].length; i++){
            if(this.fruits[j][i]?.body?.position?.y >= centerY + spriteScale * spriteSize ||
            this.fruits[j][i]?.body?.velocity?.y <= 0){
                this.fruits[j][i].body.setVelocity(0);
                this.fruits[j][i].body.setAcceleration(0);
                this.fruits[j][i].body.allowGravity = false;
            }
        }
    }
}

function addCheatButtons(_this){
    removeCheatButtons();

    const centerY = _this.cameras.main.centerY;

    
}

function removeCheatButtons(){
    
}

function addSpinButton(_this){
    const centerX = _this.cameras.main.centerX;
    const centerY = _this.cameras.main.centerY;

    _this.startButton = _this.add.image(centerX, centerY + spriteSize * 1.2 * spriteScale, "spinGray")
    .setScale(0.6)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => startNewRoll(_this))
}

function startNewRoll(_this){
    if(!rollHasStarted){
        const centerX = _this.cameras.main.centerX;
        const centerY = _this.cameras.main.centerY;

        _this.bigWin?.destroy?.();
        
        rollHasStarted = true;
        _this.startButton?.setTexture("spinGray");

        destroyElements(_this);
        
        fillSlots();
        drawReelBackground(_this);
        addFruits(_this);
        drawMasks(_this);
        drawReelForeground(_this);
        addSpinButton(_this);

        addCheatButtons(_this);

        setTimeout(function(){
            _this.startButton?.setTexture("spin");
            rollHasStarted = false;
            if(firstColumn[0] === secondColumn[0] && secondColumn[0] === thirdColumn[0]){
                _this.bigWin = _this.add.image(centerX, centerY - spriteScale * spriteSize * 1.2, "win")
                .setScale(spriteScale);
            }
        }, 3500);
    }
}

function drawReelForeground(_this){
    
    const centerX = _this.cameras.main.centerX;
    const centerY = _this.cameras.main.centerY;
    const reelFg = _this.add.image(centerX, centerY, "reelForeground");
    reelFg.setScale(spriteScale * 0.8);
}

function drawReelBackground(_this){
    
    const centerX = _this.cameras.main.centerX;
    const centerY = _this.cameras.main.centerY;
    const reelBk = _this.add.image(centerX, centerY, "reelBackground");
    reelBk.setScale(spriteScale * 0.8);
}

function addFruits(_this){
    _this.fruits = [];
    _this.fruits[0] = [];
    _this.fruits[1] = [];
    _this.fruits[2] = [];
    const centerX = _this.cameras.main.centerX;
    const centerY = _this.cameras.main.centerY;

    const distance = Math.pow(speed, 2) / 800;
    const offset = 50 * spriteScale;

    for(let i = 0; i < firstColumn.length; i++){
        _this.fruits[0][i] = _this.physics.add.sprite(centerX - (37.5 + spriteSize) * spriteScale, centerY - distance + offset + spriteSize * spriteScale * i, firstColumn[i]);
        _this.fruits[0][i].setScale(spriteScale);
        _this.fruits[0][i].body.setVelocity(0, speed);

    }
    for(let i = 0; i < secondColumn.length; i++){
        _this.fruits[1][i] = _this.physics.add.sprite(centerX,centerY - distance * 1.44 + offset + spriteSize * spriteScale * i, secondColumn[i]);
        _this.fruits[1][i].setScale(spriteScale);
        _this.fruits[1][i].body.setVelocity(0, speed * 1.2);
    }
    for(let i = 0; i < thirdColumn.length; i++){
        _this.fruits[2][i] = _this.physics.add.sprite(centerX + (37.5 + spriteSize) * spriteScale, centerY - distance * 1.96 + offset + spriteSize * spriteScale * i, thirdColumn[i]);
        _this.fruits[2][i].setScale(spriteScale);
        _this.fruits[2][i].body.setVelocity(0, speed * 1.4);
    }
}

function drawMasks(_this){
    const centerX = _this.cameras.main.centerX;
    const centerY = _this.cameras.main.centerY;
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    const maskHeight = (height - 1.75 * spriteScale * spriteSize) / 2;
    _this.add.rectangle(centerX, maskHeight / 2, width, maskHeight, 0x060403, 1);
    _this.add.rectangle(centerX, centerY + (1.75 * spriteSize * spriteScale + maskHeight) * .5, width, maskHeight, 0x060403, 1);
}

function destroyElements(_this){
    destroyFruits(_this);
    _this.topMask?.destroy?.();
    _this.bottomMask?.destroy?.();
}

function destroyFruits(_this){
    for(let i = 0; i < _this.fruits?.length; i++){
        _this.fruits[i].destroy?.();
    }
}

function fillSlots(){
    const minSize = 80;
    const sizeDifference = 20;
    const fruits = ["banana", "blackberry", "cherry"];
    const firstColumnSize = minSize
    const secondColumnSize = minSize + sizeDifference;
    const thirdColumnSize = minSize + 2 * sizeDifference;
    firstColumn = [];
    secondColumn = [];
    thirdColumn = [];
    for(let i = 0; i < firstColumnSize; i++) firstColumn.push(fruits[Math.floor(Math.random() * fruits.length)]);
    for(let i = 0; i < secondColumnSize; i++) secondColumn.push(fruits[Math.floor(Math.random() * fruits.length)]);
    for(let i = 0; i < thirdColumnSize; i++) thirdColumn.push(fruits[Math.floor(Math.random() * fruits.length)]);
    if(cheatChosen != ""){
        firstColumn[0] = cheatChosen;
        secondColumn[0] = cheatChosen;
        thirdColumn[0] = cheatChosen;
        cheatChosen = "";
    }
}