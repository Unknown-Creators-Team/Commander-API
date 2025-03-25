/**
 * DatabaseMC
 * @license MIT
 * @author @Nano191225
 * @version 1.2.0
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
import { world } from "@minecraft/server";
/**
 * Abstract class representing a Database.
 *
 * @template K - The type of the keys in the database. Must be a string, number, or symbol.
 * @template V - The type of the values in the database.
 *
 * @implements {Map<K, V>}
 */
class Database {
    ALLOWED_CHARACTERS = /[^0-9a-zA-Z!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~ ]/;
    name;
    rawName;
    meta;
    metaKeys;
    /**
     * Creates an instance of the DatabaseMC class.
     *
     * @param name - The name of the database. Must be a string containing only alphanumeric characters and underscores, and must be 11 characters or less.
     *
     * @throws {TypeError} If the name is not a string.
     * @throws {TypeError} If the name contains invalid characters.
     * @throws {RangeError} If the name is longer than 11 characters (a warning is logged).
     */
    constructor(name) {
        if (typeof name !== "string")
            throw new TypeError("Database name must be a string");
        if (name.search(this.ALLOWED_CHARACTERS) !== -1)
            throw new TypeError("Database name must only contain alphanumeric characters and underscores");
        if (name.length > 11)
            console.warn(new RangeError("Database name must be 11 characters or less"));
        this.rawName = name;
        this.name = name.slice(0, 11) + "_dbMC";
        this.getMeta();
    }
    /**
     * Asynchronously sets a key-value pair in the database.
     * @param key - The key to set in the database
     * @param value - The value to associate with the key
     * @returns A Promise that resolves to the database instance (this) when the operation completes
     * @throws Will reject the promise if the set operation fails
     */
    setAsync(key, value) {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.set(key, value));
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Asynchronously retrieves the value associated with the specified key.
     * @param key - The key to retrieve
     * @returns A Promise that resolves to the value associated with the key, or `undefined` if the key does not exist
     * @throws Will reject the promise if the get operation fails
     */
    getAsync(key) {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.get(key));
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Asynchronously checks if a key exists in the database.
     * @param key - The key to check for existence
     * @returns A Promise that resolves to `true` if the key exists in the database, `false` otherwise
     * @throws Will reject the promise if the has operation fails
     */
    hasAsync(key) {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.has(key));
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Asynchronously deletes a key from the database.
     * @param key - The key to delete
     * @returns A Promise that resolves to `true` if the key was successfully deleted, `false` otherwise
     * @throws Will reject the promise if the delete operation fails
     */
    deleteAsync(key) {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.delete(key));
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Asynchronously removes all key-value pairs from the database.
     * @returns A Promise that resolves when the operation completes
     * @throws Will reject the promise if the clear operation fails
     */
    clearAsync() {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.clear());
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Returns an iterator over all keys in the map.
     * @returns {IterableIterator<K>} An iterator that yields all keys in the map.
     */
    keys() {
        const keys = Object.keys(this.meta.keys);
        return keys[Symbol.iterator]();
    }
    /**
     * Returns an iterator over all values in the map.
     * @returns {IterableIterator<V>} An iterator that yields all values in the map.
     */
    values() {
        const values = [];
        for (const key of this.keys()) {
            values.push(this.get(key));
        }
        return values[Symbol.iterator]();
    }
    /**
     * Returns an iterator over all entries in the map.
     * @returns {IterableIterator<[K, V]>} An iterator that yields all entries in the map.
     */
    entries() {
        const entries = [];
        for (const key of this.keys()) {
            entries.push([key, this.get(key)]);
        }
        return entries[Symbol.iterator]();
    }
    /**
     * Executes a provided function once for each key-value pair in the map.
     * @param callbackfn - A function that accepts up to three arguments. The `forEach` method calls the callbackfn function one time for each key-value pair in the map.
     * @param thisArg - An object to which `this` can refer in the callbackfn function. If `thisArg` is omitted, `undefined` is used as the `this` value.
     */
    forEach(callbackfn, thisArg) {
        for (const key of this.keys()) {
            callbackfn.call(thisArg, this.get(key), key, this);
        }
    }
    /**
     * Returns the number of key-value pairs in the map.
     * @returns The number of key-value pairs in the map.
     */
    get size() {
        return Object.keys(this.meta.keys).length;
    }
    /**
     * Removes all key-value pairs from the map.
     */
    [Symbol.iterator]() {
        return this.entries();
    }
    /**
     * Returns a string representation of the object.
     * @returns The string representation of the object.
     */
    get [Symbol.toStringTag]() {
        return "DatabaseMC";
    }
    /**
     * Checks if the key is valid.
     * @param key - The key to check
     */
    keyCheck(key) {
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
    getMeta() {
        try {
            this.meta = JSON.parse(world.getDynamicProperty(this.name)) || {
                id: this.name,
                name: this.rawName,
                keys: 0,
            };
            let chunks = [];
            for (let i = 0; i < this.meta.keys; i++) {
                chunks.push(world.getDynamicProperty(`${this.name}[${i}]`));
            }
            this.metaKeys = JSON.parse(chunks.join(""));
        }
        catch {
            this.meta = {
                id: this.name,
                name: this.rawName,
                keys: 0,
            };
            this.metaKeys = {};
        }
    }
    /**
     * Sets metadata for the current database instance by converting it to a JSON string and storing it as a dynamic property.
     * The metadata is stored using the database name as the property key.
     * @returns void
     */
    setMeta() {
        const str = JSON.stringify(this.meta);
        const chunks = str.match(/.{1,30000}/g) ?? [];
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
    updateMeta() {
        this.setMeta();
        this.getMeta();
    }
}
export class ScoreboardDatabase extends Database {
    MAX_KEY_LENGTH = 512;
    MAX_VALUE_LENGTH = 32768;
    MAX_KEYS_LENGTH = 32768;
    getObject() {
        const object = world.scoreboard.getObjective(this.meta.id);
        if (object)
            return object;
        world.scoreboard.addObjective(this.meta.id, this.meta.name);
        return this.getObject();
    }
    set(key, value) {
        this.keyCheck(key);
        const string = JSON.stringify(value);
        if (string.length > this.MAX_VALUE_LENGTH)
            throw new RangeError(`Value length must be ${this.MAX_VALUE_LENGTH} characters or less`);
        this.delete(key);
        this.metaKeys[key] = string.length;
        this.updateMeta();
        this.getObject().setScore(key + "§;" + string, 0);
        return this;
    }
    get(key) {
        this.keyCheck(key);
        const value = this.getObject()
            .getParticipants()
            .find((participant) => participant.displayName.startsWith(key + "§;"));
        if (!value)
            return undefined;
        return JSON.parse(value.displayName.split("§;").slice(1).join("§;"));
    }
    has(key) {
        this.keyCheck(key);
        return this.getObject()
            .getParticipants()
            .some((participant) => participant.displayName.startsWith(key + "§;"));
    }
    delete(key) {
        this.keyCheck(key);
        if (!this.has(key))
            return false;
        const object = this.getObject();
        const participant = object.getParticipants().find((participant) => participant.displayName.startsWith(key + "§;"));
        if (!participant)
            return false;
        object.removeParticipant(participant);
        delete this.metaKeys[key];
        this.updateMeta();
        return true;
    }
    clear() {
        world.scoreboard.removeObjective(this.meta.id);
        this.metaKeys = {};
        this.updateMeta();
    }
}
export class WorldPropertyDatabase extends Database {
    MAX_KEY_LENGTH = 512;
    MAX_VALUE_LENGTH = 32768;
    MAX_KEYS_LENGTH = 32768;
    set(key, value) {
        this.keyCheck(key);
        const string = JSON.stringify(value);
        if (string.length > this.MAX_VALUE_LENGTH)
            throw new RangeError(`Value length must be ${this.MAX_VALUE_LENGTH} characters or less`);
        this.metaKeys[key] = string.length;
        this.updateMeta();
        world.setDynamicProperty(this.meta.id + "@" + key, string);
        return this;
    }
    get(key) {
        this.keyCheck(key);
        const value = world.getDynamicProperty(this.meta.id + "@" + key);
        if (!value)
            return undefined;
        return JSON.parse(value);
    }
    has(key) {
        this.keyCheck(key);
        return world.getDynamicProperty(this.meta.id + "@" + key) !== undefined;
    }
    delete(key) {
        this.keyCheck(key);
        if (!this.has(key))
            return false;
        world.setDynamicProperty(this.meta.id + "@" + key, undefined);
        delete this.metaKeys[key];
        this.updateMeta();
        return true;
    }
    clear() {
        for (const key of this.keys()) {
            world.setDynamicProperty(this.meta.id + "@" + key, undefined);
        }
        this.metaKeys = {};
        this.updateMeta();
    }
}
//# sourceMappingURL=DatabaseMC.js.map