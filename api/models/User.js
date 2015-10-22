/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
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

