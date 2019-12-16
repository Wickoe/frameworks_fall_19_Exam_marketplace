module.exports = () => {
    const router = require('express').Router();

    router.get('*', (req, res) => {
        res.sendFile(path.resolve('..', 'client', 'build', 'index.html'));
    });

    return router;
};