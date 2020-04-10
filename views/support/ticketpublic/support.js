var submitticket = {
    uploadFieldCount: 0,

    cloneAttchInput: function() {
      var clon = 'fileFields_0';
      if (!$('#' + clon)) {
        // attachments feature disabled
        return;
      }
      var newField = $('#' + clon).clone().prop('id', clon + submitticket.uploadFieldCount);
      var inputField = $(newField).find('input');
      var linkDelete = $(newField).find('a');

      var newId = clon + submitticket.uploadFieldCount;
      var newName = clon + submitticket.uploadFieldCount;

      $(newField).find('.file-input-name').text('');
      $(newField).removeClass('hidden');

      $(inputField).attr('id', newId);
      $(inputField).attr('name', newName);
      $(inputField).val('');
      $(inputField).change(submitticket.selectedFile);
      linkDelete[1].setAttribute("href", "javascript:submitticket.removeFileField('"+"delete_"+submitticket.uploadFieldCount+"');");

      linkDelete[1].setAttribute("id", "delete_"+submitticket.uploadFieldCount);
      $('#fileFieldsContainer').append(newField);
      $('input[type=file]:not(".file-input-wrapper input[type=file]")').bootstrapFileInput();

      submitticket.uploadFieldCount++;
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
              $(this).parents('.file-upload').find('a.hidden').removeClass('hidden');
            } else {
                // gotta unselect the file, as explained here:
                // http://stackoverflow.com/questions/1043957/clearing-input-type-file-using-jquery/1043969#1043969
                $(this).val('').replaceWith($(this).clone(true));

                RichHTML.error(
                    lang("This file type is not accepted. Please select a different file.")
                );
            }
        }
    }
};

