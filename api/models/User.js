/**
* @file User.js
* @author luodongyang@baidu.com
* @date 2015-11-08
*/

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
    }
};

