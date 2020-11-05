const express = require("express");
const AuthService = require("./auth-service");
const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post("/login", jsonParser, (req, res, next) => {
    const { username, pwd } = req.body;
    const loginUser = { username, pwd };
    console.log(username, pwd)

    for (const [key, value] of Object.entries(loginUser))
        if (value == null)
            return res.status(400).json({
                error: `Missing '${key}' in request body`,
            });

    AuthService.getUserWithUserName(
        req.app.get("db"),
        loginUser.username
    )
        .then((dbUser) => {
            if (!dbUser)
                return res.status(400).json({
                    error: "Incorrect username or password",
                });
            console.log('loginUser.pwd: ', loginUser.pwd)    
            console.log('dbUser: ', dbUser)    
            console.log('dbUser.pwd: ', dbUser.pwd)    
            return AuthService.comparePasswords(
                loginUser.pwd,
                dbUser.pwd
            ).then(compareMatch => {
                if (!compareMatch)
                    return res.status(400).json({
                        error: "Incorrect username or password",
                    });

                const sub = dbUser.username;
                const payload = { user_id: dbUser.userid };
                console.log(sub, payload)
                res.send({
                    authToken: AuthService.createJwt(sub, payload),
                });
            });
        })
        .catch(next);
});

module.exports = authRouter;