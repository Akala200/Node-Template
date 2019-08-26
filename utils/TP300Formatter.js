import clean from "clean-deep";
import moment from "moment";
import { gamelib, marketlib } from "./library";
import {
    printoutindex,
    bankFilter,
    directFilter,
    totalStakeFilter,
    mappingdetails,
    permFilter,
    defineresult
} from "./TP300UtilityBelt";

export const clock = () => {
    const gbengastpformat = moment().format("YY MM DD, HH:mm:ss");
    const tosintpfomrat = moment().format("MM");
    const gbenga = gbengastpformat
        .split(", ")
        .reduce((prev, current, index) => {
            const stringArr = current.split("");
            for (var i = 0; i < stringArr.length; i++) {
                if (stringArr[i] === " " || stringArr[i] === ":") {
                    console.log("");
                } else {
                    prev = prev + stringArr[i];
                }
            }
            return prev;
        }, "");

    return {
        gbenga,
        year: moment().format("YYYY"),
        month: moment().format("MM"),
        day: moment().format("DD"),
        hour: moment().format("HH"),
        minute: moment().format("mm"),
        second: moment().format("ss")
    };
};
/**
 *
 * @@function convert resposne data from cyprus server to json
 */
export const PlaceBetStringDataGen = data => {
    const ad = JSON.parse(data);
    let ArrData;
    // clean array
    ArrData = clean(ad);
    ArrData = ArrData.filter(({ type, string }, i, array) => {
        return type === "string" && string ? array[i] : null;
    });

    let ArrDataString = [];

    ArrData.forEach(({ string }, index) => {
        ArrDataString.push(string);
    });

    return ArrDataString;
};

/**
 *
 * @param {json data} data
 * @param {generate game library} body
 * @function   STAGE1 FORMATTING RESULT DATA
 */
export const PlaceBetFormat = async (data, body) => {
    const Game1Library = await gamelib(body);
    let gameTypeValue = 0;
    let permno = 0;
    let directnoo = 0;
    let banker = 0;
    let dateHandler;
    let currentValueIndex = [];
    const newFormat = data.reduce(
        (formatObject, currentValue, current_index) => {
            if (currentValue === "==============================") null;
            if (currentValue === "------------------------------") {
                permno++;
                directnoo++;
                banker++;
            }
            // checkk if it contains :
            if (currentValue.includes(":")) {
                const preFormat = currentValue.split(":");
                // special cases > Date #1, Direct
                if (currentValue.includes("Date")) {
                    formatObject["Date"] = `${preFormat[1]}:${preFormat[2]}:${
                        preFormat[3]
                    }`;

                    dateHandler = formatObject["Date"];
                }

                if (currentValue.includes("Direct")) {
                    currentValueIndex.push({
                        value: `${preFormat[0]}${preFormat[1]}`,
                        origin: current_index
                    });
                    formatObject[
                        `${preFormat[0]}${directnoo}`.trim()
                    ] = preFormat[1].split(" ")[1];
                }

                if (
                    currentValue.includes("Perm") ||
                    currentValue.includes("PERM")
                ) {
                    currentValueIndex.push({
                        value: `${preFormat[0]}${preFormat[1]}`,
                        origin: current_index
                    });
                    formatObject[`${preFormat[0]}${permno}`.trim()] =
                        preFormat[1];
                }

                if (currentValue.includes("Banker")) {
                    currentValueIndex.push({
                        value: `${preFormat[0]}${preFormat[1]}`,
                        origin: current_index
                    });
                    if (preFormat[3] && preFormat[2]) {
                        formatObject[`${preFormat[0]}${banker}`.trim()] = `${
                            preFormat[1]
                        }:${preFormat[2]}:${preFormat[3].split(" ")[0]}`;
                    } else if (preFormat[2] && !preFormat[3]) {
                        formatObject[`${preFormat[0]}${banker}`.trim()] = `${
                            preFormat[1]
                        }:${preFormat[2].split(" ")[0]}`;
                    } else {
                        formatObject[`${preFormat[0]}${banker}`.trim()] = `${
                            preFormat[1].split(" ")[1]
                        }`;
                    }
                }

                // special cases > includes #
                // if (currentValue.includes("#")) {
                //     formatObject[`${preFormat[0]}`.trim()] = preFormat[1];
                //     if (currentValue.includes("-")) {
                //         const preformatObject = { ...currentValue.split("-") };
                //         formatObject[`${preformatObject[0]}`.trim()] = `${
                //             preformatObject[0]
                //         }-${preformatObject[1]}`;
                //     }
                // }

                formatObject[`${preFormat[0]}`.trim()] = preFormat[1];
            }

            if (currentValue.includes("Lottery")) {
                formatObject["type"] = currentValue;
            }

            // for Game1
            if (Game1Library[currentValue]) {
                formatObject[`Game${gameTypeValue}`] = currentValue;
                gameTypeValue++;
            }

            return formatObject;
        },
        { result: "ok" }
    );

    newFormat["Date"] = dateHandler;
    return newFormat;
};

/**
 * @FUNCTION BARCODE EXTRACTOR
 */
export const barcodeExtractor = data => {
    const ad = JSON.parse(data);
    let ArrData;
    // clean array
    ArrData = clean(ad);
    ArrData = ArrData.filter(({ type, barcode }, i, array) => {
        return type === "barcode" && barcode ? array[i] : null;
    });

    return { barcode: ArrData[0].barcode };
};

/**
 * @function {*} generate result slip
 */
export const slipGenerator = dataObj => {
    const slipObject = {};
    const { result_desc, result_code, data } = dataObj;
    slipObject["result_code"] = result_code;
    slipObject["result_desc"] = result_desc;

    Object.keys(data).forEach((key_value, i) => {
        if (typeof data[key_value] == "object") {
            const slip = data[key_value];

            Object.keys(slip).forEach((key, i) => {
                slipObject[`betslip_${key}`] = slip[key];
            });
            return;
        }

        slipObject[`betslip_${key_value}`] = data[key_value];
    });

    return slipObject;
};

/**
 * @function  format results
 */
export const resultFormatter = async resultObj => {
    let theartofthespread = {};
    let total = 0;
    await Object.keys(resultObj).forEach(async (currentkeyvalue, i) => {
        const alteredData = await defineresult(
            currentkeyvalue,
            resultObj[currentkeyvalue]
        );

        total++;

        theartofthespread = {
            ...theartofthespread,
            ...alteredData
        };
    });
    return { total, ...theartofthespread };
};

/**
 * @function  SelectionArray + attavhes (+M)
 */
export const theFlaginator = async SelectionArray => {
    const newSelectionArr = [];
    SelectionArray.forEach(({ selection }, i, arr) => {
        const newObject = {
            ...arr[i],
            selection: `(+M)${selection}`
        };
        newSelectionArr.push(newObject);
    });
    return newSelectionArr;
};

export const payoutFormatter = data => {
    const { betslip } = data;
    const spreadDataObject = {};
    Object.keys(data).forEach(key => {
        spreadDataObject[key] = data[key];
        if (key === "betslip") null;
    });

    Object.keys(betslip).forEach(key => {
        spreadDataObject[`betslip_${key}`] = betslip[key];
    });

    return spreadDataObject;
};

export const nairabeef = data => {
    const returnData = {};
    Object.keys(data).forEach(key => {
        if (data[key] !== null)
            returnData[key] = data[key].replace("₦", "").trim();
    });
    return returnData;
};

/**
 * @function   generate games played data from selectuoin array and games library
 * @param {*} selectionArr
 * @param {*} body
 */

export const gpLibrary = async (selectionArr, body) => {
    const marketLibrary = await marketlib(body);
    // const plyedgamedlib =
    return selectionArr.reduce(
        (
            formatObject,
            { market, line_stake, total_stake, lines, selection },
            current_index
        ) => {
            // check if market exist in the market libarary
            // chgeck if market object has been created
            // inser into market object son
            const mlo = marketLibrary[market];
            if (mlo) {
                if (formatObject[`${mlo.name}`]) {
                    formatObject[`${mlo.name}`].push({
                        line_stake,
                        total_stake,
                        lines,
                        selection
                    });
                    return formatObject;
                }
                formatObject[`${mlo.name}`] = [];
                formatObject[`${mlo.name}`].push({
                    line_stake,
                    total_stake,
                    lines,
                    selection
                });
            }
            return formatObject;
        },
        {}
    );
    // reduce to an arr | object of line_stake + total_stake |^ panle price
};

// .join(`${columnLine}~`)
/**
 * @function  generate outpiut columns for placebets
 * @param {*} output
 * @param {*} {gpl, currentValueIndex}
 */
const outputcolumns = async (output, { gpl, flag }) => {
    // output is a string
    let columnoutpt = "";
    const arr = output.split("~");
    // filter || BANKER || PERM || DIRECT
    const df = directFilter(arr);
    const bf = bankFilter(arr);
    const pf = permFilter(arr);
    const ts = totalStakeFilter(arr);

    df
        ? (columnoutpt =
              columnoutpt + mappingdetails(df, "Direct", { gpl, flag }))
        : null;
    bf
        ? (columnoutpt =
              columnoutpt + mappingdetails(bf, "Banker", { gpl, flag }))
        : null;
    pf
        ? (columnoutpt =
              columnoutpt + mappingdetails(pf, "Perm", { gpl, flag }))
        : null;
    ts
        ? (columnoutpt =
              columnoutpt.substring(0, columnoutpt.length - 31) +
              mappingdetails(ts, "TotalStake", { gpl, flag }))
        : null;

    // RETURN IN ORDER || ADD ^ FOR EACH NEW COLUMN
    // ASYNC AWAIT CHANGES

    return columnoutpt.trim();
};

/**
 * @function   OutputCOLUMN STAGE 1
 * @param {*} data
 * @param {*} param1
 */

export const printOutput1 = async (data, { gpl, flag, closingLib }) => {
    let newObject = {};
    let output = "";
    Object.keys(data).forEach(key => {
        if (key.includes("Direct")) {
            const directKeyNumber = 8;
            const diff = key.length - directKeyNumber;
            if (key.includes("Direct")) {
                output += `${key.substring(0, key.length - diff)}: ${
                    data[key]
                } ~ `;
            } else {
                output += `${key}: ${data[key]} ~ `;
            }
        } else if (key.includes("Perm")) {
            const permKeyNumber = 6;
            const diff = key.length - permKeyNumber;
            output += `${key.substring(0, key.length - diff)}: ${
                data[key].split(" ")[0]
            } ~ `;
        } else if (key.includes("PERM")) {
            const permKeyNumber = 6;
            const diff = key.length - permKeyNumber;
            output += `${key.substring(0, key.length - diff)}: ${
                data[key].split(" ")[0]
            } ~ `;
        } else if (key.includes("Game")) {
            newObject["Draw"] = data[key];
            newObject["ClosingTime"] =
                moment().format("MMM Do YYYY") +
                " " +
                closingLib[`T${data[key]}`];
        } else if (key.includes("Banker")) {
            if (key.includes("Banker 1-All")) {
                const bankerKeyNumber = 12;
                const diff = key.length - bankerKeyNumber;
                output += `${key.substring(0, key.length - diff)}: ${
                    data[key]
                } ~ `;
            } else {
                const bankerKeyNumber = 6;
                const diff = key.length - bankerKeyNumber;
                output += `${key.substring(0, key.length - diff)}: ${
                    data[key]
                } ~ `;
            }
        } else if (key.includes("total_stake")) {
            console.log(data[key], "from cyprus");
            output += `${key}: ${data[key]} ~ `;
            newObject[key] = data[key];
        } else if (key === `Max. Bonus`) {
            newObject["Max Bonus"] = data[key];
        } else {
            newObject[key] = data[key];
        }
    });

    newObject["Output"] = await outputcolumns(output, {
        gpl,
        flag
    });

    return printoutindex(newObject);
};

export const reporterFomrat = data => {
    const newdata = {
        ...data
    };
    Object.keys(data).forEach(key => {
        const currentValue = data[key];
        if (currentValue.includes(".0")) {
            const newvalue = currentValue.split(".")[0];
            newdata[key] = newvalue;
        }
    });
    return newdata;
};

const calculateTotal = ({ line_stake, lines }) => {
    return lines * line_stake;
};

/**8
 * @function modify selection for banker + permuntation || games
 * @param {data} modified or original version of request body
 */
export const bpm = async (bodydata, flag) => {
    const {
        api_user,
        api_pass,
        timestamp,
        data: { type, selections }
    } = bodydata;
    const marketLibrary = await marketlib({ api_user, api_pass, timestamp });

    const newSelectionArr = [];
    /**
     *  @func    editing line_stake + total_stake
     */

    if (flag === "true") {
        selections.forEach(
            ({ lines, line_stake, total_stake, market }, i, arr) => {
                if (
                    marketLibrary[market].name.includes("Banker") ||
                    marketLibrary[market].name.includes("Perm")
                ) {
                    const newObject = {
                        ...arr[i],
                        total_stake: calculateTotal({ line_stake, lines }) * 2
                    };
                    return newSelectionArr.push(newObject);
                }
                // for evey other bet type if machine multiply total stake by 2
                const newObject = {
                    ...arr[i],
                    total_stake: total_stake * 2
                };
                newSelectionArr.push(newObject);
            }
        );
    } else {
        selections.forEach(({ lines, line_stake, market }, i, arr) => {
            if (
                marketLibrary[market].name.includes("Banker") ||
                marketLibrary[market].name.includes("Perm")
            ) {
                const newObject = {
                    ...arr[i],
                    total_stake: calculateTotal({ line_stake, lines })
                };
                return newSelectionArr.push(newObject);
            }
            newSelectionArr.push(arr[i]);
        });
    }

    /**
     *  selections||
     */
    return {
        ...bodydata,
        data: {
            type,
            selections: newSelectionArr
        }
    };
};
