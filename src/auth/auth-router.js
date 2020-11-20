const express = require("express");
const AuthService = require("./auth-service");
const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post("/login", jsonParser, (req, res, next) => {
    const { username, pwd } = req.body;
    const loginUser = { username, pwd };

    for (const [key, value] of Object.entries(loginUser)) {
        if (value == null) {
            return res.status(400).json({
                error: `Missing '${key}' in request body`,
            });
        }
    }
    AuthService.getUserWithUserName(
        req.app.get("db"),
        loginUser.username
    )
        .then((dbUser) => {
            if (!dbUser) {
                return res.status(400).json({
                    error: "Incorrect username or password",
                }); 
            }
            return AuthService.comparePasswords(
                loginUser.pwd,
                dbUser.pwd
            ).then(compareMatch => {
                if (!compareMatch) {
                    return res.status(400).json({
                        error: "Incorrect username or password",
                    });
                }
                    
                const sub = dbUser.username;
                const payload = { user_id: dbUser.id };
                return res.json({
                    authToken: AuthService.createJwt(sub, payload),
                    userid: payload.user_id,
                    username: sub
                });
            });
        })
        .catch(next);
});

module.exports = authRouter;