const jwt = require("jsonwebtoken");
const { head } = require("../routes/products");

//  as jsonwebtoken did not enccrpted the data basiclly it convert the data into a coded form
//  Also our server did not verified the json webtoken and for that purpose we need to verifeid method used the token.

module.exports = (req, res, next) => {
    try {
        const token = headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        // adding new field in request 
        req.userData = decoded;
        next();
    } catch (error) {
        res.status(401).json({ 
            message: "Unauthorized"
         });
    }    
};