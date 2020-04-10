$(document).ready(function() {
    var table = $('#emails-grid').DataTable({
        language: {
            emptyTable: lang('No Emails To Show'),
            zeroRecords: lang('No matching records found')
        },
        ajax: {
            url: 'index.php?fuse=clients&controller=index&action=getemails',
            dataSrc: 'data'
        },
        columns: [{
            'class':          'details-control',
            'orderable':      false,
            'data':           null,
            'defaultContent': ''
        },{
            data: 'subject'
        },{
            data: 'date'
        }],
        order: [
            [ 2, 'desc' ]
        ]
    });

    $('#emails-grid tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );

        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );
});

function format(obj)
{
    return obj.content;
}