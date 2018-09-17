import * as Phaser from 'phaser';

import * as React from 'react';

import { IConnectionData, ServerConnect } from '../../data/connectionConf';
// import { TravelTimeToString } from '../../data/gameCALC';
import { IEquipmentModification, IInstanceNode, IItemResult, ILocationResult, } from '../../data/gameTYPES';

import { IMessage } from '../../MessageMenager';
import { IHero, IPassedGameData, } from '../../TYPES';

// import * as React from 'react';

// import AcceptDialog from '../../presentational/dialogs/AcceptDialog';

import { IHeroUpdates } from '../../Game';
import { ItemDescription } from '../presentational/ItemDescription';
import { LocalMapScene } from './MapScenes';

const Settings = {
    Button: {
        Padding: 5,
        Size: 40,
    },
    Enemy: {
        Height: 300,
        Padding: 30,
        X: 600,
        Y: 596,
    },
    EnemyHP: {
        Height: 20,
        Width: 250,
    },
    Log: {
        BetweenDuration: 500,
        FadeDuration: 500,
        FadeTime: 10000,
        FallSize: 120,
        Height: 30,
        Velocity: 0.2,
        Width: 90,
    },
}

export class FightingScene extends Phaser.Scene {
    private dimentions: { height: number, width: number };
    private ConnData: IConnectionData;
    private heroUpdates: IHeroUpdates;
    private hero: IHero;

    private FightingData: IFightingResult;
    private isClickEnabled: boolean;
    private EnemyHPBar: Phaser.GameObjects.Graphics;
    private EnemyImage: Phaser.GameObjects.Image;
    private EnemyHPText: Phaser.GameObjects.Text;
    // private EnemyHitzones: InteractiveButton[];
    // private EnemyHitzonesBackground: Phaser.GameObjects.Graphics;

    private ButtonsBackground: Phaser.GameObjects.Graphics;
    private ButtonsArray: InteractiveButton[];

    private Background: Phaser.GameObjects.Image;
    private MainScale: number;

    private HPUpdate: IHPUpdate | null;
    private LogData: ILogDisplay[];

    constructor(dim: { height: number, width: number }, Hero: IHero, ConnData: IConnectionData, HeroUpdates: IHeroUpdates, FightingData: IFightingResult) {
        super({ key: "FightingScene", });
        this.dimentions = dim;
        this.ConnData = ConnData;
        this.heroUpdates = HeroUpdates;
        this.hero = Hero;
        // ----- bindings
        // this.EndBattle = this.EndBattle.bind(this);
        this.MakeTurn = this.MakeTurn.bind(this);
        this.CreateButton = this.CreateButton.bind(this);
        this.setHover = this.setHover.bind(this);
        this.setHoverEnd = this.setHoverEnd.bind(this);
        this.setElementActive = this.setElementActive.bind(this);
        this.resize = this.resize.bind(this);
        this.GenerateButtons = this.GenerateButtons.bind(this);
        this.GenerateElements = this.GenerateElements.bind(this);
        this.GenerateHPBar = this.GenerateHPBar.bind(this);
        this.PrepairLogs = this.PrepairLogs.bind(this);
        this.GenLogContainer = this.GenLogContainer.bind(this);
        this.GenerateFightResult = this.GenerateFightResult.bind(this);
        this.GenItemChoose = this.GenItemChoose.bind(this);
        this.GenApply = this.GenApply.bind(this);
        this.EndFight = this.EndFight.bind(this);

        this.FightingData = FightingData;
        this.isClickEnabled = true;

        this.ButtonsArray = [];
        this.HPUpdate = null;
        this.LogData = [];
    }

    public preload() {
        const background = require('../../img/Game/Locations/Interface/Battlefield.png');
        this.load.image("FightingBackground", String(background));

        if (!this.textures.exists("Enemy" + this.FightingData.enemyID)) {
            const enemySrc = require('../../img/Game/Enemies/Enemy' + this.FightingData.enemyID + '.png');
            this.load.image({ key: "Enemy" + this.FightingData.enemyID, url: String(enemySrc) });
        }

        if (!this.textures.exists("Hit")) {
            const hitSrc = require('../../img/Game/Locations/Interface/hit.png');
            // this.load.image({ key: "Podest", url: String(podestSrc) });
            this.textures.addBase64("Hit", String(hitSrc));
        }

        if (!this.textures.exists("Fist")) {
            const fistSrc = require('../../img/Game/Locations/Interface/fist.png');
            // this.load.image({ key: "Podest", url: String(podestSrc) });
            this.textures.addBase64("Fist", String(fistSrc));
        }

        if (!this.textures.exists("Defense")) {
            const shieldSrc = require('../../img/Game/Locations/Interface/shield.png');
            // this.load.image({ key: "Podest", url: String(podestSrc) });
            this.textures.addBase64("Defense", String(shieldSrc));
        }

        if (!this.textures.exists("Podest")) {
            const podestSrc = require('../../img/Game/Locations/Interface/Podest.png');
            // this.load.image({ key: "Podest", url: String(podestSrc) });
            this.textures.addBase64("Podest", String(podestSrc));
        }

        if (!this.textures.exists("Success")) {
            const podestSrc = require('../../img/MainPage/success.png');
            // this.load.image({ key: "Podest", url: String(podestSrc) });
            this.textures.addBase64("Success", String(podestSrc));
        }
        if (!this.textures.exists("Deny")) {
            const podestSrc = require('../../img/MainPage/error.png');
            // this.load.image({ key: "Podest", url: String(podestSrc) });
            this.textures.addBase64("Deny", String(podestSrc));
        }
        if (!this.textures.exists("BlackBRG")) {
            const blackSrc = require('../../img/Game/Locations/Interface/black.png');
            // this.load.image({ key: "Podest", url: String(podestSrc) });
            this.textures.addBase64("BlackBRG", String(blackSrc));
        }
    }
    public create() {
        this.cameras.resize(this.dimentions.width, this.dimentions.height);
        this.events.on('resize', this.resize, this);

        this.data.set("FightingData", this.FightingData);
        this.data.events.on("changedata_FightingData", () => {
            // TODO update bars etc
            if (this.FightingData.isOver) {
                const graphic = this.add.graphics({ fillStyle: { color: 0xFFFFFF, alpha: 0.3 } });
                graphic.fillRect(0, 0, this.dimentions.width, this.dimentions.height);
                if (this.FightingData.loot !== null) {
                    if (this.textures.exists("Item" + this.FightingData.loot.itemID)) {
                        this.GenerateFightResult();
                    } else {
                        const path = require('../../img/Game/Items/' + this.FightingData.loot.itemID + '.png');

                        if (String(path).startsWith("data:image")) {
                            this.textures.once("onload", () => {
                                this.GenerateFightResult();
                            });
                            this.textures.addBase64("Item" + this.FightingData.loot.itemID, String(path));

                        } else {
                            this.load.once("complete", () => {
                                this.GenerateFightResult();
                            });
                            this.load.image({ key: "Item" + this.FightingData.loot.itemID, url: String(path), });
                            this.load.start();
                        }
                    }
                } else {
                    this.GenerateFightResult();
                }
            }
        });

        this.GenerateElements();

        // TODO set alpha

        this.Background.alpha = 0;
        this.tweens.add({
            alpha: 1,
            duration: 500,
            targets: this.children.getAll(),
        });
    }
    public update() {
        const now = Date.now();
        if (this.HPUpdate !== null) {
            const toupdate = this.HPUpdate;
            const progress = (now - toupdate.start) / toupdate.duration;
            if (progress < 1) {
                const hp = (1 - progress) * toupdate.startHP + progress * toupdate.endHP;
                this.GenerateHPBar(hp);
            }
            else {
                this.GenerateHPBar(toupdate.endHP);
                this.HPUpdate = null;
            }
        }
        const toremove: number[] = [];
        this.LogData.forEach((e, i) => {
            const targetx = this.EnemyImage.x + this.EnemyImage.displayWidth / 2 + Settings.Enemy.Padding;
            const targety = this.EnemyImage.y - Settings.Log.Height * (i + 1) - Settings.Enemy.Padding / 2;
            e.x = targetx;
            e.container.x = targetx;
            if (e.y < targety) {
                e.y += e.fallVelocity * (now - e.lastUpdate);
                if (e.y > targety) {
                    e.y = targety;
                }
                e.container.y = e.y;
            }
            e.lastUpdate = now;
            if (now > e.start + e.duration) {
                if (now > e.start + e.duration + Settings.Log.FadeDuration) {
                    toremove.push(i);
                    e.container.destroy();
                }
                else {
                    e.container.alpha = 1 - (now - e.start - e.duration) / Settings.Log.FadeDuration;
                }
            }
            else {
                if (now < e.start + e.showtime) {
                    e.container.alpha = (now - e.start) / e.showtime;
                }
                else {
                    e.container.alpha = 1;
                }
            }
        });
        this.LogData = this.LogData.filter((e, i) => (toremove.findIndex(f => f === i) === -1));
    }
    private GenerateButtons(enemyWidth: number) {
        this.ButtonsArray.forEach(e => e.Button.destroy());
        this.ButtonsBackground = this.add.graphics({});
        const buttons = [
            {
                Active: !this.FightingData.isOver,
                OnClick: () => {
                    if (this.isClickEnabled) {
                        this.MakeTurn(AttackType.Normal);
                    }
                },
                OriginX: 1,
                OriginY: 0,
                Text: "Normal\nAttack",
                Texture: "Hit",
                X: Settings.Enemy.X - enemyWidth / this.MainScale / 2 - Settings.Enemy.Padding,
                Y: Settings.Enemy.Y - Settings.Enemy.Height,
            },
            {
                Active: !this.FightingData.isOver,
                OnClick: () => {
                    if (this.isClickEnabled) {
                        this.MakeTurn(AttackType.Strong);
                    }
                },
                OriginX: 1,
                OriginY: 0,
                Text: "Strong\nAttack",
                Texture: "Fist",
                X: Settings.Enemy.X - enemyWidth / this.MainScale / 2 - Settings.Enemy.Padding,
                Y: Settings.Enemy.Y - Settings.Enemy.Height + 100,
            },
            {
                Active: !this.FightingData.isOver,
                OnClick: () => {
                    if (this.isClickEnabled) {
                        this.MakeTurn(AttackType.Defense);
                    }
                },
                OriginX: 1,
                OriginY: 0,
                Text: "Defensive\nAttack",
                Texture: "Defense",
                X: Settings.Enemy.X - enemyWidth / this.MainScale / 2 - Settings.Enemy.Padding,
                Y: Settings.Enemy.Y - Settings.Enemy.Height + 200,
            },
        ];
        this.ButtonsArray = [];
        buttons.forEach((e, i) => {

            const backStuff = this.CreateButton(e.Texture, e.Text, 40, e.Active);
            const backButton = backStuff.Button;
            backButton.setSize(backStuff.Width, backStuff.Height);
            backButton.x = this.MainScale * e.X - e.OriginX * backStuff.Width;
            backButton.y = this.MainScale * e.Y - e.OriginY * backStuff.Height;
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
    private EndFight(acceptItem:boolean) {
        const passed: IPassedGameData<boolean> = {
            ActionToken: this.ConnData.actionToken,
            Data: acceptItem,
            UserToken: this.ConnData.userToken,
        };
        const succFun = (res: any) => {
            // alert(JSON.stringify(res));
            const result = res.data as IEndFightingResult;
            this.heroUpdates.AddToEQ(result.added, result.newItems);
            // alert(JSON.stringify(result));
            this.heroUpdates.UpdateHPBase(result.newHPmax);
            this.heroUpdates.UpdateHP(result.newHP);
            this.heroUpdates.UpdateEXP(result.newExp, result.newLvl);
            // TODO update other 
            const mapscene = this.scene.get("MapScene") as LocalMapScene;

            // Must update hero before - will it work?
            this.hero.status = result.heroStatus;
            this.hero.statusData = result.statusData;
            mapscene.updateData(result.location as ILocationResult<any>);

            this.tweens.add({
                alpha: 0,
                duration: 250,
                onComplete: () => {
                    this.scene.resume("MapScene");
                    this.scene.remove("FightingScene");
                },
                targets: this.children.getAll(),
            });
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.ConnData.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], []);
            } else {
                this.ConnData.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], []);
            }
        };
        // TODO string
        ServerConnect(`/api/EndFighting`, passed, succFun, failFun, this.ConnData.popWaiting, this.ConnData.closeWaiting);
    }
    private MakeTurn(type: AttackType) {
        // TODO action interface
        const passed: IPassedGameData<number> = {
            ActionToken: this.ConnData.actionToken,
            Data: type,
            UserToken: this.ConnData.userToken,
        };
        const succFun = (res: any) => {
            // alert(JSON.stringify(res.data));
            this.HPUpdate = {
                duration: 500,
                endHP: res.data.fightingData.hp,
                start: Date.now(),
                startHP: this.FightingData.hp,
            }
            const now = Date.now();
            this.FightingData = res.data.fightingData;
            // alert(JSON.stringify(this.FightingData.log));
            this.LogData = [...this.LogData, ...this.PrepairLogs(this.FightingData.log, now)];
            this.data.set("FightingData", this.FightingData);

            this.heroUpdates.UpdateHP(res.data.heroHP);

        };
        const failFun = (error: any) => {
            // alert(JSON.stringify(error));
            if (error.response === undefined) {
                this.ConnData.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], []);
            } else {
                this.ConnData.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], []);
            }
        };
        ServerConnect(`/api/MakeTurn`, passed, succFun, failFun, this.ConnData.popWaiting, this.ConnData.closeWaiting);
    }
    private PrepairLogs(logs: IBattleLog[], now: number) {
        const num = this.LogData.length;
        const arr: ILogDisplay[] = [];
        logs.forEach((e, i) => {
            const x = this.EnemyImage.x + this.EnemyImage.displayWidth / 2 + Settings.Enemy.Padding;
            const y = this.EnemyImage.y - Settings.Log.Height * (num + 2 * i + 1) - Settings.Log.FallSize - Settings.Enemy.Padding / 2;
            const container = this.GenLogContainer(e);
            container.x = x;
            container.y = y;
            arr.push({
                container,
                duration: Settings.Log.FadeTime + i * Settings.Log.BetweenDuration,
                fallVelocity: Settings.Log.Velocity,
                lastUpdate: now,
                showtime: 100 * (i + 1),
                start: now,
                x,
                y,
            } as ILogDisplay);
        });
        return arr;
    }
    private GenLogContainer(log: IBattleLog) {
        const texture = TypeTextures[log.attackType];
        const padding = 3;
        const size = Settings.Log.Height - 2 * padding;
        const image = this.add.image(padding, padding, texture);
        image.setOrigin(0, 0);
        image.displayHeight = size;
        image.displayWidth = size;
        const dmgText = this.add.text(Settings.Log.Width - padding, Settings.Log.Height / 2, "-" + log.damage, { color: "white", fontStyle: "bold" });
        dmgText.setOrigin(1, 0.5);
        const background = this.add.graphics({ fillStyle: { color: (log.target === 0) ? 0x8B0000 : 0x006400 } });
        background.fillRect(0, 0, Settings.Log.Width, Settings.Log.Height);
        return this.add.container(0, 0, [background, image, dmgText]);
    }
    private CreateButton(texture: string, text: string, imageSize = Settings.Button.Size, isActive = true) {
        const painting = this.add.image(0, 0, texture);
        painting.displayHeight = this.MainScale * imageSize;
        painting.displayWidth = this.MainScale * imageSize;

        const textDisp = this.add.text(0, 0, text, { color: isActive ? "#ffffff" : "#727272", fontSize: this.MainScale * 16, fontStyle: 'bold', align: 'center' });

        // const Width = Math.max(this.MainScale * Settings.HealingDisplay.ButtonSize, textDisp.displayWidth) + this.MainScale * 2 * Settings.HealingDisplay.ButtonPadding;
        const Width = this.MainScale * 110;

        painting.setOrigin(0.5, 0.5);
        painting.x = Width / 2;
        painting.y = this.MainScale * (Settings.Button.Padding + Settings.Button.Size / 2);
        let Height = this.MainScale * (2 * Settings.Button.Padding + Settings.Button.Size);

        textDisp.setOrigin(0.5, 0);
        textDisp.x = Width / 2;
        textDisp.y = Height;
        Height = textDisp.y + textDisp.displayHeight + this.MainScale * (Settings.Button.Padding);

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
        /*if (width === undefined) { width = this.sys.game.config.width as number; }
        if (height === undefined) { height = this.sys.game.config.height as number; }

        const res = Math.min(Math.floor(width / 16), Math.floor(height / 9));
        width = res * 16;
        height = res * 9;

        if (width > 0 && (this.dimentions.width !== width || this.dimentions.height !== height)) {
            this.cameras.resize(width, height);
            this.dimentions = { height, width };

            this.GenerateElements();
        }*/
    }
    private GenerateElements() {
        this.children.removeAll();

        this.Background = this.add.image(this.dimentions.width / 2, this.dimentions.height / 2, "FightingBackground");
        const scale = Math.max(this.dimentions.width / this.Background.width, this.dimentions.height / this.Background.height);
        // adjust to edges
        this.MainScale = scale * 1.01;
        this.Background.setScale(this.MainScale, this.MainScale);
        this.Background.setOrigin(0.5, 0.5);

        const podest = this.add.image(this.MainScale * Settings.Enemy.X, this.MainScale * Settings.Enemy.Y, "Podest");
        const enemy = this.add.image(this.MainScale * Settings.Enemy.X, this.MainScale * Settings.Enemy.Y, "Enemy" + this.FightingData.enemyID);

        enemy.setScale(this.MainScale * Settings.Enemy.Height / enemy.height, this.MainScale * Settings.Enemy.Height / enemy.height);
        enemy.setOrigin(0.5, 1);

        this.EnemyImage = enemy;

        podest.setScale(this.MainScale, this.MainScale);
        podest.setOrigin(0.5, 0.75);

        this.GenerateHPBar(this.FightingData.hp);

        const enemyDesc = this.add.text(this.dimentions.width / 2, enemy.y - enemy.displayHeight - Settings.Button.Padding, this.FightingData.enemyName + "\nLevel: " + this.FightingData.enemyLevel, { color: "white", align: "center" });
        enemyDesc.setOrigin(0.5, 1);
        enemyDesc.setStroke("#3d3d3d", 4);

        this.GenerateButtons(enemy.displayWidth);

        if (this.FightingData.isOver) {
            const graphic = this.add.graphics({ fillStyle: { color: 0xFFFFFF, alpha: 0.3 } });
            graphic.fillRect(0, 0, this.dimentions.width, this.dimentions.height);
            if (this.FightingData.loot !== null) {
                if (this.textures.exists("Item" + this.FightingData.loot.itemID)) {
                    this.GenerateFightResult();
                } else {
                    const path = require('../../img/Game/Items/' + this.FightingData.loot.itemID + '.png');

                    if (String(path).startsWith("data:image")) {
                        this.textures.once("onload", () => {
                            this.GenerateFightResult();
                        });
                        this.textures.addBase64("Item" + this.FightingData.loot.itemID, String(path));

                    } else {
                        this.load.once("complete", () => {
                            this.GenerateFightResult();
                        });
                        this.load.image({ key: "Item" + this.FightingData.loot.itemID, url: String(path), });
                        this.load.start();
                    }
                }
            } else {
                this.GenerateFightResult();
            }
        }

    }
    private GenerateHPBar(newHP: number) {
        if (this.EnemyHPBar !== undefined && this.EnemyHPBar !== null) {
            this.EnemyHPBar.clear();
            this.EnemyHPBar.fillStyle(0xff9191);
            this.EnemyHPBar.fillRect((this.dimentions.width - this.MainScale * Settings.EnemyHP.Width) / 2, this.EnemyImage.y + Settings.Button.Padding, this.MainScale * Settings.EnemyHP.Width, Settings.EnemyHP.Height);
            this.EnemyHPBar.fillStyle(0x8a0707);
            const hpproc = newHP / this.FightingData.hpMax;
            this.EnemyHPBar.fillRect((this.dimentions.width - this.MainScale * Settings.EnemyHP.Width) / 2, this.EnemyImage.y + Settings.Button.Padding, hpproc * this.MainScale * Settings.EnemyHP.Width, Settings.EnemyHP.Height);
        }
        else {
            const hpbar = this.add.graphics({ fillStyle: { color: 0xff9191 } });
            hpbar.fillRect((this.dimentions.width - this.MainScale * Settings.EnemyHP.Width) / 2, this.EnemyImage.y + Settings.Button.Padding, this.MainScale * Settings.EnemyHP.Width, Settings.EnemyHP.Height);
            hpbar.fillStyle(0x8a0707);
            const hpproc = newHP / this.FightingData.hpMax;
            hpbar.fillRect((this.dimentions.width - this.MainScale * Settings.EnemyHP.Width) / 2, this.EnemyImage.y + Settings.Button.Padding, hpproc * this.MainScale * Settings.EnemyHP.Width, Settings.EnemyHP.Height);
            this.EnemyHPBar = hpbar;
        }
        const text = Math.floor(newHP) + "/" + this.FightingData.hpMax
        if (this.EnemyHPText === undefined || this.EnemyHPText === null) {
            this.EnemyHPText = this.add.text(this.dimentions.width / 2, this.EnemyImage.y + Settings.Button.Padding + Settings.EnemyHP.Height / 2, text, { color: "white" });
            this.EnemyHPText.setOrigin(0.5, 0.5);
        }
        else {
            this.EnemyHPText.setText(text);
        }
    }
    private GenerateFightResult() {
        const Width = 300;
        const Padding = 10;
        let Height = Padding;
        const Text = (this.FightingData.hp > 0) ? "Battle has been lost" : "Battle has been won";
        const FontColor = (this.FightingData.hp > 0) ? "#8B0000" : "#006400";
        const BackColor = (this.FightingData.hp > 0) ? 0xFF8C8C : 0x75CF75;

        const dispText = this.add.text(Width / 2, Height, Text, { fontSize: 18, fontStyle: "bold", color: FontColor });
        dispText.setOrigin(0.5, 0);
        Height += dispText.displayHeight + Padding;

        const RewardText = this.add.text(Width / 2, Height, "Rewards", { fontSize: 18, fontStyle: "bold" });
        RewardText.setOrigin(0.5, 0);
        Height += RewardText.displayHeight + Padding;

        const ExpText = this.add.text(Width / 2, Height, "Experience: " + this.FightingData.experience);
        ExpText.setOrigin(0.5, 0);
        Height += ExpText.displayHeight + 2 * Padding;

        if (this.FightingData.loot !== null) {
            const Accept: IAcceptItem = {
                accepted: true,
                id: 0,
            };
            const container = this.add.container((Width - 60) / 2, Height);
            this.GenItemChoose(container, this.FightingData.loot, Accept);
            Height += 90 + 2 * Padding;

            Height += 20;
            const apply = this.add.container(0, Height);
            apply.setSize(Width, 30);
            apply.setInteractive(new Phaser.Geom.Rectangle(Width / 2, 30 / 2, Width, 30), Phaser.Geom.Rectangle.Contains);
            this.GenApply(apply, false);
            apply.on("pointerover", () => {
                this.setHover();
                this.GenApply(apply, true);
            });
            apply.on("pointerout", () => {
                this.setHoverEnd();
                this.GenApply(apply, false);
            });
            apply.on("pointerup", () => {
                this.EndFight(Accept.accepted);
            });

            const Background = this.add.graphics({ fillStyle: { color: BackColor } });
            Background.fillRect(0, 0, Width, Height);
            return this.add.container((this.dimentions.width - Width) / 2, (this.dimentions.height - Height) / 2, [Background, ExpText, RewardText, container, dispText, apply]);
        }
        else {
            Height += 20;
            const apply = this.add.container(0, Height);
            apply.setSize(Width, 30);
            apply.setInteractive(new Phaser.Geom.Rectangle(Width / 2, 30 / 2, Width, 30), Phaser.Geom.Rectangle.Contains);
            this.GenApply(apply, false);
            apply.on("pointerover", () => {
                this.setHover();
                this.GenApply(apply, true);
            });
            apply.on("pointerout", () => {
                this.setHoverEnd();
                this.GenApply(apply, false);
            });
            apply.on("pointerup", () => {
                this.EndFight(false);
            });

            const Background = this.add.graphics({ fillStyle: { color: BackColor } });
            Background.fillRect(0, 0, Width, Height);
            return this.add.container((this.dimentions.width - Width) / 2, (this.dimentions.height - Height) / 2, [Background, ExpText, RewardText, dispText, apply]);
        }
    }
    private GenItemChoose(container: Phaser.GameObjects.Container, item: IItemResult, status: IAcceptItem) {
        container.removeAll();
        const padding = 5;
        const size = 50;
        const image = this.add.image(padding, padding, 'Item' + item.itemID);
        image.setOrigin(0, 0);
        image.displayHeight = size;
        image.displayWidth = size;
        image.setInteractive();
        // TODO action
        image.on("pointerover", () => {
            this.setHover();
        });
        image.on("pointerout", () => {
            this.setHoverEnd();
        });
        image.on("pointerup", () => {
            const fun = (event: any, target: string) => undefined;
            this.ConnData.popDialog(<ItemDescription hero={this.hero} item={item} isOn={false} ConnData={this.ConnData} equipFun={fun} disabled={true} />);
        });
        const Details = this.add.text(image.x + size / 2, image.y + size / 2, "Details", { color: "#000000", fontSize: 12, fontStyle: "bold" });
        Details.setOrigin(0.5, 0.5);
        Details.setStroke("#FFFFFF", 3);

        const AcceptImage = this.add.image(2, 65, "Success");
        AcceptImage.setOrigin(0, 0);
        AcceptImage.displayHeight = size / 2 - 2;
        AcceptImage.displayWidth = size / 2 - 2;
        AcceptImage.setInteractive();

        const DenyImage = this.add.image(58, 65, "Deny");
        DenyImage.setOrigin(1, 0);
        DenyImage.displayHeight = size / 2 - 2;
        DenyImage.displayWidth = size / 2 - 2;
        DenyImage.setInteractive();

        const Color = (!status.accepted) ? 0x8B0000 : 0x006400;

        const Background = this.add.graphics({ fillStyle: { color: Color }, lineStyle: { color: 0x000000, width: 1 } });
        Background.fillRect(-10, -5, 80, 100);
        Background.fillStyle(0xFFFFFF);
        Background.fillRect(padding - 2, padding - 2, 54, 54);
        Background.strokeRect(padding - 2, padding - 2, 54, 54);

        container.add([Background, image, AcceptImage, DenyImage, Details]);

        AcceptImage.on("pointerover", () => {
            this.setHover();
        });
        AcceptImage.on("pointerout", () => {
            this.setHoverEnd();
        });
        AcceptImage.on("pointerup", () => {
            status.accepted = true;
            this.GenItemChoose(container, item, status);
        });
        DenyImage.on("pointerover", () => {
            this.setHover();
        });
        DenyImage.on("pointerout", () => {
            this.setHoverEnd();
        });
        DenyImage.on("pointerup", () => {
            status.accepted = false;
            this.GenItemChoose(container, item, status);
        });
    }
    private GenApply(container: Phaser.GameObjects.Container, isHover: boolean) {
        container.removeAll();
        // container.setSize(150, 30);
        // container.setInteractive(new Phaser.Geom.Rectangle(150 / 2, 30 / 2, 150, 30), Phaser.Geom.Rectangle.Contains);
        const Background = this.add.graphics({ fillStyle: { color: (isHover) ? 0x4F628E : 0x7585A9 } });
        Background.fillRect(0, 0, 300, 30);
        const Text = this.add.text(300 / 2, 30 / 2, "End Fight", { color: "white", fontStyle: "bold" });
        Text.setOrigin(0.5, 0.5);
        container.add([Background, Text]);
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

export interface IFightingResult {
    enemyName: string;
    enemyID: number;
    enemyLevel: number;
    hp: number;
    hpMax: number;
    isOver: number;
    loot: IItemResult | null;
    log: IBattleLog[];
    experience: number;
}
interface IBattleLog {
    target: number;
    damage: number;
    attackType: AttackType;
}

interface IHPUpdate {
    start: number;
    duration: number;
    startHP: number;
    endHP: number;
}
interface ILogDisplay {
    start: number;
    showtime: number;
    duration: number;
    fallVelocity: number;
    lastUpdate: number;
    x: number;
    y: number;
    container: Phaser.GameObjects.Container;
}
interface IAcceptItem {
    id: number;
    accepted: boolean;
}
interface IEndFightingResult {
    success: boolean;
    heroStatus: number;
    newHP: number;
    newHPmax: number;
    newLvl: number;
    newExp: number;
    location: ILocationResult<IInstanceNode>;
    statusData: object;
    added: IEquipmentModification[];
    newItems: IItemResult[];
}

enum AttackType {
    Normal,
    Strong,
    Defense,
}
const TypeTextures = [
    "Hit", "Fist", "Defense"
];