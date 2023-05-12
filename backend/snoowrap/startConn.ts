import Snoowrap from "snoowrap";
import * as dotenv from 'dotenv';
dotenv.config();

const snoo = new Snoowrap({
    userAgent: "Firefox",
    clientSecret: process.env.CLIENT_SECRET,
    clientId: process.env.CLIENT_ID,
    refreshToken: process.env.REFRESH_TOKEN
});

export default snoo;