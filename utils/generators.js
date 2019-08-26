// const generator = {};
export const generateRef = () => {
    let init = +new Date();
    init += "";
    const transform = {
        1: "D",
        2: "F",
        3: "E",
        4: "K",
        5: "A",
        6: "J",
        7: "O",
        8: "P",
        9: "W",
        0: "Z"
    };
    let pref = "";
    const initArr = init.split("");
    initArr.forEach(int => {
        pref += transform[int];
    });
    return `WT-${pref}`;
};

export const generateETRef = () => {
    let init = +new Date();
    init += "";
    const transform = {
        1: "D",
        2: "F",
        3: "E",
        4: "K",
        5: "A",
        6: "J",
        7: "O",
        8: "P",
        9: "W",
        0: "Z"
    };
    let pref = "";
    const initArr = init.split("");
    initArr.forEach(int => {
        pref += transform[int];
    });
    return `ET-${pref}`;
};

export const generateITSWRef = () => {
    let init = +new Date();
    init += "";
    const transform = {
        1: "D",
        2: "F",
        3: "E",
        4: "K",
        5: "A",
        6: "J",
        7: "O",
        8: "P",
        9: "W",
        0: "Z"
    };
    let pref = "";
    const initArr = init.split("");
    initArr.forEach(int => {
        pref += transform[int];
    });
    return `ITSW-${pref}`;
};

export const generateUPRef = () => {
    let init = +new Date();
    init += "";
    const transform = {
        1: "D",
        2: "F",
        3: "E",
        4: "K",
        5: "A",
        6: "J",
        7: "O",
        8: "P",
        9: "W",
        0: "Z"
    };
    let pref = "";
    const initArr = init.split("");
    initArr.forEach(int => {
        pref += transform[int];
    });
    return `UP-${pref}`;
};
