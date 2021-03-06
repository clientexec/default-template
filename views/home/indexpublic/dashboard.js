$(document).ready(function() {

    $('#tickets-grid').DataTable({
        'paging': false,
        'searching': false,
        'language': {
            'emptyTable': lang('There are currently no support tickets'),
        },
        'bInfo': false
    });

    $('#invoices-grid').DataTable({
        'paging': false,
        'searching': false,
        'language': {
            'emptyTable': lang('There are currently no invoices due'),
        },
        'bInfo': false
    });

    var products = {
        removedActionCol: false,
        neverDelete: false
    }

    if ($('#products-grid').length) {
        RichHTML.mask();
        $.getJSON('index.php?fuse=clients&controller=products&action=getproducts', function(json) {
            var headers = {
                'Id': 'id',
                'Package': 'name',
                'Next Due Date': 'nextDueDate',
                'Billing Cycle': 'term',
                'Status': 'status'
            };

            addAction = false;
            $.each(json.data, function (i, val) {
                $.each(val.customfields, function(key, v) {
                    headers[key] = key;
                });
                if ('actions' in val) {
                    addAction = true;
                }
            });

            if (addAction) {
                headers['Actions'] = 'actions';
            }

            var datatbl = {
                'columns': [],
                'data': [],
                'language': {
                    'emptyTable': lang('No Packages To Show'),
                },
                'searching': false,
                'paging': false,
                'bInfo': false
            };

            $.each(headers, function (k, v) {
                if (v == 'actions') {
                    datatbl.columns.push({
                        'data': v,
                        'sortable': false,
                    });
                } else if (v == 'nextDueDate') {
                    datatbl.columns.push({
                        'data': {
                            '_': v + '.display',
                            'sort': v + '.sort'
                        }
                    });
                } else {
                    datatbl.columns.push({'data': v});
                }
                $('#products-grid thead tr').append('<th class="all">' + lang(k) + '</th>');
                $.each(json.data, function (row, value) {
                    if (!(row in datatbl.data)) {
                        datatbl.data[row] = {};
                    }
                    if (v in value) {
                        if (v == 'term') {
                            datatbl.data[row][v] = value[v] + ' <br> ' + value['price'];
                        } else if (v == 'id') {
                            datatbl.data[row][v] = '<a href="index.php?fuse=clients&controller=products&view=product&id=' + value[v] + '">#' + value[v] + '</a>';
                        } else if (v == 'name') {
                            datatbl.data[row][v] = '<a href="index.php?fuse=clients&controller=products&view=product&id=' + value['id'] + '">' + ce.htmlspecialchars(value[v]) + '</a>';
                        } else if (v == 'nextDueDate') {
                            if (value[v].length) {
                                datatbl.data[row][v] = {};
                                datatbl.data[row][v]['display'] = value[v];
                                datatbl.data[row][v]['sort'] = value[v + 'TS'];
                            } else {
                                datatbl.data[row][v] = lang("Not Applicable");
                            }
                        } else {
                            datatbl.data[row][v] = value[v];
                        }
                    } else if (v in value['customfields']) {
                        datatbl.data[row][v] = value['customfields'][v];
                    } else {
                        datatbl.data[row][v] = '';
                    }
                });
            });

            $('#products-grid').DataTable(datatbl);
            RichHTML.unMask();
        });
    }
});