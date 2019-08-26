export const columnLine = "------------------------------";
const endingLine = "==============================";
import { columspace } from "./TP300OutputUtility";

export const printoutindex = data => {
    const odered = {
        result: data.result,
        barcode: data.barcode,
        pin: data.pin,
        Date: data.Date,
        Draw: data.Draw,
        ClosingTime: data.ClosingTime,
        ...data
    };
    return odered;
};

const gplFilter = (gpl, key) => {
    function fil(value) {
        return value === key;
    }
    const filtered = Object.keys(gpl).filter(fil);
    return gpl[filtered];
};

const etsi = stra => {
    // Extract type + selcetion + index
    const arr = [];
    stra.forEach((string, i) => {
        const daSplit = string.split(":");
        arr.push({
            market: daSplit[0].trim(),
            selection: daSplit[1].trim(),
            i
        });
    });
    return arr;
};

export const mappingdetails = (stringArr, type, { gpl, flag }) => {
    let gplcopy = gpl;
    let dataString = "";
    let direct1 = 0;
    let direct2 = 0;
    let direct3 = 0;
    let direct4 = 0;
    let direct5 = 0;
    let perm2 = 0;
    let perm3 = 0;
    let perm4 = 0;
    let banker = 0;
    let banker1all = 0;

    if (type === "Direct") {
        const marketindex = etsi(stringArr);
        marketindex.forEach((obj, i) => {
            const gplMarketArray = gplFilter(gplcopy, obj.market);
            let linestake;
            let selections;
            if (obj.market == "Direct 1") {
                const { line_stake, selection } = gplMarketArray[direct1];
                linestake = line_stake;
                selections = selection;
                direct1++;
            }
            if (obj.market == "Direct 2") {
                const { line_stake, selection } = gplMarketArray[direct2];
                linestake = line_stake;
                selections = selection;
                direct2++;
            }
            if (obj.market == "Direct 3") {
                const { line_stake, selection } = gplMarketArray[direct3];
                linestake = line_stake;
                selections = selection;
                direct3++;
            }
            if (obj.market == "Direct 4") {
                const { line_stake, selection } = gplMarketArray[direct4];
                linestake = line_stake;
                selections = selection;
                direct4++;
            }
            if (obj.market == "Direct 5") {
                const { line_stake, selection } = gplMarketArray[direct5];
                linestake = line_stake;
                selections = selection;
                direct5++;
            }
            dataString =
                dataString.trim() +
                `${obj.market.trim()}~${selections}~${columspace(
                    columnLine,
                    `Line Price:  =N=${linestake}`
                )}~${columspace(columnLine, `Panel Price:  =N=${linestake}`)}` +
                "~" +
                columnLine +
                "~";
        });
        return dataString;
    }

    if (type === "Perm") {
        const marketindex = etsi(stringArr);
        marketindex.forEach((obj, i) => {
            const gplMarketArray = gplFilter(gplcopy, obj.market);
            let linestake;
            let linesm;
            let selections;
            if (obj.market == "Perm 2") {
                const { line_stake, lines, selection } = gplMarketArray[perm2];
                linestake = line_stake;
                selections = selection;
                linesm = lines;
                perm2++;
            }
            if (obj.market == "Perm 3") {
                const { line_stake, lines, selection } = gplMarketArray[perm3];
                linestake = line_stake;
                selections = selection;
                linesm = lines;
                perm3++;
            }
            if (obj.market == "Perm 4") {
                const { line_stake, lines, selection } = gplMarketArray[perm4];
                linestake = line_stake;
                selections = selection;
                linesm = lines;
                perm4++;
            }
            dataString =
                dataString.trim() +
                `${obj.market.trim()}~${selections}~${columspace(
                    columnLine,
                    `Line Price:  =N=${linestake}`
                )}~${columspace(
                    columnLine,
                    `Panel Price:  =N=${linestake * linesm}`
                )}` +
                "~" +
                columnLine +
                "~";
        });

        return dataString;
    }

    if (type === "Banker") {
        const marketindex = etsi(stringArr);
        marketindex.forEach((obj, i) => {
            const gplMarketArray = gplFilter(gplcopy, obj.market);
            let linestake;
            let linesm;
            let selections;
            if (obj.market == "Banker") {
                const { line_stake, lines, selection } = gplMarketArray[banker];
                linestake = line_stake;
                selections = selection;
                linesm = lines;
                banker++;
            }
            if (obj.market == "Banker 1-All") {
                const { line_stake, lines, selection } = gplMarketArray[
                    banker1all
                ];
                linestake = line_stake;
                selections = selection;
                linesm = lines;
                banker1all++;
            }
            dataString =
                dataString.trim() +
                `${obj.market.trim()}~${selections}~${columspace(
                    columnLine,
                    `Line Price:  =N=${linestake}`
                )}~${columspace(
                    columnLine,
                    `Panel Price:  =N=${linestake * linesm}`
                )}` +
                "~" +
                columnLine +
                "~";
        });
        return dataString;
    }

    if (type === "TotalStake") {
        const total = +stringArr[0].split(":")[1];
        dataString =
            endingLine +
            columspace(columnLine, `Total Stake:  =N=${total}`) +
            "~" +
            endingLine +
            "~";
        return dataString;
    }
};

export const bankFilter = arr => {
    function isBanker(value) {
        return value.includes("Banker");
    }
    return arr.filter(isBanker);
};

export const directFilter = arr => {
    function isDirect(value) {
        return value.includes("Direct");
    }
    return arr.filter(isDirect);
};

export const permFilter = arr => {
    function isPerm(value) {
        return value.includes("Perm") || value.includes("PERM");
    }
    return arr.filter(isPerm);
};

export const totalStakeFilter = arr => {
    function isTotal(value) {
        return value.includes("total_stake");
    }
    return arr.filter(isTotal);
};

export const defineresult = (indexkey, index_key_object_data) => {
    const resultdata = {};
    Object.keys(index_key_object_data).forEach(key => {
        resultdata[`${key}${indexkey}`] = index_key_object_data[key];
    });
    return resultdata;
};
