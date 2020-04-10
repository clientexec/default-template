paymentmethod = paymentmethod || {};

$(document).ready(function () {
    paymentmethod.get_cc_info(paymentmethod.selectedplugin);
    $('.btn-update-payment-method').on('click', function(e) {
        if ($('.update-payment-method-frm').parsley('validate')) {
            $('.update-payment-method-frm').submit();
        }
    });
    $('select.paymenttype-list').on('change', function() {
        paymentmethod.get_cc_info($(this).val());
    });
    $('#deleteccbutton').on('click', function() {
        paymentmethod.delete_cc();
    });

    if ($('#btnDeleteProfileID').length > 0) {
        $('#btnDeleteProfileID').click(function(){
            paymentmethod.delete_profile_id();
        });
    }

    //This code here is to avoid an issue with the Delete button been displayed in a different line, when the div was been displayed by default.
    if ($('.selected_paymenttype').length > 0 && $('.'+$('.selected_paymenttype')[0].value+'BillingProfileID').length > 0) {
        $('.DivBillingProfileID').show();
    }
    //This code here is to avoid an issue with the Delete button been displayed in a different line, when the div was been displayed by default.
});

paymentmethod.get_cc_info = function(selectedplugin)
{
    $.get('index.php?fuse=admin&action=getpaymentplugindetails', {
        plugin: selectedplugin
    }, paymentmethod.process_plugin_details);
}

paymentmethod.delete_profile_id = function()
{
    paymenttype = $('.selected_paymenttype')[0].value;

    $.post('index.php?fuse=clients&controller=index&action=deleteprofileid&paymenttype='+paymenttype, {}, function (response) {
        var data = ce.parseResponse(response);
        if (data.error) {
            return false;
        }
        window.location = 'index.php?fuse=clients&controller=userprofile&view=paymentmethod';
    });
}

paymentmethod.delete_cc = function()
{
    $.post('index.php?fuse=clients&controller=index&action=deleteccnumber', {}, function (response) {
        var data = ce.parseResponse(response);
        if (data.error) {
            return false;
        }
        window.location = 'index.php?fuse=clients&controller=userprofile&view=paymentmethod';
    });
}

paymentmethod.process_plugin_details = function(json)
{
    if (json.error) {
        return false;
    }

    //show subscription options
    if (json.usingsubscriptionoptions) {
        $('#use_recurring').removeClass('hidden');
    } else {
        $('#use_recurring').addClass('hidden');
    }

    //Display Payment Information for special plugins
    $('#btnupdatepaymentmethod').addClass('hidden');
    $('.PaymentInformation').addClass('hidden');
    $('.PaymentIframe').prop('src', '');

    if ($('.' + json.internalname + 'PaymentInformation').length) {
        if (json.customercurrentpaymenttype == json.internalname) {
            $('.' + json.internalname + 'PaymentInformation').removeClass('hidden').trigger('paymentShow');
            if ($('.' + json.internalname + 'PaymentIframe').length > 0) {
                $('.' + json.internalname + 'PaymentIframe').prop('src', 'index.php?fuse=admin&view=viewpluginurl&plugintoshow=' + json.internalname);
            } else if (json.openHandler) {
                window[json.internalname+"OpenHandler"]();
            }
        } else {
            if ($('.update-payment-method-frm').parsley('validate')) {
                $('.update-payment-method-frm').submit();
            }
        }
    } else {
        $('#btnupdatepaymentmethod').removeClass('hidden');
    }

    //showHideProfileID
    if ($('.selected_paymenttype').length > 0) {
        $('.selected_paymenttype')[0].value = json.internalname;
    }

    if ($('.DivBillingProfileID').length > 0) {
        $('.DivBillingProfileID').hide();
    }

    if ($('.'+json.internalname+'BillingProfileID').length > 0) {
        $('.DivBillingProfileID').show();
    }
    //showHideProfileID

    if (json.description.length) {
        $('.plugin_description').html("<p>" + json.description + "</p>");
        $('.plugin_description').removeClass('hidden');
    } else {
        $('.plugin_description').addClass('hidden');
    }

    // show cc info
    if (json.showccoptions) {
        $('#creditcardinfo').removeClass('hidden');
    } else {
        $('#creditcardinfo').addClass('hidden');

        // return because the remaining options are only for cc
        return;
    }

    // cc validation field check
    if (json.awaitingvalidation != "") {
        $('#awaitingvalidation').html(json.awaitingvalidation);
        $('#awaitingvalidationspan').removeClass('hidden');
        $('#ccnumberspan').addClass('hidden');
        $('#deleteccspan').removeClass('hidden');
        $('#newccspan').addClass('hidden');
        $('#lastfourspan').addClass('hidden');
    } else {
        // console.debug(json.awaitingvalidation);
        if (json.last4 != "") {
            $('#newccspan').removeClass('hidden');
            $('#ccnumberspan').addClass('hidden');
            $('#lastfourspan').removeClass('hidden');
            $('#lastfour').val("xxxxxxxxxxxx" + json.last4);
            $('#lastfour2').textContent = "xxxxxxxxxxxx" + json.last4;
            $('#deleteccspan').removeClass('hidden');
        } else {
            $('#newccspan').addClass('hidden');
            $('#ccnumberspan').removeClass('hidden');
            $('#lastfourspan').addClass('hidden');
            $('#lastfour').val("");
            $('#lastfour2').textContent = "None";
            $('#deleteccspan').addClass('hidden');
        }
        $('#awaitingvalidationspan').addClass('hidden');
    }

    //if cc then which cards do we show
    $('#visa_logo').css('display', json.visastyle);
    $('#mastercard_logo').css('display', json.mastercardstyle);
    $('#americanexpress_logo').css('display', json.americanexpressstyle);
    $('#discover_logo').css('display', json.discoverstyle);
    $('#lasercard_logo').css('display', json.lasercardstyle);
    $('#dinersclub_logo').css('display', json.dinersclubstyle);
    $('#switch_logo').css('display', json.switchstyle);

    //for card validation
    $('#validccbits').val(json.visabit + json.mcbit + json.amexbit + json.discbit + json.laserbit + json.dinersbit + json.switchbit);
}
