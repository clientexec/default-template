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

    selectedFile: function(e) {
        var fileExt = $(this).val().split('\.').pop().toLowerCase();
        var validExtns = $('input[name=validExtns]').val().trim().toLowerCase();

        if (fileExt && validExtns != '*') {
            var valid = false;
            validExtns = validExtns.split(',');
            $.each(validExtns, function(ix, val) {
                if (fileExt.toLowerCase() == val.trim().toLowerCase()) {
                    valid = true;
                    return false;
                }
            });
            if (valid) {
                $(this).parents('.file-upload').find('.deleteButton').removeClass('d-none');
            } else {
                // gotta unselect the file, as explained here:
                // http://stackoverflow.com/questions/1043957/clearing-input-type-file-using-jquery/1043969#1043969
                $(this).val('').replaceWith($(this).clone(true));
                alert(
                    clientexec.lang("This file type is not accepted. Please select a different file.")
                );
            }
        } else if (validExtns == '*') {
            $(this).parents('.file-upload').find('.deleteButton').removeClass('d-none');
        }
    },

    removeFileField: function(id) {
        document.getElementById(id).parentNode.parentNode.removeChild(document.getElementById(id).parentNode);
        support.uploadFieldCount--;

        // if (support.uploadFieldCount == 0) {
        //     support.cloneAttchInput();
        // }
    }
};