/**
 * DatabaseMC
 * @license MIT
 * @author @Nano191225
 * @version 1.2.2
 * Supported Minecraft Version
 * @version 1.21.70
 * @description DatabaseMC is a database that can be used in Minecraft Script API.
 * --------------------------------------------------------------------------
 * These databases are available in the Script API of the integrated version
 * of Minecraft. They inherit from Map Class. Database names are limited to
 * a maximum of 11 characters. (If the name exceeds 11 characters, it will
 * be automatically truncated.)
 * --------------------------------------------------------------------------
 */

import { ScoreboardObjective, world } from "@minecraft/server";

interface Meta {
    id: string;
    name: string;
    keys: number;
}

type MetaKeys<K extends string | number | symbol> = Record<K, number>;

/**
 * Abstract class representing a Database.
 *
 * @template K - The type of the keys in the database. Must be a string, number, or symbol.
 * @template V - The type of the values in the database.
 *
 * @implements {Map<K, V>}
 */
abstract class Database<K extends string | number | symbol, V> implements Map<K, V> {
    protected abstract readonly MAX_KEY_LENGTH: number;
    protected abstract readonly MAX_VALUE_LENGTH: number;
    protected abstract readonly MAX_KEYS_LENGTH: number;
    protected readonly ALLOWED_CHARACTERS: RegExp = /[^0-9a-zA-Z!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~ ]/;
    protected name!: string;
    protected rawName!: string;
    protected meta!: Meta;
    protected metaKeys!: MetaKeys<K>;

    /**
     * Creates an instance of the DatabaseMC class.
     *
     * @param name - The name of the database. Must be a string containing only alphanumeric characters and underscores, and must be 11 characters or less.
     *
     * @throws {TypeError} If the name is not a string.
     * @throws {TypeError} If the name contains invalid characters.
     * @throws {RangeError} If the name is longer than 11 characters (a warning is logged).
     */
    constructor(name: string) {
        if (typeof name !== "string") throw new TypeError("Database name must be a string");
        if (name.search(this.ALLOWED_CHARACTERS) !== -1) throw new TypeError("Database name must only contain alphanumeric characters and underscores");
        if (name.length > 11) console.warn(new RangeError("Database name must be 11 characters or less"));

        this.rawName = name;
        this.name = name.slice(0, 11) + "_dbMC";

        this.getMeta();
    }

    /**
     * Sets a value for a specific key in the database.
     *
     * @param key - The key to set. Must be a string, number, or symbol containing only alphanumeric characters and underscores.
     * @param value - The value to associate with the key.
     * @returns This database instance for method chaining.
     *
     * @throws {TypeError} If the key is not a string, number, or symbol.
     * @throws {TypeError} If the key contains invalid characters.
     * @throws {RangeError} If the key exceeds maximum length.
     *
     * @example
     * ```typescript
     * db.set("user_1", { name: "John", age: 30 });
     * ```
     */
    public abstract set(key: K, value: V): this;

    /**
     * Asynchronously sets a key-value pair in the database.
     * @param key - The key to set in the database
     * @param value - The value to associate with the key
     * @returns A Promise that resolves to the database instance (this) when the operation completes
     * @throws Will reject the promise if the set operation fails
     */
    public setAsync(key: K, value: V): Promise<this> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.set(key, value));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Retrieves the value associated with the specified key.
     *
     * @param key - The key to retrieve. Must be a string, number, or symbol containing only alphanumeric characters and underscores.
     * @returns The value associated with the key, or `undefined` if the key does not exist.
     *
     * @throws {TypeError} If the key is not a string, number, or symbol.
     * @throws {TypeError} If the key contains invalid characters.
     * @throws {RangeError} If the key exceeds maximum length.
     *
     * @example
     * ```typescript
     * const user = db.get("user_1");
     * console.log(user); // { name: "John", age: 30 }
     * ```
     */
    public abstract get(key: K): V | undefined;

    /**
     * Asynchronously retrieves the value associated with the specified key.
     * @param key - The key to retrieve
     * @returns A Promise that resolves to the value associated with the key, or `undefined` if the key does not exist
     * @throws Will reject the promise if the get operation fails
     */
    public getAsync(key: K): Promise<V | undefined> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.get(key));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Checks if a key exists in the database.
     *
     * @param key - The key to check for existence. Must be a string, number, or symbol containing only alphanumeric characters and underscores.
     * @returns `true` if the key exists in the database, `false` otherwise.
     *
     * @throws {TypeError} If the key is not a string, number, or symbol.
     * @throws {TypeError} If the key contains invalid characters.
     * @throws {RangeError} If the key exceeds maximum length.
     *
     * @example
     * ```typescript
     * if (db.has("user_1")) {
     *     console.log("User 1 exists");
     * }
     * ```
     */
    public abstract has(key: K): boolean;

    /**
     * Asynchronously checks if a key exists in the database.
     * @param key - The key to check for existence
     * @returns A Promise that resolves to `true` if the key exists in the database, `false` otherwise
     * @throws Will reject the promise if the has operation fails
     */
    public hasAsync(key: K): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.has(key));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Deletes a key from the database.
     *
     * @param key - The key to delete. Must be a string, number, or symbol containing only alphanumeric characters and underscores.
     * @returns `true` if the key was successfully deleted, `false` otherwise.
     *
     * @throws {TypeError} If the key is not a string, number, or symbol.
     * @throws {TypeError} If the key contains invalid characters.
     * @throws {RangeError} If the key exceeds maximum length.
     *
     * @example
     * ```typescript
     * db.delete("user_1");
     * ```
     */
    public abstract delete(key: K): boolean;

    /**
     * Asynchronously deletes a key from the database.
     * @param key - The key to delete
     * @returns A Promise that resolves to `true` if the key was successfully deleted, `false` otherwise
     * @throws Will reject the promise if the delete operation fails
     */
    public deleteAsync(key: K): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.delete(key));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Removes all key-value pairs from the database.
     */
    public abstract clear(): void;

    /**
     * Asynchronously removes all key-value pairs from the database.
     * @returns A Promise that resolves when the operation completes
     * @throws Will reject the promise if the clear operation fails
     */
    public clearAsync(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.clear());
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Returns an iterator over all keys in the map.
     * @returns {IterableIterator<K>} An iterator that yields all keys in the map.
     */
    public keys(): IterableIterator<K> {
        const keys = Object.keys(this.metaKeys);
        return keys[Symbol.iterator]() as IterableIterator<K>;
    }

    /**
     * Returns an iterator over all values in the map.
     * @returns {IterableIterator<V>} An iterator that yields all values in the map.
     */
    public values(): IterableIterator<V> {
        const values: V[] = [];
        for (const key of this.keys()) {
            values.push(this.get(key) as V);
        }
        return values[Symbol.iterator]();
    }

    /**
     * Returns an iterator over all entries in the map.
     * @returns {IterableIterator<[K, V]>} An iterator that yields all entries in the map.
     */
    public entries(): IterableIterator<[K, V]> {
        const entries: [K, V][] = [];
        for (const key of this.keys()) {
            entries.push([key, this.get(key) as V]);
        }
        return entries[Symbol.iterator]();
    }

    /**
     * Executes a provided function once for each key-value pair in the map.
     * @param callbackfn - A function that accepts up to three arguments. The `forEach` method calls the callbackfn function one time for each key-value pair in the map.
     * @param thisArg - An object to which `this` can refer in the callbackfn function. If `thisArg` is omitted, `undefined` is used as the `this` value.
     */
    public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
        for (const key of this.keys()) {
            callbackfn.call(thisArg, this.get(key) as V, key, this);
        }
    }

    /**
     * Returns the number of key-value pairs in the map.
     * @returns The number of key-value pairs in the map.
     */
    public get size(): number {
        return Object.keys(this.metaKeys).length;
    }

    /**
     * Removes all key-value pairs from the map.
     */
    public [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.entries();
    }

    /**
     * Returns a string representation of the object.
     * @returns The string representation of the object.
     */
    public get [Symbol.toStringTag](): string {
        return "DatabaseMC";
    }

    /**
     * Checks if the key is valid.
     * @param key - The key to check
     */
    protected keyCheck(key: K): void {
        if (typeof key !== "string" && typeof key !== "number" && typeof key !== "symbol")
            throw new TypeError("Key must be a string, number, or symbol");
        if (typeof key === "string" && key.length > this.MAX_KEY_LENGTH)
            throw new RangeError(`Key length must be ${this.MAX_KEY_LENGTH} characters or less`);
        if (typeof key === "string" && key.search(this.ALLOWED_CHARACTERS) !== -1)
            throw new TypeError("Key must only contain alphanumeric characters and underscores");
    }

    /**
     * Retrieves the metadata for the current database instance.
     */
    protected getMeta(): void {
        try {
            this.meta = JSON.parse(world.getDynamicProperty(this.name) as string) || {
                id: this.name,
                name: this.rawName,
                keys: 0,
            };
            let chunks: string[] = [];
            for (let i = 0; i < this.meta.keys; i++) {
                chunks.push(world.getDynamicProperty(`${this.name}[${i}]`) as string);
            }
            this.metaKeys = JSON.parse(chunks.join(""));
        } catch {
            this.meta = {
                id: this.name,
                name: this.rawName,
                keys: 0,
            };
            this.metaKeys = {} as Record<K, number>;
        }
    }

    /**
     * Sets metadata for the current database instance by converting it to a JSON string and storing it as a dynamic property.
     * The metadata is stored using the database name as the property key.
     * @returns void
     */
    protected setMeta(): void {
        const str = JSON.stringify(this.metaKeys);
        const chunks: string[] = str.match(/.{1,30000}/g) ?? [];

        for (let i = 0; i < chunks.length; i++) {
            world.setDynamicProperty(`${this.name}[${i}]`, chunks[i]);
        }

        this.meta.keys = chunks.length;
        world.setDynamicProperty(this.name, JSON.stringify(this.meta));
    }

    /**
     * Updates the metadata by setting and then retrieving it.
     * This method first calls `setMeta` to update the metadata,
     * and then calls `getMeta` to retrieve the updated metadata.
     *
     * @protected
     */
    protected updateMeta(): void {
        this.setMeta();
        this.getMeta();
    }

    /**
     * Removes metadata for the current database instance.
     * This method deletes the metadata and all associated keys.
     *
     * @protected
     */
    protected deleteMeta(): void {
        world.setDynamicProperty(this.name, undefined);
        for (let i = 0; i < this.meta.keys; i++) {
            world.setDynamicProperty(`${this.name}[${i}]`, undefined);
        }
    }
}

export class ScoreboardDatabase<K, V> extends Database<string, V> {
    protected readonly MAX_KEY_LENGTH: number = 512;
    protected readonly MAX_VALUE_LENGTH: number = 32768;
    protected readonly MAX_KEYS_LENGTH: number = 32768;

    private getObject(): ScoreboardObjective {
        const object = world.scoreboard.getObjective(this.meta.id);
        if (object) return object;
        world.scoreboard.addObjective(this.meta.id, this.meta.name);
        return this.getObject();
    }

    public set(key: string, value: V): this {
        this.keyCheck(key);

        const string = JSON.stringify(value);
        if (string.length > this.MAX_VALUE_LENGTH) throw new RangeError(`Value length must be ${this.MAX_VALUE_LENGTH} characters or less`);

        this.delete(key);

        this.metaKeys[key] = string.length;
        this.updateMeta();

        this.getObject().setScore(key + "§;" + string, 0);

        return this;
    }

    public get(key: string): V | undefined {
        this.keyCheck(key);

        const value = this.getObject()
            .getParticipants()
            .find((participant) => participant.displayName.startsWith(key + "§;"));
        if (!value) return undefined;

        return JSON.parse(value.displayName.split("§;").slice(1).join("§;"));
    }

    public has(key: string): boolean {
        this.keyCheck(key);
        return this.getObject()
            .getParticipants()
            .some((participant) => participant.displayName.startsWith(key + "§;"));
    }

    public delete(key: string): boolean {
        this.keyCheck(key);

        if (!this.has(key)) return false;

        const object = this.getObject();
        const participant = object.getParticipants().find((participant) => participant.displayName.startsWith(key + "§;"));
        if (!participant) return false;
        object.removeParticipant(participant);
        delete this.metaKeys[key];
        this.updateMeta();

        return true;
    }

    public clear(): void {
        world.scoreboard.removeObjective(this.meta.id);
        this.deleteMeta();
    }
}

export class WorldPropertyDatabase<K, V> extends Database<string, V> {
    protected readonly MAX_KEY_LENGTH: number = 512;
    protected readonly MAX_VALUE_LENGTH: number = 32768;
    protected readonly MAX_KEYS_LENGTH: number = 32768;

    public set(key: string, value: V): this {
        this.keyCheck(key);

        const string = JSON.stringify(value);
        if (string.length > this.MAX_VALUE_LENGTH) throw new RangeError(`Value length must be ${this.MAX_VALUE_LENGTH} characters or less`);

        this.metaKeys[key] = string.length;
        this.updateMeta();

        world.setDynamicProperty(this.getKey(key), string);

        return this;
    }

    public get(key: string): V | undefined {
        this.keyCheck(key);

        const value = world.getDynamicProperty(this.getKey(key)) as string;
        if (!value) return undefined;

        return JSON.parse(value);
    }

    public has(key: string): boolean {
        this.keyCheck(key);
        return world.getDynamicProperty(this.getKey(key)) !== undefined;
    }

    public delete(key: string): boolean {
        this.keyCheck(key);

        if (!this.has(key)) return false;

        world.setDynamicProperty(this.getKey(key), undefined);
        delete this.metaKeys[key];
        this.updateMeta();

        return true;
    }

    public clear(): void {
        for (const key of this.keys()) {
            world.setDynamicProperty(this.getKey(key), undefined);
        }
        this.deleteMeta();
    }

    private getKey(key: string): string {
        return this.meta.id + "@" + key;
    }
}
