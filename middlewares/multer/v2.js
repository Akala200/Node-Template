import multer from "multer";
import Datauri from "datauri";
import { Binary } from "mongodb";
import path from "path";
const storage = multer.memoryStorage();
export const multeruploadsv2 = multer({ storage }).single("firmware");
/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The data url from the string buffer
 */
const dUri = new Datauri();

export const dataUri = file =>
    dUri.format(
        path.extname(file.originalname).toString(),
        Binary(file.buffer)
    );
