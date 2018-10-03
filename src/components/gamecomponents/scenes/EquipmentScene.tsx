import * as Phaser from 'phaser';

export class EquipmentScene extends Phaser.Scene {
    private dimentions: { height: number, width: number };

    private Background: Phaser.GameObjects.Image;

    constructor(dim: { height: number, width: number }) {
        super({ key: "EquipmentScene", });
        this.resize = this.resize.bind(this);


        this.dimentions = dim;
    }

    public preload() {
        const progressBGR = this.add.graphics({ fillStyle: { color: 0x5e3408, alpha: 0.2 } });
        progressBGR.fillRect(0, 0, this.dimentions.width, this.dimentions.height);
        const progressText = this.add.text(this.dimentions.width / 2, this.dimentions.height / 2, "Loading...", { color: "white", fontSize: 25 });
        progressText.alpha = 0;
        const tween = this.tweens.add({
            alpha: 1,
            duration: 500,
            targets: [progressBGR, progressText],
        });

        this.load.on('progress', (value: number) => {
            progressText.setText("Loading...\n" + Math.floor(value * 100) + "%");
        });
        this.load.on('complete', () => {
            progressBGR.destroy();
            progressText.destroy();
            tween.stop();
        });

        const background = require('../../img/Game/EQ/background.jpg');
        this.load.image("Background", String(background));
    }
    public create() {
        this.Background = this.add.image(this.dimentions.width / 2, this.dimentions.height / 2, "Background");
        this.Background.setOrigin(0.5, 0.5);
        const scale = Math.max(this.dimentions.width / this.Background.width, this.dimentions.height / this.Background.height);
        this.Background.setScale(scale, scale);
        this.events.on('resize', this.resize, this); 
    }
    private resize(width: number, height: number) {
        if (width === undefined) { width = this.sys.game.config.width as number; }
        if (height === undefined) { height = this.sys.game.config.height as number; }

        this.cameras.resize(width, height);
        this.Background.x = width / 2;
        this.Background.y = height / 2;
        const scale = Math.max(width / this.Background.width,height / this.Background.height);
        this.Background.displayHeight = scale * this.Background.height;
        this.Background.displayWidth = scale * this.Background.width;
    }
}