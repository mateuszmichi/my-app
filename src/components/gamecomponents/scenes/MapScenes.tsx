import * as Collections from 'typescript-collections';

import * as Phaser from 'phaser';
import { IAstarResult, IGraph, IInstanceNode, ILocationResult, IMainNode, INode, INSTANCE_OPTIONS, InstanceOptionsImg, INSTANCES, InstanceTypes, ITravelResult, LOCATION_OPTIONS, LocationOptionsImg, LocationTypes, } from '../../data/gameTYPES';

import { ChildNodeRange, TravelTime, TravelTimeToString, VectorInGlobal, } from '../../data/gameCALC';
import { IMessage } from '../../MessageMenager';
import { IHero, IPassedGameData, } from '../../TYPES';

import { LinkedList } from 'typescript-collections';

import { TravelScene } from './TravelScene';

// ------------------ constants
import { IConnectionData, ServerConnect } from '../../data/connectionConf';
import { HealingScene, IHealingResult } from './HealingScene';

import { IHeroUpdates } from '../../Game';
import { FightingScene, IFightingResult,  } from './FightingScene';

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
    private hero: IHero;
    private velocityFactor: number;
    private locationType: LOCTYPE;
    private location: ILocationResult<IMainNode> | ILocationResult<IInstanceNode>;
    private connData: IConnectionData;
    private heroUpdates: IHeroUpdates;

    private background: Phaser.GameObjects.Image;
    private container: Phaser.GameObjects.Container;
    private topcontainer: Phaser.GameObjects.Container;

    private dimentions: { height: number, width: number };
    private deltas: { x: number, y: number };
    private travelingData: { travelStart: Date, travelEnd: Date, travel: ITravelResult, Astar: IAstarResult } | null;

    private graph: IGraph<INode>;
    private graphnodes: Array<{ sprite: Phaser.GameObjects.Image, mask: Phaser.GameObjects.Graphics | null, index: number }>;

    private pathdrawer: Phaser.GameObjects.Graphics;
    private traveldrawer: Phaser.GameObjects.Image;
    private nodesdrawer: Phaser.GameObjects.Graphics;
    private currentdesc: Phaser.GameObjects.Container;
    private targetNode: Phaser.GameObjects.Image;
    private locationName: Phaser.GameObjects.Text;
    private locationNameBGR: Phaser.GameObjects.Graphics;
    private border: Phaser.GameObjects.Graphics;

    private toMove: LinkedList<ItoMove>;

    constructor(dim: { height: number, width: number }, hero: IHero, ConnData: IConnectionData, HeroUpdates: IHeroUpdates) {

        super({ key: "MapScene", });
        this.dimentions = dim;
        this.deltas = { x: 0, y: 0 };
        // ----- bindings
        this.createNode = this.createNode.bind(this);
        this.showTrack = this.showTrack.bind(this);
        this.drawPath = this.drawPath.bind(this);
        this.showDescription = this.showDescription.bind(this);
        this.HeurDist = this.HeurDist.bind(this);
        this.MaxDistanceAngle = this.MaxDistanceAngle.bind(this);
        this.CreateDescriptionButton = this.CreateDescriptionButton.bind(this);
        this.ChangeDescriptionButtonWidth = this.ChangeDescriptionButtonWidth.bind(this);
        this.SetTargetNode = this.SetTargetNode.bind(this);
        this.TravelTo = this.TravelTo.bind(this);
        this.resetPath = this.resetPath.bind(this);
        this.StartTravel = this.StartTravel.bind(this);
        this.EndTravel = this.EndTravel.bind(this);
        this.InstanceTravel = this.InstanceTravel.bind(this);

        this.DataHandling = this.DataHandling.bind(this);
        this.loadLocationImage = this.loadLocationImage.bind(this);
        this.AdjustElementsPosition = this.AdjustElementsPosition.bind(this);
        this.setElementActive = this.setElementActive.bind(this);
        this.resize = this.resize.bind(this);
        this.calculateDeltas = this.calculateDeltas.bind(this);
        this.nodeCenterPosition = this.nodeCenterPosition.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.selectOption = this.selectOption.bind(this);
        this.UseLocationAction = this.UseLocationAction.bind(this);
        this.createInstanceNode = this.createInstanceNode.bind(this);
        this.showInstanceDescription = this.showInstanceDescription.bind(this);

        this.toMove = new LinkedList<ItoMove>();

        this.hero = hero;
        this.velocityFactor = hero.velocityFactor;

        if (hero.location.locationGlobalType === 2) {
            this.locationType = LOCTYPE.INSTANCE;
            this.location = hero.location as ILocationResult<IInstanceNode>;
        } else {
            this.locationType = LOCTYPE.NORMAL;
            this.location = hero.location as ILocationResult<IMainNode>;
        }

        this.connData = ConnData;
        this.heroUpdates = HeroUpdates;

        // TODO put here logic of running game not in myGame !!!
        if (hero.status === 1 && this.locationType === LOCTYPE.INSTANCE) {
            const now = Date.now();
            this.travelingData = { Astar: { distance: 0, nodes: [] }, travel: hero.statusData as ITravelResult, travelStart: new Date(now), travelEnd: new Date(now + 1000) };
        } else {
            this.travelingData = null;
        }
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


        const img = require('../../img/Game/Locations/Location' + this.location.locationID + '.png');
        this.load.image({ key: "LocalMapBGR" + this.location.locationID, url: img, });

        const travel = require('../../img/Game/Locations/Interface/travel.png');
        // this.load.image({ key: "TravelImg", url: String(travel) });
        this.textures.addBase64("TravelImg", String(travel));

        const target = require('../../img/Game/Locations/Interface/target.png');
        this.load.image({ key: "Target", url: String(target) });

        const gps = require('../../img/Game/Locations/Interface/gps.png');
        // this.load.image({ key: "GPS", url: String(gps) });
        this.textures.addBase64("GPS", String(gps));

        LocationTypes.forEach(e => {
            if (!e.isURI) {
                this.load.image({ key: e.name + "Img", url: e.image });
            } else {
                this.textures.addBase64(e.name + "Img", e.image);
            }

        });
        LocationOptionsImg.forEach(e => {
            if (!e.isURI) {
                this.load.image({ key: e.name + "Img", url: e.image });
            } else {
                this.textures.addBase64(e.name + "Img", e.image);
            }
        });
        InstanceTypes.forEach(e => {
            if (!e.isURI) {
                this.load.image({ key: e.name + "Img", url: e.image });
            } else {
                this.textures.addBase64(e.name + "Img", e.image);
            }

        });
        InstanceOptionsImg.forEach(e => {
            if (!e.isURI) {
                this.load.image({ key: e.name + "Img", url: e.image });
            } else {
                this.textures.addBase64(e.name + "Img", e.image);
            }
        });

        this.graphnodes = [];
    }
    public create() {
        this.cameras.resize(this.dimentions.width, this.dimentions.height);
        this.events.on('resize', this.resize, this);
        this.DataHandling();

        this.events.once('JourneyCompleted', this.EndTravel);

        this.updateLocation();
    }
    public update() {
        if (this.locationType === LOCTYPE.INSTANCE) {
            this.traveldrawer.alpha = 0;
            if (this.travelingData !== null) {
                try {
                    const travelData = this.travelingData;
                    const progress = (Date.now() - this.travelingData.travelStart.getTime()) / (this.travelingData.travelEnd.getTime() - this.travelingData.travelStart.getTime());
                    if (progress > 1) {
                        // TODO
                        // alert(JSON.stringify(this.travelingData));
                        this.travelingData = null;
                        this.events.emit('JourneyCompleted');
                        return;
                    }
                    let currDist = progress * travelData.Astar.distance;
                    let it = 0;
                    let proc = 0;
                    while (currDist > 0 && it < travelData.Astar.nodes.length - 1) {
                        let distBet = this.HeurDist(this.graph.nodes[travelData.Astar.nodes[it]], this.graph.nodes[travelData.Astar.nodes[it + 1]]);
                        const edgeMno = this.graph.outEdges(travelData.Astar.nodes[it]).find(e => e.to === travelData.Astar.nodes[it + 1]);
                        if (edgeMno === undefined) {
                            throw Error("Edge not found");
                        }
                        distBet *= edgeMno.value;
                        if (distBet >= currDist) {
                            proc = currDist / distBet;
                            currDist = 0;
                        } else {
                            currDist -= distBet;
                            it++;
                        }
                    }
                    if (currDist > 0.001) {
                        throw Error("Travel exides range + " + currDist);
                    }

                    const nx = this.graph.nodes[travelData.Astar.nodes[it]].x * (1 - proc) + this.graph.nodes[travelData.Astar.nodes[it + 1]].x * proc;
                    const ny = this.graph.nodes[travelData.Astar.nodes[it]].y * (1 - proc) + this.graph.nodes[travelData.Astar.nodes[it + 1]].y * proc;
                    this.traveldrawer.x = nx;
                    this.traveldrawer.y = ny;
                    this.traveldrawer.alpha = 1;
                } catch(err) {
                    this.traveldrawer.alpha = 0;
                }
            }
        }
    }
    public updateData(newlocation: ILocationResult<any>) {
        if (newlocation.locationGlobalType === 2) {
            this.locationType = LOCTYPE.INSTANCE;
            this.location = newlocation as ILocationResult<IInstanceNode>;
        } else {
            this.locationType = LOCTYPE.NORMAL;
            this.location = newlocation as ILocationResult<IMainNode>;
        }
        this.graph = new IGraph(this.location.nodes, this.location.edges, this.HeurDist);

        // TODO first user comperer
        this.data.set("CurrentPosition", this.location.currentLocation);
        this.data.set("LocationName", this.location.locationName);
        this.data.set("Nodes", this.location.nodes);
        this.data.set("LocationType", this.locationType);
        this.data.set("MainNodes", this.location.mainNodes);
        this.data.set("Edges", this.location.edges);
        this.data.set("TravelScale", this.location.travelScale);
        this.data.set("LocationID", this.location.locationID);

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
                e.mask.x = delta.x + this.deltas.x;
                e.mask.y = delta.y + this.deltas.y;
            }
            e.sprite.x = delta.x + Settings.MapBorder + nodes[e.index].x;
            e.sprite.y = delta.y + Settings.MapBorder + nodes[e.index].y;
        });
        this.toMove.forEach(e => {
            if (e.mask !== null) {
                e.mask.x = delta.x + this.deltas.x;
                e.mask.y = delta.y + this.deltas.y;
            }
            e.sprite.x = delta.x + e.initialx + this.deltas.x;
            e.sprite.y = delta.y + e.initialy + this.deltas.y;
        });
    }
    // TODO other type
    private showDescription(mapnode: IMainNode, distance: number) {
        const traveltime = TravelTime(distance, this.data.values.TravelScale as number, 18 * this.velocityFactor);
        this.currentdesc.removeAll();

        const graph = this.add.graphics({ fillStyle: { color: 0xffffff }, lineStyle: { width: 2, color: 0x333333 } });
        const locationname = this.add.text(0, 0, mapnode.name, { color: '#ffffff', align: 'center', fontSize: 14, fontStyle: 'bold' });
        const time = this.add.text(0, 0, ["Travel time", TravelTimeToString(traveltime)], { color: '#222222', align: 'center', fontSize: 12 });
        let DescWidth = Math.max(locationname.displayWidth, Settings.Description.ButtonExtend, Settings.Description.MinWidth);

        const buttonsToAdd = new Collections.LinkedList<InteractiveButton>();
        if (mapnode.nodeID !== (this.data.values.CurrentPosition as number)) {
            const travelbutton = this.CreateDescriptionButton("TravelImg", "Travel");
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
                const travelbutton = this.CreateDescriptionButton(LocationOptionsImg[option].name + "Img", LocationOptionsImg[option].buttonDesc);
                if (travelbutton.Width > DescWidth) {
                    DescWidth = travelbutton.Width;
                }
                buttonsToAdd.add(travelbutton);
                travelbutton.Button.on("pointerup", () => {
                    this.selectOption(i, option, LOCTYPE.NORMAL);
                });
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
        arr.forEach((e, i) => {
            this.ChangeDescriptionButtonWidth(e, DescWidth);
            buttonFill.fillRect(0, DescHeight + Settings.Description.DistanceBetweenButtons, DescWidth, e.Height);

            e.Button.x = (DescWidth - e.Width) / 2;
            e.Button.y = DescHeight + Settings.Description.DistanceBetweenButtons;
            DescHeight = e.Button.y + e.Height;

            e.Button.setSize(e.Width, e.Height);
            e.Button.setInteractive(new Phaser.Geom.Rectangle(e.Width / 2, e.Height / 2, e.Width, e.Height), Phaser.Geom.Rectangle.Contains);
            e.Button.on("pointerover", () => {
                this.setHover();
                this.setElementActive(i, arr, buttonFill, DescWidth);
            });
            e.Button.on("pointerout", () => {
                this.setHoverEnd();
                this.setElementActive(-1, arr, buttonFill, DescWidth);
            });
            // e.Button.on("pointerup", () => {
            //    this.selectOption(i);
            // });
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
        // const radius = 5;
        // graph.fillRoundedRect(0, 0, DescWidth, DescHeight + Settings.Description.TopPadding, radius);
        graph.fillRect(0, 0, DescWidth, DescHeight + Settings.Description.TopPadding);
        graph.fillStyle(0x2E4172);
        // graph.fillRoundedRect(0, 0, DescWidth, locationname.y + locationname.displayHeight + Settings.Description.TopPadding, radius);
        graph.fillRect(0, 0, DescWidth, locationname.y + locationname.displayHeight + Settings.Description.TopPadding);
        // graph.fillRect(0, locationname.y + locationname.displayHeight + Settings.Description.TopPadding - radius, DescWidth, radius);
        graph.fillStyle(0x4F628E);

        const nodes = this.data.values.Nodes as INode[];
        this.currentdesc.x = nodes[mapnode.nodeID].x + 5;
        this.currentdesc.y = nodes[mapnode.nodeID].y + 5;
        // finding best position:
        if (DescWidth + this.currentdesc.x > this.background.displayWidth) {
            this.currentdesc.x -= (10 + DescWidth);
        }
        if (DescHeight + this.currentdesc.y > this.background.displayHeight) {
            this.currentdesc.y = this.background.displayHeight - DescHeight;
        }
    }
    private showInstanceDescription(mapnode: IInstanceNode, distance: number) {
        const traveltime = TravelTime(distance, this.data.values.TravelScale as number, 18 * this.velocityFactor);
        this.currentdesc.removeAll();

        const graph = this.add.graphics({ fillStyle: { color: 0xffffff }, lineStyle: { width: 2, color: 0x333333 } });
        let descr = "";
        switch (mapnode.instanceType) {
            case INSTANCES.ENTRANCE:
                descr = "Entrance";
                break;
            case INSTANCES.ENEMY:
                descr = (mapnode.isCleared) ? "Defeated enemy" : "Enemy";
                break;
            case INSTANCES.BOSS:
                descr = (mapnode.isCleared) ? "Defeated boss" : "Boss";
                break;
            case INSTANCES.TREASURE:
                descr = (mapnode.isCleared) ? "Opened treasure" : "Treasure";
                break;
        }

        const locationname = this.add.text(0, 0, descr, { color: '#ffffff', align: 'center', fontSize: 14, fontStyle: 'bold' });
        const time = this.add.text(0, 0, ["Travel time", TravelTimeToString(traveltime)], { color: '#222222', align: 'center', fontSize: 12 });
        let DescWidth = Math.max(locationname.displayWidth, Settings.Description.ButtonExtend, Settings.Description.MinWidth);

        const buttonsToAdd = new Collections.LinkedList<InteractiveButton>();
        if (mapnode.nodeID !== (this.data.values.CurrentPosition as number)) {
            const opt = InstanceOptionsImg[InstanceTypes[mapnode.instanceType].options[0]];
            const travelbutton = (mapnode.isCleared || mapnode.instanceType === INSTANCES.ENTRANCE) ? this.CreateDescriptionButton("TravelImg", "Travel") : this.CreateDescriptionButton(opt.name + "Img", opt.buttonDesc);

            if (Math.max(time.displayWidth, travelbutton.Width) > DescWidth) {
                DescWidth = Math.max(time.displayWidth, travelbutton.Width);
            }
            travelbutton.Button.on("pointerdown", () => {
                this.TravelTo(mapnode.nodeID, traveltime);
            });
            buttonsToAdd.add(travelbutton);
        } else {
            const LocType = mapnode.instanceType;
            if (!mapnode.isCleared || LocType === INSTANCES.ENTRANCE) {
                InstanceTypes[LocType].options.forEach((option, i) => {
                    // TODO onclick
                    const travelbutton = this.CreateDescriptionButton(InstanceOptionsImg[option].name + "Img", InstanceOptionsImg[option].buttonDesc);
                    if (travelbutton.Width > DescWidth) {
                        DescWidth = travelbutton.Width;
                    }
                    buttonsToAdd.add(travelbutton);
                    travelbutton.Button.on("pointerup", () => {
                        // TODO
                        this.selectOption(i, option, LOCTYPE.INSTANCE);
                    });
                });
            }
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
        arr.forEach((e, i) => {
            this.ChangeDescriptionButtonWidth(e, DescWidth);
            buttonFill.fillRect(0, DescHeight + Settings.Description.DistanceBetweenButtons, DescWidth, e.Height);

            e.Button.x = (DescWidth - e.Width) / 2;
            e.Button.y = DescHeight + Settings.Description.DistanceBetweenButtons;
            DescHeight = e.Button.y + e.Height;

            e.Button.setSize(e.Width, e.Height);
            e.Button.setInteractive(new Phaser.Geom.Rectangle(e.Width / 2, e.Height / 2, e.Width, e.Height), Phaser.Geom.Rectangle.Contains);
            e.Button.on("pointerover", () => {
                this.setHover();
                this.setElementActive(i, arr, buttonFill, DescWidth);
            });
            e.Button.on("pointerout", () => {
                this.setHoverEnd();
                this.setElementActive(-1, arr, buttonFill, DescWidth);
            });
            // e.Button.on("pointerup", () => {
            //    this.selectOption(i);
            // });
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
        // const radius = 5;
        // graph.fillRoundedRect(0, 0, DescWidth, DescHeight + Settings.Description.TopPadding, radius);
        graph.fillRect(0, 0, DescWidth, (arr.length > 0) ? (DescHeight + Settings.Description.TopPadding) : DescHeight);
        graph.fillStyle(0x2E4172);
        // graph.fillRoundedRect(0, 0, DescWidth, locationname.y + locationname.displayHeight + Settings.Description.TopPadding, radius);
        graph.fillRect(0, 0, DescWidth, locationname.y + locationname.displayHeight + Settings.Description.TopPadding);
        // graph.fillRect(0, locationname.y + locationname.displayHeight + Settings.Description.TopPadding - radius, DescWidth, radius);
        graph.fillStyle(0x4F628E);

        const nodes = this.data.values.Nodes as INode[];
        this.currentdesc.x = nodes[mapnode.nodeID].x + 5;
        this.currentdesc.y = nodes[mapnode.nodeID].y + 5;

        if (DescWidth + this.currentdesc.x > this.background.displayWidth) {
            this.currentdesc.x -= (10 + DescWidth);
        }
        if (DescHeight + this.currentdesc.y > this.background.displayHeight) {
            this.currentdesc.y = this.background.displayHeight - DescHeight;
            // this.currentdesc.y -= (10 + DescHeight);
        }

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
    // TODO other type
    private createNode(e: IMainNode) {
        const mapnode: INode = this.data.values.Nodes[e.nodeID];
        const node = this.add.image(mapnode.x + Settings.MapBorder - this.deltas.x, mapnode.y + Settings.MapBorder - this.deltas.y, LocationTypes[e.locationType].name + "Img");

        this.nodesdrawer.fillStyle(this.nodesdrawer.defaultFillColor);
        this.nodesdrawer.lineStyle(this.nodesdrawer.defaultStrokeWidth, this.nodesdrawer.defaultStrokeColor);

        this.nodesdrawer.fillCircle(mapnode.x, mapnode.y, Settings.MainNodeSize * Settings.MainNodeRadiusScale / 2);
        this.nodesdrawer.strokeCircle(mapnode.x, mapnode.y, Settings.MainNodeSize * Settings.MainNodeRadiusScale / 2);

        const mask = this.make.graphics({}).fillCircle(node.x, node.y, Settings.MainNodeSize * Settings.MainNodeRadiusScale / 2);
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
            const optionbutton = this.add.image(node.x + dVector.x, node.y + dVector.y, LocationOptionsImg[option].name + "Img");

            if ((this.data.values.CurrentPosition as number) === e.nodeID) {
                const wopt = optionbutton.width;
                const hopt = optionbutton.height;
                const hitboxopt = new Phaser.Geom.Ellipse(wopt / 2, hopt / 2, wopt * Settings.MainNodeRadiusScale, hopt * Settings.MainNodeRadiusScale);
                optionbutton.setInteractive(hitboxopt, Phaser.Geom.Ellipse.Contains);

                optionbutton.on("pointerover", this.setHover);
                optionbutton.on("pointerout", this.setHoverEnd);
                optionbutton.on("pointerup", () => { this.selectOption(index, option, LOCTYPE.NORMAL); });
            }

            optionbutton.displayHeight = Settings.SuppNodeSize;
            optionbutton.displayWidth = Settings.SuppNodeSize;
            const dX = Settings.MapBorder - this.deltas.x;
            const dY = Settings.MapBorder - this.deltas.y;

            this.nodesdrawer.fillCircle(optionbutton.x - dX, optionbutton.y - dY, Settings.SuppNodeSize * Settings.MainNodeRadiusScale / 2);
            this.nodesdrawer.strokeCircle(optionbutton.x - dX, optionbutton.y - dY, Settings.SuppNodeSize * Settings.MainNodeRadiusScale / 2);

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
            this.showTrack(e, LOCTYPE.NORMAL);
            this.SetTargetNode(e.nodeID);
        });
        node.on("pointerover", this.setHover);
        node.on("pointerout", this.setHoverEnd);

        this.graphnodes.push({ sprite: node, mask, index: e.nodeID });
    }
    private createInstanceNode(e: IInstanceNode) {
        const mapnode: INode = this.data.values.Nodes[e.nodeID];
        const node = this.add.image(mapnode.x + Settings.MapBorder - this.deltas.x, mapnode.y + Settings.MapBorder - this.deltas.y, InstanceTypes[e.instanceType].name + "Img");
        const alpha = (e.isCleared) ? 0.5 : 1
        node.alpha = alpha;
        this.nodesdrawer.fillStyle((!e.isCleared) ? this.nodesdrawer.defaultFillColor : 0x727272);
        this.nodesdrawer.lineStyle(this.nodesdrawer.defaultStrokeWidth, (!e.isCleared) ? this.nodesdrawer.defaultStrokeColor : 0x727272);

        this.nodesdrawer.fillCircle(mapnode.x, mapnode.y, Settings.MainNodeSize * Settings.MainNodeRadiusScale / 2);
        this.nodesdrawer.strokeCircle(mapnode.x, mapnode.y, Settings.MainNodeSize * Settings.MainNodeRadiusScale / 2);

        if (!e.isCleared && e.instanceType === INSTANCES.ENEMY || e.instanceType === INSTANCES.BOSS) {
            const levelText = this.add.text(0, 0, "Lvl: " + e.level, { color: "white" });
            // TODO - based on hero level background
            const padding = 2;
            levelText.setOrigin(0.5, 0);
            // this.nodesdrawer.fillRect(mapnode.x - levelText.displayWidth / 2 - padding, mapnode.y + Settings.MainNodeSize * Settings.MainNodeRadiusScale / 4, levelText.displayWidth + 2 * padding, Settings.MainNodeSize * Settings.MainNodeRadiusScale / 4 + 2 * padding + levelText.displayHeight);
            levelText.x = mapnode.x;
            levelText.y = mapnode.y + Settings.MainNodeSize * Settings.MainNodeRadiusScale / 2 + padding;
            levelText.setStroke("#3d3d3d", 4);
            this.container.add(levelText);
        }


        const mask = this.make.graphics({}).fillCircle(node.x, node.y, Settings.MainNodeSize * Settings.MainNodeRadiusScale / 2);
        const nodemask = new Phaser.Display.Masks.GeometryMask(this, mask);
        node.setMask(nodemask);

        const w = node.width;
        const h = node.height;
        const hitbox = new Phaser.Geom.Ellipse(w / 2, h / 2, w * Settings.MainNodeRadiusScale, h * Settings.MainNodeRadiusScale);
        node.setInteractive(hitbox, Phaser.Geom.Ellipse.Contains);
        // node.setInteractive();
        node.displayWidth = Settings.MainNodeSize;
        node.displayHeight = Settings.MainNodeSize;

        node.on("pointerdown", () => {
            // TODO
            if (this.travelingData === null) {
                this.showTrack(e, LOCTYPE.INSTANCE);
                this.SetTargetNode(e.nodeID);
            }
        });
        node.on("pointerover", this.setHover);
        node.on("pointerout", this.setHoverEnd);

        this.graphnodes.push({ sprite: node, mask, index: e.nodeID });
    }
    private showTrack(mainnode: IMainNode | IInstanceNode, type: LOCTYPE) {
        if (this.travelingData === null) {
            const AstarRes = this.drawPath(mainnode.nodeID);
            if (type === LOCTYPE.NORMAL) {
                this.showDescription(mainnode as IMainNode, AstarRes.distance);
            }
            else {
                this.showInstanceDescription(mainnode as IInstanceNode, AstarRes.distance);
            }
        }
    }
    private drawPath(target: number) {
        const nodes = this.data.values.Nodes as INode[];
        this.pathdrawer.clear();
        const AstarRes = this.graph.Astar((this.data.values.CurrentPosition as number), target);
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
        return AstarRes;
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
    private CreateDescriptionButton(texture: string, text: string) {
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
            TextObj: traveltext,
            Width,
        } as InteractiveButton;
    }
    private ChangeDescriptionButtonWidth(but: InteractiveButton, newwidth:number) {
        but.Width = newwidth;
        but.InteractiveObj.setOrigin(0.5, 0);
        but.InteractiveObj.x = newwidth / 2;
        but.TextObj.setOrigin(0.5, 0);
        but.TextObj.x = newwidth / 2;
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
        if (this.travelingData === null) {
            this.StartTravel(nodeIndex);
        }
    }
    private resetPath() {
        if (this.travelingData === null) {
            this.currentdesc.removeAll();
            this.pathdrawer.clear();
            this.SetTargetNode((this.data.values.CurrentPosition as number));
            this.setHoverEnd();
        }
    }
    // TODO InstanceTravel
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
            // TODO 
            if (this.locationType === LOCTYPE.NORMAL) {
                this.resetPath();
                this.scene.pause("MapScene");
                this.scene.add("TravelScene", new TravelScene(this.dimentions, travel, this.connData, this.hero), true);
            }
            else {
                this.InstanceTravel(travel, cel);
            }
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
    // should be executed only for instance
    private EndTravel() {
        const passed: IPassedGameData<number | null> = {
            ActionToken: this.connData.actionToken,
            Data: null,
            UserToken: this.connData.userToken,
        };
        const succFun = (res: any) => {

            this.hero.status = res.data.herostatus;
            this.hero.statusData = res.data.statusdata;
            this.updateData(res.data.location as ILocationResult<any>);
            this.events.once('JourneyCompleted', this.EndTravel);
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.connData.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], []);
            } else {
                this.connData.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], []);
            }
            this.events.once('JourneyCompleted', this.EndTravel);
        };
        ServerConnect(`/api/HerosLocationsLoad`, passed, succFun, failFun, this.connData.popWaiting, this.connData.closeWaiting);
    }
    private InstanceTravel(travel: ITravelResult, targetID: number) {
        
        this.currentdesc.removeAll();
        const Astar = this.drawPath(targetID);
        const now = Date.now();
        this.travelingData = { Astar, travel, travelEnd: new Date(now + travel.fullDuration - travel.currentDuration), travelStart: new Date(now - travel.currentDuration) };
        // 
    }
    private UseLocationAction(cel: number) {
        const passed: IPassedGameData<number> = {
            ActionToken: this.connData.actionToken,
            Data: cel,
            UserToken: this.connData.userToken,
        };
        const succFun = (res: any) => {
            const received = res.data;
            const location = received.location as ILocationResult<any>;
            // TODO? czy nie rozwalamy reacta?
            // alert(JSON.stringify(received));
            this.hero.statusData = received.statusData;
            this.hero.status = received.heroStatus;
            this.updateData(location);
            // alert(JSON.stringify(received));
            // this.resetPath();
            // this.scene.pause("MapScene");
            // this.scene.add("TravelScene", new TravelScene(this.dimentions, travel, this.connData), true);
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.connData.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], []);
            } else {
                this.connData.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], []);
            }
        };
        ServerConnect(`/api/LocationAction`, passed, succFun, failFun, this.connData.popWaiting, this.connData.closeWaiting);
    }
    private DataHandling() {
        this.data.set("LocationName", this.location.locationName);
        this.data.set("CurrentPosition", this.location.currentLocation);
        this.data.set("Nodes", this.location.nodes);
        this.data.set("MainNodes", this.location.mainNodes);
        this.data.set("LocationType", this.locationType);
        this.data.set("Edges", this.location.edges);
        this.data.set("TravelScale", this.location.travelScale);
        this.data.set("LocationID", this.location.locationID);

        this.graph = new IGraph(this.location.nodes, this.location.edges, this.HeurDist);
        // TODO set events for updates
        this.data.events.on("changedata_LocationID", () => {
            this.loadLocationImage(this.data.values.LocationID as number);
        });
    }
    private loadLocationImage(LocationID: number) {
        if (this.textures.exists("LocalMapBGR" + LocationID)) {
            this.background.setTexture("LocalMapBGR" + LocationID);
            this.updateLocation();
        } else {
            this.load.once("complete", () => {
                this.background.setTexture("LocalMapBGR" + LocationID);
                this.updateLocation();
            });
            const img = require('../../img/Game/Locations/Location' + LocationID + '.png');
            this.load.image({ key: "LocalMapBGR" + LocationID, url: img, });
            this.load.start();
        }
    }
    private updateLocation() {
        this.graphnodes = [];
        this.toMove.clear();

        this.children.removeAll();
        this.border = this.add.graphics({ fillStyle: { color: 0x5e3408 }, lineStyle: { width: 3, color: 0x5e3408 } });
        this.border.fillRect(0, 0, this.dimentions.width, this.dimentions.height);

        this.background = this.add.image(0, 0, "LocalMapBGR" + this.data.values.LocationID);
        this.background.setOrigin(0, 0);
        this.deltas = this.calculateDeltas();
        this.background.x = Settings.MapBorder - this.deltas.x;
        this.background.y = Settings.MapBorder - this.deltas.y;

        this.targetNode = this.add.image(0, 0, "Target");
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

        this.container = this.add.container(Settings.MapBorder - this.deltas.x, Settings.MapBorder - this.deltas.y);
        this.pathdrawer = this.add.graphics({ lineStyle: { width: 8, color: 0x4f628e } });
        this.container.add(this.pathdrawer);
        this.container.add(this.targetNode);

        this.nodesdrawer = this.add.graphics({ fillStyle: { color: 0xAD7942 }, lineStyle: { width: 2, color: 0x865420 } });
        this.container.add(this.nodesdrawer);
        // this.traveldrawer = this.add.graphics({ fillStyle: { color: 0x000080 } });
        this.traveldrawer = this.add.image(0, 0, "GPS");
        this.traveldrawer.setScale(0.2);
        this.traveldrawer.setOrigin(0.5, 1);
        this.tweens.add({
            duration: 2000,
            ease: 'Sine.easeInOut',
            repeat: -1,
            scaleX: 0.25,
            scaleY: 0.25,
            targets: this.traveldrawer,
            yoyo: true,
        });


        this.traveldrawer.alpha = 0;
        this.container.add(this.traveldrawer);

        this.locationNameBGR = this.add.graphics({ fillStyle: { color: 0x5e3408 } });
        this.locationName = this.add.text(this.background.displayWidth / 2, -Settings.MapBorder / 2, this.data.values.LocationName, { color: "white", fontStyle: "bold", fontSize: "18px" });
        this.locationName.setOrigin(0.5, 0);
        // this.locationNameBGR.fillRoundedRect((this.background.displayWidth - this.locationName.displayWidth - 2 * Settings.MapBorder) / 2, -Settings.MapBorder / 2, 2 * Settings.MapBorder + this.locationName.displayWidth, this.locationName.displayHeight + Settings.MapBorder / 2, 3);
        this.locationNameBGR.fillRect((this.background.displayWidth - this.locationName.displayWidth - 2 * Settings.MapBorder) / 2, -Settings.MapBorder / 2, 2 * Settings.MapBorder + this.locationName.displayWidth, this.locationName.displayHeight + Settings.MapBorder / 2);
        this.container.add([this.locationNameBGR, this.locationName]);

        if (this.locationType === LOCTYPE.NORMAL) {
            const MainNodes = this.data.values.MainNodes as IMainNode[];
            MainNodes.forEach(this.createNode);
        }
        else {
            const MainNodes = this.data.values.MainNodes as IInstanceNode[];
            MainNodes.forEach(this.createInstanceNode);
        }

        this.currentdesc = this.add.container(0, 0);

        this.topcontainer = this.add.container(Settings.MapBorder - this.deltas.x, Settings.MapBorder - this.deltas.y);
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

        this.travelingData = null;
        this.resetPath();

        switch (this.hero.status) {
            case 0:
                break;
            case 1:
                const travelData = this.hero.statusData as ITravelResult;
                if (this.locationType === LOCTYPE.NORMAL) {
                    this.scene.pause("MapScene");
                    this.scene.add("TravelScene", new TravelScene(this.dimentions, travelData, this.connData,this.hero), true);
                } else {
                    const newTargetNode = parseInt(travelData.targetName, 10);
                    this.SetTargetNode(newTargetNode);
                    this.InstanceTravel(travelData, newTargetNode);
                }
                break;
            case 2:
                const healingData = this.hero.statusData as IHealingResult;
                this.scene.pause("MapScene");
                this.scene.add("HealingScene", new HealingScene(this.dimentions, this.connData, this.heroUpdates, healingData, this.hero), true);
                break;
            case 3:
                const fightingData = this.hero.statusData as IFightingResult;
                this.scene.pause("MapScene");
                this.scene.add("FightingScene", new FightingScene(this.dimentions, this.hero, this.connData, this.heroUpdates, fightingData), true);
                break;
        }
    }

    private setElementActive(key: number, List: InteractiveButton[], graphics: Phaser.GameObjects.Graphics, width: number) {
        graphics.clear();
        List.forEach((e, i) => {
            graphics.fillStyle((i !== key) ? 0xA8B3CC : 0x4F628E);
            graphics.fillRect(0, e.Button.y, width, e.Height);
        });
    }
    private calculateDeltas(): { x: number, y: number } {
        const Nodes = this.data.values.Nodes as INode[];
        const mapnode: INode = Nodes[this.data.values.CurrentPosition as number];
        const x = this.nodeCenterPosition(mapnode.x, this.background.displayWidth, this.dimentions.width);
        const y = this.nodeCenterPosition(mapnode.y, this.background.displayHeight, this.dimentions.height);
        return { x, y };
    }
    private nodeCenterPosition(position: number, bgrSize: number, windowSize: number): number {
        if (position < bgrSize - position) {
            return (position < windowSize / 2) ? 0 : position - windowSize / 2;
        }
        else {
            return (position > bgrSize - windowSize / 2 + Settings.MapBorder) ? bgrSize - windowSize + 2 * Settings.MapBorder : position - windowSize / 2;
        }
    }


    private selectOption(option: number, optionType: LOCATION_OPTIONS | INSTANCE_OPTIONS, type: LOCTYPE) {
        // TODO list of implemented
        // alert(option + " " + optionType);
        if (type === LOCTYPE.NORMAL) {
            const implemented = [LOCATION_OPTIONS.TOGLOBAL, LOCATION_OPTIONS.TOLOCAL, LOCATION_OPTIONS.TOINSTANCE];
            if (implemented.findIndex(e => e === optionType) !== -1) {
                this.UseLocationAction(option);
            }
            else {
                if (optionType === LOCATION_OPTIONS.TOREST) {
                    this.scene.pause("MapScene");
                    this.scene.add("HealingScene", new HealingScene(this.dimentions, this.connData, this.heroUpdates, null, this.hero), true);
                } else {
                    this.connData.popMessage([{ title: "notImplementedErr", description: "This method has not been implemented!" } as IMessage], []);
                }
            }
            
        }
        else {
            // TODO 
            const implemented: INSTANCE_OPTIONS[] = [INSTANCE_OPTIONS.TOLOCAL,INSTANCE_OPTIONS.TOFIGHT];
            if (implemented.findIndex(e => e === optionType) !== -1) {
                this.UseLocationAction(option);
            } else {
                this.connData.popMessage([{ title: "notImplementedErr", description: "This feature has not been implemented!" } as IMessage], []);
            }
            if (optionType === INSTANCE_OPTIONS.TOTREASURE) {
                /*this.scene.pause("MapScene");
                this.scene.add("HealingScene", new HealingScene(this.dimentions, this.connData, this.heroUpdates, null), true);*/
                // TODO add loot scene
            }
        }
    }
}


interface ItoMove {
    initialx: number;
    initialy: number;
    sprite: Phaser.GameObjects.Image;
    mask: Phaser.GameObjects.Graphics | null;
}

interface InteractiveButton {
    InteractiveObj: Phaser.GameObjects.Image,
    TextObj: Phaser.GameObjects.Text,
    Button: Phaser.GameObjects.Container,
    Height: number;
    Width: number;
}

enum LOCTYPE {
    NORMAL,
    INSTANCE
}