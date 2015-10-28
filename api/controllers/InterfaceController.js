/**
 * InterfaceController
 *
 * @description :: Server-side logic for managing interfaces
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/**
 * 对接口的CRUD操作
 */
module.exports = {
    index: function (req, res) {
        res.view('main/index', {
            layout: 'main/layout',
            data: ''
        });
    },

    // 
    search: function (req, res) {
        var key = req.param('key');
        var value = req.param('request');
        var criteria = {};

        criteria[key] = value;

        Interface.find(criteria).exec(function (err, result) {
            if (err) {
                // do something...
            }
            else {
                if (result) {
                    res.json(result);
                }
                else {
                    res.send(false);
                }
            }
        });
    },
    /**
     * 增加接口
     * @param req
     * @param res
     */
    create: function (req, res) {
        // 由申请参数构造待创建的Interface对象
        var interfaceParams = req.allParams();
        Interface.create(interfaceParams).exec(function (err, created) {
            if (err) {
                // 如果有误，返回错误信息
                res.send({success: false});
            }
            else {
                //否则，显示添加成功
                res.send({success: true});
            }
        });
    },

    /**
     * 显示全部接口信息
     * @param req
     * @param res
     */
    showAll: function (req, res) {
        Interface.find().exec(function (err, results) {
            if (err) {
                res.send({err: err});
            }
            else {
                res.json(results);
            }
        });
    },

    /**
     * 根据ID删除接口
     * @param req
     * @param res
     */
    delete: function (req, res) {
        var id = req.param('id');

        Interface.destroy({id:id}).exec(function (err) {
            if (err) {
                res.send({err: err});
            }
            else {
                res.redirect('/interface');
            }
        })
    },

    test: function (req, res) {
        res.locals.layout = 'layout';
        res.view('index');
    },

    /**
     * 更新接口数据
     * @param req
     * @param res
     */
    // update: function (req, res) {
    //     var name = req.param('name');
    //     console.log(name);

    //     Interface.update({name: 'sjk'}, {name: name}).exec(function (err, updated) {
    //         if (err) {
    //             res.send({err: err});
    //         }
    //         else {
    //             res.send('Updated the id:sjk ' + ' to ' + updated[0].name);
    //         }
    //     })
    // }

    update: function (req, res) {
        var id = req.param('id');
        Interface.update({url: 'activation/f'}, {url: 'activation/a'}).where({id: 6}).exec(function (err, results) {
            if (err) {
                res.send({err: err});
            }
            else {
                res.send(results);
            }
        });
    }
};

