import Snoowrap from "snoowrap";
import * as dotenv from 'dotenv';
dotenv.config();

const snoo = new Snoowrap({
    userAgent: "Javascript:xdqifH3QLbkowQOrnJBeHw:v1.0Javascript:xdqifH3QLbkowQOrnJBeHw:v1.0",
    clientSecret: process.env.CLIENT_SECRET,
    clientId: process.env.CLIENT_ID,
    refreshToken: process.env.REFRESH_TOKEN
});

export default snoo;