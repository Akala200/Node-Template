import md5 from "md5";

export const MD5Hashgenerator = timestamp => {
    return md5(`*bb123!!.${timestamp}`);
};
