import * as Collections from 'typescript-collections';

export const CharacterAttributes: IAttribute[] = [
    {

        description: "Strength is crucial for all types of warriors who are fighting in close combat. It increases damage dealt with almost all kind of \
        weapons. It also provides higher chance of multiple critical strickes.",
        name: "Strength",
        shortcut: "STR",
    },
    {

        description: "Endurance is describtion of character's physical durability. It allows to take more hits and helps to sustain multiple critical strickes.",
        name: "Endurance",
        shortcut: "END",
    },
    {

        description: "Dexterity is extremly useful for characters, that are using daggers and bows. It is also helpful in case of stealing. Every sneaky character \
        should posses high dexterity.",
        name: "Dexterity",
        shortcut: "DEX",
    },
    {

        description: "Reflex is crucial for characters that are not heavly armoured. It helps to avoid attack rather than to block them. Hgh reflex helps to avoid many \
        critical attacks.",
        name: "Reflex",
        shortcut: "REF",
    },
    {

        description: "Knowledge and wisdom came in one pair. It helps to understand true nature of stormlight. Every character who would like to use \
        power given by Stormfather efficiently, should posses high wisdom.",
        name: "Wisdom",
        shortcut: "WIS",
    },
    {

        description: "Intelligence is the base to quickly understand the situation. With fresh mind and analitical thinking, your character will always find \
        the way out of trouble.",
        name: "Intelligence",
        shortcut: "INT",
    },
    {

        description: "Charisma is the power to influence others. It helps to gain influence. Everyone is going to dance exacly the tune your character is playing.",
        name: "Charisma",
        shortcut: "CHA",
    },
    {

        description: "Willpower is mental durability. Even weakened character with great willpower can carry the mountain. It helps to sustain critical attacks. \
        Character with great willpower will newer loose willing to fight.",
        name: "Willpower",
        shortcut: "WLP",
    },
];

export interface IAttribute {
    name: string;
    description: string;
    shortcut: string;
}

// ----------------- map types
export class IGraph<T> {
    public nodes: T[];
    private edges: IEdge[][];
    private distanceFun: (n1: T, n2: T) => number;
    public constructor(nodes: T[], edges: IEdge[], distanceFun: (n1:T,n2:T)=>number) {
        this.nodes = [...nodes];
        this.edges = new Array<IEdge[]>(this.nodesCount()).fill(new Array<IEdge>());
        this.distanceFun = distanceFun;
        edges.forEach(e => { this.addEdge(e) });
    }
    public nodesCount() {
        return this.nodes.length;
    }
    public addEdge(edge: IEdge) {
        if (edge.from >= this.nodesCount() || edge.to >= this.nodesCount()) {
            throw new Error("Edge out of range");
        }
        // this.removeEdge(edge);
        // alert(edge.from + " " + edge.to);
        this.edges[edge.from] = [...this.edges[edge.from], edge];
        this.edges[edge.to] = [...this.edges[edge.to], { from: edge.to, to: edge.from, value: edge.value } as IEdge];
        // alert(JSON.stringify(this.edges[edge.to]));
    }
    // not working correctly!
    public removeEdge(edge: IEdge) {
        this.edges[edge.from] = this.edges[edge.from].filter(e => !this.EdgeCompere(edge, e));
        this.edges[edge.to] = this.edges[edge.to].filter(e => !this.EdgeCompere(edge, e));
    }
    public outEdges(index: number): IEdge[] {
        if (index >= this.nodesCount()) {
            throw new Error("Edge out of range");
        }
        return this.edges[index];
    }
    public Astar(start: number, end: number) {
        const gScore = new Map<number, { distance: number, prev: number }>();
        gScore.set(start, { distance: 0, prev: -1 });

        const closedset = new Collections.Bag<number>();
        
        const openset = new PriorQueue();
        openset.enqueue({ distance:this.distanceFun(this.nodes[start],this.nodes[end]), index: start });

        while (!openset.isEmpty()) {
            const current = openset.dequeue();
            if (current === undefined) {
                throw Error("Astar error");
            }
            if (current.index === end) {
                return this.reconstructPath(start, end, gScore);
            }
            closedset.add(current.index);

            this.outEdges(current.index).forEach(e => {
                const neighbour = e.to;
                if (!closedset.contains(neighbour)) {
                    if (!openset.contains(e.to)) {
                        gScore.set(neighbour, { distance: Number.MAX_VALUE, prev: -1 });
                        openset.enqueue({ distance: Number.MAX_VALUE, index: neighbour });
                    }
                    const curdist = gScore.get(current.index);
                    const posscore = gScore.get(neighbour);
                    if (curdist === undefined || posscore === undefined) {
                        throw Error("Astar error 2");
                    }
                    const ndist = curdist.distance + e.value * this.distanceFun(this.nodes[current.index], this.nodes[neighbour]);
                    if (posscore.distance > ndist) {
                        gScore.set(neighbour, { distance: ndist, prev: current.index });
                        openset.update({ index: neighbour, distance: ndist + this.distanceFun(this.nodes[neighbour],this.nodes[end]) });
                    }
                }
            });
        }
        throw Error("Not connected!");
    }

    private reconstructPath(from: number, to: number, camefrom: Map<number, { distance: number, prev: number }>) {
        const toNode = camefrom.get(to);
        if (toNode === undefined) {
            throw Error("Astar errro 5");
        }

        const total = new Collections.LinkedList();
        let iterator = to;
        total.add(iterator);
        while (camefrom.has(iterator)) {
            const newit = camefrom.get(iterator);
            if (newit === undefined) {
                throw Error("Astar errro 3");
            }
            if (newit.prev === -1) {
                break;
            }
            iterator = newit.prev;
            total.add(iterator);
        }
        total.reverse();
        const nodes = total.toArray() as number[];
        return {
            distance: toNode.distance,
            nodes,
        } as IAstarResult;
    }

    private EdgeCompere(e1: IEdge, e2: IEdge): boolean {
        return ((e1.from === e2.from) && (e1.to === e1.to)) || ((e1.to === e2.from) && (e1.from === e1.to));
    }
}
// TODO log(N)
class PriorQueue {
    private list: Collections.LinkedList<IAstarPrior>;
    constructor() {
        this.list = new Collections.LinkedList<IAstarPrior>();
    }
    public enqueue(a: IAstarPrior) {
        let i = 0;
        this.list.forEach(e => {
            if (a.distance < e.distance) {
                return;
            }
            i++;
        });
        this.list.add(a, i);
    }
    public dequeue() {
        return this.list.removeElementAtIndex(0);
    }
    public contains(i: number) {
        return this.list.contains({ distance: 0, index: i }, (n1: IAstarPrior, n2: IAstarPrior) => n1.index === n2.index);
    }
    public update(na: IAstarPrior) {
        this.list.remove(na, (n1: IAstarPrior, n2: IAstarPrior) => n1.index === n2.index);
        this.enqueue(na);
    }
    public isEmpty() {
        return this.list.isEmpty();
    }
}
interface IAstarResult {
    distance: number;
    nodes: number[];
}
interface IAstarPrior {
    distance: number;
    index: number;
}
export interface IEdge {
    from: number;
    to: number;
    value: number;
}


// ----------------- locationTypes
export interface ILocationType {
    image: string;
    name: string;
    options: LOCATION_OPTIONS[];
}
export interface ILocationOptionType {
    buttonDesc: string;
    name: string;
    image: string;
}

export interface INode {
    x: number;
    y: number;
}
export interface IMainNode {
    nodeID: number;
    locationType: LOCATIONS;
    name: string;
}
export interface ILocationResult {
    locationName: string;
    currentLocation: number;
    nodes: INode[];
    mainNodes: IMainNode[];
    edges: IEdge[];
    travelScale: number;
    locationID: number;
}

export const LocationOptionsImg: ILocationOptionType[] = [
    {
        buttonDesc: "Global Map",
        image: String(require('../img/Game/Locations/world.svg')),
        name: "ToGlobal",
    },
    {
        buttonDesc: "Local Map",
        image: String(require('../img/Game/Locations/plains.svg')),
        name: "ToLocal",
    },
    {
        buttonDesc: "Instance",
        image: String(require('../img/Game/Locations/location.svg')),
        name: "ToInstance",
    },
    {
        buttonDesc: "Shopping",
        image: String(require('../img/Game/Locations/stall.svg')),
        name: "ToShop",
    },
    {
        buttonDesc: "Rest",
        image: String(require('../img/Game/Locations/camping.svg')),
        name: "ToRest",
    },
];

export enum LOCATION_OPTIONS {
    TOGLOBAL,
    TOLOCAL,
    TOINSTANCE,
    TOSHOP,
    TOREST,
}

export enum LOCATIONS {
    UNKNOWN,
    LANDLOCATION,
    GLOBALLOCATION,
}

export const LocationTypes: ILocationType[] = [
    {
        image: String(require('../img/Game/Locations/mystery.svg')),
        name: "Unknown",
        options: [
        ],
    },
    {
        image: String(require('../img/Game/Locations/plains.svg')),
        name: "LandLocation",
        options: [
            LOCATION_OPTIONS.TOINSTANCE,
        ],
    },
    {
        image: String(require('../img/Game/Locations/roadsign.svg')),
        name: "GlobalLocation",
        options: [
            LOCATION_OPTIONS.TOGLOBAL,
            LOCATION_OPTIONS.TOREST,
        ],
    }
]

// ---------------- travel
export interface ITravelResult {
    startName: string;
    targetName: string;
    startTime: Date;
    endTime: Date;
    isReverse: boolean;
    reverseTime: Date;
}

// ---------------- equipement
export interface IEquipmentResult {
    knownItems: IItemResult[];
    backpack: Array<number | null>;
    backpackSize: number |null;
    firstHand: number | null;
    secondHand: number | null;
    armour: number | null;
    helmet: number | null;
    trousers: number | null;
    shoes: number | null;
    gloves: number | null;
    ring1: number | null;
    ring2: number | null;
    neckles: number | null;
    bracelet: number | null;
    money: number;
}

export interface IItemResult {
    itemID: number;
    itemType: ItemTypes;
    name: string;
    attributes: number[],
    lvl: number,
    dmgMin: number,
    dmgMax:number,
    armour: number,
}

export enum ItemTypes {
    SINGLEHAND_WEAPON,
    HELMET,
    ARMOUR,
    TROUSERS,
    SHOES,
    GLOVES,
    RING,
    NECKLES,
    BRACELET,
    DOUBLEHAND_WEAPON,
    SECONDARY_WEAPON,
    SHIELD,
}

export const ItemTypeDescription: string[] = [
    "Singlehand Weapon",
    "Helmet",
    "Armour",
    "Trousers",
    "Shoes",
    "Gloves",
    "Ring",
    "Neckles",
    "Bracelet",
    "Doublehand Weapon",
    "Secondary Weapon",
    "Shield",
];

export interface IEquipmentModifyResult {
    added: IEquipmentModification[];
    removed: IEquipmentModification[];
}
export interface IEquipmentModification {
    target: string;
    itemID: number|null;
}