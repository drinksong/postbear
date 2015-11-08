/**
* @file User.js
* @author luodongyang@baidu.com
* @date 2015-11-08
*/
var bcrypt = require('bcrypt');
module.exports = {
    attributes: {
        email: {
            type: 'email',
            unique: true,
            required: true
        },

        password: {
            type: 'string',
            required: true
        },

        isAdmin: {
            type: 'boolean',
            defaultsTo: false
        },

        config: {
            type: 'json'
        }
    },

    // 创建（注册）用户前，对用户密码加密
    beforeCreate: function (values, cb) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(values.password, salt, function (err, hash) {
                if (err) return cb(err);
                values.password = hash;

                // 执行用户定义回调
                cb();
            });
        });
    }
};

