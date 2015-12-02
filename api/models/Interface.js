/**
* Interface.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        // 接口
        url: {
            type: 'string'
            // required: true
        },

        // story
        story: 'string',
        
        // 描述
        description: {
            type: 'string'
        },

        // 创建者
        author: {
            type: 'string'
        },

        // 参数
        parameters: 'json',

        // responses
        responses: 'json',

        toJSON: function() {
            var obj = this.toObject();
            delete obj.id;
            return obj;
        }
    }
};

