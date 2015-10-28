/**
 * TestTaskController
 *
 * @description :: Server-side logic for managing testtasks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    testSeparately: function (req, res) {
        return res.send('testOne');
    },

    testRegressively: function (req, res) {
        return res.send('testAll');
    },

    getDevMachineHost: function () {
        return null;
    }
};

