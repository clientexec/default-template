function loadTotalsInfo()
{
    packageId = $("#upgradePackage").val();

    $(".upgradePackageDescription").hide();
    $("#upgradePackageDescription_" + packageId).show();

    packageTerm = $('input[name="priceTerm_' + packageId + '"]:checked').val();

    $(".upgradeAddonDescription").hide();
    $("#upgradeAddonDescription_" + packageId + '_' + packageTerm).show();

    packageTaxable = Number($('select[name="upgradePackage"] option:selected').data('taxable'));
    packageSubtotalAmount = Number($('input[name="priceTerm_' + packageId + '"]:checked').data('subtotal_amount'));
    customerTax = Number($('input[name="customerTax"]').val());
    customerTax2 = Number($('input[name="customerTax2"]').val());
    customerTax2Compound = Number($('input[name="customerTax2Compound"]').val());
    upgradeDowngradeStatusValue = Number($('input[name="upgradeDowngradeStatusValue"]').val());

    packageAddonsString = $("#upgradeAddonDescription_" + packageId + "_" + packageTerm +" :input").serialize()

    if (packageAddonsString !== '') {
        packageAddonsArray =  packageAddonsString.split("&");
        addonQuantity = 1;
        $.each(packageAddonsArray, function (index, value) {
            packageAddonName = value.split("=");
            addonItem = $('input[name="' + packageAddonName[0] + '"]');

            if (addonItem.hasClass("quantity")) {
                addonQuantity = Number(addonItem.val());
            } else if (addonItem.is(":radio")) {
                addonItem = $('input[name="' + packageAddonName[0] + '"]:checked');
                packageSubtotalAmount += (addonQuantity * Number(addonItem.data('subtotal_amount')));
                addonQuantity = 1;
            } else if (addonItem.is(":hidden")) {
                packageSubtotalAmount += (addonQuantity * Number(addonItem.data('subtotal_amount')));
                addonQuantity = 1;
            } else {
                addonItem = $('select[name="' + packageAddonName[0] + '"] option:selected');
                packageSubtotalAmount += (addonQuantity * Number(addonItem.data('subtotal_amount')));
                addonQuantity = 1;
            }
        });
    }

    packageTaxAmount = (packageTaxable * customerTax * packageSubtotalAmount / 100);
    packageTax2Amount = (packageTaxable * customerTax2 * (packageSubtotalAmount + (customerTax2Compound * packageTaxAmount)) / 100)
    packageTotal = packageSubtotalAmount + packageTaxAmount + packageTax2Amount - upgradeDowngradeStatusValue;

    if (packageTotal < 0) {
        packageTotal = 0;
    }

    $('.total_subtotal_price').html(accounting.formatMoney(packageSubtotalAmount, currency.symbol, currency.precision, currency.thousandssep, currency.decimalssep, currency.alignment)+currency.showabrv);

    $('.total_subtotal_couponDiscount').html(accounting.formatMoney(upgradeDowngradeStatusValue, currency.symbol, currency.precision, currency.thousandssep, currency.decimalssep, currency.alignment)+currency.showabrv);

    if (packageTaxAmount > 0) {
        $('.total_tax_amount').html(accounting.formatMoney(packageTaxAmount, currency.symbol, currency.precision, currency.thousandssep, currency.decimalssep, currency.alignment)+currency.showabrv);
        $('.total_tax_row').show();
    }else{
        $('.total_tax_row').hide();
    }

    if (packageTax2Amount > 0) {
        $('.total_tax2_amount').html(accounting.formatMoney(packageTax2Amount, currency.symbol, currency.precision, currency.thousandssep, currency.decimalssep, currency.alignment)+currency.showabrv);
        $('.total_tax2_row').show();
    }else{
        $('.total_tax2_row').hide();
    }

    $('.total_total_pay').html(accounting.formatMoney(packageTotal, currency.symbol, currency.precision, currency.thousandssep, currency.decimalssep, currency.alignment)+currency.showabrv);
}

$(document).ready(function() {
    $('.quantity').each(function() {
        $(this).keydown(function (e) {
            // Allow: delete, backspace, tab, escape, enter        Ctrl+A                                     end, home, left, up, right, down
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 || (e.keyCode == 65 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 40)) {
                     // let it happen, don't do anything
                     return;
            }

            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    });

    $('#cancel-button').click(function() {
        window.location = 'index.php?fuse=clients&controller=products&view=products';
    });

    $('#submit-button').click(function(e) {
        var valid = $('#upgrade-form').parsley( 'validate' );
    });

    loadTotalsInfo();
});