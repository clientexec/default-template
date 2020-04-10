hostinfo.newhostrecordid = 0;

$(document).ready(function(){
    customFields.load(hostinfo.jsonFields,function(data) {
        var html = '<div class="form-group col-xs-12">';
        $.each(data, function (key, value) {
            if ($(value).css('display') == 'none') {
                $(value).addClass('hidden');
            }
            if (value.localName == 'div') {
                $(value).css('padding-top', '').addClass('col-xs-12');
                if ($('#addhostrecord', value).length) {
                    $('#addhostrecord', value).removeAttr('style').addClass('btn-info pull-right');
                }
            } else {
                html += '<div class="col-xs-3">';
                $(value).removeAttr('style');
            }
            if (value.localName == 'label') {
                $(value).addClass('control-label');
            } else if (value.localName == 'input') {
                $(value).addClass('form-control');
            } else if (value.localName == 'select') {
                $(value).addClass('form-control selectpicker');
            } else if (value.localName == 'button') {
                $(value).removeAttr('onclick').removeClass('rich-button').addClass('form-control btn-danger');
            }
            html += value.outerHTML
            if (value.localName != 'div') {
                html += '</div>';
            }
        });
        html += '</div>';
        $('#hostinfo-div').append(html);
    }, function(){
        //clientexec.postpageload('#hostinfo-div');
        $('.form-actions').removeClass('hidden');
        $('#addhostrecord').unbind('click').on('click', function () {
            hostinfo.newhostrecordid++;
            var cloneDisplay = $('#hostname_CT_blankrecord').parent().parent().clone();
            $('.hosttype', cloneDisplay)
                .prop('id', 'hosttype_CT_' + hostinfo.newhostrecordid)
                .prop('name', 'hosttype_CT_' + hostinfo.newhostrecordid)
                .removeClass('hidden')
                .val('');
            $('.hostname', cloneDisplay)
                .prop('id', 'hostname_CT_' + hostinfo.newhostrecordid)
                .prop('name', 'hostname_CT_' + hostinfo.newhostrecordid)
                .removeClass('hidden')
                .val('');
            $('.hostaddress', cloneDisplay)
                .prop('id', 'hostaddress_CT_' + hostinfo.newhostrecordid)
                .prop('name', 'hostaddress_CT_' + hostinfo.newhostrecordid)
                .removeClass('hidden')
                .val('');
            $(cloneDisplay).append('<div class="col-xs-3"><button type="button" name="CT_' + hostinfo.newhostrecordid + '_hostdelete" id="CT_' + hostinfo.newhostrecordid + '_hostdelete" class="btn btn-danger form-control" onclick="hostrecords_deleteaddress(this);"><span>Delete</span></button></div>');
            var cloneInput = $('#CTT_blankrecord').parent().parent().clone();
            $('span', cloneInput).prop('for', 'CTT_' + hostinfo.newhostrecordid)
            $('input', cloneInput)
                .prop('id', 'CTT_' + hostinfo.newhostrecordid)
                .prop('name', hostinfo.newhostrecordid);

            $('#addhostrecord_wrapper').parent().before(cloneDisplay);
            $('#addhostrecord_wrapper').parent().before(cloneInput);
        });
    });

    $('#hostinfo-div').on('click', 'button[name$="_hostdelete"]', function () {
        id = $(this).prop('id').split("_")[1];
        $('#CTT_' + id).parent().parent().remove();
        $(this).parent().parent().remove();
    });

});

//add a new host entry
function hostrecords_addzoneentry()
{

    hostinfo.newhostrecordid++;


    var hosttype = $($('select.hosttype')[0]).clone();
    hosttype.attr('id',"hosttype_CT_"+hostinfo.newhostrecordid);
    hosttype.attr('name',"hosttype_CT_"+hostinfo.newhostrecordid);
    var hostname = $($('input.hostname')[0]).clone().removeClass('hidden');
    hostname.prop('id', 'hostname_CT_' + hostinfo.newhostrecordid);
    hostname.attr('name', 'hostname_CT_' + hostinfo.newhostrecordid);
    hostname.val("");
    var hostaddress = $($('input.hostaddress')[0]).clone().show();
    hostaddress.attr('id',"hostaddress_CT_"+hostinfo.newhostrecordid);
    hostaddress.attr('name',"hostaddress_CT_"+hostinfo.newhostrecordid);
    hostaddress.val("");

    $('#addhostrecord').parent().before("<div id='hostdivider_CT_"+hostinfo.newhostrecordid+"' style='padding-top:10px;'></div>");
    $('#addhostrecord').parent().before(hostname);
    $('#addhostrecord').parent().before(hosttype);
    $('#addhostrecord').parent().before(hostaddress);

    $('#addhostrecord').parent().before('<button type="button" name="CT_'+hostinfo.newhostrecordid+'_hostdelete" id="CT_'+hostinfo.newhostrecordid+'_hostdelete" style="margin-left:10px;" class="rich-button btn" onclick="hostrecords_deleteaddress(this);"><span>Delete</span></button>');
}

$('#update-button').click(function() {
    $.post('index.php?fuse=clients&controller=products&action=savedomainhostrecords', $('#hostinfo').serialize(), function(data){
        var json = ce.parseResponse(data);
    });
});