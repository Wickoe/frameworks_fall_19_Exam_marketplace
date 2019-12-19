module.exports = (error, req, res, next) => {
    if(error.name === "UnauthorizedError") {
        res.status(401).json({msg: `${error.message}`, error: 1});
        return;
    }

    next();
};