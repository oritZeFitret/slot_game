import "phaser";

const spriteScale: number = 0.75;
const spriteSize: number = 256;
const speed: number = 1200;

let firstColumn: string[] = [];
let secondColumn: string[] = [];
let thirdColumn: string[] = [];
let rollHasStarted: boolean = false;

let toolOpen: boolean = false;
let cheatChosen: number[] = [0, 0, 0];

const game: any = new Phaser.Game({
    type: Phaser.AUTO,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
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
});

function preload(this: any): void{
    this.load.image("banana", "./assets/banana.png");
    this.load.image("cherry", "./assets/cherry.png");
    this.load.image("blackberry", "./assets/blackberry.png");
    this.load.image("spin", "./assets/spin.png");
    this.load.image("spinGray", "./assets/spinGray.png");
    this.load.image("win", "./assets/win.png");
    this.load.image("reelBackground", "./assets/reelBackground.png");
    this.load.image("reelForeground", "./assets/reelForeground.png");
    this.load.image("cheatToolBackground", "./assets/cheatToolBackground.png");
    this.load.image("cheatToolInput", "./assets/cheatToolInput.png");
    this.load.image("arrow", "./assets/arrow.png");
}

function create(this: any): void{
    startNewRoll(this);
}

function update(this: any){
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

function addTools(_this: any): void{
    removeTools(_this);
    const scale: number = spriteScale * 0.75
    
    _this.cheatToolBk = _this.add.image(224 * scale, (toolOpen ? 130 : -80) * scale, "cheatToolBackground").setScale(scale);
    _this.arrow = _this.add.image(170 * scale, (toolOpen ? 230 :  20) * scale, "arrow").setScale(scale);
    _this.toolText = _this.add.text(40 * scale, (toolOpen ? 215 :  5) * scale, "Tools").setStyle({ fontStyle: "bold"});
    _this.toolPromptText = _this.add.text(20 * scale, (toolOpen ? 20 :  -190) * scale, "SYMBOL POSITION IN THE REEL").setStyle({ fontStyle: "bold", fontSize: 24 * scale});
    _this.inputBk1 = _this.add.image(70 * scale, (toolOpen ? 90 : -120) * scale, "cheatToolInput").setScale(scale);
    _this.inputBk2 = _this.add.image(200 * scale,  (toolOpen ? 90 : -120) * scale, "cheatToolInput").setScale(scale);
    _this.inputBk3 = _this.add.image(330 * scale,  (toolOpen ? 90 : -120) * scale, "cheatToolInput").setScale(scale);
    _this.input1 = _this.add.text(60 * scale, (toolOpen ? 70 :  -140) * scale, cheatChosen[0]).setScale(scale).setStyle({fontSize: 72 * scale, fontStyle: "bold"});
    _this.input2 = _this.add.text(190 * scale, (toolOpen ? 70 :  -140) * scale, cheatChosen[1]).setScale(scale).setStyle({fontSize: 72 * scale, fontStyle: "bold"});
    _this.input3 = _this.add.text(320 * scale, (toolOpen ? 70 :  -140) * scale, cheatChosen[2]).setScale(scale).setStyle({fontSize: 72 * scale, fontStyle: "bold"});

    function inputHandler(index: number): void{
        switch(index){
            case 1:
                cheatChosen[0] = (cheatChosen[0] + 1) % 4;
                _this.input1.text = cheatChosen[0];
                break;
            case 2: 
                cheatChosen[1] = (cheatChosen[1] + 1) % 4;
                _this.input2.text = cheatChosen[1];
                break;
            case 3:
                cheatChosen[2] = (cheatChosen[2] + 1) % 4;
                _this.input3.text = cheatChosen[2];
                break;
        }
    }

    _this.inputBk1.setInteractive({ useHandCursor: true }).on('pointerdown', () => inputHandler(1));
    _this.inputBk2.setInteractive({ useHandCursor: true }).on('pointerdown', () => inputHandler(2));
    _this.inputBk3.setInteractive({ useHandCursor: true }).on('pointerdown', () => inputHandler(3));

    function openHandler() {
        if(!toolOpen){
            _this.cheatToolBk.setPosition(_this.cheatToolBk.x, _this.cheatToolBk.y + 210 * scale);
            _this.toolText.setPosition(_this.toolText.x, _this.toolText.y + 210 * scale);
            _this.arrow.setPosition(_this.arrow.x, _this.arrow.y + 210 * scale);
            _this.input3.setAngle(0);
            _this.toolPromptText.setPosition(_this.toolPromptText.x, _this.toolPromptText.y + 210 * scale);
            _this.inputBk1.setPosition(_this.inputBk1.x, _this.inputBk1.y + 210 * scale);
            _this.inputBk2.setPosition(_this.inputBk2.x, _this.inputBk2.y + 210 * scale);
            _this.inputBk3.setPosition(_this.inputBk3.x, _this.inputBk3.y + 210 * scale);
            _this.input1.setPosition(_this.input1.x, _this.input1.y + 210 * scale);
            _this.input2.setPosition(_this.input2.x, _this.input2.y + 210 * scale);
            _this.input3.setPosition(_this.input3.x, _this.input3.y + 210 * scale);

            toolOpen = true;
        }
        else{
            _this.cheatToolBk.setPosition(_this.cheatToolBk.x, _this.cheatToolBk.y - 210 * scale);
            _this.toolText.setPosition(_this.toolText.x, _this.toolText.y - 210 * scale);
            _this.arrow.setPosition(_this.arrow.x, _this.arrow.y - 210 * scale);
            _this.arrow.setAngle(180);
            _this.toolPromptText.setPosition(_this.toolPromptText.x, _this.toolPromptText.y - 210 * scale);
            _this.inputBk1.setPosition(_this.inputBk1.x, _this.inputBk1.y - 210 * scale);
            _this.inputBk2.setPosition(_this.inputBk2.x, _this.inputBk2.y - 210 * scale);
            _this.inputBk3.setPosition(_this.inputBk3.x, _this.inputBk3.y - 210 * scale);
            _this.input1.setPosition(_this.input1.x, _this.input1.y - 210 * scale);
            _this.input2.setPosition(_this.input2.x, _this.input2.y - 210 * scale);
            _this.input3.setPosition(_this.input3.x, _this.input3.y - 210 * scale);

            toolOpen = false;
        }
    }
    _this.toolText
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', openHandler);
    _this.arrow
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', openHandler);
}

function removeTools(_this: any): void{
    _this.cheatToolB?.destroy?.();
    _this.arrow?.destroy?.();
    _this.toolText?.destroy?.();
    _this.toolPromptText?.destroy?.();
    _this.inputBk1?.destroy?.();
    _this.inputBk2?.destroy?.();
    _this.inputBk3?.destroy?.();
    _this.input1?.destroy?.();
    _this.input2?.destroy?.();
    _this.input3?.destroy?.();
}

function addSpinButton(_this: any): void{
    const centerX: number = _this.cameras.main.centerX;
    const centerY: number = _this.cameras.main.centerY;

    _this.startButton = _this.add.image(centerX, centerY + spriteSize * 1.2 * spriteScale, "spinGray")
    .setScale(0.6).setInteractive({ useHandCursor: true }).on('pointerdown', () => startNewRoll(_this));
}

function startNewRoll(_this: any): void{
    if(!rollHasStarted){
        const centerX: number = _this.cameras.main.centerX;
        const centerY: number = _this.cameras.main.centerY;

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
        addTools(_this);

        setTimeout(function():void{
            _this.startButton?.setTexture("spin");
            rollHasStarted = false;
            if(firstColumn[0] === secondColumn[0] && secondColumn[0] === thirdColumn[0]){
                _this.bigWin = _this.add.image(centerX, centerY - spriteScale * spriteSize * 1.2, "win")
                .setScale(spriteScale);
            }
        }, 4000);
    }
}

function drawReelForeground(_this: any): void{
    
    const centerX: number = _this.cameras.main.centerX;
    const centerY: number = _this.cameras.main.centerY;
    const reelFg = _this.add.image(centerX, centerY, "reelForeground");
    reelFg.setScale(spriteScale * 0.8);
}

function drawReelBackground(_this: any): void{
    
    const centerX: number = _this.cameras.main.centerX;
    const centerY: number = _this.cameras.main.centerY;

    const reelBk = _this.add.image(centerX, centerY, "reelBackground");
    reelBk.setScale(spriteScale * 0.8);
}

function addFruits(_this: any): void{
    _this.fruits = [[], [], []];
    // _this.fruits[0] = [];
    // _this.fruits[1] = [];
    // _this.fruits[2] = [];
    const centerX: number = _this.cameras.main.centerX;
    const centerY: number = _this.cameras.main.centerY;

    const distance: number = Math.pow(speed, 2) / 800;
    const offset: number = 50 * spriteScale;

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

function drawMasks(_this: any): void{
    const centerX: number = _this.cameras.main.centerX;
    const centerY: number = _this.cameras.main.centerY;
    const width: number = document.body.clientWidth;
    const height: number = document.body.clientHeight;
    const maskHeight: number = (height - 1.75 * spriteScale * spriteSize) / 2;
    _this.add.rectangle(centerX, maskHeight / 2, width, maskHeight, 0x060403, 1);
    _this.add.rectangle(centerX, centerY + (1.75 * spriteSize * spriteScale + maskHeight) * .5, width, maskHeight, 0x060403, 1);
}

function destroyElements(_this: any): void{
    destroyFruits(_this);
    _this.topMask?.destroy?.();
    _this.bottomMask?.destroy?.();
}

function destroyFruits(_this: any): void{
    for(let i = 0; i < _this.fruits?.length; i++){
        _this.fruits[i].destroy?.();
    }
}

function fillSlots(): void{
    const minSize: number = 80;
    const sizeDifference: number = 20;
    const fruits: string[] = ["banana", "blackberry", "cherry"];
    const firstColumnSize: number = minSize
    const secondColumnSize: number = minSize + sizeDifference;
    const thirdColumnSize: number = minSize + 2 * sizeDifference;
    firstColumn = [];
    secondColumn = [];
    thirdColumn = [];
    for(let i = 0; i < firstColumnSize; i++) firstColumn.push(fruits[Math.floor(Math.random() * fruits.length)]);
    for(let i = 0; i < secondColumnSize; i++) secondColumn.push(fruits[Math.floor(Math.random() * fruits.length)]);
    for(let i = 0; i < thirdColumnSize; i++) thirdColumn.push(fruits[Math.floor(Math.random() * fruits.length)]);
    if(cheatChosen[0] > 0) firstColumn[0] = fruits[cheatChosen[0] - 1];
    if(cheatChosen[1] > 0) secondColumn[0] = fruits[cheatChosen[1] - 1];
    if(cheatChosen[2] > 0) thirdColumn[0] = fruits[cheatChosen[2] - 1];
}