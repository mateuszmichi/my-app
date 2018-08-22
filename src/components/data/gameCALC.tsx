export function ExpToLevel(level: number): number {
    if (level <= 10) {
        return 10 * (level * level - level);
    }
    else {
        return 25 * level * (level - 13 * level) + 1650;
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

export function TravelTime(distance: number, mapscale:number, velocity = 18) {
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

