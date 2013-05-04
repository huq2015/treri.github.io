(function($) {
    $.fn.lazyload = function(options) {
        var settings = {
            threshold: 0,
            failurelimit: 0,
            event: "scroll",
            effect: "show",
            container: window
        };
        if (options) {
            $.extend(settings, options)
        }
        var elements = this;
        if ("scroll" == settings.event) {
            $(settings.container).bind("scroll", function(event) {
                var counter = 0;
                elements.each(function() {
                    if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {
                        $(this).trigger("appear")
                    } else {
                        if (counter++ > settings.failurelimit) {
                            return false
                        }
                    }
                });
                var temp = $.grep(elements, function(element) {
                    return !element.loaded
                });
                elements = $(temp)
            })
        }
        return this.each(function() {
            var self = this;
            $(self).attr("original", $(self).attr("src"));
            if ("scroll" != settings.event || $.belowthefold(self, settings) || $.rightoffold(self, settings)) {
                if (settings.placeholder) {
                    $(self).attr("src", settings.placeholder)
                } else {
                    $(self).removeAttr("src")
                }
                self.loaded = false
            } else {
                self.loaded = true
            }
            $(self).one("appear", function() {
                if (!this.loaded) {
                    $("<img />").bind("load", function() {
                        $(self).hide().attr("src", $(self).attr("original"))[settings.effect](settings.effectspeed);
                        self.loaded = true
                    }).attr("src", $(self).attr("original"))
                }
            });
            if ("scroll" != settings.event) {
                $(self).bind(settings.event, function(event) {
                    if (!self.loaded) {
                        $(self).trigger("appear")
                    }
                })
            }
        })
    };
    $.belowthefold = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).height() + $(window).scrollTop()
        } else {
            var fold = $(settings.container).offset().top + $(settings.container).height()
        }
        return fold <= $(element).offset().top - settings.threshold
    };
    $.rightoffold = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).width() + $(window).scrollLeft()
        } else {
            var fold = $(settings.container).offset().left + $(settings.container).width()
        }
        return fold <= $(element).offset().left - settings.threshold
    };
    $.extend($.expr[':'], {
        "below-the-fold": "$.belowthefold(a, {threshold : 0, container: window})",
        "above-the-fold": "!$.belowthefold(a, {threshold : 0, container: window})",
        "right-of-fold": "$.rightoffold(a, {threshold : 0, container: window})",
        "left-of-fold": "!$.rightoffold(a, {threshold : 0, container: window})"
    })
})(jQuery);
(function(w) {
    var E = w(window),
        u, f, F = -1,
        n, x, D, v, y, L, r, m = !window.XMLHttpRequest,
        s = [],
        l = document.documentElement,
        k = {},
        t = new Image(),
        J = new Image(),
        H, a, g, p, I, d, G, c, A, K;
    w(function() {
        w("body").append(w([H = w('<div id="lbOverlay"></div>').click(C)[0], a = w('<div id="lbCenter"></div>')[0], G = w('<div id="lbBottomContainer"></div>')[0]]).css("display", "none"));
        g = w('<div id="lbImage"></div>').appendTo(a).append(p = w('<div style="position: relative;"></div>').append([I = w('<a id="lbPrevLink" href="#"></a>').click(B)[0], d = w('<a id="lbNextLink" href="#"></a>').click(e)[0]])[0])[0];
        c = w('<div id="lbBottom"></div>').appendTo(G).append([w('<a id="lbCloseLink" href="#"></a>').click(C)[0], A = w('<div id="lbCaption"></div>')[0], K = w('<div id="lbNumber"></div>')[0], w('<div style="clear: both;"></div>')[0]])[0]
    });
    w.slimbox = function(O, N, M) {
        u = w.extend({
            loop: false,
            overlayOpacity: 0.8,
            overlayFadeDuration: 400,
            resizeDuration: 400,
            resizeEasing: "swing",
            initialWidth: 250,
            initialHeight: 250,
            imageFadeDuration: 400,
            captionAnimationDuration: 400,
            counterText: "Image {x} of {y}",
            closeKeys: [27, 88, 67],
            previousKeys: [37, 80],
            nextKeys: [39, 78]
        }, M);
        if (typeof O == "string") {
            O = [
                [O, N]
            ];
            N = 0
        }
        y = E.scrollTop() + (E.height() / 2);
        L = u.initialWidth;
        r = u.initialHeight;
        w(a).css({
            top: Math.max(0, y - (r / 2)),
            width: L,
            height: r,
            marginLeft: -L / 2
        }).show();
        v = m || (H.currentStyle && (H.currentStyle.position != "fixed"));
        if (v) {
            H.style.position = "absolute"
        }
        w(H).css("opacity", u.overlayOpacity).fadeIn(u.overlayFadeDuration);
        z();
        j(1);
        f = O;
        u.loop = u.loop && (f.length > 1);
        return b(N)
    };
    w.fn.slimbox = function(M, P, O) {
        P = P ||
        function(Q) {
            return [Q.href, Q.title]
        };
        O = O ||
        function() {
            return true
        };
        var N = this;
        return N.unbind("click").click(function() {
            var S = this,
                U = 0,
                T, Q = 0,
                R;
            T = w.grep(N, function(W, V) {
                return O.call(S, W, V)
            });
            for (R = T.length; Q < R; ++Q) {
                if (T[Q] == S) {
                    U = Q
                }
                T[Q] = P(T[Q], Q)
            }
            return w.slimbox(T, U, M)
        })
    };

    function z() {
        var N = E.scrollLeft(),
            M = E.width();
        w([a, G]).css("left", N + (M / 2));
        if (v) {
            w(H).css({
                left: N,
                top: E.scrollTop(),
                width: M,
                height: E.height()
            })
        }
    }

    function j(M) {
        if (M) {
            w("object").add(m ? "select" : "embed").each(function(O, P) {
                s[O] = [P, P.style.visibility];
                P.style.visibility = "hidden"
            })
        } else {
            w.each(s, function(O, P) {
                P[0].style.visibility = P[1]
            });
            s = []
        }
        var N = M ? "bind" : "unbind";
        E[N]("scroll resize", z);
        w(document)[N]("keydown", o)
    }

    function o(O) {
        var N = O.keyCode,
            M = w.inArray;
        return (M(N, u.closeKeys) >= 0) ? C() : (M(N, u.nextKeys) >= 0) ? e() : (M(N, u.previousKeys) >= 0) ? B() : false
    }

    function B() {
        return b(x)
    }

    function e() {
        return b(D)
    }

    function b(M) {
        if (M >= 0) {
            F = M;
            n = f[F][0];
            x = (F || (u.loop ? f.length : 0)) - 1;
            D = ((F + 1) % f.length) || (u.loop ? 0 : -1);
            q();
            a.className = "lbLoading";
            k = new Image();
            k.onload = i;
            k.src = n
        }
        return false
    }

    function i() {
        a.className = "";
        w(g).css({
            backgroundImage: "url(" + n + ")",
            visibility: "hidden",
            display: ""
        });
        w(p).width(k.width);
        w([p, I, d]).height(k.height);
        w(A).html(f[F][1] || "");
        w(K).html((((f.length > 1) && u.counterText) || "").replace(/{x}/, F + 1).replace(/{y}/, f.length));
        if (x >= 0) {
            t.src = f[x][0]
        }
        if (D >= 0) {
            J.src = f[D][0]
        }
        L = g.offsetWidth;
        r = g.offsetHeight;
        var M = Math.max(0, y - (r / 2));
        if (a.offsetHeight != r) {
            w(a).animate({
                height: r,
                top: M
            }, u.resizeDuration, u.resizeEasing)
        }
        if (a.offsetWidth != L) {
            w(a).animate({
                width: L,
                marginLeft: -L / 2
            }, u.resizeDuration, u.resizeEasing)
        }
        w(a).queue(function() {
            w(G).css({
                width: L,
                top: M + r,
                marginLeft: -L / 2,
                visibility: "hidden",
                display: ""
            });
            w(g).css({
                display: "none",
                visibility: "",
                opacity: ""
            }).fadeIn(u.imageFadeDuration, h)
        })
    }

    function h() {
        if (x >= 0) {
            w(I).show()
        }
        if (D >= 0) {
            w(d).show()
        }
        w(c).css("marginTop", -c.offsetHeight).animate({
            marginTop: 0
        }, u.captionAnimationDuration);
        G.style.visibility = ""
    }

    function q() {
        k.onload = null;
        k.src = t.src = J.src = n;
        w([a, g, c]).stop(true);
        w([I, d, g, G]).hide()
    }

    function C() {
        if (F >= 0) {
            q();
            F = x = D = -1;
            w(a).hide();
            w(H).stop().fadeOut(u.overlayFadeDuration, j)
        }
        return false
    }
})(jQuery);

function up() {
    $wd = $(window);
    $wd.scrollTop($wd.scrollTop() - 1);
    fq = setTimeout("up()", 40)
}

function dn() {
    $wd = $(window);
    $wd.scrollTop($wd.scrollTop() + 1);
    fq = setTimeout("dn()", 40)
}
$(function() {
    $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
    $('#up').mouseover(function() {
        up()
    }).mouseout(function() {
        clearTimeout(fq)
    }).click(function() {
        $body.animate({
            scrollTop: 0
        }, 500)
    });
    $('#down').mouseover(function() {
        dn()
    }).mouseout(function() {
        clearTimeout(fq)
    }).click(function() {
        $body.animate({
            scrollTop: $('#footer').offset().top
        }, 500)
    });
    $('#reply').click(function() {
        $body.animate({
            scrollTop: $('#comment').offset().top
        }, 500)
    });

    function assetsPath() {
        var i = 0,
            got = -1,
            url, len = document.getElementsByTagName('link').length;
        while (i < len && got == -1) {
            url = document.getElementsByTagName('link')[i].href;
            got = url.indexOf('/style.css');
            i++
        }
        return url.replace(/\/css\/style.css.*/g, "")
    };

    function imgEffection() {
        $("img").lazyload({
            placeholder: assetsPath() + "/images/empty.gif",
            effect: "fadeIn"
        });
        $("div.article div.post a:has(img)").slimbox();
    }
    imgEffection();

    var supportPjax = window.history && window.history.pushState && window.history.replaceState && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/);

    var slide = {
        _nowObj: null,
        pop:false,
        _now: 0,
        cache: {},
        handle: null,
        init: function(select, container) {
            var self = this;
            $('#inner ul.listing').removeClass('tmp').css('margin-left','680px');
            this._nowObj = $($('ul.listing')[0]);
            this._now = parseInt($('#pagination a.current').text());
            this.bindEvent(select, container);
            this.cache[this._now] = this._nowObj;
            if(supportPjax){
                var _link = window.location.href;
                var _title = 'Vinntoe';
                var _page = $('#pagination a.current').attr('id');
                window.history.replaceState({
                    title:_title,
                    url:_link,
                    page:_page
                },_title,_link);
                window.onpopstate=function(e){
                    //console.log(e);
                    if(e.state){
                        self.pop = true;
                        var page = e.state.page;
                        $('#'+page).click();
                    }
                };
            }
        },
        bindEvent: function(select, container) {
            var self = this;
            $('body').on('click', select, function() {
                var _this = this;
                if ($(_this).text() == self._now) {
                    return false;
                }
                var _link = $(_this).attr('href');
                var _title = $(_this).text();
                var _page = $(_this).attr('id');
                // console.log('_page',_page);
                var state = {
                    title:'Vinntoe',
                    url:_link,
                    page:_page
                }
                $(_this).addClass('current').siblings().removeClass('current');
                self.handle = parseInt($(_this).text());
                if (self.cache[self.handle]) {
                    self.handleData(self.cache[self.handle],state);
                } else {
                    self.handle = $(_this).text();
                    var link = $(_this).attr('href');
                    $.ajax({
                        url: link,
                        dataType: 'html',
                        type: 'GET',
                        beforeSend: function() {
                            $(self._nowObj).find('.overmap').show();
                        },
                        success: function(obj) {
                            var $obj = $($.parseHTML(obj));
                            var data = $($obj.find(container)[0]);
                            $('.overmap').hide();
                            self.handleData(data,state);
                        },
                        error: function() {
                            console.log('error');
                        }
                    });
                }
                return false;
            })
        },
        handleData: function(data,state) {
            var self = this;
            self.cache[self.handle] = data;
            $data = $(data);
            if(supportPjax && !self.pop){
                window.history.pushState(state,state.title,state.url);
            }
            if (self.handle - self._now < 0) {
                $(self._nowObj).css('margin-left','0px');
                $data.removeClass('tmp').css('margin-left','0px').show().insertBefore($(self._nowObj)).animate({'margin-left':'680px'},300,function(){
                    $(self._nowObj).hide();
                    self._nowObj = $data;
                    self._now = self.handle;
                    $body.animate({scrollTop:0},300);
                });
            } else {
                $data.css('margin-left','0px').removeClass('tmp').show().insertAfter($(self._nowObj));
                $(self._nowObj).animate({
                    'margin-left': "0px"
                }, 300, function() {
                    $(self._nowObj).hide();
                    $($data).css('margin-left','680px');
                    self._nowObj = $data;
                    self._now = self.handle;
                    $body.animate({scrollTop:0},300);
                })
            }
            self.pop = false;
        }
    }
    slide.init('#pagination a', '#inner ul.listing');
});