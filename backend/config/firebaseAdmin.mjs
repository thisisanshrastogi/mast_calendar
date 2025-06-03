import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("../config/mast-calendar-81f38-firebase-adminsdk-fbsvc-3d3e1cccb3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
