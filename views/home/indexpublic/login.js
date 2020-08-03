ce_login= {};
$(document).ready(function(){

    $('.forgotpasswordurl').click(function(){
        ce_login.resetpwdwin = new RichHTML.window({
            width: '435',
            height: clientexec.captcha? '350' : '250',
            title: lang('Reset password'),
            url: 'index.php?fuse=home&view=resetpwd',
            actionUrl: 'index.php?fuse=home&action=resetpassword',
            showSubmit: true,
            showerrors: false,
            onSubmit: function(xhr) {
                if (xhr.error) {
                    ce_login.showerror(xhr.message);
                } else {
                    $('.alert-reset-password-success').show();
                }
            }
        });
        ce_login.resetpwdwin.show();
    });

    ce_login.show_tc = function() {
        new RichHTML.window({
            width: 550,
            height: 550,
            showSubmit: false,
            title: lang("Terms & Conditions"),
            content: $('#toc').html()
        }).show();
    }

    $('.newaccounturl').click(function() {
        ce_login.newuserwin = new RichHTML.window({
            width: '435',
            height: clientexec.captcha? '435' : '335',
            title: lang('Create an account'),
            url: 'index.php?fuse=home&view=register',
            actionUrl: 'index.php?fuse=home&action=createaccount',
            showSubmit: true,
            showerrors: false,
            onSubmit: function(xhr) {
                if (xhr.error) {
                    ce_login.showerror(xhr.message);
                    if (xhr.error_code == '2332') {
                        Recaptcha.reload();
                    }
                } else {
                    $('.alert-registration-success').show();
                }
            }
        });
        ce_login.newuserwin.show();
    });
    $('input[name=email]').focus();

    ce_login.showerror = function(msg) {
        $('.richwindow .description').addClass('alert-error').html(msg)
    }
});
