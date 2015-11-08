/**
 * @file isAuthenticated
 * @author luodongyang
 * @date 2015-11-08
 */
module.exports = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        return res.redirect('/welcome', 313);
    }
};

