clientexec.timer_typing = null;

$(document).ready(function(){

    $('.drop-ticket-type').on('change',function(){
        $('.review-questions-fortype').html('');
        var self = this;
        $('.top-questions-block table').remove();
        $('.loading-ticket-type').removeClass('hidden');
        //gets any top questions we might have
        $.get('index.php?fuse=support&controller=ticket&action=toparticles&typeid='+$(this).val(),function(xhr){
            var html = "";
            console.log(xhr.articles.length);
            if (xhr.articles.length > 0) {
                var template = $('#articles').html();
                html = Mustache.render(template, xhr);
                $('.top-questions-block .review-questions-desc').after(html);
                $('.top-questions-block').removeClass('hidden');
                $('.loading-ticket-type').addClass('hidden');
                $('.review-questions-fortype').append(' '+$('.drop-ticket-type option:selected').text());
            } else {
                $('.top-questions-block').addClass('hidden');
                $('.loading-ticket-type').addClass('hidden');
            }
        })

        //gets any custom fields we might have
        submitticket.loadCustomFields($(this).val());
    });

    //if coming back to page and already have something selected
    //let's pull the popular articles
    if ($('.drop-ticket-type').val() > 0 ) {
        $('.drop-ticket-type').trigger('click');
    }

    //if we go back and we have content in subject let's call the query
    if ($.trim($('.ticket-subject').val()) != "") {
        $('.ticket-subject').keyup();;
    }

    $('.btn-newticket-submit').click(function(e){
        var valid = $('.support-ticket-form').parsley( 'validate' );
    });

    if ($('#new-file-button').length) {
        $('input[type=file]').bootstrapFileInput();
        $('input[type=file]').change(submitticket.selectedFile);

        $('#new-file-button').on('click',function(e){
            e.preventDefault();
            submitticket.cloneAttchInput();
        });

        submitticket.cloneAttchInput();
    }
});

submitticket.removeFileField = function (id) {
    document.getElementById(id).parentNode.parentNode.removeChild(document.getElementById(id).parentNode);
    submitticket.uploadFieldCount--;
};

submitticket.loadCustomFields = function(issuetype) {
    $('.fieldset-customfields').addClass('hidden');
    $('.fieldset-customfields .customfields').empty();
    $.get('index.php?fuse=support&controller=ticket&action=customfieldsfortype',
        {
            ticketType: issuetype
        },function(data){
            customFields.load(data.fields,function(data) {
                $('.fieldset-customfields .customfields').append(customFields.bootstrapWrap(data));
            }, function(){
                $('.fieldset-customfields .customfields .header label').parents('.header').addClass('col-xs-12 col-sm-5 customfield_group');
                $('.fieldset-customfields .customfields .header textarea').parents('.header').removeClass('col-sm-5').addClass('col-sm-10');
                clientexec.postpageload('.fieldset-customfields');
                //needs to reset the fields
                $( '.support-ticket-form' ).parsley( 'destroy' );
                $( '.support-ticket-form' ).parsley();
            });

            if (data.fields.length > 0) {
                $('.fieldset-customfields').removeClass('hidden');
            } else {
                $('.fieldset-customfields').addClass('hidden');
            }
    });

};


clientexec.loadKBArticles = function(e, path)
{

    if (!path) path = "";

    if (e.which == 13) {
      window.clearTimeout(clientexec.timer_typing);
      e.preventDefault();
    } else {
      window.clearTimeout(clientexec.timer_typing);
      clientexec.timer_typing = window.setTimeout( function() {
          var str = $.trim($('.ticket-subject').val());
          if(str == "") {
                $('.subject-article-matches').html('').addClass('hidden');
                window.clearTimeout(clientexec.timer_typing);
                return;
          }
          $.get(path + 'index.php?fuse=knowledgebase&action=livearticlesearch',{subject:str, path:path},function(data){
            if (data.articles.length == 0) {
                html = "";
                $('.subject-article-matches').addClass('hidden');
                return;
            } else if (data.articles.length == 1) {
                html = lang("There is 1 article that might answer your question.");
            } else {
                html = lang("There are % articles that might answer your question.", data.articles.length);
            }

            var template = document.getElementById('articles').innerHTML;
            html = "<div class='subject-article-desc'>"+html+"</div>" + Mustache.render(template, data);
            $('.subject-article-matches').html(html).fadeIn();


          });
      }, 800 );

    }
}
