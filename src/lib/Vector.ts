import { Vector3 } from "@minecraft/server";
import { FMath } from "./FastMath.js";


export default class Vector implements Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public toString(): string {
        return `${this.x} ${this.y} ${this.z}`;
    }

    public toArray(): number[] {
        return [this.x, this.y, this.z];
    }

    public toObject(): Vector3 {
        return { x: this.x, y: this.y, z: this.z };
    }

    public toFixed(fractionDigits: number): Vector {
        const fd = Math.min(Math.max(fractionDigits, 0), 100);
        return new Vector(
            parseFloat(this.x.toFixed(fd)),
            parseFloat(this.y.toFixed(fd)),
            parseFloat(this.z.toFixed(fd))
        );
    }

    public equals(v: Vector3): boolean {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }

    public add(v: Vector3): Vector {
        return Vector.add(this, v);
    }

    public subtract(v: Vector3): Vector {
        return Vector.subtract(this, v);
    }

    public normalize(): Vector {
        return Vector.normalize(this);
    }

    public multiply(v: Vector3): Vector {
        return Vector.multiply(this, v);
    }

    public divide(v: Vector3): Vector {
        return Vector.divide(this, v);
    }

    public distance(v: Vector3): number {
        return Vector.distance(this, v);
    }

    public cross(v: Vector3): Vector {
        return Vector.cross(this, v);
    }

    public floor(): Vector {
        return Vector.floor(this);
    }

    public ceil(): Vector {
        return Vector.ceil(this);
    }

    public round(): Vector {
        return Vector.round(this);
    }

    public static add(v1: Vector3, v2: Vector3): Vector {
        return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    public static subtract(v1: Vector3, v2: Vector3): Vector {
        return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    public static normalize(v: Vector3): Vector {
        const length = FMath.hypot(v.x, v.y, v.z);
        return new Vector(v.x / length, v.y / length, v.z / length);
    }

    public static multiply(v1: Vector3, v2: Vector3): Vector {
        return new Vector(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
    }

    public static divide(v1: Vector3, v2: Vector3): Vector {
        return new Vector(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
    }

    public static distance(v1: Vector3, v2: Vector3): number {
        return FMath.hypot(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    public static cross(v1: Vector3, v2: Vector3): Vector {
        return new Vector(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x
        );
    }

    public static fromArray(arr: number[]): Vector {
        return new Vector(arr[0], arr[1], arr[2]);
    }

    public static fromObject(obj: { x: number; y: number; z: number }): Vector {
        return new Vector(obj.x, obj.y, obj.z);
    }

    public static floor(v: Vector3): Vector {
        return new Vector(FMath.floor(v.x), FMath.floor(v.y), FMath.floor(v.z));
    }

    public static ceil(v: Vector3): Vector {
        return new Vector(FMath.ceil(v.x), FMath.ceil(v.y), FMath.ceil(v.z));
    }

    public static round(v: Vector3): Vector {
        return new Vector(FMath.round(v.x), FMath.round(v.y), FMath.round(v.z));
    }

    public static from(v: Vector3): Vector {
        return new Vector(v.x, v.y, v.z);
    }

    public static ZERO = new Vector(0, 0, 0);
    public static ONE = new Vector(1, 1, 1);
    public static UP = new Vector(0, 1, 0);
    public static DOWN = new Vector(0, -1, 0);
    public static LEFT = new Vector(-1, 0, 0);
    public static RIGHT = new Vector(1, 0, 0);
    public static FORWARD = new Vector(0, 0, 1);
    public static BACK = new Vector(0, 0, -1);
    public static X = new Vector(1, 0, 0);
    public static Y = new Vector(0, 1, 0);
    public static Z = new Vector(0, 0, 1);
    public static XY = new Vector(1, 1, 0);
    public static XZ = new Vector(1, 0, 1);
    public static YZ = new Vector(0, 1, 1);
}