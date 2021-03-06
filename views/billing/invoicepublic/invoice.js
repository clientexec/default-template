invoice = invoice || {};

$('.btn-pay-invoice').on('click', function() {
    invoice.showPaymentOptions();
});
$('.btn-apply-credit').on('click', function() {
    invoice.apply_account_credit();
});
$('.paymentMethod').on('click', function () {
    invoice.toggle_gateway($(this).val());
});

invoice.apply_account_credit = function() {
    location.href = "index.php?sessionHash=" + clientexec.sessionHash + "&fuse=billing&controller=invoice&action=applyaccountcredit&id=" + invoice.id;
}

invoice.toggle_gateway = function(gatewayName) {
    var el = $('#' + invoice.selected_gateway + '-extraFields');
    if (el.length > 0) {
        el.addClass('hidden')
    }
    var el = $('#' + gatewayName + '-extraFields');
    if (el.length > 0) {
        el.removeClass('hidden')
        $('.makeDefaultNoCC').addClass('hidden');
        $('.makeDefaultCC').removeClass('hidden');
    } else {
        $('.makeDefaultCC').addClass('hidden');
        $('.makeDefaultNoCC').removeClass('hidden');
    }
    invoice.selected_gateway = gatewayName;
    $('.payment_method_selected').removeClass('payment_method_selected');
    $('.payment_method_' + gatewayName).parent().addClass('payment_method_selected');

    if ($('.paymentbutton2').length) {
        $('.paymentbutton2').addClass('hidden');
    }
    if ($('.'+invoice.selected_gateway+'paymentbutton').length) {
        $('.paymentbutton1').addClass('hidden');
        $('.' + invoice.selected_gateway + 'paymentbutton').removeClass('hidden').trigger('paymentShow');
    } else {
        $('.paymentbutton1').removeClass('hidden');
    }
}

invoice.sendInvoice = function(invoiceId) {
    RichHTML.msgBox(lang('Are you sure you want to send the selected invoice?'),
    {
        type:"yesno"
    }, function(result) {
        if(result.btn === lang("Yes")) {
            RichHTML.mask();
            var data = {
                    items:          invoiceId,
                    itemstype:      'invoices',
                    actionbutton:   'inv-send-smart'
                };

            $.ajax({
                url: "index.php?fuse=billing&controller=invoice&action=actoninvoice",
                type: 'POST',
                data:  data,
                success:  function(xhr){
                    RichHTML.unMask();
                    RichHTML.alert(
                        lang('Invoice has been successfully sent'),
                        {
                            buttons: {
                                button1: {
                                    text: "OK",
                                    type: "OK"
                                },
                            }
                        }
                    );
                }
            });
        }
    });
};