/* eslint-disable camelcase */
/* eslint-disable max-len */
import responses from "../../utils/responses";
import tracelogger from "../../logger/tracelogger";
import Admin from "../../models/admin";
import bcrypt from "bcryptjs";
import { signToken } from "../../utils/storeToken";

/**
 * @description Defines the actions to for the users endpoints
 * @class AdminController
 *
 */

const erroresponse = [
    {
        path: "login",
        message: "Unable to Login"
    }
];

const regErrorResposne = [
    { path: "register", message: "Email is already in use" }
];

class AdminController {
    /**
     *@description Creates user Admin
     *@static
     *@param  {Object} req - request
     *@param  {object} res - response
     *@returns {object} - status code, message and created wallet
     *@memberof AdminController
     */

    static async createAdmin(
        {
            body,
            query: { su, sa, role }
        },
        res
    ) {
        try {
            admin = await Admin.findOne({ email });
        } catch (error) {
            return res.status(401).json(error);
        }

        if (admin) return res.status(401).json(regErrorResposne);

        let payload;
        payload = {
            active: true,
            ...body
        };   

        let newadmin;
        try {
            newadmin = new Admin(payload);
            await newadmin.save();
        } catch (error) {
            tracelogger(error);
            return res.status(401).json([
                {
                    path: "register",
                    error
                    // message:
                    //     "Am error occured during process, pleae try again later"
                }
            ]);
        }
        return res.json({ ok: true, newadmin });
    }

    /**
     *@description Creates user Admin
     *@static
     *@param  {Object} req - request
     *@param  {object} res - response
     *@returns {object} - status code, message and created wallet
     *@memberof AdminController
     */

    static async loginAdmin(
        {
            body: { email, password }
        },
        res
    ) {
        let admin;
        try {
            admin = await Admin.findOne({ email, active: true });
        } catch (error) {
            return res.json(error);
        }

        if (!admin) {
            return res.status(401).json({ ok: false, error: erroresponse });
        }

        const valid = await bcrypt.compare(password, admin.password);

        if (!valid) {
            return res.status(401).json({ ok: false, error: erroresponse });
        }

        //  Login successfull
        const TokenData = {
            _id: admin._id,
            email,
            firstname: admin.firstname,
            lastname: admin.lastname,
            department: admin.department,
            superadmin: admin.superadmin,
            role: admin.role
        };

        //  Generate Token
        const token = await signToken(TokenData);

        return res.json({ token });
    }

    /**
     *@description Gets all movies
     *@static
     *@param {Object} req - request
     *@param {Object} res - response
     *@returns {object} - status code, message
     * @memberof AdminController
     */
    static async getAdminUsers(
        {
            query: { _id }
        },
        res
    ) {
        if (_id) {
            let admin;
            try {
                admin = await Admin.findOne({ _id });
            } catch (error) {
                return res.status(401).json([
                    {
                        path: "getUser",
                        message:
                            "An error occured while finding user, please try again later"
                    }
                ]);
            }

            return res.json({ ok: true, admin });
        }

        let admins;
        try {
            admins = await Admin.find();
        } catch (error) {
            return res.status(401).json({
                ok: false,
                error: [
                    {
                        path: "getUser",
                        message:
                            "An error occured while finding users, please try again later"
                    }
                ]
            });
        }

        return res.json({ ok: true, admins });
    }

}

export default AdminController;
