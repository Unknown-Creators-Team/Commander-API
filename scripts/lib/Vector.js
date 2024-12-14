import { FMath } from "./FastMath.js";
export default class Vector {
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    toString() {
        return `${this.x} ${this.y} ${this.z}`;
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    toObject() {
        return { x: this.x, y: this.y, z: this.z };
    }
    toFixed(fractionDigits) {
        const fd = Math.min(Math.max(fractionDigits, 0), 100);
        return new Vector(parseFloat(this.x.toFixed(fd)), parseFloat(this.y.toFixed(fd)), parseFloat(this.z.toFixed(fd)));
    }
    equals(v) {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }
    add(v) {
        return Vector.add(this, v);
    }
    subtract(v) {
        return Vector.subtract(this, v);
    }
    normalize() {
        return Vector.normalize(this);
    }
    multiply(v) {
        return Vector.multiply(this, v);
    }
    divide(v) {
        return Vector.divide(this, v);
    }
    distance(v) {
        return Vector.distance(this, v);
    }
    cross(v) {
        return Vector.cross(this, v);
    }
    floor() {
        return Vector.floor(this);
    }
    ceil() {
        return Vector.ceil(this);
    }
    round() {
        return Vector.round(this);
    }
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    static subtract(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    static normalize(v) {
        const length = FMath.hypot(v.x, v.y, v.z);
        return new Vector(v.x / length, v.y / length, v.z / length);
    }
    static multiply(v1, v2) {
        return new Vector(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
    }
    static divide(v1, v2) {
        return new Vector(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
    }
    static distance(v1, v2) {
        return FMath.hypot(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    static cross(v1, v2) {
        return new Vector(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
    }
    static fromArray(arr) {
        return new Vector(arr[0], arr[1], arr[2]);
    }
    static fromObject(obj) {
        return new Vector(obj.x, obj.y, obj.z);
    }
    static floor(v) {
        return new Vector(FMath.floor(v.x), FMath.floor(v.y), FMath.floor(v.z));
    }
    static ceil(v) {
        return new Vector(FMath.ceil(v.x), FMath.ceil(v.y), FMath.ceil(v.z));
    }
    static round(v) {
        return new Vector(FMath.round(v.x), FMath.round(v.y), FMath.round(v.z));
    }
    static from(v) {
        return new Vector(v.x, v.y, v.z);
    }
    static ZERO = new Vector(0, 0, 0);
    static ONE = new Vector(1, 1, 1);
    static UP = new Vector(0, 1, 0);
    static DOWN = new Vector(0, -1, 0);
    static LEFT = new Vector(-1, 0, 0);
    static RIGHT = new Vector(1, 0, 0);
    static FORWARD = new Vector(0, 0, 1);
    static BACK = new Vector(0, 0, -1);
    static X = new Vector(1, 0, 0);
    static Y = new Vector(0, 1, 0);
    static Z = new Vector(0, 0, 1);
    static XY = new Vector(1, 1, 0);
    static XZ = new Vector(1, 0, 1);
    static YZ = new Vector(0, 1, 1);
}
