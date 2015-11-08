/**
 * @file AuthController
 * @author luodongyang
 * @date 2015-11-08
 */

var passport = require('passport');
module.exports = {
    processRegistry: function (req, res) {
        var user = req.allParams();
        User.create(user).exec(function (err, result) {
            if (err) {
                // 如果发生错误，则把错误信息发送给前端
                return res.send({status: 1, msg: '注册时发生错误', detail: err});
            }
            else {
                // 否则，自动登陆新用户
                req.login(result, function (err) {
                    if (err) {
                        // TO-DO error处理
                    }
                    else {
                        return res.redirect('/', 301);
                    }
                })
            }
        });
    },

    processLogin: function (req, res) {
        passport.authenticate('local', function (err, user, info) {
            if (err || (!user)) {
                return res.send({status: 1, msg: info.message});
            }
            req.login(user, function (err) {
                if (err) {
                    return res.send({status: 1, msg: '登陆失败', detail: err});
                }
                return res.send({status: 0, msg: '登陆成功', detail: info.message});
            });
        });
    },

    processLogout: function (req, res) {
        req.logout();
        res.redirect('/', 313);
    }
};

