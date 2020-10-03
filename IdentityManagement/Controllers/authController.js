const bcrypt = require('bcrypt');

const saltRounds = parseInt(process.env.SALT_ROUND);

exports.login = async (req, res, next) => {
    const [username, password] = parseAuthHeader(req);

    let dbPassword = "$2b$10$Dzjzo3ZZNqs4IhNEgZ8VY.GAiGmMwTzRF4r7y0AbOS1/S8KqaugNW";

    let match = false;
    try {
        match = await bcrypt.compare(password, dbPassword);
    } catch (err) {
        console.log(err);
    }
    
    if (match) {
        return res.status(200).json({
            status: "success",
            message: "Sucessfull login",
            data: {
                username: username
            }
        });
    } else {
        return res.status(401).json({
            status: "fail",
            message: "The username and password is incorrect"
        })
    }
}


exports.signup = async (req, res, next) => {
    const [username, password] = parseAuthHeader(req);

    console.log('Username:' + username);
    console.log('Password:' + password);

    // Check if database contains the submitted username
    // if (username is used) {
    //     return  res.status(200).json({
    //         status: "fail",
    //         message: "The username already exists. Try a different username"
    //     });
    // }
    
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
    } catch(err) {
        console.log(err);
    }
    
    // store username and hashed password in db

    return res.status(200).json({
        status: "success",
        message: "Account has been successfully created.",
        data: {
            username: username,
            password: hash
        }
    });
}


// This helper function takes in request object as paramter and parses the auth-header 
// to obtain username & password. It returns the parsed username and password as an array.
const parseAuthHeader = (req) => {
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    return [username, password] = credentials.split(':');
}