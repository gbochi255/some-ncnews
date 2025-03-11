exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({ error: err.msg });
    }else {
        next(err);
    }
};
    exports.handleNotFoundErrors = (req, res, next) => {
        res.status(404).send({ error: "Route not found" });
    };

    exports.handleServerErrors = (err, res, req, next) => {
        console.error(err);
        res.status(500).send({ error: "Internal Server Error:" });
    };

    exports.handlePsqlErrors = (err, req, res, next) => {
        if(err.code==='22P02'){
            res.status(400).send({ msg: 'bad request' });
        }
        next(err);
    }