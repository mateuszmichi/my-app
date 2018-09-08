import * as Collections from 'typescript-collections';

import * as Phaser from 'phaser';
import { IGraph, ILocationResult, IMainNode, INode, ITravelResult, LocationOptionsImg, LocationTypes, } from '../../data/gameTYPES';

import { ChildNodeRange, TravelTime, TravelTimeToString, VectorInGlobal, } from '../../data/gameCALC';
import { IMessage } from '../../MessageMenager';
import { IPassedGameData } from '../../TYPES';

import { LinkedList } from 'typescript-collections';

import { TravelScene } from './TravelScene';

// ------------------ images
import target from '../../img/Game/Locations/target.svg';

// ------------------ constants
import { IConnectionData, ServerConnect } from '../../data/connectionConf';

// ----------- settings
const Settings = {
    ActiveNodeFreq: 20,
    Description: {
        ButtonExtend: 50,
        ButtonSize: 40,
        DistanceBetween: 3,
        DistanceBetweenButtons: 1,
        MainPadding: 10,
        MinWidth: 90,
        TopPadding: 5,
    },
    MainNodeRadiusScale: 1.3,
    MainNodeSize: 30,
    MapBorder: 10,
    SuppNodePadding: 4,
    SuppNodeSize: 20,
}

export class LocalMapScene extends Phaser.Scene {
    private location: ILocationResult;
    private connData: IConnectionData;

    private background: Phaser.GameObjects.Sprite;
    private container: Phaser.GameObjects.Container;
    private topcontainer: Phaser.GameObjects.Container;

    private dimentions: { height: number, width: number };

    private graph: IGraph<INode>;
    private graphnodes: Array<{ sprite: Phaser.GameObjects.Sprite, mask: Phaser.GameObjects.Graphics | null, index: number }>;

    private pathdrawer: Phaser.GameObjects.Graphics;
    private nodesdrawer: Phaser.GameObjects.Graphics;
    private currentdesc: Phaser.GameObjects.Container;
    private targetNode: Phaser.GameObjects.Sprite;
    private locationName: Phaser.GameObjects.Text;
    private locationNameBGR: Phaser.GameObjects.Graphics;
    private border: Phaser.GameObjects.Graphics;

    private toMove: LinkedList<ItoMove>;

    constructor(dim: { height: number, width: number }, location: ILocationResult, ConnData: IConnectionData) {
        super({ key: "MapScene", });
        this.dimentions = dim;
        // ----- bindings
        this.createNode = this.createNode.bind(this);
        this.showTrack = this.showTrack.bind(this);
        this.showDescription = this.showDescription.bind(this);
        this.HeurDist = this.HeurDist.bind(this);
        this.MaxDistanceAngle = this.MaxDistanceAngle.bind(this);
        this.CreateDescriptionButton = this.CreateDescriptionButton.bind(this);
        this.SetTargetNode = this.SetTargetNode.bind(this);
        this.TravelTo = this.TravelTo.bind(this);
        this.resetPath = this.resetPath.bind(this);
        this.StartTravel = this.StartTravel.bind(this);
        this.DataHandling = this.DataHandling.bind(this);
        this.loadLocationImage = this.loadLocationImage.bind(this);
        this.AdjustElementsPosition = this.AdjustElementsPosition.bind(this);
        this.setElementActive = this.setElementActive.bind(this);
        this.resize = this.resize.bind(this);

        this.toMove = new LinkedList<ItoMove>();

        this.location = location;
        this.connData = ConnData;
    }
    public preload() {
        const img = require('../../img/Game/Locations/Location' + this.location.locationID + '.png');
        this.load.image({ key: "LocalMapBGR" + this.location.locationID, url: img, });

        const travel = require('../../img/Game/Locations/travel.svg');
        this.load.svg({ key: "TravelImg", url: String(travel) });

        this.load.svg({ key: "Target", url: String(target) });

        LocationTypes.forEach(e => {
            this.load.svg({ key: e.name + "Img", url: e.image });
        });
        LocationOptionsImg.forEach(e => {
            this.load.svg({ key: e.name + "Img", url: e.image });
        })

        this.graphnodes = [];
    }
    public create() {
        this.cameras.resize(this.dimentions.width, this.dimentions.height);
        this.events.on('resize', this.resize, this); 
        this.DataHandling();

        this.border = this.add.graphics({ fillStyle: { color: 0x5e3408 }, lineStyle: { width: 3, color: 0x5e3408 } });
        this.border.fillRect(0, 0, this.dimentions.width, this.dimentions.height);

        this.background = this.add.sprite(Settings.MapBorder, Settings.MapBorder, "LocalMapBGR" + this.data.values.LocationID);
        this.background.setOrigin(0, 0);

        this.targetNode = this.add.sprite(0, 0, "Target");
        this.targetNode.displayHeight = 1.5 * Settings.MainNodeRadiusScale * Settings.MainNodeSize;
        this.targetNode.displayWidth = 1.5 * Settings.MainNodeRadiusScale * Settings.MainNodeSize;
        this.tweens.add({
            displayHeight: Settings.MainNodeRadiusScale * Settings.MainNodeSize,
            displayWidth: Settings.MainNodeRadiusScale * Settings.MainNodeSize,
            duration: 60000 / Settings.ActiveNodeFreq,
            ease: 'Sine.easeInOut',
            repeat: -1,
            targets: this.targetNode,
            yoyo: true,
        });

        this.container = this.add.container(Settings.MapBorder, Settings.MapBorder);
        this.pathdrawer = this.add.graphics({ lineStyle: { width: 8, color: 0x4f628e } });
        this.container.add(this.pathdrawer);
        this.container.add(this.targetNode);

        this.nodesdrawer = this.add.graphics({ fillStyle: { color: 0xAD7942 }, lineStyle: { width: 2, color: 0x865420 } });
        this.container.add(this.nodesdrawer);

        this.locationNameBGR = this.add.graphics({ fillStyle: { color: 0x5e3408 } });
        this.locationName = this.add.text(this.background.displayWidth / 2, -Settings.MapBorder / 2, this.data.values.LocationName, { color: "white", fontStyle: "bold", fontSize: "18px" });
        this.locationName.setOrigin(0.5, 0);
        this.locationNameBGR.fillRoundedRect((this.background.displayWidth - this.locationName.displayWidth - 2 * Settings.MapBorder) / 2, -Settings.MapBorder / 2, 2 * Settings.MapBorder + this.locationName.displayWidth, this.locationName.displayHeight + Settings.MapBorder / 2, 3);
        this.container.add([this.locationNameBGR, this.locationName]);

        const MainNodes = this.data.values.MainNodes as IMainNode[];
        MainNodes.forEach(this.createNode);

        this.currentdesc = this.add.container(0, 0);

        this.topcontainer = this.add.container(Settings.MapBorder, Settings.MapBorder);
        this.topcontainer.setDepth(1);
        this.topcontainer.add(this.currentdesc);

        this.background.addListener("drag", (pointer: any, dragX: number, dragY: number) => {
            const delta = this.NewCoordinate(dragX, dragY);
            this.AdjustElementsPosition(delta);
        });
        this.background.addListener("pointerup", () => {
            this.resetPath();
        });

        this.background.setInteractive();
        this.input.setDraggable(this.background, true);
    }

    public updateData(newlocation: ILocationResult) {
        this.location = newlocation;
        // TODO first user comperer
        this.data.set("LocationID", this.location.locationID);
        this.data.set("CurrentPosition", this.location.currentLocation);
        this.data.set("LocationName", this.location.locationName);
        this.data.set("Nodes", this.location.nodes);
        this.data.set("MainNodes", this.location.mainNodes);
        this.data.set("Edges", this.location.edges);
        this.data.set("TravelScale", this.location.travelScale);

        this.graph = new IGraph(this.location.nodes, this.location.edges, this.HeurDist);
        this.resetPath();
    }

    public resize(width: number, height: number) {
        if (width === undefined) { width = this.sys.game.config.width as number; }
        if (height === undefined) { height = this.sys.game.config.height as number; }

        this.cameras.resize(width, height);
        this.dimentions = { height, width };

        this.border.clear();
        this.border.fillRect(0, 0, this.dimentions.width, this.dimentions.height);
    }

    private NewCoordinate(dragX: number, dragY: number): { x: number, y: number } {
        const gamewidth = this.dimentions.width;
        const gameheight = this.dimentions.height;
        const res = {
            x: 0,
            y: 0,
        }

        if (dragX > gamewidth - this.background.displayWidth - Settings.MapBorder) {
            if (dragX < Settings.MapBorder) {
                res.x = dragX - Settings.MapBorder;
            }
            else {
                res.x = 0;
            }
        }
        else {
            res.x = gamewidth - this.background.displayWidth - 2 * Settings.MapBorder;
        }

        if (dragY > gameheight - this.background.displayHeight - Settings.MapBorder) {
            if (dragY < Settings.MapBorder) {
                res.y = dragY - Settings.MapBorder;
            }
            else {
                res.y = 0;
            }
        }
        else {
            res.y = gameheight - this.background.displayHeight - 2 * Settings.MapBorder;
        }
        return res;
    }
    private AdjustElementsPosition(delta: { x: number, y: number }) {
        const nodes = this.data.values.Nodes as INode[];

        this.background.x = delta.x + Settings.MapBorder;
        this.background.y = delta.y + Settings.MapBorder;
        this.container.x = delta.x + Settings.MapBorder;
        this.container.y = delta.y + Settings.MapBorder;
        this.topcontainer.x = delta.x + Settings.MapBorder;
        this.topcontainer.y = delta.y + Settings.MapBorder;

        this.graphnodes.forEach(e => {
            if (e.mask !== null) {
                e.mask.x = delta.x;
                e.mask.y = delta.y;
            }
            e.sprite.x = delta.x + Settings.MapBorder + nodes[e.index].x;
            e.sprite.y = delta.y + Settings.MapBorder + nodes[e.index].y;
        });
        this.toMove.forEach(e => {
            if (e.mask !== null) {
                e.mask.x = delta.x;
                e.mask.y = delta.y;
            }
            e.sprite.x = delta.x + e.initialx;
            e.sprite.y = delta.y + e.initialy;
        });
    }
    private showDescription(mapnode: IMainNode, distance: number) {
        const traveltime = TravelTime(distance, this.data.values.TravelScale as number);
        this.currentdesc.removeAll();

        const graph = this.add.graphics({ fillStyle: { color: 0xffffff }, lineStyle: { width: 2, color: 0x333333 } });
        const locationname = this.add.text(0, 0, mapnode.name, { color: '#ffffff', align: 'center', fontSize: 14, fontStyle: 'bold' });
        const time = this.add.text(0, 0, ["Travel time", TravelTimeToString(traveltime)], { color: '#222222', align: 'center', fontSize: 12 });
        let DescWidth = Math.max(locationname.displayWidth, Settings.Description.ButtonExtend, Settings.Description.MinWidth);

        const buttonsToAdd = new Collections.LinkedList<InteractiveButton>();
        if (mapnode.nodeID !== (this.data.values.CurrentPosition as number)) {
            const travelbutton = this.CreateDescriptionButton("TravelImg", "Travel", null);
            if (Math.max(time.displayWidth, travelbutton.Width) > DescWidth) {
                DescWidth = Math.max(time.displayWidth, travelbutton.Width);
            }
            travelbutton.Button.on("pointerdown", () => {
                this.TravelTo(mapnode.nodeID, traveltime);
            });
            buttonsToAdd.add(travelbutton);
        } else {
            const LocType = mapnode.locationType;
            LocationTypes[LocType].options.forEach((option, i) => {
                // TODO onclick
                const travelbutton = this.CreateDescriptionButton(LocationOptionsImg[option].name + "Img", LocationOptionsImg[option].buttonDesc, null);
                if (travelbutton.Width > DescWidth) {
                    DescWidth = travelbutton.Width;
                }
                buttonsToAdd.add(travelbutton);
            });
        }
        DescWidth += 2 * Settings.Description.MainPadding;
        // 4F628E
        const buttonFill = this.add.graphics({ fillStyle: { color: 0xA8B3CC } });

        locationname.setOrigin(0.5, 0);
        locationname.x = DescWidth / 2;
        locationname.y = Settings.Description.TopPadding;
        let DescHeight = locationname.y + locationname.displayHeight + Settings.Description.TopPadding;

        this.currentdesc.add(graph);
        this.currentdesc.add(locationname);
        this.currentdesc.add(buttonFill);

        const arr = buttonsToAdd.toArray();
        arr.forEach((e,i) => {
            buttonFill.fillRect(0, DescHeight + Settings.Description.DistanceBetweenButtons, DescWidth, e.Height);

            e.Button.x = (DescWidth - e.Width) / 2;
            e.Button.y = DescHeight + Settings.Description.DistanceBetweenButtons;
            DescHeight = e.Button.y + e.Height;

            e.Button.setSize(e.Width, e.Height);
            e.Button.setInteractive(new Phaser.Geom.Rectangle(e.Width/2,e.Height/2,e.Width,e.Height), Phaser.Geom.Rectangle.Contains);
            e.Button.on("pointerover", () => {
                this.setHover();
                this.setElementActive(i,arr,buttonFill,DescWidth);
            });
            e.Button.on("pointerout", () => {
                this.setHoverEnd();
                this.setElementActive(-1, arr, buttonFill, DescWidth);
            });

            this.currentdesc.add(e.Button);
        });

        if (mapnode.nodeID !== (this.data.values.CurrentPosition as number)) {
            time.setOrigin(0.5, 0);
            time.x = DescWidth / 2;
            time.y = DescHeight + Settings.Description.DistanceBetween;
            DescHeight = time.y + time.displayHeight;
            this.currentdesc.add(time);
        } else {
            time.destroy();
        }
        const radius = 5;
        graph.fillRoundedRect(0, 0, DescWidth, DescHeight + Settings.Description.TopPadding, radius);
        graph.fillStyle(0x2E4172);
        graph.fillRoundedRect(0, 0, DescWidth, locationname.y + locationname.displayHeight + Settings.Description.TopPadding, radius);
        graph.fillRect(0, locationname.y + locationname.displayHeight + Settings.Description.TopPadding - radius, DescWidth, radius);
        graph.fillStyle(0x4F628E);

        const nodes = this.data.values.Nodes as INode[];
        this.currentdesc.x = nodes[mapnode.nodeID].x + 5;
        this.currentdesc.y = nodes[mapnode.nodeID].y + 5;
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
    private createNode(e: IMainNode) {
        const mapnode: INode = this.data.values.Nodes[e.nodeID];
        const node = this.add.sprite(mapnode.x + Settings.MapBorder, mapnode.y + Settings.MapBorder, LocationTypes[e.locationType].name + "Img");

        this.nodesdrawer.fillStyle(this.nodesdrawer.defaultFillColor);
        this.nodesdrawer.lineStyle(this.nodesdrawer.defaultStrokeWidth, this.nodesdrawer.defaultStrokeColor);

        this.nodesdrawer.fillCircle(mapnode.x, mapnode.y, Settings.MainNodeSize * Settings.MainNodeRadiusScale / 2);
        this.nodesdrawer.strokeCircle(mapnode.x, mapnode.y, Settings.MainNodeSize * Settings.MainNodeRadiusScale / 2);

        const mask = this.make.graphics({}).fillCircle(mapnode.x + Settings.MapBorder, mapnode.y + Settings.MapBorder, Settings.MainNodeSize * Settings.MainNodeRadiusScale / 2);
        const nodemask = new Phaser.Display.Masks.GeometryMask(this, mask);
        node.setMask(nodemask);


        const initialAngle = this.MaxDistanceAngle(mapnode.x, mapnode.y, this.background.width, this.background.height);
        const betweenAngle = 2 * Math.asin((Settings.SuppNodeSize * Settings.MainNodeRadiusScale + Settings.SuppNodePadding) / ((Settings.SuppNodeSize + Settings.MainNodeSize) * Settings.MainNodeRadiusScale + 2 * Settings.SuppNodePadding));
        const localVTable = ChildNodeRange(LocationTypes[e.locationType].options.length, betweenAngle, (Settings.SuppNodeSize + Settings.MainNodeSize) * Settings.MainNodeRadiusScale / 2 + Settings.SuppNodePadding);

        if ((this.data.values.CurrentPosition as number) === e.nodeID) {
            this.nodesdrawer.fillStyle(0xD4A573);

            this.SetTargetNode(e.nodeID);

        } else {
            this.nodesdrawer.fillStyle(0x9D9C9C);
            this.nodesdrawer.lineStyle(this.nodesdrawer.defaultStrokeWidth, 0x3e3e3e);
        }
        LocationTypes[e.locationType].options.forEach((option, index) => {
            const dVector = VectorInGlobal(initialAngle, localVTable[index]);
            const optionbutton = this.add.sprite(node.x + dVector.x, node.y + dVector.y, LocationOptionsImg[option].name + "Img");

            if ((this.data.values.CurrentPosition as number) === e.nodeID) {
                const wopt = optionbutton.width;
                const hopt = optionbutton.height;
                const hitboxopt = new Phaser.Geom.Ellipse(wopt / 2, hopt / 2, wopt * Settings.MainNodeRadiusScale, hopt * Settings.MainNodeRadiusScale);
                optionbutton.setInteractive(hitboxopt, Phaser.Geom.Ellipse.Contains);

                optionbutton.on("pointerover", this.setHover);
                optionbutton.on("pointerout", this.setHoverEnd);
            }

            optionbutton.displayHeight = Settings.SuppNodeSize;
            optionbutton.displayWidth = Settings.SuppNodeSize;
            this.nodesdrawer.fillCircle(optionbutton.x - Settings.MapBorder, optionbutton.y - Settings.MapBorder, Settings.SuppNodeSize * Settings.MainNodeRadiusScale / 2);
            this.nodesdrawer.strokeCircle(optionbutton.x - Settings.MapBorder, optionbutton.y - Settings.MapBorder, Settings.SuppNodeSize * Settings.MainNodeRadiusScale / 2);

            const optionmask = this.make.graphics({}).fillCircle(optionbutton.x, optionbutton.y, Settings.SuppNodeSize * Settings.MainNodeRadiusScale / 2);
            optionbutton.setMask(new Phaser.Display.Masks.GeometryMask(this, optionmask));

            this.toMove.add({ initialx: node.x + dVector.x, initialy: node.y + dVector.y, mask: optionmask, sprite: optionbutton });

        });

        const w = node.width;
        const h = node.height;
        const hitbox = new Phaser.Geom.Ellipse(w / 2, h / 2, w * Settings.MainNodeRadiusScale, h * Settings.MainNodeRadiusScale);
        node.setInteractive(hitbox, Phaser.Geom.Ellipse.Contains);
        // node.setInteractive();
        node.displayWidth = Settings.MainNodeSize;
        node.displayHeight = Settings.MainNodeSize;

        node.on("pointerdown", () => {
            this.showTrack(e);
            this.SetTargetNode(e.nodeID);
        });
        node.on("pointerover", this.setHover);
        node.on("pointerout", this.setHoverEnd);

        this.graphnodes.push({ sprite: node, mask, index: e.nodeID });
    }
    private showTrack(mainnode: IMainNode) {
        const nodes = this.data.values.Nodes as INode[];
        this.pathdrawer.clear();
        const AstarRes = this.graph.Astar((this.data.values.CurrentPosition as number), mainnode.nodeID);
        this.pathdrawer.beginPath();
        this.pathdrawer.moveTo(nodes[AstarRes.nodes[0]].x, nodes[AstarRes.nodes[0]].y);
        for (let aa = 1; aa < AstarRes.nodes.length; aa++) {
            this.pathdrawer.lineTo(nodes[AstarRes.nodes[aa]].x, nodes[AstarRes.nodes[aa]].y);
        }
        this.pathdrawer.strokePath();

        this.pathdrawer.alpha = 1;
        this.tweens.killTweensOf(this.pathdrawer);
        this.tweens.add({
            alpha: 0.8,
            duration: 2000,
            ease: 'Sine.easeInOut',
            repeat: -1,
            targets: this.pathdrawer,
            yoyo: true,
        });
        this.showDescription(mainnode, AstarRes.distance);
    }
    private HeurDist(a: INode, b: INode) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }
    private MaxDistanceAngle(x: number, y: number, mapx: number, mapy: number): number {
        const options = [mapx - x, y, x, mapy - y];
        const min = Math.min(mapx - x, y, x, mapy - y);
        for (let i = 0; i < 4; i++) {
            if (options[i] === min) {
                return Math.PI - Math.PI / 2 * (i);
            }
        }
        throw Error("Math.max error");
    }
    // TODO onclick type
    private CreateDescriptionButton(texture: string, text: string, onclick: any) {
        const travelbutton = this.add.image(0, 0, texture);
        travelbutton.displayHeight = Settings.Description.ButtonSize;
        travelbutton.displayWidth = Settings.Description.ButtonSize;

        const traveltext = this.add.text(0, 0, text, { color: "#ffffff", fontSize: 12, fontStyle: 'bold', align: 'center' });

        const ButtonsPadding = (Settings.Description.ButtonExtend - Settings.Description.ButtonSize) / 2;
        const Width = Math.max(travelbutton.displayWidth, traveltext.displayWidth) + 2 * ButtonsPadding;

        travelbutton.setOrigin(0.5, 0);
        travelbutton.x = Width / 2;
        travelbutton.y = ButtonsPadding;

        traveltext.setOrigin(0.5, 0);
        traveltext.x = Width / 2;
        traveltext.y = travelbutton.y + travelbutton.displayHeight + Settings.Description.DistanceBetween;
        const Height = traveltext.y + traveltext.displayHeight + ButtonsPadding

        return {
            Button: this.add.container(0, 0, [travelbutton, traveltext]),
            Height,
            InteractiveObj: travelbutton,
            Width,
        } as InteractiveButton;
    }
    private SetTargetNode(index: number) {
        const node = this.data.values.Nodes[index] as INode;
        this.targetNode.x = node.x;
        this.targetNode.y = node.y;
        this.tweens.killTweensOf(this.targetNode);
        this.targetNode.displayHeight = 1.5 * Settings.MainNodeRadiusScale * Settings.MainNodeSize;
        this.targetNode.displayWidth = 1.5 * Settings.MainNodeRadiusScale * Settings.MainNodeSize;
        this.tweens.add({
            displayHeight: Settings.MainNodeRadiusScale * Settings.MainNodeSize,
            displayWidth: Settings.MainNodeRadiusScale * Settings.MainNodeSize,
            duration: 60000 / Settings.ActiveNodeFreq,
            ease: 'Sine.easeInOut',
            repeat: -1,
            targets: this.targetNode,
            yoyo: true,
        });
    }
    private TravelTo(nodeIndex: number, travelTime: number) {
        this.StartTravel(nodeIndex);
    }
    private resetPath() {
        this.currentdesc.removeAll();
        this.pathdrawer.clear();
        this.SetTargetNode((this.data.values.CurrentPosition as number));
        this.setHoverEnd();
    }
    private StartTravel(cel: number) {
        const passed: IPassedGameData<number> = {
            ActionToken: this.connData.actionToken,
            Data: cel,
            UserToken: this.connData.userToken,
        };
        const succFun = (res: any) => {
            const received = res.data;
            const travel = received.travel as ITravelResult;
            // alert(JSON.stringify(travel));
            this.resetPath();
            this.scene.pause("MapScene");
            this.scene.add("TravelScene", new TravelScene(this.dimentions, travel, this.connData), true);
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.connData.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], []);
            } else {
                this.connData.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], []);
            }
        };
        ServerConnect(`/api/TravelingsStart`, passed, succFun, failFun, this.connData.popWaiting, this.connData.closeWaiting);
    }
    private DataHandling() {
        this.data.set("LocationID", this.location.locationID);
        this.data.set("LocationName", this.location.locationName);
        this.data.set("CurrentPosition", this.location.currentLocation);
        this.data.set("Nodes", this.location.nodes);
        this.data.set("MainNodes", this.location.mainNodes);
        this.data.set("Edges", this.location.edges);
        this.data.set("TravelScale", this.location.travelScale);

        this.graph = new IGraph(this.location.nodes, this.location.edges, this.HeurDist);
        // TODO set events for updates
        this.data.events.on("changedata_LocationID", () => {
            this.loadLocationImage(this.data.values.LocationID as number);
        });
        this.data.events.on("changedata_LocationName", () => {
            this.locationName.setText(this.data.values.LocationName);
            this.locationNameBGR.fillRoundedRect((this.background.displayWidth - this.locationName.displayWidth - 2 * Settings.MapBorder) / 2, -Settings.MapBorder / 2, 2 * Settings.MapBorder + this.locationName.displayWidth, this.locationName.displayHeight + Settings.MapBorder / 2, 3);
        });
        this.data.events.on("changedata_MainNodes", () => {
            this.graphnodes.forEach(e => {
                if (e.mask !== null) {
                    e.mask.destroy();
                }
                e.sprite.destroy();
            });
            this.graphnodes = [];

            this.toMove.forEach(e => {
                if (e.mask !== null) {
                    e.mask.destroy();
                }
                e.sprite.destroy();
            });
            this.toMove.clear();

            const MainNodes = this.data.values.MainNodes as IMainNode[];
            MainNodes.forEach(this.createNode);
            this.AdjustElementsPosition({ x: this.background.x - Settings.MapBorder, y: this.background.y - Settings.MapBorder });
        });
    }
    private loadLocationImage(LocationID: number) {
        if (this.textures.exists("LocalMapBGR" + LocationID)) {
            this.background.setTexture("LocalMapBGR" + LocationID);
        } else {
            this.load.once("complete", () => {
                this.background.setTexture("LocalMapBGR" + LocationID);
            });
            const img = require('../../img/Game/Locations/Location' + LocationID + '.png');
            this.load.image({ key: "LocalMapBGR" + LocationID, url: img, });
            this.load.start();
        }
    }

    private setElementActive(key: number, List: InteractiveButton[], graphics: Phaser.GameObjects.Graphics, width:number) {
        graphics.clear();
        List.forEach((e, i) => {
            graphics.fillStyle((i !== key) ? 0xA8B3CC : 0x4F628E);
            graphics.fillRect(0, e.Button.y, width, e.Height);
        });
    }

    
}


interface ItoMove {
    initialx: number;
    initialy: number;
    sprite: Phaser.GameObjects.Sprite;
    mask: Phaser.GameObjects.Graphics | null;
}

interface InteractiveButton {
    InteractiveObj: Phaser.GameObjects.Image,
    Button: Phaser.GameObjects.Container,
    Height: number;
    Width: number;
}
