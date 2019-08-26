import { MakeRequest } from "../make.requests";
import moment from "moment-timezone";

export const scheduleGenerator = async response => {
    return response.reduce((formatObject, { name, id }) => {
        formatObject[`${name}`] = id;
        return formatObject;
    }, {});
};

const marketGenerator = async body => {
    const response = await MakeRequest(
        `${process.env.BASE_URL_TP300}/lotteryschedule`,
        body
    );

    if (typeof response !== "object") {
        return null;
    }

    if (typeof response == "object") {
        return response.reduce((formatObject, game) => {
            const { markets } = game;
            Object.keys(markets).forEach(key => {
                if (!formatObject[key]) {
                    formatObject[key] = markets[key];
                }
            });
            return formatObject;
        }, {});
    }

    return null;
};

const Game1Library = {
    Cash: true,
    Winna: true,
    Millions: true,
    Rich: true,
    Naira: true,
    Ghana: true,
    Kano: true,
    GhanaHoliday: true,
    National: true,
    Success: true,
    "Naija Gold": true,
    LUNCHTIME: true,
    TEA: true,
    MidWeek: true,
    Evening: true,
    POWERBALL: true,
    "DAILY LOTTO": true
};

const marketLibrary = {
    "771": { market: "771", name: "Direct 1", short_name: null, odds: "5.00" },
    "772": {
        market: "772",
        name: "Direct 2",
        short_name: null,
        odds: "240.00"
    },
    "773": {
        market: "773",
        name: "Direct 3",
        short_name: null,
        odds: "2100.00"
    },
    "774": {
        market: "774",
        name: "Direct 4",
        short_name: null,
        odds: "6000.00"
    },
    "775": {
        market: "775",
        name: "Direct 5",
        short_name: null,
        odds: "44000.00"
    },
    "776": {
        market: "776",
        name: "Bonus Number",
        short_name: null,
        odds: "48.00"
    },
    "777": {
        market: "777",
        name: "Bonus Number Single",
        short_name: null,
        odds: null
    },
    "779": {
        market: "779",
        name: "Bonus Ball Under/Over",
        short_name: null,
        odds: null
    },
    "783": { market: "783", name: "Perm 2", short_name: null, odds: "240.00" },
    "784": { market: "784", name: "Perm 3", short_name: null, odds: "2100.00" },
    "785": { market: "785", name: "Perm 4", short_name: null, odds: "6000.00" },
    "787": { market: "787", name: "Banker", short_name: null, odds: "240.00" },
    "788": {
        market: "788",
        name: "Banker 1-All",
        short_name: null,
        odds: "240.00"
    }
};

const closingTimeLibrary = {};

export const gamelib = async body => {
    const response = await MakeRequest(
        `${process.env.BASE_URL_TP300}/lotteryschedule`,
        body
    );
    const data = await scheduleGenerator(response);

    if (typeof data == "object") {
        return data;
    }

    return { ...Game1Library };
};

export const marketlib = async body => {
    const newmarketLibrary = await marketGenerator(body);
    if (newmarketLibrary) {
        return { ...newmarketLibrary };
    }
    return { ...marketLibrary };
};

const dateFormatter = date => {
    const cyprus = moment.tz(date, "Europe/Istanbul");
    const lagos = cyprus.clone().tz("Africa/Lagos");
    return lagos
        .format()
        .split("T")[1]
        .split("+")[0];
};

export const closingTimeGen = async response => {
    if (typeof response !== "object") {
        return { ...closingTimeLibrary };
    }

    return response.reduce((formatObject, { name, date }) => {
        formatObject[`T${name}`] = dateFormatter(date);
        return formatObject;
    }, {});
};
