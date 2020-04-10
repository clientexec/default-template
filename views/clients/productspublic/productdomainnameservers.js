$(document).ready(function(){
    customFields.load(nameservers.jsonFields,function(data) {
        var html = '<div class="form-group col-xs-12">';
        $.each(data, function (key, value) {
            if ($(value).css('display') == 'none') {
                $(value).addClass('hidden');
            }
            if (value.localName == 'div') {
                $(value).css('padding-top', '').addClass('col-xs-12');
                if ($('#addnameserver', value).length) {
                    $('#addnameserver', value).removeAttr('style').addClass('btn-info pull-right hidden');
                }
            } else {
                html += '<div class="col-xs-4">';
                $(value).removeAttr('style');
            }
            if (value.localName == 'label') {
                $(value).addClass('control-label');
            } else if (value.localName == 'input') {
                $(value).addClass('form-control');
            } else if (value.localName == 'select') {
                $(value).addClass('form-control selectpicker').removeClass('disableSelect2AutoLoad');
            } else if (value.localName == 'button') {
                $(value).removeAttr('onclick').removeClass('rich-button').addClass('form-control btn-danger');
            }
            html += value.outerHTML
            if (value.localName != 'div') {
                html += '</div>';
            }
        });
        html += '</div>';
        $('#nameservers-div').append(html);
    }, function(){
        clientexec.postpageload('#nameservers-div');
        $('.form-actions').removeClass('hidden');
    });
});


$('#update-button').click(function() {
    $.post('index.php?fuse=clients&controller=products&action=savedomainnameservers', $('#nameservers').serialize(), function(data){
        var json = ce.parseResponse(data);
    });
});

$('#nameservers-div').on('click', 'button[name$="_nameserverdelete"]', function () {
    $(this).parent().parent().remove();
});

//add a new host entry
function nameservers_ChangeUseDefaults()
{
    if ($('#ns_usedefaults').val() === "0") {
        // let's show all name server fields
        $('button, input, label', '#nameservers-div')
            .not('#blankrecord_nameserverdelete')
            .not('#blankrecord')
            .not('label[for="blankrecord"]')
            .removeClass('hidden');
    } else {
        // let's hide all name server fields
        $('button, input, label', '#nameservers-div')
            .not('#blankrecord_nameserverdelete')
            .not('#blankrecord')
            .not('label[for="blankrecord"]')
            .not('label[for="ns_usedefaults"]')
            .not('button[data-id="ns_usedefaults"]')
            .addClass('hidden');
    }
}

function nameservers_addnameserver()
{
    var default_ns = $('#blankrecord').parent().parent().clone();
    var nth = $('input.nameserver').length;

    $('label', default_ns)
        .html('Name Server ' + nth)
        .prop('for', 'ns_' + nth)
        .removeClass('hidden');
    $('input', default_ns)
        .prop('id', 'ns_' + nth)
        .prop('name', 'ns_' + nth)
        .val('')
        .removeClass('hidden');
    $('button', default_ns)
        .prop('id', 'ns_' + nth + '_nameserverdelete')
        .prop('name', 'ns_' + nth + '_nameserverdelete')
        .removeClass('hidden');

    $('#addnameserver_wrapper').parent().before(default_ns);
}