$(document).ready(function(){
    customFields.load(contactinfo.jsonFields,function(data) {
        var html = '<div class="form-group col-xs-12 col-sm-5">';
        $.each(data, function (key, value) {
            $(value).removeAttr('style');
            if (value.localName == 'label') {
                $(value).addClass('control-label');
            } else if (value.localName == 'input') {
                $(value).addClass('form-control');
            }
            html += value.outerHTML;
        })
        html += '</div>';
        $('#contactinfo-div').append(html);
    }, function(){
        clientexec.postpageload('#contactinfo-div');
        $('.form-actions').removeClass('hidden');
    });
});


$('#update-button').click(function() {
    $.post('index.php?fuse=clients&controller=products&action=savedomaincontactinfo', $('#contactinfo').serialize(), function(data){
        var json = ce.parseResponse(data);
    });
});