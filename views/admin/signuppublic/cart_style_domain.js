domains = {};
domains.additional_fields = [];

/**
* @return int possible return values:
*       -1:    Domain name already has an account in this system
*       0:     Domain available
*       1:     Domain already registered
*       2:     Registrar Error, domain extension not recognized or supported
*       3:     Domain invalid
*       5:     Could not contact registry to look up domain
*/
domains.search_domain = function(searchType) {

    if ( searchType == 'self') {

        // self-manage, just submit the domain and carry on.

        products_data = {};
        products_data.is_domain = 1;
        products_data.domainname = $('.self_domain').val();
        products_data.domainType = 2;
        products_data.productGroup = domains.productGroup;

        $.ajax({
            url: 'index.php?fuse=admin&controller=signup&action=updateparentpackage',
            type: 'POST',
            data: products_data,
            success: function (result) {
                json = ce.parseResponse(result);
                if (!json.error) {
                    window.location = json.nexturl;
                }
            }
        });

        return;

    } else if ( searchType == 'subdomain' ) {
        products_data = {};
        products_data.is_domain = 1;
        products_data.domainname = $('#subdomain').val() + '.' + $('#subdomain-tld').val();
        products_data.domainType = 2;
        products_data.productGroup = domains.productGroup;

        $.ajax({
            url: 'index.php?fuse=admin&controller=signup&action=updateparentpackage',
            type: 'POST',
            data: products_data,
            success: function (result) {
                json = ce.parseResponse(result);
                if (!json.error) {
                    window.location = json.nexturl;
                }
            }
        });

        return;

    } else if ( searchType == 'register' ) {
        $('.first_domain_name').val($('.first_domain_name').val().toLowerCase());
        name = $('.first_domain_name').val();
        tld = $('.domain_extension').find('option:selected').text();
        product_id = $('.domain_extension').find('option:selected').val();

        searchOptionsDiv = '#domainSearchOptions';
        searchResultsDiv = '#domainSearchResults';
    } else if ( searchType == 'transfer' ) {
        $('.transfer_domain').val($('.transfer_domain').val().toLowerCase());
        name = $('.transfer_domain').val();
        tld = $('.transfer_extension').find('option:selected').text();
        product_id = $('.transfer_extension').find('option:selected').val();

        searchOptionsDiv = '#domainTransferSearchOptions';
        searchResultsDiv = '#domainTransferSearchResults';
    }

    if ( name == '' ) {
        $(searchResultsDiv).html("<div class='ce-alert alert alert-danger ce-alert-error domain_search_alreadyregistered'><strong>"+lang("Please enter a valid domain")+"</strong></div>");
        return;
    }


        // Handle the searching animation
        $(searchResultsDiv).html('<i class="fa fa-spinner fa-spin fa-lg"></i>&nbsp;&nbsp;'+lang("Searching domain availability ..."));
        $('#domainSearchOptions').html("");
        $('#domainTransferSearchOptions').html("");
        $('.continue-btn').hide();

        $.getJSON('index.php?fuse=admin&controller=signup&action=searchdomain',
            {
                name: name,
                tld: tld.trim(),
                product:product_id,
                searchType: searchType,
                cartParentPackageId: cartParentPackageId,
                cartParentPackageTerm: cartParentPackageTerm
            },
            function(response){
                //response = ce.parseResponse(response);
                domains.response = response;

                if (response.error) {
                    $(searchResultsDiv).html("");
                    searched_domain_status = 2;
                    error_message = response.message;
                } else {
                    search_results  = response.search_results;
                    searched_domain_status = search_results.status;
                    error_message = lang("There was an error looking up that domain.  Please try again.");
                }



                if ( searchType == 'transfer' ) {
                    if ( searched_domain_status == 1 ) {
                        $(searchResultsDiv).html("<div class='domain_search_notregistered'>"+lang("Good news")+", "+search_results.domainName+" "+lang("is available to transfer")+"</div>");
                    } else if ( searched_domain_status == 0 ) {
                        $(searchResultsDiv).html("<div class='domain_search_alreadyregistered'>"+lang("Sorry")+", "+search_results.domainName+" "+lang("is not available to transfer")+"</div>");
                    } else  {
                        $(searchResultsDiv).html("<div class='ce-alert alert alert-danger ce-alert-error domain_search_alreadyregistered'><strong>"+error_message+"</strong></div>");
                        return;
                    }

                }



                // no errors, and we are searching to register
                else if ( searchType == 'register' ) {
                    if (searched_domain_status == 1) {
                        $(searchResultsDiv).html("<div class='domain_search_alreadyregistered'>"+lang("Sorry")+", "+search_results.domainName+" "+lang("is already registered")+"</div>");
                    } else if (searched_domain_status == 0) {
                        $(searchResultsDiv).html("<div class='domain_search_notregistered'>"+lang("Good news")+", "+search_results.domainName+" "+lang("is available to register")+"</div>");
                    } else {
                        $(searchResultsDiv).html("<div class='ce-alert alert alert-danger ce-alert-error domain_search_alreadyregistered'><strong>"+error_message+"</strong></div>");
                        // only return if there are 0 domains to show.
                        if ( search_results.available_count == 0 ) {
                            return;
                        }
                        // set this to 1, so we can get to the next step
                        searched_domain_status = 1;
                    }
                }

                    //only show domain suggest if domain came back with either available or registered (not any error status)
                    if ( (search_results.available_options.length > 0) && (search_results.available_count > 0) && (searched_domain_status == 0 || searched_domain_status == 1) ) {

                            //let's show the results
                            //response.search_results.available_options
                            $.get('templates/default/views/admin/signuppublic/domainresults.mustache',function(template) {
                                    $.each(response.search_results.available_options, function (index1, value1) {
                                        response.search_results.available_options[index1].index = index1;
                                        $.each(value1.price, function (index2, value2) {
                                                if ( searchType == 'transfer' ) {
                                                    if ( value2.transfer == '' ) {
                                                        // Tranfer periods can be disabled by leaving it blank
                                                        delete response.search_results.available_options[index1].price;
                                                        return;
                                                    }
                                                    periodPrice = value2.formated_transfer;
                                                } else {
                                                        periodPrice = value2.formated_price;
                                                }

                                                if ( ce.isIE()) {
                                                    periodPrice = periodPrice.replace(/\$/g, '$$$$');
                                                }
                                                response.search_results.available_options[index1].price[index2].priceLang = lang('% for %', value2.period, periodPrice);
                                        });
                                    });
                                    items = {
                                        domainType: searchType,
                                        available_options:response.search_results.available_options,
                                        name: name,
                                        translate: function () {
                                            return function(text,render) {
                                                    switch (text) {
                                                            case 'Available Domains':
                                                                return lang("Available Domains");
                                                            case 'Years':
                                                                return lang("Years");
                                                            case 'Add to cart':
                                                                return lang('Add to cart');
                                                    }
                                            }
                                        },
                                        render_additional: function () {
                                            $.each(response.search_results.available_options, function (index, value) {
                                                domains.additional_fields[value.domain_name] = value.additional_options;
                                            });
                                        }
                                    };

                                    $(searchOptionsDiv).html(Mustache.render(template, items));

                                    // gotta build the select2 dynamically in order to use html for currencies inside the options
                                    // see https://github.com/clientexec/webapp/issues/1481
                                    $('input.domain-option-yrs').each(function() {
                                        var index = $(this).data('index');
                                        var select = $(this).parent().find('select.domain-option-yrs');
                                        var firstId = false;
                                        $.each(response.search_results.available_options[index].price, function(ix, value) {
                                            selected = '';
                                            if ( typeof value === 'undefined' ) {
                                                return;
                                            }

                                            //default to the same billing cycle as the one selected in the parent package if available
                                            if (!firstId || (value.period_id*12) == cartParentPackageTerm) {
                                                firstId = value.period_id;
                                                selected = ' selected';
                                            }

                                            select.append('<option value="' + value.period_id + '"' + selected + '>' + value.priceLang + '</option>');
                                        });
                                        select.addClass('selectpicker');
                                        select.selectpicker('render');
                                    });

                                    suggest_label = '';
                                    if ( searchType == 'register' ) {
                                        if ( searched_domain_status == 1) {
                                            suggest_label = lang("But don’t worry, we found these other great domains for you.");
                                        } else if ( response.search_results.available_options.length > 1 ) {
                                            suggest_label = lang("We also found additional results for you...");
                                        }
                                    }
                                    $(searchOptionsDiv).prepend("<div class='other-options-available'>"+suggest_label+"</div>");
                                    clientexec.postpageload(".available-domains-to-register");
                                }
                            );

                    } else {

                    }
                }
        );
}

$(document).ready(function(){


    $('.first_domain_name').on('keydown', function(event) {
        if (event.keyCode == 13) domains.search_domain('register');
    });

    $("#domainSearchOptions").on("click", "i.fa.fa-times-circle-o", function(event){
        product_id = $(this).parent().parent().data('product-id');

        //let's remove all those fields
        $('.domain-additional-options[data-product-id="'+product_id+'"] .customfields-wrapper').empty();
        $('.domain-additional-options[data-product-id="'+product_id+'"] .extra_attributes-wrapper').empty();
        $('.domain-additional-options[data-product-id="'+product_id+'"] .addons-wrapper').empty();

        $('.domainForm[data-product-id="'+product_id+'"]').removeClass('selected-domain-form')
        $('.domain-additional-options[data-product-id="'+product_id+'"]').hide();

        $(this).parent().parent().find('.btn-warning').removeClass('btn-warning').text(lang('Add to cart'));
        $(this).parent().parent().find('select.domain-option-yrs').prop('disabled', false);
        $(this).parent().parent().find('.customfields-wrapper').html('');
        $(this).parent().parent().find('.addons-wrapper').html('');
        $(this).parent().parent().find('.extra_attributes-wrapper').html('');
        $(this).remove();

    });

    $("#domainSearchOptions").on("click", ".configure-product", function(event){

            var product_id = $(this).data('product-id');
            selected_new_domain = domains.start_additional_info_check(this, product_id);
            if (selected_new_domain) {
                $('.selected-domain-form[data-product-id='+product_id+'] .domain-option-add').append('<i class="fa fa-times-circle-o"></i>');
            }

    });

     $("#domainTransferSearchOptions").on("click", ".configure-product", function(event){

            var product_id = $(this).data('product-id');
            selected_new_domain = domains.start_additional_info_check(this, product_id);
            if (selected_new_domain) {
                $('.selected-domain-form[data-product-id='+product_id+'] .domain-option-add').append('<i class="fa fa-times-circle-o"></i>');
            }

    });

        $('#self-manage-button').on('click', function(e){
            e.preventDefault();

            $('#submitForm').parsley( 'validate' );

            if ( $('#submitForm').parsley( 'isValid' ) ) {
                domains.search_domain('self');
            }
        });

         $('#subdomain-button').on('click', function(e){
            e.preventDefault();

            $('#submitForm-subdomain').parsley( 'validate' );

            if ( $('#submitForm-subdomain').parsley( 'isValid' ) ) {
                domains.search_domain('subdomain');
            }
        });


});

domains.submit_selected_domains = function()
{
    var products_data = {};
    products_data.products = {};
    // let's loop through the selected rows and grab any fields
    $('.selected-domain-form').each(function() {
        // we might not have any attributes
        products_data.products[$(this).data('product-id')] = $(this).serializeJSON();
        products_data.products[$(this).data('product-id')].is_domain = 1;
        products_data.products[$(this).data('product-id')].domainname = $(this).find('.domain-option-name').html();
        products_data.products[$(this).data('product-id')].paymentterm = $(this).find('select.domain-option-yrs').val();
        products_data.products[$(this).data('product-id')].product = $(this).data('product-id');
        products_data.products[$(this).data('product-id')].domainType = $(this).data('domain-type');
    });


     if ($('.domainForm').parsley('validate')) {
        RichHTML.mask();
        $.ajax({
            url: 'index.php?fuse=admin&controller=signup&action=savedomainfields',
            type: 'POST',
            data: products_data,
            success: function (result) {
                RichHTML.unMask();
                json = ce.parseResponse(result);
                if (!json.error) {
                    window.location = json.nexturl;
                }
            }
        });
    }
}

/* method to run when add to cart button is clicked (or remove) */
domains.start_additional_info_check = function(self, product_id)
{
    $(self).parent().parent().find('select.domain-option-yrs').prop('disabled', 'disabled');
    domainName = $(self).data('domain-name');
    var count_domains = $('.domain-option-name').length;
    //we need to deep copy variable so that we con't override in customfields
    var additional_fields = domains.additional_fields[domainName];
    var has_attributes = true;

    if (additional_fields.addons.length == 0 &&
            additional_fields.customFields.length == 0 &&
            additional_fields.extra_attributes.length == 0) {
            has_attributes = false;
    }

    $('.domainForm[data-domain-name="'+domainName+'"]').addClass('selected-domain-form');

    //let's see if we clicked continue if so submit
    if (  (count_domains == 1 && !has_attributes) || ($(self).text() == lang('Continue')) ) {
        domains.submit_selected_domains();
        return false;
    }

    $(self).addClass('btn-warning').text(lang('Continue'));

    // we don't have any attributes for this product
    if (!has_attributes) return true;

    $('form.domainForm[data-domain-name="' + domainName + '"]').show();

    //let's check custom fields
    if (additional_fields && additional_fields.customFields.length > 0) {
        //let's load custom fields
        customFields.load(additional_fields.customFields,function(data) {
            $('form.domainForm[data-domain-name="' + domainName + '"] .customfields-wrapper').append(customFields.bootstrapWrap(data));
        }, function(){
            $('.customfields-wrapper .header label').parents('.header').addClass('col-xs-12 col-sm-5 customfield_group');
            $('.customfields-wrapper .header textarea').parents('.header').removeClass('col-sm-5').addClass('col-sm-10');
            $('form.domainForm[data-domain-name="' + domainName + '"] .customfields-wrapper select').addClass('selectpicker');
            $('form.domainForm[data-domain-name="' + domainName + '"] .customfields-wrapper select').selectpicker('render');
        },true);

    }

    //let's check for additional fields needed based on tld (extra_attributes)
    if (additional_fields && additional_fields.extra_attributes.attributes) {

        var addon_html = "<h2>"+lang("Additional information required for this domain extension")+"</h2>";
        for(var propertyName in additional_fields.extra_attributes.attributes) {
                o = additional_fields.extra_attributes.attributes[propertyName];
                addon_html += "<div class='col-xs-12 col-sm-5 addon-type customfield_group'><label class='customfield_label control-label'>";
                if ($.trim(o.description) == "") {
                    addon_html += o.name;
                } else if ($.trim(o.popup) == '') {
                    addon_html += "<span data-toggle='popover-hover' data-html='true' data-placement='top' title='"+lang('Description')+"' data-content='"+o.description+"' class='tip-target'>"+o.name+"</span>";
                } else {
                    addon_html += "<span data-toggle='popover-hover' data-html='true' data-placement='top' title='"+o.description+"' data-content='"+ce.htmlspecialchars(o.popup)+"' class='tip-target'>"+o.name+"</span>";
                }
                addon_html += "</label>"

                //if we have options
                if (o.options && !jQuery.isEmptyObject(o.options) ) {
                    addon_html += '<select name="'+additional_fields.extra_attributes.tld+'-EA-'+propertyName+'" class="form-control selectpicker extra-attributes">';
                    for(var optionName in o.options) {
                                addon_html += '<option value="'+o.options[optionName].value+'">'+optionName+'</option>';
                    }
                    addon_html += '</select>';
                } else {
                    addon_html += '<input type="text" name="'+additional_fields.extra_attributes.tld+'-EA-'+propertyName+'" class="form-control required" />';
                }
                addon_html += '</div>';

        }
        $('form.domainForm[data-domain-name="' + domainName + '"] .extra_attributes-wrapper').html(addon_html);
        clientexec.postpageload('.selected-domain-form[data-domain-name="'+domainName+'"] .extra_attributes-wrapper');
        $('select', '.selected-domain-form[data-domain-name="'+domainName+'"] .extra_attributes-wrapper').selectpicker('render');
    }

    // let's check addons
    domains.start_addons_info_check($(self).parent().parent().find('select.domain-option-yrs'));

    return true;
}

function ObjectLength_Modern( object ) {
    return Object.keys(object).length;
}

function ObjectLength_Legacy( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
}

var ObjectLength = Object.keys ? ObjectLength_Modern : ObjectLength_Legacy;

/* method to run to display addon options */
domains.start_addons_info_check = function(self)
{
    domainName = $(self).parents('form.selected-domain-form').data('domain-name');

    //we need to deep copy variable so that we con't override in customfields
    var additional_fields = domains.additional_fields[domainName];

    var addon_html = '';

    //let's check addons
    if (additional_fields) {
        var billing_cycle = $(self).val();
        billing_cycle = (billing_cycle*12);
        switch(billing_cycle){
            case 12:
                if (additional_fields.addons12) {
                    var selectedAddons = additional_fields.addons12;
                }
                break;
            case 24:
                if (additional_fields.addons24) {
                    var selectedAddons = additional_fields.addons24;
                }
                break;
            case 36:
                if (additional_fields.addons36) {
                    var selectedAddons = additional_fields.addons36;
                }
                break;
            case 48:
                if (additional_fields.addons48) {
                    var selectedAddons = additional_fields.addons48;
                }
                break;
            case 60:
                if (additional_fields.addons60) {
                    var selectedAddons = additional_fields.addons60;
                }
                break;
            case 72:
                if (additional_fields.addons72) {
                    var selectedAddons = additional_fields.addons72;
                }
                break;
            case 84:
                if (additional_fields.addons84) {
                    var selectedAddons = additional_fields.addons84;
                }
                break;
            case 96:
                if (additional_fields.addons96) {
                    var selectedAddons = additional_fields.addons96;
                }
                break;
            case 108:
                if (additional_fields.addons108) {
                    var selectedAddons = additional_fields.addons108;
                }
                break;
            case 120:
                if (additional_fields.addons120) {
                    var selectedAddons = additional_fields.addons120;
                }
                break;
        }
        if (selectedAddons && selectedAddons.length > 0) {
            addon_html = "<h2>"+lang("Product Add-ons")+"</h2>";
            $.each(selectedAddons, function(i,o) {
                //o.id
                //o.desc
                //o.name
                //o.prices
                //o.addon_type
                //o.taxable
                addon_html += "<div class='col-xs-12 col-sm-4 addon-type'><label>";
                if ($.trim(o.desc) == "") {
                    addon_html += "<b>"+o.name+"</b>";
                } else {
                    o.desc = o.desc.replace(/\"/g, "&quot;");
                    addon_html += '<span data-toggle="popover-hover" data-html="true" data-placement="top" title="'+lang("Description")+'" data-content="'+o.desc+'" class="tip-target">'+o.name+"</span>";
                }
                addon_html += "</label>"

                switch (o.addon_type) {
                    case '2':    // quantity
                        countAddonOptions = ObjectLength(o.prices);
                        addon_html += "<table style='width:100%'>";
                        addon_html += "<tr>";
                        addon_html += "<td style='width:75px'>";
                        addon_html += lang("Quantity")+"*</br>";
                        addon_html += "</td>";
                        addon_html += "<td>";

                        if (countAddonOptions > 1) {
                            addon_html += lang("Option")+"</br>";
                        }

                        addon_html += "</td>";
                        addon_html += "</tr>";
                        addon_html += "<tr>";
                        addon_html += "<td style='width:75px'>";
                        addon_html += "<input type='number' min='0' style='width:70px;' id='addonQuantity_"+o.id+"' name='addonQuantity_"+o.id+"' class='quantity form-control' value='0'>";
                        addon_html += "</td>";
                        addon_html += "<td>";

                        if (countAddonOptions == 1) {
                            value = "addon_"+o.id+"_"+o.prices[0].price_id+"_"+o.prices[0].recurringprice_cyle;
                            addon_html += "<input type='hidden' name='addonSelect_"+o.id+"' value='"+value+"' >";

                            //Removing Addon Name from the Addon Option Name if it is there at the beginning
                            var prefix = o.name;
                            var str = o.prices[0].price;
                            if (str.indexOf(prefix) == 0) {
                              str = str.slice(prefix.length);
                            }
                            addon_html += str;
                        } else {
                            addon_html += "<select name='addonSelect_"+o.id+"' class='form-control selectpicker'>";

                            $.each(o.prices, function (p_i, p_o) {
                                value = "addon_"+o.id+"_"+p_o.price_id+"_"+p_o.recurringprice_cyle;
                                addon_html += "<option value='"+value+"' "+p_o.price_selected+">"+p_o.price+"</option>";
                            });

                            addon_html += "</select>";
                        }

                        addon_html += "</td>";
                        addon_html += "</tr>";
                        addon_html += "<tr>";
                        addon_html += "<td colspan='2'>";
                        addon_html += "* "+lang("Prices will be multiplied by the quantity")+"</br>";
                        addon_html += "</td>";
                        addon_html += "</tr>";
                        addon_html += "</table>";
                        break;
                    case '0':    // dropdown
                        addon_html += "<select name='addonSelect_"+o.id+"' class='form-control selectpicker'>";

                        $.each(o.prices, function (p_i, p_o) {
                            value = "addon_"+o.id+"_"+p_o.price_id+"_"+p_o.recurringprice_cyle;
                            addon_html += "<option value='"+value+"' "+p_o.price_selected+">"+p_o.price+"</option>";
                        });

                        addon_html += "</select>";
                        addon_html += "</br>";
                        break;
                    case '1':    // radio buttons
                        $.each(o.prices, function (p_i, p_o) {
                            addon_html += "<label class='radio'>";
                            value = "addon_"+o.id+"_"+p_o.price_id+"_"+p_o.recurringprice_cyle;
                            addon_html += "<input name='addonSelect_" + o.id + "' type='radio' value='"+value+"' "+p_o.price_selected+" /> "+p_o.price;
                            addon_html += "</label>";
                        });
                        break;
                }
                addon_html += "</br>";
                addon_html += '</div>';
            });
        }
    }

    $('.selected-domain-form[data-domain-name="' + domainName + '"] .addons-wrapper').html(addon_html);
    clientexec.postpageload('.selected-domain-form[data-domain-name="' + domainName + '"] .addons-wrapper');
    $('select', '.selected-domain-form[data-domain-name="' + domainName + '"] .addons-wrapper').selectpicker('render');

    $('.quantity').each(function() {
        $(this).keydown(function (e) {
            // Allow: delete, backspace, tab, escape, enter
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
                 // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                 // Allow: end, home, left, up, right, down
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                     // let it happen, don't do anything
                     return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    });
}