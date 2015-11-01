/**
 * @file 首页
 * @author luodongyang@baidu.com
 * @date 2015-10-27
 */

(function ($) {
    $('#sign-up-modal').on('hidden.bs.modal', function () {
        $('#sign-up')[0].reset();
    });
    $('#log-in-modal').on('hidden.bs.modal', function () {
        $('#log-in')[0].reset();
    });

    $('sign-up-btn').click(function () {
        $.post('register', $('#sign-up').serialize(), function (data) {
            // 跳转、显示注册成功
        });
    });
})(jQuery);
