import { decodeRegToken } from "../../utils/storeToken";

// ACCESS LEVEL MIDDLE WARES
export const smd = async (req, res, next) => {
    const token = req.get("Authorization");
    if (!token) {
        console.log("nada");
        const error = new Error("🚨🚔Un-Authorized👮");
        res.status(401);
        return next(error);
    }
    const { invalid, decodedValue } = await decodeRegToken(token);
    if (invalid) {
        const error = new Error("🚨🚔Un-Authorized👮");
        res.status(401);
        return next(error);
    }

    req.user = decodedValue;
    next();
};
