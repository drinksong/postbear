/**
 * @file 用户已创建
 * @author luodongyang
 * @date 2015-11-08
 */
module.exports = function (req, res, next) {
    var email = req.param('email');
    User.findOne({email: email}).exec(function (err, result) {
        if (err) {
            return res.send({status: 1, msg: '数据库错误', detail: err});
        }
        if (!result) {
            next();
        }
        else {
            return res.send({status: 1, msg: '改用户名已注册'});
        }
    });
};
