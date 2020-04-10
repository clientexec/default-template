$( document ).ready(function() {
    $('#update-password-button').click(function(e){
        var valid = $('#update-password-form').parsley('validate');
    });
});