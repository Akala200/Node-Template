/* eslint-disable camelcase */
/* eslint-disable max-len */
import responses from "../../utils/responses";
import tracelogger from "../../logger/tracelogger"
import Applicant from "../../models/applicant";
import ApplicantToken from "../../models/applicantToken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { signToken } from "../../utils/storeToken";
import bcrypt from "bcrypt";



/**
 * @description Defines the actions for the users endpoints
 * @class ApplicantController
 *
 */

class ApplicantController {
    /**
     *@description Creates user access
     *@static
     *@param  {Object} req - request
     *@param  {object} res - response
     *@returns {object} - status code, message and created wallet
     *@memberof ApplicantController
  e   */

    static async register(req, res) {
       
        const {} = req.body
        try {
            const checkuser = await Applicant.findOne({ email: req.body.email });

            if (checkuser) {
                return res
                    .status(401)
                    .json(
                        responses.success(
                            400,
                            "User already exist"
                        )
                    );
            }
           console.log("I dey here");
            const post = new Applicant(req.body);

            post.save();

             // Create a verification token for this user
        const token = new ApplicantToken({ _userId: post._id, token: crypto.randomBytes(16).toString('hex') });
          // Save the verification token
          token.save();
     if(!token){
        return res
        .status(500)
        .json(
            responses.success(
                500,
                token
            )
        );
     }

     const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'adeiyiakala91@gmail.com',
          pass: 'OLAtunji2020$'
        },
        tls: {
            rejectUnauthorized: false
        }
      });

     let mailOptions = { from: 'adeiyiakala91@gmail.com', to: post.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
     transporter.sendMail(mailOptions, function (err) {
         if (err) { return res.status(500).send({ msg: err.message }); }
         res.status(200).send('A verification email has been sent to ' + post.email + '.');
     });

        } catch (error) {
            tracelogger(error);
        }
    }

    /**
     *@description Gets all movies
     *@static
     *@param {Object} req - request
     *@param {Object} res - response
     *@returns {object} - status code, message
     * @memberof ApplicantController
     */
    static async applicantDetails(req, res) {
        const { id } = req.query
        try {

            const getApplicant = await Applicant.findOne({_id: id});

            if(!getApplicant) {
                return res
                .status(404)
                .json(
                    responses.success(
                        200,
                        "User not found",
                        getApplicant
                    )
                );
            }
            return res
                .status(200)
                .json(
                    responses.success(
                        200,
                        "User retrieved successfully",
                        getApplicant
                    )
                );
        } catch (error) {
            tracelogger(error);
        }
    }

    
    /**
     *@description login
     *@static
     *@param {Object} req - request
     *@param {Object} res - response
     *@returns {object} - status code, message
     * @memberof ApplicantController
     */
    static async login(req, res) {
        const {email, password} = req.body
        
        try {
            const checkEmail = await Applicant.findOne({ email });
            if (!checkEmail) {return res.status(400).send({ msg: 'Unable to login.' })}
            const valid = await bcrypt.compare(password, checkEmail.password);
            if(!valid) {return res.status(400).send({ msg: 'Unable to login.' })}

             //  Login successfull
    const TokenData = {
        _id: checkEmail._id,
        email
      };
      const token = await signToken(TokenData);
            return res
                .status(200)
                .json(
                    responses.success(
                        200,
                        "Login successful",
                        token
                    )
                );
        } catch (error) {
            tracelogger(error);
        }
    }

    /**
     *@description Get one access account
     *@static
     *@param {Object} req - request
     *@param {Object} res - response
     *@returns {object} - status code, message
     * @memberof ApplicantController
     */

    static async confirmation(req, res) {
        try {
           const  checkToken = await ApplicantToken.findOne({ token: req.body.token })
           
           if (!checkToken) {
            return res
                .status(400).send({ msg: 'We were unable to find a valid token. Your token may have expired.' });;
        }
           const checkApplicantToken = await Applicant.findOne({ _id: checkToken._userId, email: req.body.email })
            if (!checkApplicantToken) {return res.status(400).send({ msg: 'We were unable to find a user for this token.' });}
            if (checkApplicantToken.isVerified == true){ return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });}
 
             // Verify and save the user
         let status = checkApplicantToken.isVerified = true;
        const updateStatus = await Applicant.findOneAndUpdate({
            email: req.body.email
         }, {
            isVerified: status
         }, {
           new: true
         });
       
             if(!updateStatus){ return res.status(500).send({updateStatus}); }
           return res.status(200).send("The account has been verified. Please log in.");
        } catch (error) {
            tracelogger(error);
        }
    }
}

export default ApplicantController;
