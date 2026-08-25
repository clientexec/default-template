support = {
    uploadFieldCount: 0,

    cloneAttchInput: function() {
        var clon = 'fileFields_';
        if (!$('#' + clon)) {
            // attachments feature disabled
            return;
        }
        var newField = $('#' + clon).clone().prop('id', clon + support.uploadFieldCount);
        var newId = clon + support.uploadFieldCount;
        var newName = clon + support.uploadFieldCount;

        $(newField).removeClass('d-none');

        $('.file_upload_input', newField)
            .prop('id', newId)
            .prop('name', newName)
            .change(support.selectedFile);

        $('.deleteButton', newField)
            .prop("href", "javascript:support.removeFileField('" + "delete_" + support.uploadFieldCount + "');")
            .prop('id', 'delete_' + support.uploadFieldCount);
        $('#fileFieldsContainer').append(newField);

        support.uploadFieldCount++;
    },

    selectedFile: function (e) {
        var $input = $(e.target);
        var file = e.target.files && e.target.files[0];

        // Nothing selected
        if (!file) {
            return;
        }

        if (typeof MAX_UPLOAD_SIZE !== 'undefined' && file.size > MAX_UPLOAD_SIZE) {
            var maxMb = (MAX_UPLOAD_SIZE / 1024 / 1024).toFixed(2);

            // Clear file safely (works with cloned inputs)
            $input.val('').replaceWith($input.clone(true));

            $.showNotification({
                body:
                    clientexec.lang(
                        'File is too large. Maximum allowed size is % MB.',
                        maxMb
                    ),
                type: 'danger'
            });

            return;
        }

        var fileExt = $input.val().split('.').pop().toLowerCase();
        var validExtns = $('input[name=validExtns]').val().trim().toLowerCase();

        if (fileExt && validExtns !== '*') {
            var valid = false;
            var allowed = validExtns.split(',');

            $.each(allowed, function (ix, val) {
                if (fileExt === val.trim().toLowerCase()) {
                    valid = true;
                    return false;
                }
            });

            if (!valid) {
                $input.val('').replaceWith($input.clone(true));

                $.showNotification({
                    body:
                        clientexec.lang(
                            'This file type is not accepted. Please select a different file.'
                        ),
                    type: 'danger'
                });

                return;
            }
        }

        // Passed validation — show delete button
        $input
            .parents('.file-upload')
            .find('.deleteButton')
            .removeClass('d-none');
    },


    removeFileField: function(id) {
        document.getElementById(id).parentNode.parentNode.removeChild(document.getElementById(id).parentNode);
        support.uploadFieldCount--;

        // if (support.uploadFieldCount == 0) {
        //     support.cloneAttchInput();
        // }
    }
};