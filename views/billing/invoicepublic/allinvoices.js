invoices = invoices || {};

$(document).ready(function() {
    var table = $('#invoices-grid').DataTable({
        language: {
            emptyTable: lang('No Invoices To Show'),
        },
        ajax: {
            url: 'index.php?fuse=billing&controller=invoice&action=getinvoices&filter=' + invoices.filter,
            dataSrc: 'invoices'
        },
        columns: [{
            searchable: false,
            orderable: false,
            className: 'dt-body-center',
            data: 'id',
            render: function (data, type, full, meta) {
                return '<input type="checkbox" name="id[]" value="' + data + '">';
            }
        }, {
            data: 'id'
        }, {
            data: 'detailed_description',
            render: function (data, type, full, meta) {
                return '<span class="invoicepdflink"><a href="index.php?sessionHash=' + clientexec.sessionHash + '&fuse=billing&controller=invoice&action=generatepdfinvoice&invoiceid=' + full.id + '" target="_blank"><img class="pdfimage" src="templates/admin/images/document-pdf-text.png" border="0" data-toggle="tooltip" title="' + lang('View PDF Invoice') + '" /></a></span>&nbsp;&nbsp;<a href="index.php?fuse=billing&controller=invoice&view=invoice&id=' + full.id + '">' + ce.htmlspecialchars(data) + '</a>';
            }
        }, {
            data:  {
                _: 'billdate',
                sort: 'billdatesort'
            }
        }, {
            data: 'formatedbalancedue',
            render: function (data, type, full, meta) {
                if (data.length >= 18) {
                    return '<span class="xxlong-currency">' + data + '</span>';
                } else if (data.length >= 15) {
                    return '<span class="xlong-currency">' + data + '</span>';
                } else if (data.length >= 13) {
                    return '<span class="long-currency">' + data + '</span>';
                }
                return data;
            }
        }, {
            data: 'amount',
            render: function (data, type, full, meta) {
                if (data.length >= 18) {
                    return '<span class="xxlong-currency">' + data + '</span>';
                } else if (data.length >= 15) {
                    return '<span class="xlong-currency">' + data + '</span>';
                } else if (data.length >= 13) {
                    return '<span class="long-currency">' + data + '</span>';
                }
                return data;
            }
        }, {
            data: 'status_name'
        }],
        order: [
            [ 3, 'desc' ]
        ]
    });

    // Handle click on "Select all" control
    $('#check-all-boxes').on('click', function() {
        // Get all rows with search applied
        var rows = table.rows({ 'search': 'applied' }).nodes();
        $('input[type="checkbox"]', rows).prop('checked', $(this).prop('checked'));
        if ($('#invoices-grid tbody input[type="checkbox"]:checked').length) {
            $('#openConfirmInvoices').prop('disabled', false);
        } else {
            $('#openConfirmInvoices').prop('disabled', true);
        }
    });

    // Handle click on checkbox to set state of "Select all" control
    $('#invoices-grid tbody').on('change', 'input[type="checkbox"]', function() {
        // If checkbox is not checked
        if (!$(this).prop('checked')) {
            $('#check-all-boxes').prop('checked', false);
        }
        if ($('#invoices-grid tbody input[type="checkbox"]:checked').length) {
            $('#openConfirmInvoices').prop('disabled', false);
        } else {
            $('#openConfirmInvoices').prop('disabled', true);
        }
    });

    if ($('#invoices-grid tbody input[type="checkbox"]:checked').length) {
        $('#openConfirmInvoices').prop('disabled', false);
    } else {
        $('#openConfirmInvoices').prop('disabled', true);
    }

    $('#sendInvoice').click(function() {
        $('#confirmSendInvoice').modal('hide');

        var selectedInvoices = [];
        $('#invoices-grid tbody input[type="checkbox"').each(function () {
            if ($(this).prop('checked')) {
                selectedInvoices.push($(this).val());
            }
        });
        $.ajax({
            url: 'index.php?fuse=billing&controller=invoice&action=actoninvoice',
            type: 'POST',
            data:  {
                items: selectedInvoices,
                itemstype: 'invoices',
                actionbutton: 'inv-send-smart'
            },
            success:  function(xhr) {
                $('#feedback').modal('show');
                $('#invoices-grid tbody input[type="checkbox"').each(function () {
                    $(this).prop('checked', false);
                });
                $('#openConfirmInvoices').prop('disabled', true);
            }
        });
    });

    $('#filter-ul button').click(function() {
        $('#filter-ul button.btn-primary').removeClass('btn-primary');
        $(this).addClass('btn-primary');

        table.ajax.url('index.php?fuse=billing&controller=invoice&action=getinvoices&filter=' + $(this).data('filter')).load();
    });
});