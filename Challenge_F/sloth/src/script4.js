/* Minification failed. Returning unminified contents.
(762,44-45): run-time error JS1100: Expected ',': =
 */
var bbcore = {

    loaderPermanent: false,
    activeTrackedAjax: 0,
    crossDomainURL: "",

    init: function () {

        $(window).bind("load", function () {

            if (this.loaderPermanent === false) {
                $('#loaderCheck').hide();
                $('#infoCheck').hide();
            }

            bbcore.size();
        });

        // Only track non-AccessGo and same-origin jQuery AJAX to control spinner
        $(document).ajaxSend(function (_event, _jqXHR, settings) {
            try {
                if (bbcore._shouldIgnoreAjax(settings && settings.url)) return;
                if (bbcore.activeTrackedAjax === 0) {
                    bbcore.loaderStart();
                }
                bbcore.activeTrackedAjax++;
            } catch (e) { }
        });

        $(document).ajaxComplete(function (_event, _jqXHR, settings) {
            try {
                if (bbcore._shouldIgnoreAjax(settings && settings.url)) return;
                bbcore.activeTrackedAjax = Math.max(0, bbcore.activeTrackedAjax - 1);
                if (bbcore.activeTrackedAjax === 0) {
                    bbcore.loaderEnd();
                }
            } catch (e) { }
        });
    },

    _shouldIgnoreAjax: function (url) {
        try {
            if (!url || typeof url !== 'string') return false;
            var u = url.toLowerCase();
            var host = location.host.toLowerCase();
            if (u.indexOf('widget.accessgo.de') !== -1 || u.indexOf('accessgo') !== -1) return true;
            if (u.indexOf('http://') === 0 || u.indexOf('https://') === 0) {
                var a = document.createElement('a'); a.href = url;
                if (a.host && a.host.toLowerCase() !== host) return true;
            }
        } catch (e) { }
        return false;
    },

    loaderStartPermanent: function () {
        this.loaderPermanent = true;
        $('#loaderCheck').show();
        $('#infoCheck').show();
    },

    loaderEndPermanent: function () {
        this.loaderPermanent = false;
        $('#loaderCheck').hide();
        $('#infoCheck').hide();
    },

    loaderStart: function (elementId) {
        if (this.loaderPermanent === false) {
            $("#loaderCheck").css("margin", "0");
            $("#loaderCheck").css("opacity", "0.5");
            $("#loaderCheck").css("background-color", "gray");
            $("#loaderCheck").css("background-blend-mode", "color-burn");
            $('#loaderCheck').fadeIn(1);
            $('#loaderCheck').fadeTo(0, 0.8);
            //$('#loaderCheck').fadeTo(500, 1.0);
        }
    },

    loaderEndPermanentAfterIntervalInSeconds: function(intervalInSeconds) {
        var intervalInMilliseconds = intervalInSeconds * 1000;
        setTimeout(function() {
            bbcore.loaderEndPermanent();
        }, intervalInMilliseconds);
    },

    loaderEnd: function (elementId) {
        if (this.loaderPermanent === false) {
            $('#loaderCheck').fadeOut(1000);
        }
    },

    loaderPermanentGray: function () {

        this.loaderPermanent = true;

        //if (this.loaderPermanent === false) {
            $("#loaderCheck").css("margin", "0");
            $("#loaderCheck").css("opacity", "0.5");
            $("#loaderCheck").css("background-color", "gray");
            $("#loaderCheck").css("background-blend-mode", "color-burn");
            $('#loaderCheck').fadeIn(1);
            $('#loaderCheck').fadeTo(0, 0.8);
        //}
    },

    infoPermanentGray: function () {
        if (this.loaderPermanent === false) {
            $("#infoCheck").css("margin", "0");
            $("#infoCheck").css("opacity", "0.5");
            $("#infoCheck").css("background-color", "gray");
            $("#infoCheck").css("background-blend-mode", "color-burn");
            $('#infoCheck').fadeIn(1);
            $('#infoCheck').fadeTo(0, 0.8);
        }
    },

    infoEnd: function (elementId) {
        if (this.loaderPermanent === false) {
            $('#infoCheck').fadeOut(1000);
        }
    },

    resizeDivInfo: function () {
        var parent = $("#infoCheck");
        var child = $('.infoDiv');
        child.height(parent.height() / 10).width(parent.width()).css("top", parent.height() / 3);
    },

    timedAlert: function (text, dauer) {

        /* hier Abfrage für denSaalplan Timer */
        var currEventTermineTableCounter = parseInt($('#EventTermineTable tr').length);
        if (!$.isNumeric(currEventTermineTableCounter) || ($.isNumeric(currEventTermineTableCounter) && currEventTermineTableCounter > 1)) {

            $(".bbloadernone").css("visibility", "hidden");

            bbcore.infoPermanentGray();

            $(".bbloadernone").css("visibility", "visible");
            $("#infoCheck").html("");
            $("#infoCheck").append("<div class='divInfo'>" + text + "</div>");

            setTimeout(function () {
                $(".divInfo").html("");
                $("#infoCheck").html("");
                $(".bbloadernone").css("visibility", "hidden");
            }, dauer);
        }
    },

    timedOutDiv: function (text, dauer) {

        /* hier Abfrage für denSaalplan Timer */
        var currEventTermineTableCounter = parseInt($('#EventTermineTable tr').length);
        if ($.isNumeric(currEventTermineTableCounter) && currEventTermineTableCounter > 1)
            dauer = currEventTermineTableCounter * 3000;

        if (!$.isNumeric(currEventTermineTableCounter) || ($.isNumeric(currEventTermineTableCounter) && currEventTermineTableCounter > 1)) {

            $(".bbloadernone").css("visibility", "hidden");

            bbcore.infoPermanentGray();

            $(".bbloadernone").css("visibility", "visible");
            $("#infoCheck").html("");
            $("#infoCheck").append("<div class='divInfo'>" + text + "</div>");
            $(".divInfo").css("margin-top", "80px");

            bbcore.resizeDivInfo();

            setTimeout(function () {
                $(".divInfo").css("margin-top", "0px");
                $(".divInfo").html("");
                $("#infoCheck").html("");
                $(".bbloadernone").css("visibility", "hidden");
            }, dauer);
        }
    },

    size: function (s) {
        var cookies = document.cookie.split(';');
        var found = false;
        for (var i = 0; i < cookies.length; i++) {
            var currCookie = cookies[i];
            if (currCookie.match(/size/g) != null) {
                found = true;
                break;
            }
        }
        if (found == false) {
            bbcore.saveSizeCookie(100);
        }
        else {
            var currSize = parseInt(bbcore.getCookie('size'));
            var currFontSize = parseInt($("body").css("font-size").match(/\d+/));

            var currFooterSize = parseInt(10);
            if (! typeof $(".FooterKontaktEmail") == "undefined")
                currFooterSize = parseInt($(".FooterKontaktEmail").css("font-size").match(/\d+/));

            if (currSize < 100) {
                $("#accessibilityMin").hide();
            }
            else {
                $("#accessibilityMin").show();
            }

            // comes with link actions on site
            if (typeof (s) == 'undefined') {
                var factor = 100 - currSize;
                if (factor < 0) {
                    var newFontSize = currFontSize + (factor * -1) + "px";
                    var newFooterSize = currFooterSize + (factor * -1) + "px";
                    $("body").css("font-size", newFontSize);
                    $('.dropdown-menu').css("font-size", newFontSize);
                    $('.footer').children().css("font-size", newFooterSize);
                }
            }
                // comes with minimize button
            else if (parseInt(s) < 1) {
                var newFontSize = currFontSize - 1 + "px";
                var newFooterSize = currFooterSize + (factor * -1) + "px";
                $("body").css("font-size", newFontSize);
                $('.dropdown-menu').css("font-size", newFontSize);
                $('.footer').children().css("font-size", newFooterSize);

                $("body").data("size", parseInt(parseInt(currSize) - 1));
                bbcore.saveSizeCookie(parseInt(parseInt(currSize) - 1));
            }
                // comes with maximize button
            else {
                var newFontSize = currFontSize + s + "px";
                var newFooterSize = currFooterSize + (factor * -1) + "px";
                $("body").css("font-size", newFontSize);
                $('.dropdown-menu').css("font-size", newFontSize);
                $('.footer').children().css("font-size", newFooterSize);

                $("body").data("size", parseInt(parseInt(currSize) + parseInt(s)));
                bbcore.saveSizeCookie(parseInt(parseInt(currSize) + parseInt(s)));
            }
        }
        return true;
    },

    saveSizeCookie: function (size) {
        $("body").data("size", size);
        document.cookie = "size=" + size + ";path=/";
    },

    getCookie: function (name) {
        var pattern = RegExp(name + "=.[^;]*")
        matched = document.cookie.match(pattern)
        if (matched) {
            var cookie = matched[0].split('=')
            return cookie[1]
        }
        return false
    },

    showMainModal: function () {
        $("#MainModalDiv").show();
    },

    searchContent: function (HostWithPort, Language, searchString, noresultString, categoryId) {

        if (searchString.trim().length >= 3) {

            bbcore.loaderStart();
            if (categoryId === undefined || categoryId === null) {
                categoryId = -1;
            }

            // url friendly string
            searchString = searchString
                .replace(/\s+/g, '-')
                .replace(/[^a-zA-Z0-9-]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '');

            var searchUrl = "Host/api/Search/SearchContent/Language/searchString/categoryId";
            searchUrl = searchUrl.replace("Host", HostWithPort);
            searchUrl = searchUrl.replace("Language", Language);
            searchUrl = searchUrl.replace("searchString", searchString);
            searchUrl = searchUrl.replace("categoryId", categoryId);

            $.ajax({
                type: 'GET',
                async: false,
                url: searchUrl,
                success: function (result) {

                    var HtmlResult = "<div id='HtmlSearchResult'><ul class='searchResultList'>";
                    if (result != null && result.length > 0) {
                        $.each(result, function (index, currObj) {
                            HtmlResult = HtmlResult + "<li class='searchResultListRow'>" +
                                                        "<a class='searchResultLink' href='" + currObj.ResultUrl + "'>" +
                                                            "<span class='searchResultImage'><img src='" + currObj.ResultImage + "' alt=''/></span>" +
                                                            "<span class='searchResultString'>" + currObj.ResultString + "</span>" +
                                                            "<span class='searchResultPrice'>" + currObj.ResultPrice + "</span>" +
                                                        "</a>" +
                                                      "</li>";
                        });
                    }
                    else {
                        HtmlResult = HtmlResult + "<li class='searchResultListRow'>" + noresultString + "</li>";
                    }

                    HtmlResult = HtmlResult + "</ul></div>";
                    $("#searchResults").html("");
                    $("#searchResults").append(HtmlResult);
                },
                beforeSend: setHeader,
            }).fail(function () { alert("Es hat etwas nicht funktioniert."); });

            function setHeader(xhr) {
                xhr.setRequestHeader('BBApiKey', bbcore.getCurrentHeaderValue("BBApiKey"));
            }

        } else {
            $("#searchResults").html("");
        }
        bbcore.loaderEnd();

        $(document).mouseup(function () {
            setTimeout(function () {
                $("#searchResults").html("");
            }, 200);
        });

        return true;
    },

    getCurrentHeaderValue: function (headerKey) {
        var req = new XMLHttpRequest();

        if (window.location.protocol == 'https:')
            req.open('GET', document.location, true);
        else
            req.open('GET', document.location, true); 

        req.send(null);

        //return headers = req.getResponseHeader(headerKey);
        return "BECKERBILLETT";
    },

    getCurrentHeaderPostValue: function (headerKey) {
        return "BECKERBILLETT";
    },

    setGoogleCrossDomainURL: function (url) {
        this.crossDomainURL = url;
    },

    googleGaOptin: function (extraTrackingIds, currentTrackingName, hideIP, reloadSite) {
        var gaProperty = 'UA-29179658-46';
        var disableStr = 'ga-disable-' + gaProperty;

        // enable BB cookie, but unused until we have Google contract (no data sent)
        document.cookie = disableStr + '=false; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
        window[disableStr] = false;

        // enabled for all other
        var ids = extraTrackingIds.split(';');
        if (extraTrackingIds != null && extraTrackingIds.length > 0) {
            if (ids != null) {
                for (var i = 0; i < ids.length; i++) {
                    var gaProperty = $.trim(ids[i]);
                    var disableStr = 'ga-disable-' + gaProperty;
                    document.cookie = disableStr + '=false; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
                    window[disableStr] = false;
                }
            }
        }
        location.reload();
    },

    googleGaOptout: function (extraTrackingIds, currentTrackingName, hideIP, reloadSite) {
        var gaProperty = 'UA-29179658-46';
        var disableStr = 'ga-disable-' + gaProperty;

        if (document.cookie.indexOf(disableStr + '=true') == -1) {
            document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
            window[disableStr] = true;
        }

        var ids = extraTrackingIds.split(';');
        if (extraTrackingIds != null && extraTrackingIds.length > 0) {
            if (ids != null) {
                for (var i = 0; i < ids.length; i++) {
                    var gaProperty = $.trim(ids[i]);
                    var disableStr = 'ga-disable-' + gaProperty;
                    if (document.cookie.indexOf(disableStr + '=true') == -1) {
                        document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
                        window[disableStr] = true;
                    }
                }
            }
        }
        location.reload();
    },

    checkUAIsActive: function () {
        var gaProperty = 'UA-29179658-46';
        var disableStr = 'ga-disable-' + gaProperty;

        if (document.cookie.indexOf(disableStr + '=false') != -1)
        {
            if (navigator.doNotTrack == 1)
                return false;

            return true;
        }
        return false;
    },

    googleTrackSite: function (extraTrackingIds, currentTrackingName, hideIP) {
        // check, is is off
        var UAIsActive = bbcore.checkUAIsActive();
        if (UAIsActive == false)
            return true;

        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        //// DEBUG - MODE START
        //(function (i, s, o, g, r, a, m) {
        //    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        //        (i[r].q = i[r].q || []).push(arguments)
        //    }, i[r].l = 1 * new Date(); a = s.createElement(o),
        //    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        //})(window, document, 'script', '//www.google-analytics.com/analytics_debug.js', 'ga');
        //window.ga_debug = { trace: true };
        //// DEBUG - MODE END

        var shopname = currentTrackingName;
        var cookiedomain = window.location.host;

        currentTrackingName = "tracker";
        //currentTrackingName = $.trim(currentTrackingName.replace(' ', ''));
        // ID-61: DSGVO BB Tracking off
        // check also enable BB cookie, but unused until we have Google contract (no data sent)
        //g//a//(//'//create', 'UA-29179658-46', 'auto', { 'name': currentTrackingName, 'allowLinker': true, 'cookieDomain': cookiedomain });


        try {
            var ids = extraTrackingIds.split(';');
            if (extraTrackingIds != null && extraTrackingIds.length > 0) {
                //var ids = extraTrackingIds.split(';');
                if (ids != null) {
                    for (var i = 0; i < ids.length; i++) {

                        var temp = currentTrackingName + i;
                        ga('create', $.trim(ids[i]), 'auto', { 'name': temp, 'allowLinker': true, 'cookieDomain': cookiedomain });
                        //if (typeof (hideIP) != "undefined" && hideIP == true)
                        //    ga('set', 'anonymizeIp', true);
                    }
                }
            }

            if (typeof (hideIP) != "undefined" && hideIP == true)
                ga('set', 'anonymizeIp', true);

            ga(currentTrackingName + '.require', 'linker');
            ga(currentTrackingName + '.require', 'ecommerce');
            ga(currentTrackingName + '.require', 'displayfeatures');
            ga(currentTrackingName + '.set', 'appName', shopname);
            ga(currentTrackingName + '.send', 'pageview');

            if (ids != null) {
                for (var i = 0; i < ids.length; i++) {
                    ga(currentTrackingName + i + '.require', 'linker');

                    if (this.crossDomainURL != "") {
                        ga(currentTrackingName + i + '.linker:autoLink', [cookiedomain, this.crossDomainURL]);
                    }
                    ga(currentTrackingName + i + '.require', 'ecommerce');
                    ga(currentTrackingName + i + '.require', 'displayfeatures');
                    ga(currentTrackingName + i + '.set', 'appName', shopname);
                    ga(currentTrackingName + i + '.send', 'pageview');
                }
            }
        } catch (e) { }
    },

    /// Category, ArticleEventOidStringNumber, Menge, 
    /// Basket_AddArticle, 123, 1, VorlageFührungen
    /// Basket_AddEventArticle, 123321, 10, StichwortKohle
    /// Basket_ChangeArticleCount, 123, 2
    /// Basket_removeArticle, 123321, 5
    //googleTrackEvent: function (currentTrackingName, eventCategory, eventAction, eventValue, eventLabel) {
    googleTrackEvent: function (extraTrackingIds, eventCategory, eventAction, eventValue, eventLabel) {
        // check, is is off
        var UAIsActive = bbcore.checkUAIsActive();
        if (UAIsActive == false)
            return true;

        //currentTrackingName = $.trim(currentTrackingName.replace(' ', ''));
        currentTrackingName = "tracker";
        var ids = extraTrackingIds.split(';');

        try {
            if (typeof (eventLabel) != "undefined" && eventLabel != null) {
                ga(currentTrackingName + '.send', {
                    hitType: 'event',
                    eventCategory: eventCategory,
                    eventAction: eventAction,
                    eventValue: eventValue,
                    eventLabel: eventLabel
                });
                if (ids != null) {
                    for (var i = 0; i < ids.length; i++) {

                        if (this.crossDomainURL != "") {
                            ga(currentTrackingName + i + '.linker:autoLink', [this.crossDomainURL]);
                        }

                        ga(currentTrackingName + i + '.send', {
                            hitType: 'event',
                            eventCategory: eventCategory,
                            eventAction: eventAction,
                            eventValue: eventValue,
                            eventLabel: eventLabel
                        });
                    }
                }
            }
            else {
                ga(currentTrackingName + '.send', {
                    hitType: 'event',
                    eventCategory: eventCategory,
                    eventAction: eventAction,
                    eventValue: eventValue
                });
                if (ids != null) {
                    for (var i = 0; i < ids.length; i++) {

                        if (this.crossDomainURL != "") {
                            ga(currentTrackingName + i + '.linker:autoLink', [this.crossDomainURL]);
                        }

                        ga(currentTrackingName + i + '.send', {
                            hitType: 'event',
                            eventCategory: eventCategory,
                            eventAction: eventAction,
                            eventValue: eventValue
                        });
                    }
                }
            }
        } catch (e) { }
    },

    //googleTrackAddTransaction: function (currentTrackingName, id, affiliation, revenue, shipping, tax) {
    googleTrackAddTransaction: function (extraTrackingIds, id, affiliation, revenue, shipping, tax) {

        // check, is is off
        var UAIsActive = bbcore.checkUAIsActive();
        if (UAIsActive == false)
            return true;

        //currentTrackingName = $.trim(currentTrackingName.replace(' ', ''));
        //ga(currentTrackingName + '.ecommerce:clear');

        currentTrackingName = "tracker";
        var ids = extraTrackingIds.split(';');


        //console.log("id__:" + id);
        //console.log("affiliation__:" + affiliation);
        //console.log("revenue__:" + revenue);
        //console.log("shipping__:" + shipping);
        //console.log("tax__:" + tax);

        //alert("googleTrackAddTransaction");

        var transaction = {
            'id': id,                    // Transaction ID.
            'affiliation': affiliation,  // Affiliation or store name.
            'revenue': revenue,          // Grand Total.
            'shipping': shipping,        // Shipping.
            'tax': tax,                  // Tax.
            'currency': 'EUR'
        };

        //var transaction = {
        //    'id': '1234',                    // Transaction ID.
        //    'affiliation': 'Acme Clothing',  // Affiliation or store name.
        //    'revenue': '11.99',              // Grand Total.
        //    'shipping': '5',                // Shipping.
        //    'tax': '1.29',                  // Tax.
        //    'currency': 'EUR'
        //};

        try {
            ga(currentTrackingName + '.ecommerce:addTransaction', transaction);
            ga(currentTrackingName + '.ecommerce:send');
            ga(currentTrackingName + '.ecommerce:clear');

            if (ids != null) {
                for (var i = 0; i < ids.length; i++) {

                    if (this.crossDomainURL != "") {
                        ga(currentTrackingName + i + '.linker:autoLink', [this.crossDomainURL]);
                    }

                    ga(currentTrackingName + i + '.ecommerce:addTransaction', transaction);
                    ga(currentTrackingName + i + '.ecommerce:send');
                    ga(currentTrackingName + i + '.ecommerce:clear');
                }
            }
        } catch (e) { }
    },

    //googleTrackAddItem: function (currentTrackingName, id, name, sku, category, price, quantity) {
    googleTrackAddItem: function (extraTrackingIds, id, name, sku, category, price, quantity) {

        // check, is is off
        var UAIsActive = bbcore.checkUAIsActive();
        if (UAIsActive == false)
            return true;

        //currentTrackingName = $.trim(currentTrackingName.replace(' ', ''));
        //ga(currentTrackingName + '.ecommerce:clear');

        currentTrackingName = "tracker";
        var ids = extraTrackingIds.split(';');

        //console.log("id__:" + id);
        //console.log("name__:" + name);
        //console.log("sku__:" + sku);
        //console.log("category__:" + category);
        //console.log("price__:" + price);
        //console.log("quantity__:" + quantity);

        var addItem = {
            'id': id,                   // Transaction ID. Required.
            'name': name,               // Product name. Required.
            'sku': sku,                 // SKU/code.
            'category': category,       // Category or variation.
            'price': price,             // Unit price.
            'quantity': quantity,       // Quantity.
            'currency': 'EUR'           // local currency code.
        }

        try {
            ga(currentTrackingName + '.ecommerce:addItem', addItem);
            ga(currentTrackingName + '.ecommerce:send');

            if (ids != null) {
                for (var i = 0; i < ids.length; i++) {

                    if (this.crossDomainURL != "") {
                        ga(currentTrackingName + i + '.linker:autoLink', [this.crossDomainURL]);
                    }

                    ga(currentTrackingName + i + '.ecommerce:addItem', addItem);
                    ga(currentTrackingName + i + '.ecommerce:send');
                }
            }
        } catch (e) { }
    },

    //googleTrackAddToCart: function (currentTrackingName, id, name, sku, category, price, quantity) {
    googleTrackAddToCart: function (extraTrackingIds, id, name, sku, category, price, quantity) {

        // check, is is off
        var UAIsActive = bbcore.checkUAIsActive();
        if (UAIsActive == false)
            return true;

        //currentTrackingName = $.trim(currentTrackingName.replace(' ', ''));
        currentTrackingName = "tracker";
        var ids = extraTrackingIds.split(';');

        // TODOJL
        //dataLayer.push({
        //    'ecommerce': {
        //        'currencyCode': 'EUR',                       // Local currency is optional.
        //        'impressions': [
        //         {
        //             'name': 'Triblend Android T-Shirt',       // Name or ID is required.
        //             'id': '12345',
        //             'price': '15.25',
        //             'brand': 'Google',
        //             'category': 'Apparel',
        //             'variant': 'Gray',
        //             'list': 'Search Results',
        //             'position': 1
        //         },
        //         {
        //             'name': 'Donut Friday Scented T-Shirt',
        //             'id': '67890',
        //             'price': '33.75',
        //             'brand': 'Google',
        //             'category': 'Apparel',
        //             'variant': 'Black',
        //             'list': 'Search Results',
        //             'position': 2
        //         }]
        //    }
        //});


    },


    googleTrackRemoveFromCart: function (currentTrackingName, id, name, sku, category, price, quantity) {

        // check, is is off
        var UAIsActive = bbcore.checkUAIsActive();
        if (UAIsActive == false)
            return true;

        currentTrackingName = $.trim(currentTrackingName.replace(' ', ''));
        // TODOJL

    },

    normalizeStringForCSS: function (str) {
        return str.toString()
            .toLowerCase()
            .replace('ü', 'ue')
            .replace('ä', 'ae')
            .replace('ö', 'oe')
            .replace('ß', 'ss')
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z 0-9-]+/g, '');
    },

    applicationInsightsCookieValidation: function (instrumentationKey) {

        if (!bbcore.getCookie('ai-disabled')) {
            document.cookie = "ai-disabled=true;path=/";
        }

        if (bbcore.getCookie('ai-disabled') === 'false') {
            var appInsights = window.appInsights || function (config) {
                function r(config) { t[config] = function () { var i = arguments; t.queue.push(function () { t[config].apply(t, i) }) } }
                var t = { config: config }, u = document, e = window, o = 'script', s = u.createElement(o), i, f; for (s.src = config.url || (window.location.origin + '/Scripts/ai.0.js'), u.getElementsByTagName(o)[0].parentNode.appendChild(s), t.cookie = u.cookie, t.queue = [], i = ['Event', 'Exception', 'Metric', 'PageView', 'Trace', 'Ajax']; i.length;)r('track' + i.pop()); return r('setAuthenticatedUserContext'), r('clearAuthenticatedUserContext'), config.disableExceptionTracking || (i = 'onerror', r('_' + i), f = e[i], e[i] = function (config, r, u, e, o) { var s = f && f(config, r, u, e, o); return s !== !0 && t['_' + i](config, r, u, e, o), s }), t
            }({
                instrumentationKey: instrumentationKey
            });

            window.appInsights = appInsights;
            appInsights.trackPageView();
        } else {
            document.cookie = 'ai_user=;expires=Thu, 01 Jan 1970 00:00:00;path=/';
            document.cookie = 'ai_session=;expires=Thu, 01 Jan 1970 00:00:00;path=/';
        };
    },

    applicationGoogleTagManagerCookieValidation: function () {
        if (!bbcore.getCookie('gtm-disabled')) {
            document.cookie = "gtm-disabled=true;path=/";
        }
    },

    // scrolls to the given element within 500ms, only on xs
    scrollToElement: function (tag, offset = 0) {
        var anchorElem = $(tag);
        if (anchorElem.length) {
            var windowWidth = $(window).width();
            if (windowWidth <= 991) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: anchorElem.offset().top - offset
                }, 500);
            }
        }
    },

    // checks whether an object is currently visible in DOM
    isVisible: function (object) {
        return $(object).is(':visible');
    },

    sortTableOnString: function(tableId, columnIndex) {
        var table, rows, switching, i, x, y, shouldSwitch;
        table = document.getElementById(tableId);
        switching = true;
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
            // Start by saying: no switching is done: 
            switching = false;
            rows = table.rows;
            /* Loop through all table rows(except the
            first, which contains table headers): */
            for (i = 1; i < (rows.length - 1); i++) {
                // Start by saying there should be no switching:
                shouldSwitch = false;
                /* Get the two elements you want to compare,
                    one from current row and one from the next: */
                x = rows[i].getElementsByTagName("TD")[columnIndex];
                y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
                // Check if the two rows should switch place: 
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                /* If a switch has been marked, make the switch
                and mark that a switch has been done: */
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    },

    displayLoadingSpinner: function () {
        document.querySelector('.bbloaderbg').style.display = '';
    },

    hideLoadingSpinner: function () {
        document.querySelector('.bbloaderbg').style.display = 'none';
    },

    googleTrackPurchase: function (transaction_id, value, currency, itemsArray) {
        if (typeof gtag === 'function') {
            var purchaseData = {
                transaction_id: transaction_id,
                value: parseFloat(value),
                currency: currency
            };

            if (itemsArray && itemsArray.length > 0) {
                purchaseData.items = itemsArray;
            }
            gtag('event', 'purchase', purchaseData);
        } 
    }
};

bbcore.init();;
