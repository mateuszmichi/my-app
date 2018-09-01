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
        ButtonSize: 40,
    }
}

export class TravelScene extends Phaser.Scene {
    private dimentions: { height: number, width: number };
    private ConnData: IConnectionData;
    private travelData: ITravelResult;
    private startDate: Date;
    private endDate: Date;

    private Background: Phaser.GameObjects.Image;
    private TextTime: Phaser.GameObjects.Text;
    private TimeToTravel: number;
    private ProgressBar: Phaser.GameObjects.Graphics;
    private ClockContainer: Phaser.GameObjects.Container;

    constructor(dim: { height: number, width: number }, travel: ITravelResult, ConnData: IConnectionData) {
        super({ key: "TravelScene", });
        this.dimentions = dim;
        this.ConnData = ConnData;
        // ----- bindings
        this.endTravel = this.endTravel.bind(this);

        this.travelData = travel;
        this.endDate = new Date(this.travelData.endTime);
        this.startDate = new Date(this.travelData.startTime);
        this.TimeToTravel = (this.endDate.getTime() - this.startDate.getTime()) / 1000;
        if (this.TimeToTravel < 1) {
            this.TimeToTravel = 1;
        }
    }

    public preload() {
        const background = require('../../img/Game/Locations/TravelBGR2.png');
        this.load.image("Background", String(background));

        const fromto = require('../../img/Game/Locations/from-to.svg');
        this.load.svg("FromTo", String(fromto));
    }
    public create() {
        this.Background = this.add.image(this.dimentions.width / 2, this.dimentions.height / 2, "Background");
        const scale = Math.max(this.dimentions.width / this.Background.width, this.dimentions.height / this.Background.height);
        this.Background.setScale(scale, scale);
        this.Background.alpha = 0;

        const gencont = this.genContainer();
        this.ClockContainer = gencont.Container;
        this.ClockContainer.x = (this.dimentions.width - gencont.Width) / 2;
        this.ClockContainer.y = (this.dimentions.height / 2 - gencont.Height);
        this.ClockContainer.alpha = 0;

        this.tweens.add({
            alpha: 1,
            duration: 1000,
            targets: [this.Background, this.ClockContainer],
        });
        this.events.once('JourneyCompleted', this.endTravel);
    }
    public update(time: number) {
        this.ProgressBar.clear();
        let progress = (Date.now() - this.startDate.getTime()) / (this.endDate.getTime() - this.startDate.getTime());
        if (progress >= 1) {
            progress = 1;
            this.events.emit('JourneyCompleted');
        }
        this.ProgressBar.fillRoundedRect(0, 0, Settings.ProgressBar.MainWidth * progress, Settings.ProgressBar.MainHeight, 3);
        this.TextTime.setText(TravelTimeToString(this.TimeToTravel * (1 - progress)));
    }
    private endTravel() {
        const passed: IPassedGameData<number | null> = {
            ActionToken: this.ConnData.actionToken,
            Data: null,
            UserToken: this.ConnData.userToken,
        };
        const succFun = (res: any) => {
            const mapscene = this.scene.get("MapScene") as LocalMapScene;
            mapscene.updateData(res.data.location as ILocationResult);
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
    private genContainer() {
        const Width = Settings.ProgressBar.MainWidth + Settings.ProgressBar.Border * 2;
        let Height = 0;
        const FromText = this.add.text(0, 0, ["From", this.travelData.startName], { align: 'center', fontStyle: 'bold', color: "#222222" });
        const ToText = this.add.text(0, 0, ["To", this.travelData.targetName], { align: 'center', fontStyle: 'bold', color: "#222222" });
        Height = Math.max(FromText.displayHeight, ToText.displayHeight) + 2 * Settings.ProgressBar.Border + 2 * Settings.TravelDisplay.Border + Settings.ProgressBar.MainHeight;
        const bgr = this.add.graphics({ fillStyle: { color: 0xffffff, alpha: 0.8 } });
        bgr.fillRoundedRect(0, 0, Width, Height, 4);

        const prog = this.add.graphics({ fillStyle: { color: 0x162955 } });
        prog.fillRoundedRect(0, Height - 2 * Settings.ProgressBar.Border - Settings.ProgressBar.MainHeight, Settings.ProgressBar.MainWidth + 2 * Settings.ProgressBar.Border, Settings.ProgressBar.MainHeight + 2 * Settings.ProgressBar.Border, 4);
        this.ProgressBar = this.add.graphics({ fillStyle: { color: 0x7887AB } });
        this.ProgressBar.x = Settings.ProgressBar.Border;
        this.ProgressBar.y = Height - Settings.ProgressBar.Border - Settings.ProgressBar.MainHeight;

        this.TextTime = this.add.text(Width / 2, Height - Settings.ProgressBar.MainHeight / 2 - Settings.ProgressBar.Border, TravelTimeToString(this.TimeToTravel), { color: "white", align: "center" });
        this.TextTime.setOrigin(0.5, 0.5);

        FromText.setOrigin(0, 0);
        FromText.x = Settings.TravelDisplay.Border;
        FromText.y = Settings.TravelDisplay.Border;
        ToText.setOrigin(1, 0);
        ToText.x = Width - Settings.TravelDisplay.Border;
        ToText.y = Settings.TravelDisplay.Border;

        const Arrow = this.add.image(Width / 2, Settings.TravelDisplay.Border, "FromTo");
        Arrow.setOrigin(0.5, 0);
        Arrow.setScale(Settings.TravelDisplay.ArrowWidth / Arrow.width);

        const cont = this.add.container(0, 0, [bgr, prog, this.ProgressBar, this.TextTime, FromText, ToText, Arrow]);

        return {
            Container: cont,
            Height,
            Width,
        }
    }
}