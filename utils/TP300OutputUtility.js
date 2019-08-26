/**
 * @func      Determin column sopace for line price and panel price
 * @param {*} columnLine
 * @param {*} columndata
 */
export const columspace = (columnLine, columndata) => {
    const lineSpacing = columnLine.length;
    const dataLength = columndata.length;
    const lineDifference = lineSpacing - dataLength;
    let newColumnData = columndata;

    let seperate = "  ";
    for (let i = 0; i < lineDifference; i++) {
        seperate = seperate + " ";
    }

    newColumnData = newColumnData.split("  ");

    return newColumnData[0] + seperate + newColumnData[1];
};
