import { IEquipmentResult, IItemResult, ItemTypes } from "./gameTYPES";

import { IHero } from "../TYPES";

// game mechanics

export function ExpToLevel(level: number): number {
    if (level <= 10) {
        return 10 * (level * level - level);
    }
    else {
        return 25 * level * (level - 13 * level) + 1650;
    }
}
export function MoneyToGems(money: number): string[] {
    let left = money;
    const arr: number[] = [];
    for (let i = 0; i < 2; i++) {
        arr.push(left % 100);
        if ((left - left % 100) / 100 === 0) {
            left = 0;
            break;
        } else {
            left = (left - left % 100) / 100;
        }
    }
    if (left > 0) {
        arr.push(left);
    }
    const res: string[] = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < 10 && i !== (arr.length - 1)) {
            res.push('0' + String(arr[i]));
        }
        else {
            res.push(String(arr[i]));
        }
    }
    return res;
}

export function HeroMaxHP(baseHP: number, finalAttr: number[]) {
    return baseHP + Math.ceil(finalAttr[1] / 2);
}
export function HeroMaxSL(baseSL: number, finalAttr: number[]) {
    return Math.ceil(baseSL * (1 + finalAttr[4] / 100));
}
export function HeroGenStatistics(hero: IHero) {
    const ActiveItems: IItemResult[] = [];
    const itemsOn = [
        hero.equipment.armour,
        hero.equipment.bracelet,
        hero.equipment.firstHand,
        hero.equipment.gloves,
        hero.equipment.helmet,
        hero.equipment.neckles,
        hero.equipment.ring1,
        hero.equipment.ring2,
        hero.equipment.secondHand,
        hero.equipment.shoes,
        hero.equipment.trousers
    ];
    itemsOn.forEach(e => {
        if (e !== null) {
            const element = hero.equipment.knownItems.find(f => f.itemID === e);
            if (element !== undefined) {
                ActiveItems.push(element);
            }
        }
    });
    const attr = [...hero.attributes];
    let attMin = 0;
    let attMax = 0;
    let armour = 0;
    ActiveItems.forEach(e => {
        for (let i = 0; i < 8; i++) {
            attr[i] += e.attributes[i];
        }
        attMin += e.dmgMin;
        attMax += e.dmgMax;
        armour += e.armour;
    });
    return {
        Armour: armour,
        AttackMax: attMax,
        AttackMin: attMin,
        Attributes: attr,
    }
}

// ------ vector functions

export class Vector {
    public static Add(a: Vector, b: Vector): Vector {
        return new Vector(a.x + b.x, a.y + b.y);
    }

    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.Norm = this.Norm.bind(this);
        this.Versor = this.Versor.bind(this);

        this.x = x;
        this.y = y;
    }

    public Versor(): Vector {
        return new Vector(this.x / this.Norm(), this.y / this.Norm());
    }
    public Norm(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    public Angle(): number {
        return Math.atan2(this.y, this.x);
    }

}

export function VectorInGlobal(angle: number, localV: Vector): Vector {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Vector(c * localV.x - s * localV.y, s * localV.x + c * localV.y);
}

export function ChildNodeRange(count: number, betweenangle: number, radius: number): Vector[] {
    // TODO when not enought 360 deg
    // if (Number.isInteger(count)) {
    //    throw Error("noninteger value!");
    // }
    const arr = Array(count).fill(new Vector(radius, 0));
    return arr.map((a, i) => VectorInGlobal(betweenangle * (i - (count - 1) / 2), a));
}


// ------- travel functions
export function TravelTime(distance: number, mapscale: number, velocity = 18) {
    return (distance * mapscale / velocity / 100 * 3.6);
}
export function TravelTimeToString(seconds: number) {
    seconds = Math.ceil(seconds);
    if (seconds <= 0) {
        return "0s";
    }
    const table = [60, 60, 24];
    const ext = ["s", "m", "h"];
    let left = seconds;
    const res: string[] = [];
    for (let i = 0; i < 4; i++) {
        if (left === 0) {
            break;
        }
        res.push((left - table[i] * Math.floor(left / table[i])) + ext[i]);
        left = Math.floor(left / table[i]);
    }
    if (left > 0) {
        res.push(left + "d");
    }
    return res.reverse().join(" ");
}

// ------- equipment functions

export function CompererItems(item: IItemResult, Equipment: IEquipmentResult, isOn: boolean) {
    if (isOn) {
        return {
            wearing: [],
        }
    } else {
        const schema = AcceptItemSchema(Equipment);
        const items: Array<{ item: IItemResult | null, name: string, background: string, num:number }> = [];
        schema.forEach(e => {
            if (e.acceptType.findIndex(f => f === item.itemType) !== -1) {
                if (e.item !== null) {
                    const element = Equipment.knownItems.find(f => f.itemID === e.item);
                    if (element === undefined) {
                        throw Error("Not passing SQL data correctly!!!");
                    }
                    items.push({ item: element, name: e.name, background: e.background, num: e.num });
                } else {
                    items.push({ item: null, name: e.name, background: e.background, num: e.num });
                }
            }
        });
        return ({
            wearing: items,
        });
    }
}

export function AcceptItemSchema(Equipment: IEquipmentResult) {
    return ([
        {
            acceptType: [ItemTypes.HELMET],
            background: String(require("../img/Game/EQ/helmet.svg")),
            item: Equipment.helmet,
            name: "Helmet",
            num: 0,
        } as IInventorySlot,
        {
            acceptType: [ItemTypes.RING],
            background: String(require("../img/Game/EQ/rings.svg")),
            item: Equipment.ring1,
            name: "Ring1",
            num: 1,
        } as IInventorySlot,
        {
            acceptType: [ItemTypes.NECKLES],
            background: String(require("../img/Game/EQ/necklace.svg")),
            item: Equipment.neckles,
            name: "Neckles",
            num: 2,
        } as IInventorySlot,
        {
            acceptType: [ItemTypes.RING],
            background: String(require("../img/Game/EQ/rings.svg")),
            item: Equipment.ring2,
            name: "Ring2",
            num: 3,
        } as IInventorySlot,
        {
            acceptType: [ItemTypes.GLOVES],
            background: String(require("../img/Game/EQ/gloves.svg")),
            item: Equipment.gloves,
            name: "Gloves",
            num: 4,
        } as IInventorySlot,
        {
            acceptType: [ItemTypes.ARMOUR],
            background: String(require("../img/Game/EQ/armour.svg")),
            item: Equipment.armour,
            name: "Armour",
            num: 5,
        } as IInventorySlot,
        {
            acceptType: [ItemTypes.BRACELET],
            background: String(require("../img/Game/EQ/bracelet.svg")),
            item: Equipment.bracelet,
            name: "Bracelet",
            num: 6,
        } as IInventorySlot,
        {
            acceptType: [ItemTypes.SINGLEHAND_WEAPON, ItemTypes.DOUBLEHAND_WEAPON, ItemTypes.SECONDARY_WEAPON],
            background: String(require("../img/Game/EQ/weapon2.png")),
            item: Equipment.firstHand,
            name: "FirstHand",
            num: 7,
        } as IInventorySlot,
        {
            acceptType: [ItemTypes.TROUSERS],
            background: String(require("../img/Game/EQ/trousers.svg")),
            item: Equipment.trousers,
            name: "Trousers",
            num: 8,
        } as IInventorySlot,
        {
            acceptType: [ItemTypes.SHIELD, ItemTypes.SECONDARY_WEAPON],
            background: String(require("../img/Game/EQ/shield.svg")),
            item: Equipment.secondHand,
            name: "SecondHand",
            num: 9,
        } as IInventorySlot,
        {
            acceptType: [ItemTypes.SHOES],
            background: String(require("../img/Game/EQ/shoe.svg")),
            item: Equipment.shoes,
            name: "Shoes",
            num: 10,
        } as IInventorySlot,
    ]);
}
export interface IInventorySlot {
    num: number;
    name: string;
    background: string;
    acceptType: ItemTypes[];
    item: number | null;
}