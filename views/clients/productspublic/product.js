var productview = productview || {};

productview.callPluginAction = function(pluginAction, packageId)
{
    RichHTML.mask();
    $.ajax({
        url: 'index.php?fuse=clients&action=callpluginaction',
        success: function(xhr) {
            var json = ce.parseResponse(xhr);
             RichHTML.unMask();
        },
        data: {
            id: packageId,
            actioncmd: pluginAction
        }
    });
};

$('#passwordChange').click(function(e){
    e.preventDefault();
    RichHTML.prompt(lang('Please enter a new password'), {}, function(returnVal){
        if ( returnVal.btn == lang('Cancel') ) {
            return;
        }

        if( $.trim(returnVal.elements.value) !== "" ) {
            password = returnVal.elements.value;
            $.post('index.php?fuse=clients&controller=products&action=updatehostingpassword', {
                id: productview.package_id,
                password: password
            }, function( data ) {
                ce.parseResponse(data);
            });
        }
    });
});

$('.customFieldChange').click(function(e){
    e.preventDefault();
    var fieldName = $(this).data('name');
    RichHTML.prompt(lang('Please enter a new value'), {}, function(returnVal){
        if ( returnVal.btn == lang('Cancel') ) {
            return;
        }

        if( $.trim(returnVal.elements.value) !== "" ) {
            value = returnVal.elements.value;
            RichHTML.mask();
            $.post('index.php?fuse=clients&controller=products&action=updatecustomfield', {
                id: productview.package_id,
                fieldName: fieldName,
                value: value
            }, function( data ) {
                response = ce.parseResponse(data);
                if (response.success === true) {
                    location.reload();
                }
                RichHTML.unMask();
            });
        }
    });
});