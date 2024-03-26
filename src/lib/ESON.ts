/**
 * An intrinsic object that provides functions to convert JavaScript values to and from the Easy JSON (ESON) format.
 */
var ESON = {
	/**
	 * Converts a Easy JSON (ESON) string into an object.
	 * @param {string} text A valid ESON string.
	 * @returns {any}
	 */
	parse: (text) => parser.parse(text),
	/**
	 * Converts a JavaScript value into a Easy JSON (ESON) string.
	 * @param {any} value A JavaScript value, usually an object or array, to be converted.
	 * @returns {string}
	 */
	stringify: (value) => parser.stringify(value),
	/**
	 * Converts string that contains only Number into Number.
	 * @param {Object} value
	 * @returns {Object}
	 */
	strNumToNum: (value) => parser.strnumToNum(value),
};

// module.exports = ESON;
export default ESON;

const parser = {
	getchildren: function (eson = "") {
		eson = eson.trimStart();
		let obj = {};
		while (true) {
			if (eson.startsWith("}") || eson.startsWith("]")) {
				eson = eson.substring(1).trimStart();
				if (eson.startsWith(",")) {
					eson = eson.substring(1).trimStart();
				}
				return [obj, eson];
			}
			if (eson.startsWith("[")) {
				//array
				let array = [];
				eson = eson.substring(1);
				while (true) {
					eson = eson.trimStart();
					if (eson.startsWith("]")) {
						//stop
						eson = eson.substring(1).trimStart();
						if (eson.startsWith(",")) {
							eson = eson.substring(1).trimStart();
						}
						return [array, eson];
					}
					const commapos = eson.indexOf(",");
					if (commapos == -1 || commapos > eson.indexOf("]")) {
						const tempEson = eson.substring(0, eson.indexOf("]")) + ",";
						eson = tempEson + eson.substring(eson.indexOf("]"));
					}
					if (eson.startsWith("'")) {
						eson = eson.substring(1);
						const value = eson
							.substring(0, eson.indexOf("'"))
							.replace(/\^\^\^\^\^\[QUOTE\]\^\^\^\^\^/g, "'");
						eson = eson.substring(eson.indexOf("'") + 1);
						array.push(value);
					} else if (eson.startsWith("{")) {
						eson = eson.substring(1);
						const tempEson = this.getchildren(eson);
						eson = tempEson[1];
						array.push(tempEson[0]);
					} else if (eson.startsWith("[")) {
						eson = eson.substring(1);
						const tempEson = this.getchildren(eson);
						eson = tempEson[1];
						array.push(tempEson[0]);
					} else {
						const value = eson
							.substring(0, eson.indexOf(","))
							.trimEnd()
							.replace(/\^\^\^\^\^\[QUOTE\]\^\^\^\^\^/g, "'");
						eson = eson.substring(eson.indexOf(",") + 1);
						array.push(value);
					}
				}
			}
			if (!eson.includes("=")) {
				throw new Error("Invalid ESON format.");
			}
			const currentObjName = eson.substring(0, eson.indexOf("=")).trimEnd();
			eson = eson.substring(eson.indexOf("=") + 1).trimStart();
			const commapos = eson.indexOf(",");
			if (commapos == -1) {
				const tempEson = eson.substring(0, eson.indexOf("}")) + ",";
				eson = tempEson + eson.substring(eson.indexOf("}"));
			}
			if (eson.indexOf("}") < commapos) {
				const tempEson = eson.substring(0, eson.indexOf("}")) + ",";
				eson = tempEson + eson.substring(eson.indexOf("}"));
			}
			if (eson.startsWith("'")) {
				eson = eson.substring(1);
				const value = eson
					.substring(0, eson.indexOf("'"))
					.replace(/\^\^\^\^\^\[QUOTE\]\^\^\^\^\^/g, "'");
				eson = eson.substring(eson.indexOf("'") + 1).trimStart();
				if (eson.startsWith(",")) {
					eson = eson.substring(1).trimStart();
				}
				Object.assign(obj, { [currentObjName]: value });
			} else if (eson.startsWith("{")) {
				eson = eson.substring(1);
				const tempEson = this.getchildren(eson);
				eson = tempEson[1];
				Object.assign(obj, { [currentObjName]: tempEson[0] });
			} else if (eson.startsWith("[")) {
				//array
				const tempEson = this.getchildren(eson);
				eson = tempEson[1];
				Object.assign(obj, { [currentObjName]: tempEson[0] });
			} else {
				const value = eson
					.substring(0, eson.indexOf(","))
					.trimEnd()
					.replace(/\^\^\^\^\^\[QUOTE\]\^\^\^\^\^/g, "'");
				eson = eson.substring(eson.indexOf(",") + 1).trimStart();
				Object.assign(obj, { [currentObjName]: value });
			}
		}
	},
	parse: function (eson = "") {
		const date = Date.now();
		let tryCount = 0;
		let obj = {};
		//anti '
		eson = eson.replace(/\\'/g, "^^^^^[QUOTE]^^^^^");
		while (true) {
			tryCount++;
			if (tryCount > 10) {
				throw "Unknown Error while parsing ESON.";
			}
			eson = eson.trimStart();
			if (eson.startsWith("}")) {
				eson = eson.substring(1).trimStart();
				if (eson.startsWith(",")) {
					eson = eson.substring(1).trimStart();
				}
			}
			if (!eson.includes("=")) {
				break;
			}
			if (eson.startsWith("{")) {
				eson = eson.substring(1).trimStart();
				const getChild = this.getchildren(eson);
				Object.assign(obj, getChild[0]);
				eson = getChild[1];
			} else {
				const currentObjName = eson.substring(0, eson.indexOf("="));
				eson = eson.substring(eson.indexOf("=") + 1).trimStart();
				const commapos = eson.indexOf(",");
				if (commapos > eson.indexOf("}") || commapos == -1) {
					const tempEson = eson.substring(0, eson.indexOf("}")) + ",";
					eson = tempEson + eson.substring(eson.indexOf("}")).trimStart();
				}
				if (eson.startsWith("{")) {
					eson = eson.substring(1);
					const tempEson = this.getchildren(eson);
					eson = tempEson[1];
					Object.assign(obj, { [currentObjName]: tempEson[0] });
					continue;
				}
				const value = eson.substring(0, eson.indexOf(",")).trimEnd();
				eson = eson.substring(eson.indexOf(",") + 1).trimStart();
				Object.assign(obj, { [currentObjName]: value });
			}
		}
		return obj;
	},
	strnumToNum: function (obj = {}) {
		Object.entries(obj).forEach((entry) => {
			if (entry[1] instanceof Array) {
				obj[entry[0]] = this.strnumToNum(entry[1]);
			} else if (entry[1] instanceof Object) {
				obj[entry[0]] = this.strnumToNum(entry[1]);
			} else if (typeof entry[1] == "string") {
				const numbered = Number(entry[1]);
				if (isNaN(numbered)) {
					return;
				} else {
					obj[entry[0]] = numbered;
				}
			} else {
				throw "Invalid entry type. entry:" + typeof entry[1];
			}
		});
		return obj;
	},
	stringify: function (obj = {}) {
		let stringified = JSON.stringify(obj).replace(/'/g, "\\'");
		let separated = stringified.split('"');
		let currentPosition = 0;
		// return stringified.replace(/(\":)/g, '=').replace(/\"/g, '');
		let count = 0;
		while (true) {
			count++;
			if (separated.length < 2) {
				break;
			}
			let type = 0;
			const processing = separated.splice(0, 2);
			if (processing[1].includes(" ") || processing[1].includes(",")) {
				const colonchecker = stringified
					.substring(
						stringified.indexOf(processing[1], currentPosition) +
						2 +
						processing[1].length
					)
					.substring(0, 5);
				if (colonchecker.startsWith(":")) {
					//this is objectname
					const searchStr = `"${processing[1]}":`;
					const index = stringified.indexOf(searchStr, currentPosition);

					// stringified =
					//   stringified.substring(0, index + searchStr.length + 1) +
					//   stringified.substring(index + searchStr.length + 1);
					// currentPosition += index + searchStr.length + 1;
					stringified = stringified.replace(
						`"${processing[1]}":`,
						`'${processing[1]}^^^^^'=`
					);
				} else {
					const searchStr = `"${processing[1]}":`;
					const index = stringified.indexOf(searchStr, currentPosition);

					// stringified =
					//   stringified.substring(0, index + searchStr.length + 1) +
					//   stringified.substring(index + searchStr.length + 1);
					// currentPosition += index + searchStr.length + 1;
					stringified = stringified.replace(
						`"${processing[1]}"`,
						`'${processing[1]}^^^^^'`
					);
				}
				type = 1;
			} else {
				const colonchecker = stringified
					.substring(
						stringified.indexOf(`"${processing[1]}"`, currentPosition) +
						2 +
						processing[1].length
					)
					.substring(0, 5);
				if (colonchecker.startsWith(":")) {
					//this is objectname
					stringified = stringified.replace(
						`"${processing[1]}":`,
						`${processing[1]}^^^^^=`
					);
				} else {
					stringified = stringified.replace(
						`"${processing[1]}"`,
						processing[1] + "^^^^^"
					);
				}
				type = 2;
			}
		}
		return stringified.replace(/\^\^\^\^\^/g, "");
	},
};
