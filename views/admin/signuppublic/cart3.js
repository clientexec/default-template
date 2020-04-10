cart = cart || {};
gatewayNameSelected = '';

validate_vat = function() {
    cart.update_pricing();
}

$('.paymentMethod').on('click', function () {
    cart.toggle_gateway($(this).val());
});

cart.update_pricing = function() {
    if(document.getElementById('vat_validating') != undefined){
        document.getElementById('vat_validating').style.display = '';
        document.getElementById('vat_valid').style.display = 'none';
        document.getElementById('vat_invalid').style.display = 'none';
        document.getElementById('vat_error').style.display = 'none';
    }

    // Get the country and state information to pass to the view
    var selectedState = $('#' + cart.state_var_id).val();
    var selectedCountry = $('#' + cart.country_var_id).val();
    var selectedVATNumber = $('#' + cart.vat_var_id).val();

    $.getJSON('index.php?fuse=admin&controller=signup&action=getfinalpricinginfo',
        { state: selectedState, country: selectedCountry, vatNumber: selectedVATNumber } ,
        function(response) {
            response = ce.parseResponse(response);

            $('.get_total_image').show();
            $('#taxInformation').hide();

            label_count = (response.itemcount > 1) ? response.itemcount + " " + lang("Items") : 1 + " " + lang("Item");
            $('.total_item_count').text(label_count);
            $('.total_subtotal_price').html(response.totals.subTotal);
            if (response.totals.couponDiscount) {
              $('.total_subtotal_couponDiscount').html(response.totals.couponDiscount);
              $('.total_coupon_discount_row').show();
            }
            if (response.totals.taxRequired && response.totals.taxAmount) {
              $('.total_tax_name').text(response.totals.taxName);
              $('.total_tax_amount').html(response.totals.taxAmount);
              $('.total_tax_row').show();
            }else{
              $('.total_tax_row').hide();
            }
            if (response.totals.taxRequired && response.totals.tax2Amount) {
              $('.total_tax2_name').text(response.totals.tax2Name);
              $('.total_tax2_amount').html(response.totals.tax2Amount);
              $('.total_tax2_row').show();
            }else{
              $('.total_tax2_row').hide();
            }

            //what if we don't have any taxes
            if (response.totals.taxableitems == 0) {
              $('.total_tax_row').hide();
              $('.total_tax2_row').hide();
            }

            $('.total_total_pay').html(response.totals.totalPay);
            $('.get_total_image').hide();
            $('#taxInformation').show();

            document.getElementById('totalPay_raw').value = response.totals.totalPay_raw;

            if ($('.paymentbutton2').length > 0) {
                $('.paymentbutton2').hide();
            }
            if (parseFloat(response.totals.totalPay_raw) == 0 && document.getElementById('hidePaymentMethods').value == 1) {
                $('.payment_information_box').hide();
                document.getElementById('payment_information_display').value = 0;
                $('#submitButton').text(cart.main_button_text);
                $('.customButton').text(cart.main_button_text);
                if ($('.'+gatewayNameSelected+'paymentbutton').length > 0) {
                    $('.'+gatewayNameSelected+'paymentbutton').hide();
                    $('.paymentbutton1').show();
                }
            } else {
                $('.payment_information_box').show();
                document.getElementById('payment_information_display').value = 1;
                if ($('.'+gatewayNameSelected+'paymentbutton').length > 0) {
                    $('.paymentbutton1').hide();
                    $('.'+gatewayNameSelected+'paymentbutton').show();
                }
            }

            if(document.getElementById('totalPay_raw') != undefined
              && document.getElementById('creditBalance_raw') != undefined
              && parseFloat(document.getElementById('totalPay_raw').value) > 0.00
              && parseFloat(document.getElementById('totalPay_raw').value) <= parseFloat(document.getElementById('creditBalance_raw').value)){
                $('.credit_balance_checkbox').prop('checked', false);
                $('.credit_balance_option').hide();
                $('.credit_balance_checkbox').prop('disabled', true);
                $('.payment_method_apply_my_credit').prop('checked', true);
                cart.toggle_gateway('apply_my_credit');
                $('.credit_balance_payment_option').show();
            }else{
                $('.credit_balance_payment_option').hide();
                if(parseFloat(document.getElementById('creditBalance_raw').value) > 0){
                    $('.credit_balance_checkbox').prop('disabled', false);
                    $('.credit_balance_option').show();
                    $('.credit_balance_checkbox').prop('checked', true);
                }else{
                    $('.credit_balance_checkbox').prop('checked', false);
                    $('.credit_balance_option').hide();
                    $('.credit_balance_checkbox').prop('disabled', true);
                }
            }

            if (document.getElementById('VAT'+cart.vat_var_id)) {
                if(selectedCountry == 'GR'){
                    selectedCountry = 'EL';
                }
                $("#vat_country").html(selectedCountry);
                if (response.totals.requestVAT) {
                    document.getElementById('vat_validating').style.display = 'none';
                    if(selectedVATNumber != ""){
                        switch(response.totals.vatResponse){
                            case "-1":
                                document.getElementById('vat_error').style.display = '';
                                break;
                            case "0":
                                document.getElementById('vat_invalid').style.display = '';
                                break;
                            case "1":
                                document.getElementById('vat_valid').style.display = '';
                                break;
                        }
                    }
                    document.getElementById('VAT'+cart.vat_var_id).style.display = 'block';
                } else {
                    document.getElementById('VAT'+cart.vat_var_id).style.display = 'none';
                }
            }
        }
      );

}

cart.process_profile_customfields = function(fields)
{
  customFields.load(fields,function(data) {
        $('.customfields-wrapper').append($("<div class='customfield'>").append(customFields.bootstrap(data)));
    }, function(){
        clientexec.postpageload('.customfields-wrapper');
        $('.searching-customfields').remove();
        $('.type_11').parent().addClass('first_name col-sm-5 col-xs-12 form-group').appendTo($('.type_63').parent());
        $('.type_11').parent().find('label').addClass('sub_label').text(lang('First')).appendTo($('.first_name')); //moving label below field

        $('.type_12').parent().addClass('second_name col-sm-5 col-xs-12 form-group').appendTo($('.type_63').parent());
        $('.type_12').parent().find('label').addClass('sub_label').text(lang('Last')).appendTo($('.second_name')); //moving label below field

        $('.type_13').parents('.customfield').addClass('email col-sm-5 col-xs-12 form-group');

        $('.type_14').parents('.customfield').addClass('organization col-sm-5 col-xs-12 form-group');
        $('.type_7').parents('.customfield').addClass('phone col-sm-5 col-xs-12 form-group');
        $('.type_16').parents('.customfield').addClass('accouncements col-sm-5 col-xs-12 form-group customfield_group');
        $('.type_1').parents('.customfield').addClass('accouncements col-sm-5 col-xs-12 form-group customfield_group');
        $('.type_9').parents('.customfield').addClass('accouncements col-sm-5 col-xs-12 form-group customfield_group');
        $('.type_8').parents('.customfield').addClass('language col-sm-5 col-xs-12 form-group customfield_group');

        $('.type_65').parents('.customfield').addClass('email col-sm-5 col-xs-12 form-group');
        $('#password').parent().parent().insertAfter($('.type_13').parents('.customfield'));

        $('.customfields-wrapper .customfield textarea').parent().addClass('col-xs-12 col-sm-10 textarea form-group');
        $('.customfields-wrapper .customfield input.type_0').parent().addClass('col-xs-12 col-sm-5 link form-group');

        $('.type_47').parent().parent().addClass('col-sm-5 col-xs-12 form-group');

        // FULL ADDRESS
        // let's move around address
        $('.type_2').parent().addClass('address col-sm-10 col-xs-12 form-group').appendTo($('.type_64').parent());
        $('.type_2').parent().find('label').addClass('sub_label').text(lang('Address')).appendTo($('.address')); //moving label below field

        $('.type_3').parent().addClass('city col-sm-5 col-xs-12 form-group').appendTo($('.type_64').parent());
        $('.type_3').parent().find('label').addClass('sub_label').text(lang('City')).appendTo($('.city')); //moving label below field

        $('.type_4').parent().addClass('state col-sm-5 col-xs-12 form-group').appendTo($('.type_64').parent());
        $('.type_4').parent().find('label').addClass('sub_label').text(lang('State / Province / Region')).appendTo($('.state')); //moving label below field

        $('.type_5').parent().addClass('zipcode col-sm-5 col-xs-12 form-group').appendTo($('.type_64').parent());
        $('.type_5').parent().find('label').addClass('sub_label').text(lang('Postal / Zip Code')).appendTo($('.zipcode')); //moving label below field

        $('.type_6').parent().addClass('country col-sm-5 col-xs-12 form-group').appendTo($('.type_64').parent());
        $('.type_6').parent().find('label').addClass('sub_label').text(lang('Country')).appendTo($('.country')); //moving label below field

        $('.customfields-wrapper .customfield .date').parents('.customfield').addClass('customfield_group form-group col-sm-5 col-xs-12');

        //bold the group label
        $('.type_64').hide().parent().addClass('customfield_group');
        $('.type_63').hide().parent().addClass('customfield_group');

        $('.customfields-wrapper select').addClass('selectpicker');

        $('.customfield').addClass('customfield_not_ingroup');
        $('.customfield_group,.customfield_group .customfield').removeClass('customfield_not_ingroup');
        $('.customfield_hidden, .type_65, .type_13').parent('.customfield').removeClass('customfield_not_ingroup');
    });
}


cart.submit_form = function(allowSubmit) {
  if ($('#submitButton').hasClass('disabled')) return;
  if ($('.customButton').hasClass('disabled')) return;

  if(allowSubmit == '1') {
      jQuery('#submitForm').unbind('submit').submit();
  } else {

      var valid = $('#submitForm').parsley( 'validate' );

      jQuery('#submitForm').submit();
  }
  return false;
}

// Show an ExtJS alert box when deleting a cart item
cart.confirmCartDelete = function(itemName, itemID, isBundle) {

    if(isBundle) {
        var confirmMsg = lang('Are you sure that you wish to remove the item from your cart? <br>Note: The associated items will also be removed.');
    } else {
        var confirmMsg = lang('Are you sure that you wish to remove the item from your cart?');
    }

    RichHTML.alert(confirmMsg, {}, function(o){

      if (o.btn == lang("Yes")) {

      $.ajax({
         url: 'index.php?fuse=admin&controller=signup&action=deletecartitem',
         success: function () {
                window.location='order.php?step=3';
         },
         data: { cartItem: itemID },
         dataType: 'json'
      });
      }

    });

}

cart.toggle_addons = function(productId) {
    $('#addons-' + productId).toggle('hidden');

    if ( $('#toggle_addon_icon_' + productId).html() == '<i class="fa fa-plus"></i>' ) {
        $('#toggle_addon_icon_' + productId).html('<i class="fa fa-minus"></i>');
        $('#toggle_addon_text_' + productId).html(lang("Hide Product Addons"));
    } else {
        $('#toggle_addon_icon_' + productId).html('<i class="fa fa-plus"></i>');
        $('#toggle_addon_text_' + productId).html(lang("Show Product Addons"));
    }
    return false;
}

cart.show_tc = function() {
    new RichHTML.window({
        width: 550,
        height: 550,
        showSubmit: false,
        title: lang("Terms & Conditions"),
        content: $('#toc').html()
    }).show();
}

cart.agree_tc = function() {
    if ($('#submitButton').hasClass('disabled')) {
        $('#submitButton').removeClass('disabled');
    } else {
        $('#submitButton').addClass('disabled');
    }

    if ($('.customButton').hasClass('disabled')) {
        $('.customButton').removeClass('disabled');
    } else {
        $('.customButton').addClass('disabled');
    }
}

cart.toggle_gateway = function(gatewayName) {
    var el = $('#' + cart.selected_gateway + '-extraFields');
    if (el) {
        el.addClass('hidden')
    }
    var el = $('#' + gatewayName + '-extraFields');
    if (el) {
        el.removeClass('hidden')
    }

    cart.selected_gateway = gatewayName;
    gatewayNameSelected = gatewayName;

    $('#submitButton').text(cart.main_button_text);
    $('.customButton').text(cart.main_button_text);

    $('.payment_method_selected').removeClass('payment_method_selected');
    $('.payment_method_'+gatewayName).parent().addClass('payment_method_selected');

    if ($('.paymentbutton2').length > 0) {
        $('.paymentbutton2').hide();
    }
    if ($('.'+cart.selected_gateway+'paymentbutton').length > 0 && !(parseFloat(document.getElementById('totalPay_raw').value) == 0 && document.getElementById('hidePaymentMethods').value == 1)) {
        $('.paymentbutton1').hide();
        $('.'+cart.selected_gateway+'paymentbutton').show();
    } else {
        $('.'+cart.selected_gateway+'paymentbutton').hide();
        $('.paymentbutton1').show();
    }

    var el2 = document.getElementById('autochargeccblock');
    if(el2){
        el2.style.display = 'none';
        var el3 = document.getElementById('autochargecc');
        if(el3){
            el3.checked = true;

            //If autopayment, display the autocharge option
            var el4 = document.getElementById(gatewayName+'_autopayment');
            if(el4.value == 1) {
                el2.style.display = 'block';
            }
        }
    }
}

// Show popup for Coupon
cart.applyCoupon = function(itemID, couponCode) {

  var confirmMsg = lang("Please enter the Coupon Code");

  RichHTML.prompt(confirmMsg, {} , function(o){

    if (o.btn == lang('OK')){
          couponCode = ce.htmlspecialchars(o.elements.value);
      $.ajax({
         url: 'index.php?fuse=admin&controller=signup&action=validatecoupon',
         success: function (rsp) {
            if(rsp.error){
              ce.parseResponse(rsp);
            } else {
              window.location='order.php?step=3';
            }
         },
         data: { couponCode: couponCode, itemID: itemID },
         dataType: 'json'
      });

      }

  });
}

cart.toggle_users = function(type, numpaymentmethods) {

  if(type == 'existing') {
      $('.register-block').show();
      $('.customerdata').hide();
  } else {
      $('.customerdata').show();
      $('.register-block').hide();
  }

  return false;
}
