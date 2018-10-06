import * as Phaser from 'phaser';

import { IConnectionData, ServerConnect } from '../../data/connectionConf';
import { TravelTimeToString } from '../../data/gameCALC';
import { } from '../../data/gameTYPES';

import { IMessage } from '../../MessageMenager';
import { IHero, IPassedGameData,  } from '../../TYPES';

import * as React from 'react';

import AcceptDialog from '../../presentational/dialogs/AcceptDialog';

import { IHeroUpdates } from '../../Game';


const Settings = {
    FirePlace: {
        Height: 100,
        X: 656,
        Y: 600,
    },
    HealingDisplay: {
        Border: 10,
        ButtonPadding: 6,
        ButtonSize: 50,
    },
    ProgressBar: {
        Border: 5,
        MainHeight: 25,
        MainWidth: 450,
    },
}

export class HealingScene extends Phaser.Scene {
    private dimentions: { height: number, width: number };
    private ConnData: IConnectionData;
    private heroUpdates: IHeroUpdates;
    private hero: IHero;

    private isHealing: boolean;
    private HealingData: IHealingResult;
    private startDate: Date;
    private endDate: Date;
    private TextTime: Phaser.GameObjects.Text;
    private TimeToHeal: number;
    private ProgressBar: Phaser.GameObjects.Graphics;
    private ClockContainer: Phaser.GameObjects.Container;
    private ButtonsBackground: Phaser.GameObjects.Graphics;
    private ButtonsArray: InteractiveButton[];

    private Background: Phaser.GameObjects.Image;
    private MainScale: number;

    private ProgressBarWidth: number;

    constructor(dim: { height: number, width: number }, ConnData: IConnectionData, HeroUpdates: IHeroUpdates, HealingData: IHealingResult | null, hero: IHero) {
        super({ key: "HealingScene", });
        this.dimentions = dim;
        this.ConnData = ConnData;
        this.heroUpdates = HeroUpdates;
        this.hero = hero;
        // ----- bindings
        this.EndHealing = this.EndHealing.bind(this);
        this.StartHealing = this.StartHealing.bind(this);
        this.CreateButton = this.CreateButton.bind(this);
        this.setHover = this.setHover.bind(this);
        this.setHoverEnd = this.setHoverEnd.bind(this);
        this.setElementActive = this.setElementActive.bind(this);
        this.resize = this.resize.bind(this);
        this.GenerateButtons = this.GenerateButtons.bind(this);
        this.CloseHealing = this.CloseHealing.bind(this);
        this.GenerateElements = this.GenerateElements.bind(this);

        if (HealingData !== null) {
            this.isHealing = true;
            this.HealingData = HealingData;
            const now = Date.now();
            this.endDate = new Date(now + this.HealingData.fullDuration - this.HealingData.currentDuration);
            this.startDate = new Date(this.endDate.getTime() - (this.HealingData.finalHP) / (this.HealingData.finalHP - this.HealingData.initialHP) * this.HealingData.fullDuration);
            this.TimeToHeal = (this.endDate.getTime() - this.startDate.getTime()) / 1000;
            if (this.TimeToHeal < 1) {
                this.TimeToHeal = 1;
            }
        }
        else {
            this.isHealing = false;
        }

        this.ProgressBarWidth = Settings.ProgressBar.MainWidth;

        this.ButtonsArray = [];
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

        const background = require('../../img/Game/Locations/Interface/camp.png');
        this.load.image("HealingBackground", String(background));
        const fireplace = require('../../img/Game/Locations/Interface/fireplace.png');
        this.load.spritesheet('fireplace', String(fireplace), { frameWidth: 245, frameHeight: 195, endFrame: 15 });
        const healSrc = require('../../img/Game/Locations/Interface/heal.png');
        this.load.image({ key: "heal", url: String(healSrc) });
        const stopSrc = require('../../img/Game/Locations/Interface/stop.png');
        this.load.image({ key: "stop", url: String(stopSrc) });
        // const mapSrc = require('../../img/Game/Menu/map.png');
        const mapSrc = require('../../img/Game/Locations/Interface/from-to.png');
        // this.load.image({ key: "map", url: String(mapSrc) });
        this.textures.addBase64("map", String(mapSrc));
    }
    public create() {
        this.cameras.resize(this.dimentions.width, this.dimentions.height);
        this.events.on('resize', this.resize, this);

        this.data.set("isHealing", this.isHealing);
        this.data.set("HealingData", this.HealingData);
        this.data.events.on("changedata_isHealing", () => {
            this.isHealing = this.data.values.isHealing;

            this.GenerateButtons(this.isHealing);

            this.ClockContainer.destroy();
            if (this.isHealing) {
                this.HealingData = this.data.values.HealingData as IHealingResult;
                const now = Date.now();
                this.endDate = new Date(now + this.HealingData.fullDuration - this.HealingData.currentDuration);
                this.startDate = new Date(this.endDate.getTime() - (this.HealingData.finalHP) / (this.HealingData.finalHP - this.HealingData.initialHP) * this.HealingData.fullDuration);
                this.TimeToHeal = (this.endDate.getTime() - this.startDate.getTime()) / 1000;

                const genC = this.genContainer();
                this.ClockContainer = genC.Container;
                this.ClockContainer.x = (this.dimentions.width - genC.Width) / 2;
                this.ClockContainer.y = (this.dimentions.height / 2 - genC.Height);
                this.setHoverEnd();
            }
        });
        
        this.GenerateElements();

        this.ClockContainer.alpha = 0;
        this.Background.alpha = 0;
        this.tweens.add({
            alpha: 1,
            duration: 500,
            targets: this.children.getAll(),
        });
        this.events.once('HealCompleted', this.EndHealing);

    }
    public update(time: number) {
        if (this.isHealing) {
            this.ProgressBar.clear();
            let progress = 0;
            progress = (Date.now() - this.startDate.getTime()) / (this.endDate.getTime() - this.startDate.getTime());
            if (progress >= 1) {
                progress = 1;
                this.events.emit('HealCompleted');
            }
            if (progress < 0) {
                progress = 0;
            }
            this.TextTime.setText(TravelTimeToString(this.TimeToHeal * (1 - progress)));
            // const radius = Math.min(3, this.MainScale * this.ProgressBarWidth * (1- progress) / 2);
            // this.ProgressBar.fillRoundedRect(this.MainScale * this.ProgressBarWidth * progress, 0, this.MainScale * this.ProgressBarWidth * (1- progress), this.MainScale * Settings.ProgressBar.MainHeight, radius);
            this.ProgressBar.fillRect(this.MainScale * this.ProgressBarWidth * progress, 0, this.MainScale * this.ProgressBarWidth * (1- progress), this.MainScale * Settings.ProgressBar.MainHeight);
        }
    }
    private GenerateButtons(isHealing: boolean) {
        this.ButtonsArray.forEach(e => e.Button.destroy());
        this.ButtonsBackground = this.add.graphics({});
        const buttons = [
            {
                Active: true,
                OnClick: () => {
                    if (this.isHealing) {
                        const accept = () => {
                            this.EndHealing(true);
                        }
                        const question = "Want to stop healing?";
                        const details = "To enter map, man must stop healing. Only part of health will be generated."
                        this.ConnData.popDialog(<AcceptDialog acceptFun={accept} denyFun={this.ConnData.closeDialog} details={details} question={question} />);
                    } else {
                        this.CloseHealing();
                    }
                },
                Text: "Back to map",
                Texture: "map",
                X: 1065,
                Y: 560,
            },
            {
                Active: !isHealing,
                OnClick: () => {
                    this.StartHealing();
                },
                Text: "Regenerate",
                Texture: "heal",
                X: 1065,
                Y: (470 - 107),
            },
            {
                Active: isHealing,
                OnClick: () => {
                    this.EndHealing();
                },
                Text: "Stop\nRegenerate",
                Texture: "stop",
                X: 1065,
                Y: (560 - 107),
            },
        ];
        this.ButtonsArray = [];
        buttons.forEach((e, i) => {

            const backStuff = this.CreateButton(e.Texture, e.Text, 40, e.Active);
            const backButton = backStuff.Button;
            backButton.setSize(backStuff.Width, backStuff.Height);
            backButton.x = this.MainScale * e.X;
            backButton.y = this.MainScale * e.Y;
            if (e.Active) {
                backButton.setInteractive(new Phaser.Geom.Rectangle(backStuff.Width / 2, backStuff.Height / 2, backStuff.Width, backStuff.Height), Phaser.Geom.Rectangle.Contains);
                backButton.on("pointerover", () => {
                    this.setHover();
                    this.setElementActive(i, this.ButtonsArray, this.ButtonsBackground);
                });
                backButton.on("pointerout", () => {
                    this.setHoverEnd();
                    this.setElementActive(-1, this.ButtonsArray, this.ButtonsBackground);
                });
                backButton.on("pointerup", () => {
                    e.OnClick();
                });
                // backButton.on("pointerdown", this.ReverseTravel);
            };
            backStuff.Active = e.Active;
            this.ButtonsArray.push(backStuff);
        });
        this.setElementActive(-1, this.ButtonsArray, this.ButtonsBackground);
    }
    private CloseHealing() {
        this.ConnData.closeDialog();

        this.hero.status = 0;
        this.hero.statusData = null;

        this.tweens.add({
            alpha: 0,
            duration: 250,
            onComplete: () => {
                this.scene.remove("HealingScene");
                this.scene.resume("MapScene");


            },
            targets: this.children.getAll(),
        });
    }
    private EndHealing(closeHealing = false) {
        const passed: IPassedGameData<number | null> = {
            ActionToken: this.ConnData.actionToken,
            Data: null,
            UserToken: this.ConnData.userToken,
        };
        const succFun = (res: any) => {
            // alert(JSON.stringify(res));
            this.heroUpdates.UpdateHP(res.data.newHP);
            this.data.set("isHealing", false);
            if (closeHealing) {
                this.CloseHealing();
            }
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.ConnData.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], []);
            } else {
                this.ConnData.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], []);
            }
        };
        // TODO string
        ServerConnect(`/api/EndHealing`, passed, succFun, failFun, this.ConnData.popWaiting, this.ConnData.closeWaiting);
    }
    private StartHealing() {
        const passed: IPassedGameData<number | null> = {
            ActionToken: this.ConnData.actionToken,
            Data: null,
            UserToken: this.ConnData.userToken,
        };
        const succFun = (res: any) => {
            // alert(JSON.stringify(res.data.healing));
            this.data.set("HealingData", res.data.healing);
            this.data.set("isHealing", true);
        };
        const failFun = (error: any) => {
            // alert(JSON.stringify(error));
            if (error.response === undefined) {
                this.ConnData.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], []);
            } else {
                this.ConnData.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], []);
            }
        };
        ServerConnect(`/api/StartHealing`, passed, succFun, failFun, this.ConnData.popWaiting, this.ConnData.closeWaiting);
    }


    private genContainer() {

        let Height = this.MainScale * Settings.HealingDisplay.Border;

        const Width = this.MainScale * (this.ProgressBarWidth + Settings.ProgressBar.Border * 2);

        Height += this.MainScale * (Settings.ProgressBar.MainHeight + 2 * Settings.ProgressBar.Border);

        const Heal = this.add.image(Width / 2, Height + Settings.HealingDisplay.ButtonPadding * this.MainScale, "heal");
        Heal.setOrigin(0.5, 0);
        Heal.displayWidth = this.MainScale * Settings.HealingDisplay.ButtonSize;
        Heal.displayHeight = this.MainScale * Settings.HealingDisplay.ButtonSize;

        Height = Heal.y + Heal.displayHeight + this.MainScale * Settings.HealingDisplay.Border;

        Height += this.MainScale * (2 * Settings.ProgressBar.Border + Settings.ProgressBar.MainHeight);
        // 0x8A0707  0xE1919A
        const prog = this.add.graphics({ fillStyle: { color: 0x8A0707 } });
        // prog.fillRoundedRect(0, Height - this.MainScale * (2 * Settings.ProgressBar.Border + Settings.ProgressBar.MainHeight), Width, this.MainScale * (Settings.ProgressBar.MainHeight + 2 * Settings.ProgressBar.Border), 4);
        prog.fillRect(0, Height - this.MainScale * (2 * Settings.ProgressBar.Border + Settings.ProgressBar.MainHeight), Width, this.MainScale * (Settings.ProgressBar.MainHeight + 2 * Settings.ProgressBar.Border));
        this.ProgressBar = this.add.graphics({ fillStyle: { color: 0xE1919A } });
        this.ProgressBar.x = Settings.ProgressBar.Border;
        this.ProgressBar.y = Height - this.MainScale * (Settings.ProgressBar.Border + Settings.ProgressBar.MainHeight);
        this.TextTime = this.add.text(Width / 2, Height - this.MainScale * (Settings.ProgressBar.MainHeight / 2 + Settings.ProgressBar.Border), TravelTimeToString(this.TimeToHeal), { color: "white", align: "center" });
        this.TextTime.setOrigin(0.5, 0.5);

        // bgr.fillRoundedRect(0, 0, Width, Height, 4);
        const cont = this.add.container(0, 0, [/* bgr, */Heal, prog, this.ProgressBar, this.TextTime, /* buttonBackground, */]);

        return {
            Container: cont,
            Height,
            Width,
        }
    }
    private CreateButton(texture: string, text: string, imageSize = Settings.HealingDisplay.ButtonSize, isActive = true) {
        const painting = this.add.image(0, 0, texture);
        painting.displayHeight = this.MainScale * imageSize;
        painting.displayWidth = this.MainScale * imageSize;

        const textDisp = this.add.text(0, 0, text, { color: isActive ? "#ffffff" : "#727272", fontSize: this.MainScale * 14, fontStyle: 'bold', align: 'center' });

        // const Width = Math.max(this.MainScale * Settings.HealingDisplay.ButtonSize, textDisp.displayWidth) + this.MainScale * 2 * Settings.HealingDisplay.ButtonPadding;
        const Width = this.MainScale * 110;

        painting.setOrigin(0.5, 0.5);
        painting.x = Width / 2;
        painting.y = this.MainScale * (Settings.HealingDisplay.ButtonPadding + Settings.HealingDisplay.ButtonSize / 2);
        let Height = this.MainScale * (2 * Settings.HealingDisplay.ButtonPadding + Settings.HealingDisplay.ButtonSize);

        textDisp.setOrigin(0.5, 0);
        textDisp.x = Width / 2;
        textDisp.y = Height;
        Height = textDisp.y + textDisp.displayHeight + this.MainScale * (Settings.HealingDisplay.ButtonPadding);

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
    private setElementActive(key: number, List: InteractiveButton[], graphics: Phaser.GameObjects.Graphics) {
        graphics.clear();
        List.forEach((e, i) => {
            const notBackground = ((List[i].Active) ? 0x7585A9 : 0xD3D3D3);
            graphics.fillStyle((i !== key) ? notBackground : 0x4F628E);
            // 
            // graphics.fillRoundedRect(e.Button.x, e.Button.y, e.Width, e.Height, 3);
            graphics.fillRect(e.Button.x, e.Button.y, e.Width, e.Height);
        });
    }
    private resize(width: number, height: number) {
        if (width === undefined) { width = this.sys.game.config.width as number; }
        if (height === undefined) { height = this.sys.game.config.height as number; }
        if (width > 0) {
            this.cameras.resize(width, height);
            this.dimentions = { height, width };

            this.GenerateElements();
        }
    }
    private GenerateElements() {
        this.children.removeAll();

        this.Background = this.add.image(this.dimentions.width / 2, this.dimentions.height / 2, "HealingBackground");
        const scale = Math.max(this.dimentions.width / this.Background.width, this.dimentions.height / this.Background.height);
        // adjust to edges
        this.MainScale = scale * 1.01;
        this.Background.setScale(this.MainScale, this.MainScale);

        if (this.isHealing) {
            const gencont = this.genContainer();
            this.ClockContainer = gencont.Container;
            this.ClockContainer.x = (this.dimentions.width - gencont.Width) / 2;
            this.ClockContainer.y = (this.dimentions.height / 2 - gencont.Height);
        }
        else {
            this.ClockContainer = this.add.container(0, 0);
        }

        const animconfig: AnimationConfig = {
            frameRate: 12,
            frames: this.anims.generateFrameNumbers('fireplace', { start: 0, end: 15 }),
            key: 'fire',
            repeat: -1,
        };

        this.anims.create(animconfig);

        this.GenerateButtons(this.data.values.isHealing as boolean);

        const boom = this.add.sprite(400, 300, 'fireplace');
        boom.setOrigin(0.5, 1);
        boom.x = Settings.FirePlace.X * this.MainScale;
        boom.y = Settings.FirePlace.Y * this.MainScale;

        boom.setScale(Settings.FirePlace.Height / boom.height * this.MainScale);

        boom.anims.play('fire');
    }
}

// ---------------- interfaces

interface InteractiveButton {
    Active: boolean;
    InteractiveObj: Phaser.GameObjects.Image;
    Button: Phaser.GameObjects.Container;
    Height: number;
    Width: number;
    X: number;
    Y: number;
}

export interface IHealingResult {
    currentDuration: number;
    fullDuration: number;
    initialHP: number;
    finalHP: number;
}