if (CEAffTracker == undefined) {
    var CEAffTracker = new function() {
        var affiliateId;
        var paramNameId;
        var cookieDays;
        var cookieName = 'CE_Affiliate';


        this.setCookieDays = function(value) {
            cookieDays = value;
        };

        this.getCookieDays = function() {
            return cookieDays;
        };

        this.getCookieName = function() {
            return cookieName;
        };

        this.setParamNameId = function(value) {
            paramNameId = value;
        };

        this.getParamNameId = function() {
            return paramNameId;
        };

        this.setAffiliateId = function(value) {
            paramName = this.getParamNameId();

            var parts = document.location.search.split('?');
            if (parts.length > 1) {
                parameters = parts[1].split('&');
                for (var i = 0; i < parameters.length; i++) {
                    parsed = parameters[i].split('=');
                    if (parsed[0] == this.getParamNameId()) {
                       affiliateId = parsed[1];
                    }
                }
            }
        };

        this.getAffiliateId = function() {
            return affiliateId;
        };

        this.getDomainName = function() {
            return window.location.hostname.substring(window.location.hostname.lastIndexOf(".", window.location.hostname.lastIndexOf(".") - 1) + 1);
        };

        this.getHttpCookie = function() {
            var value = document.cookie.match('(^|;) ?' + this.getCookieName() + '=([^;]*)(;|$)');
            if (value && value[2] != '') {
                return decodeURIComponent(value[2]);
            }
            return null;
        };

        this.setCookie = function() {
            var secureCookieString = 'SameSite=Lax'
            if (document.location.protocol == 'https:') {
                secureCookieString = 'Secure;SameSite=None';
            }
            var date = new Date();
            date.setTime(date.getTime() + (this.getCookieDays()*24*60*60*1000));
            expires = date.toUTCString();
            domain = this.getDomainName();
            cookieName = this.getCookieName();

            if (this.getAffiliateId() != '') {
                document.cookie = cookieName + '=' + encodeURIComponent(this.getAffiliateId()) + ';expires=' + expires + ';domain=' + domain + ';path=/;' + secureCookieString;
            }
        };

        this.track = function() {
            if (this.getHttpCookie() === null) {
                this.setAffiliateId();
                this.setCookie();
            }
        };
    };
}