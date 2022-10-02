$(function() {

    if (clientexec.sessionHash !== undefined) {
        $.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-Session-Hash', clientexec.sessionHash);
            }
        });

        $('<input>').attr({
            type: 'hidden',
            name: 'sessionHash',
            value: clientexec.sessionHash
        }).appendTo('form');
    }
    $(document.body).append(clientexec.overlayTpl);
});

clientexec._sprintf = function(s) {
    var re = /%/;
    var i = 0;
    while (re.test(s)) {
        arg = clientexec._sprintf.arguments[++i];
        if (typeof arg == "undefined") {
            break;
        }
        s = s.replace(re, arg);
    }
    return s;
}

clientexec.lang = function(phrase) {
    if ((typeof language != "undefined") && (typeof language[phrase] != "undefined") && (language[phrase] != '')) {
        switch (clientexec.lang.arguments.length) {
            case 1:
                return language[phrase];
            case 2:
                return clientexec._sprintf(language[phrase], clientexec.lang.arguments[1]);
            case 3:
                return clientexec._sprintf(language[phrase], clientexec.lang.arguments[1], clientexec.lang.arguments[2]);
            case 4:
                return clientexec._sprintf(language[phrase], clientexec.lang.arguments[1], clientexec.lang.arguments[2], clientexec.lang.arguments[3]);
        }

        return language[phrase];
    }

    switch (clientexec.lang.arguments.length) {
        case 1:
            return phrase;
        case 2:
            return clientexec._sprintf(phrase, clientexec.lang.arguments[1]);
        case 3:
            return clientexec._sprintf(phrase, clientexec.lang.arguments[1], clientexec.lang.arguments[2]);
        case 4:
            return clientexec._sprintf(phrase, clientexec.lang.arguments[1], clientexec.lang.arguments[2], clientexec.lang.arguments[3]);
    }

    return phrase;
}

clientexec.htmlspecialchars = function(txt, onlyAmpersand) {
    if (!txt) return '';
    txt = txt.replace(/&/g, "&amp;");
    if (onlyAmpersand) {
        return txt
    }
    return txt
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

clientexec.postPageLoad = function(parent) {
    if (!parent) {
        parent = 'body';
    }

    if ($(parent + ' [data-toggle="tooltip"]').exists()) {
        $('[data-toggle="tooltip"]').tooltip();
    }

    if ($(parent + " .normalSelect2").exists()) {
        $('.normalSelect2').select2({
            minimumResultsForSearch: -1
        });
    }
    if ($(parent + " .searchSelect2").exists()) {
        $('.searchSelect2').select2({});
    }

    if ($(parent + " .multiSelect").exists()) {
        $(".multiSelect").select2({
            tags: true,
            tokenSeparators: [',', ' ']
        })
    }

    if ($(parent + ' .datePicker').exists()) {
        $('.datePicker').datepicker({
            format: clientexec.dateformat,
            autoclose: true
        });
    }
    $(".form-option label").click(function() {
        $(this).parent().parent().find('label').removeClass('selected');
        $(this).addClass("selected");
    });
}

clientexec.overlayTpl = '<div id="ce-overlay" style="display:none;left:-999999px;"></div><div id="ce-overlay-inner" style="display:none;left:-999999px;"></div>';
clientexec.mask = function(selector, fade) {
    if (!fade) {
        fade = false;
    }
    if ((!selector) || selector === null) {
        selector = "body";
    }

    var $t, height, width;
    $t = $(selector);
    height = ($t.outerHeight() === 0) ? $(document).height() : $t.outerHeight();
    width = $t.outerWidth();

    $("#ce-overlay").css({
        top     : $t.offset().top,
        left    : $t.offset().left,
        width   : width,
        height  : height,
        display : '',
        position: 'fixed'
    });

    if (fade) {
        $("#ce-overlay").fadeIn('slow');
    } else {
        $("#ce-overlay").show();
    }
}
clientexec.unMask =function() {
    $("#ce-overlay").fadeOut();
    $("#ce-overlay").css({display:'none',left:'-999999px'});
}

clientexec.parseResponse = function(response, display, msg) {
    if (display == undefined) {
        display = true;
    }

    try {
        if (typeof(response.error) != "undefined" && response.error) {
            var error;

            if ((response.message != "") && display) {
                error = response.message;
                error = clientexec.htmlspecialchars(error);
                error = error.replace(/\n/gi, "<br /> \n");
                $.showNotification({body: error, type: 'danger'});
            } else if (display) {
                error = "There was an error performing this action";
                if (msg != undefined) {
                    error = msg;
                }
                $.showNotification({body: error, type: 'danger'});
            }

            response = new Object();
            response.error = true;
            response.message = error;
        } else if (typeof(response.error) == "undefined") {
            response = new Object();
            response.error = true;
            $.showNotification({body: "Data returned seems to be pure html", type: 'danger'});

        } else {
            //no errors maybe msgbox
            if ((response.message != "") && display) {
                message = clientexec.htmlspecialchars(response.message);
                $.showNotification({body: message});
            }
        }
    } catch(e) {
        response = new Object();
        response.error = true;
        response.message = "Data returned is not valid json<br/>"+e.toString()+'<br />'+response;
        if (display) {
            $.showNotification({body: response.message, type: 'danger'});
        }
    }
    return response;
}

clientexec.msg = function(message) {
    $.showNotification({body: message});
}

clientexec.error = function(message) {
    $.showNotification({body: message, type: 'danger'});
}

// @see http://phpjs.org/functions/strip_tags/
clientexec.strip_tags = function(input, allowed) {
    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
        commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}