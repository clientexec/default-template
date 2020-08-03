ticketview = ticketview || {};
$(document).ready(function(){
    $('.ticket-nav-tabs button').click(function () {
        $('.ticket-nav-tabs .btn-primary').removeClass('btn-primary');
        $(this).addClass('btn-primary')
        if ($(this).data('filter') == "messages") {
            $('.ticket-log, .frm-ticket').show();
            $('.ticket-custom-fields').hide();
        } else {
            $('.ticket-log, .frm-ticket').hide();
            $('.ticket-custom-fields').show();
        }
    });
    $('.btn-reply').click(function(){
        var status = $(this).attr('data-status');
        $('input[name="ticketstatus"]').val(status);

        var valid = $('.frm-ticket').parsley( 'validate' );
        if (valid) $('.frm-ticket').submit();
    });

    if ($('#new-file-button').length) {

        $('input[type=file]').bootstrapFileInput();
        $('input[type=file]').change(submitticket.selectedFile);

        $('#new-file-button').click(function(e){
            e.preventDefault();
            submitticket.cloneAttchInput();
        });

        submitticket.cloneAttchInput();
    }
    ticketview.loadCustomFields();
});

$('#close-ticket-button').click(function() {
    window.location = closeTicketURL;
});

submitticket.removeFileField = function (id) {
    document.getElementById(id).parentNode.parentNode.removeChild(document.getElementById(id).parentNode);
    submitticket.uploadFieldCount--;
};

/**
 * Updates the custom fields
 * @return void
 */
ticketview.updatecustomfields = function()
{
    $('#ticketCustomFieldsForm').parsley( 'validate' );
    $.post('index.php?fuse=support&controller=ticket&action=savecustomfields',{
        ticketId: ticketview.ticket_id,
        customfields: $('#ticketCustomFieldsForm').serializeArray()
    },function(t) {
        data = ce.parseResponse(t);
    });
};

ticketview.loadCustomFields = function() {

    $('#ticketCustomFieldsForm').empty();

    $.getJSON('index.php?fuse=support&controller=ticket&action=getticketcustomfields',
        {
            ticketId: ticketview.ticket_id
        },function(data){
            data = ce.parseResponse(data);
            if (data.count > 0) {
                $('.ticket-nav-tabs').show();
            }

            customFields.load(data.fields,function(data) {
                $('#ticketCustomFieldsForm').append(customFields.bootstrapWrap(data));
            }, function(){
                $('#ticketCustomFieldsForm .header label').parents('.header').addClass('col-xs-12 col-sm-5 customfield_group');
                $('#ticketCustomFieldsForm .header textarea').parents('.header').removeClass('col-sm-5').addClass('col-sm-10');
                $('#ticketCustomFieldsForm select').addClass('selectpicker').selectpicker('render');
                clientexec.postpageload('.ticket-active-tab');
            });

            if (data.fields.length > 0) {
                //check to see if all fields are disabled... if so remove update btn
                if (customFields.getAllFieldsDisabled()){
                    $('#ticketCustomFieldsSubmit').hide();
                } else {
                    $('#ticketCustomFieldsSubmit').show();
                    $('#ticketCustomFieldsSubmit').unbind('click');
                    $('#ticketCustomFieldsSubmit').click(ticketview.updatecustomfields);
                }
            }
    });
};