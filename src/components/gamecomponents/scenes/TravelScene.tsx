import * as Phaser from 'phaser';

import { IConnectionData, ServerConnect } from '../../data/connectionConf';
import { TravelTimeToString } from '../../data/gameCALC';
import { ILocationResult, ITravelResult, } from '../../data/gameTYPES';

import { LocalMapScene } from './MapScenes';

import { IMessage } from '../../MessageMenager';
import { IPassedGameData } from '../../TYPES';


const Settings = {
    ProgressBar: {
        Border: 5,
        MainHeight: 20,
        MainWidth: 300,
    },
    TravelDisplay: {
        ArrowWidth: 20,
        Border: 10,
        ButtonPadding: 3,
        ButtonSize: 30,
    }
}

export class TravelScene extends Phaser.Scene {
    private dimentions: { height: number, width: number };
    private ConnData: IConnectionData;
    private travelData: ITravelResult;
    private startDate: Date;
    private endDate: Date;
    private reverseDate: Date | null;

    private Background: Phaser.GameObjects.Image;
    private TextTime: Phaser.GameObjects.Text;
    private TimeToTravel: number;
    private ProgressBar: Phaser.GameObjects.Graphics;
    private ClockContainer: Phaser.GameObjects.Container;

    private ProgressBarWidth: number;

    constructor(dim: { height: number, width: number }, travel: ITravelResult, ConnData: IConnectionData) {
        super({ key: "TravelScene", });
        this.dimentions = dim;
        this.ConnData = ConnData;
        // ----- bindings
        this.endTravel = this.endTravel.bind(this);
        this.CreateButton = this.CreateButton.bind(this);
        this.setHover = this.setHover.bind(this);
        this.setHoverEnd = this.setHoverEnd.bind(this);
        this.setElementActive = this.setElementActive.bind(this);
        this.ReverseTravel = this.ReverseTravel.bind(this);
        this.resize = this.resize.bind(this);

        this.travelData = travel;
        const now = Date.now();
        this.endDate = new Date(now + this.travelData.fullDuration - this.travelData.currentDuration);
        this.startDate = new Date(now - this.travelData.currentDuration);
        this.reverseDate = (this.travelData.isReverse && this.travelData.reverseDuration !== null) ? (new Date(now - this.travelData.currentDuration + this.travelData.reverseDuration)) : null;

        

        this.TimeToTravel = (this.endDate.getTime() - this.startDate.getTime()) / 1000;
        if (this.TimeToTravel < 1) {
            this.TimeToTravel = 1;
        }
        this.ProgressBarWidth = Settings.ProgressBar.MainWidth;
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

        const background = require('../../img/Game/Locations/Interface/TravelBGR2.png');
        this.load.image("TravelBackground", String(background));

        const fromto = require('../../img/Game/Locations/Interface/from-to-black.png');
        // this.load.image("FromTo", String(fromto));
        if (!this.textures.exists("FromTo")) {
            this.textures.addBase64("FromTo", String(fromto));
        }

        const reverse = require('../../img/Game/Locations/Interface/back.png');
        // this.load.image("Reverse", String(reverse));
        if (!this.textures.exists("Reverse")) {
            this.textures.addBase64("Reverse", String(reverse));
        }
    }
    public create() {
        this.cameras.resize(this.dimentions.width, this.dimentions.height);
        this.events.on('resize', this.resize, this); 
        this.data.set("Travel", this.travelData);
        this.data.events.on("changedata_Travel", () => {
            this.travelData = this.data.values.Travel as ITravelResult;

            const now = Date.now();
            this.endDate = new Date(now + this.travelData.fullDuration - this.travelData.currentDuration);
            this.startDate = new Date(now - this.travelData.currentDuration);
            this.reverseDate = (this.travelData.isReverse && this.travelData.reverseDuration !== null) ? (new Date(now - this.travelData.currentDuration + this.travelData.reverseDuration)) : null;

            this.ClockContainer.destroy();
            const genC = this.genContainer();
            this.ClockContainer = genC.Container;
            this.ClockContainer.x = (this.dimentions.width - genC.Width) / 2;
            this.ClockContainer.y = (this.dimentions.height / 2 - genC.Height);
            this.setHoverEnd();
        });

        this.Background = this.add.image(this.dimentions.width / 2, this.dimentions.height / 2, "TravelBackground");
        const scale = Math.max(this.dimentions.width / this.Background.width, this.dimentions.height / this.Background.height);
        // adjust to edges
        this.Background.setScale(scale * 1.01, scale * 1.01);
        this.Background.alpha = 0;

        const gencont = this.genContainer();
        this.ClockContainer = gencont.Container;
        this.ClockContainer.x = (this.dimentions.width - gencont.Width) / 2;
        this.ClockContainer.y = (this.dimentions.height / 2 - gencont.Height);
        this.ClockContainer.alpha = 0;

        this.tweens.add({
            alpha: 1,
            duration: 500,
            targets: [this.Background, this.ClockContainer],
        });
        this.events.once('JourneyCompleted', this.endTravel);
    }
    public update(time: number) {
        this.ProgressBar.clear();
        let progress = 0;
        if (this.travelData.isReverse && this.reverseDate!==null) {
            progress = (2 * this.reverseDate.getTime() - Date.now() - this.startDate.getTime()) / (this.endDate.getTime() - this.startDate.getTime());
            if (progress <= 0) {
                progress = 0;
                this.events.emit('JourneyCompleted');
            }
            if (progress > 1) {
                progress = 1;
            }
            this.TextTime.setText(TravelTimeToString(this.TimeToTravel * (progress)));
        } else {
            progress = (Date.now() - this.startDate.getTime()) / (this.endDate.getTime() - this.startDate.getTime());
            if (progress >= 1) {
                progress = 1;
                this.events.emit('JourneyCompleted');
            }
            if (progress < 0) {
                progress = 0;
            }
            this.TextTime.setText(TravelTimeToString(this.TimeToTravel * (1 - progress)));
        }
        // const radius = Math.min(3, this.ProgressBarWidth * progress / 2);
        // this.ProgressBar.fillRoundedRect(0, 0, this.ProgressBarWidth * progress, Settings.ProgressBar.MainHeight, radius);
        this.ProgressBar.fillRect(0, 0, this.ProgressBarWidth * progress, Settings.ProgressBar.MainHeight);
    }
    private endTravel() {
        const passed: IPassedGameData<number | null> = {
            ActionToken: this.ConnData.actionToken,
            Data: null,
            UserToken: this.ConnData.userToken,
        };
        const succFun = (res: any) => {
            const mapscene = this.scene.get("MapScene") as LocalMapScene;
            mapscene.updateData(res.data.location as ILocationResult<any>);
            this.tweens.add({
                alpha: 0,
                duration: 250,
                onComplete: () => {
                    this.scene.resume("MapScene");
                    this.scene.remove("TravelScene");
                },
                targets: [this.Background, this.ClockContainer],
            });
            // TODO only testing
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.ConnData.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], []);
            } else {
                this.ConnData.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], []);
            }
        };
        ServerConnect(`/api/HerosLocationsLoad`, passed, succFun, failFun, this.ConnData.popWaiting, this.ConnData.closeWaiting);
    }
    private ReverseTravel() {
        const passed: IPassedGameData<number | null> = {
            ActionToken: this.ConnData.actionToken,
            Data: null,
            UserToken: this.ConnData.userToken,
        };
        const succFun = (res: any) => {
            // alert(JSON.stringify(res.data.travel));
            this.data.set("Travel", res.data.travel);
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.ConnData.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], []);
            } else {
                this.ConnData.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], []);
            }
        };
        ServerConnect(`/api/TravelingsReverse`, passed, succFun, failFun, this.ConnData.popWaiting, this.ConnData.closeWaiting);
    }


    private genContainer() {

        let Height = Settings.TravelDisplay.Border;
        const FromDesc = this.add.text(0, 0, "Start:", { align: 'center', fontStyle: 'bold', color: "#222222", fontSize: "12px" });
        const FromText = this.add.text(0, 0, this.travelData.startName, { align: 'left', fontStyle: 'bold', color: "#111111" });
        const ToDesc = this.add.text(0, 0, "Destination:", { align: 'center', fontStyle: 'bold', color: "#222222", fontSize: "12px" });
        const ToText = this.add.text(0, 0, this.travelData.targetName, { align: 'right', fontStyle: 'bold', color: "#111111" });

        const Arrow = this.add.image(0, 0, "FromTo");
        Arrow.setScale(Settings.TravelDisplay.ArrowWidth / Arrow.width);
        if (this.travelData.isReverse) {
            Arrow.setAngle(180);
        }

        if (2 * Math.max(FromText.displayWidth, ToText.displayWidth) + Arrow.displayWidth > this.ProgressBarWidth) {
            this.ProgressBarWidth = 2 * Math.max(FromText.displayWidth, ToText.displayWidth) + Arrow.displayWidth;
        }
        const Width = this.ProgressBarWidth + Settings.ProgressBar.Border * 2;
        const TextMiddleX = (Width - Arrow.displayWidth) / 4;

        const bgr = this.add.graphics({ fillStyle: { color: 0xffffff, alpha: 0.8 } });

        FromDesc.setOrigin(0.5, 0);
        FromDesc.x = TextMiddleX;
        FromDesc.y = Height;
        ToDesc.setOrigin(0.5, 0);
        ToDesc.x = Width - TextMiddleX;
        ToDesc.y = Height;
        Height = FromDesc.y + FromDesc.displayHeight + 5;

        FromText.setOrigin(0.5, 0);
        FromText.x = TextMiddleX;
        FromText.y = Height;
        ToText.setOrigin(0.5, 0);
        ToText.x = Width - TextMiddleX;
        ToText.y = Height;
        Height = FromText.y + Math.max(FromText.displayHeight, ToText.displayHeight) + 15;

        Arrow.setOrigin(0.5, 0.5);
        Arrow.x = Width / 2;
        // TODO
        Arrow.y = Height / 2;

        const buttonBackground = this.add.graphics({ fillStyle: { color: (this.travelData.isReverse) ? 0xD3D3D3 : 0xA8B3CC } });

        const backStuff = this.CreateButton("Reverse", "Go back", 30);
        // buttonBackground.fillRoundedRect((Width - backStuff.Width) / 2, Height, backStuff.Width, backStuff.Height, 3);
        buttonBackground.fillRect((Width - backStuff.Width) / 2, Height, backStuff.Width, backStuff.Height);

        const buttonsArray: InteractiveButton[] = [backStuff];
        const backButton = backStuff.Button;
        backButton.alpha = 0.8
        backButton.setSize(backStuff.Width, backStuff.Height);
        backButton.x = (Width - backStuff.Width) / 2;
        backButton.y = Height;
        if (!this.travelData.isReverse) {
            backButton.setInteractive(new Phaser.Geom.Rectangle(backStuff.Width / 2, backStuff.Height / 2, backStuff.Width, backStuff.Height), Phaser.Geom.Rectangle.Contains);
            backButton.on("pointerover", () => {
                this.setHover();
                this.setElementActive(0, buttonsArray, buttonBackground, backStuff.Width);
            });
            backButton.on("pointerout", () => {
                this.setHoverEnd();
                this.setElementActive(-1, buttonsArray, buttonBackground, backStuff.Width);
            });
            backButton.on("pointerdown", this.ReverseTravel);
        }

        Height = backButton.y + backStuff.Height + 5;

        Height += Settings.ProgressBar.MainHeight + 2 * Settings.ProgressBar.Border;

        const prog = this.add.graphics({ fillStyle: { color: 0x162955 } });
        // prog.fillRoundedRect(0, Height - 2 * Settings.ProgressBar.Border - Settings.ProgressBar.MainHeight, Width, Settings.ProgressBar.MainHeight + 2 * Settings.ProgressBar.Border, 4);
        prog.fillRect(0, Height - 2 * Settings.ProgressBar.Border - Settings.ProgressBar.MainHeight, Width, Settings.ProgressBar.MainHeight + 2 * Settings.ProgressBar.Border);
        this.ProgressBar = this.add.graphics({ fillStyle: { color: 0x7887AB } });
        this.ProgressBar.x = Settings.ProgressBar.Border;
        this.ProgressBar.y = Height - Settings.ProgressBar.Border - Settings.ProgressBar.MainHeight;
        this.TextTime = this.add.text(Width / 2, Height - Settings.ProgressBar.MainHeight / 2 - Settings.ProgressBar.Border, TravelTimeToString(this.TimeToTravel), { color: "white", align: "center" });
        this.TextTime.setOrigin(0.5, 0.5);

        // bgr.fillRoundedRect(0, 0, Width, Height, 4);
        bgr.fillRect(0, 0, Width, Height);



        const cont = this.add.container(0, 0, [bgr, prog, this.ProgressBar, this.TextTime, FromDesc, ToDesc, FromText, ToText, Arrow, buttonBackground, backButton]);

        return {
            Container: cont,
            Height,
            Width,
        }
    }
    private CreateButton(texture: string, text: string, imageSize = Settings.TravelDisplay.ButtonSize) {
        const painting = this.add.image(0, 0, texture);
        painting.displayHeight = imageSize;
        painting.displayWidth = imageSize;

        const textDisp = this.add.text(0, 0, text, { color: "#ffffff", fontSize: 12, fontStyle: 'bold', align: 'center' });

        const Width = Math.max(Settings.TravelDisplay.ButtonSize, textDisp.displayWidth) + 2 * Settings.TravelDisplay.ButtonPadding;

        painting.setOrigin(0.5, 0.5);
        painting.x = Width / 2;
        painting.y = Settings.TravelDisplay.ButtonPadding + Settings.TravelDisplay.ButtonSize / 2;
        let Height = 2 * Settings.TravelDisplay.ButtonPadding + Settings.TravelDisplay.ButtonSize;

        textDisp.setOrigin(0.5, 0);
        textDisp.x = Width / 2;
        textDisp.y = Height;
        Height = textDisp.y + textDisp.displayHeight + Settings.TravelDisplay.ButtonPadding;

        return {
            Button: this.add.container(0, 0, [painting, textDisp]),
            Height,
            InteractiveObj: painting,
            Width,
        } as InteractiveButton;
    }
    private setHover() {
        const element = document.getElementById("Game")
        if (element !== null) {
            element.style.cursor = "pointer";
        }
    }
    private setHoverEnd() {
        const element = document.getElementById("Game")
        if (element !== null) {
            element.style.cursor = "default";
        }
    }
    private setElementActive(key: number, List: InteractiveButton[], graphics: Phaser.GameObjects.Graphics, width: number) {
        graphics.clear();
        List.forEach((e, i) => {
            graphics.fillStyle((i !== key) ? 0xA8B3CC : 0x4F628E);
            // graphics.fillRoundedRect(e.Button.x, e.Button.y, width, e.Height, 3);
            graphics.fillRect(e.Button.x, e.Button.y, width, e.Height);
        });
    }
    private resize(width: number, height: number) {
        if (width === undefined) { width = this.sys.game.config.width as number; }
        if (height === undefined) { height = this.sys.game.config.height as number; }

        this.cameras.resize(width, height);
        this.dimentions = { height, width };

        this.Background.x = width / 2;
        this.Background.y = height / 2;
        const scale = Math.max(this.dimentions.width / this.Background.width, this.dimentions.height / this.Background.height);
        // adjust to edges
        this.Background.setScale(scale * 1.01, scale * 1.01);

        this.ClockContainer.destroy();
        const genC = this.genContainer();
        this.ClockContainer = genC.Container;
        this.ClockContainer.x = (this.dimentions.width - genC.Width) / 2;
        this.ClockContainer.y = (this.dimentions.height / 2 - genC.Height);

        const map = this.scene.get("MapScene") as LocalMapScene;
        map.resize(this.dimentions.width, this.dimentions.height);
    }
}

interface InteractiveButton {
    InteractiveObj: Phaser.GameObjects.Image,
    Button: Phaser.GameObjects.Container,
    Height: number;
    Width: number;
}