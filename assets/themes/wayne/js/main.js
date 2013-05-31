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
        if ($('.comment:visible').length > 0) {
            $body.animate({
                scrollTop: $('.comment:visible').offset().top
            }, 500);
        }
    });

    function goAnchor(anchor){
        var pos;
        if(anchor){
            if($(anchor).length > 0 ){
                pos = $(anchor).offset().top;
            }else if($('.' + anchor.substring(1) + ':visible').length > 0 ){
                pos = $('.' + anchor.substring(1) + ':visible').offset().top;
            }
        }else{
            pos = 0;
        }
        $body.animate({
            scrollTop: pos
        }, 300);
    }
    goAnchor(window.location.hash);


    var supportPjax = window.history && window.history.pushState && window.history.replaceState && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/);

    /**
     * when the page is load and at the corrent position,
     * load the duoshuo comment textarea
     * @return {null}
     */
    function loadComment() {
        $('div.comment').each(function() {
            if ($(this).html() == '' && $(this).data('thread') && $(this).data('thread') != '') {
                var threadKey = $(this).data('thread');
                var el = document.createElement('div'); //该div不需要设置class="ds-thread"
                el.setAttribute('data-thread-key', threadKey); //必选参数
                if (supportPjax) {
                    el.setAttribute('data-url', window.location.href); //必选参数
                }
                DUOSHUO.EmbedThread(el);
                $(this).append(el);
            }
        })
    }
    loadComment();

    var pjax = {
        pop: false,
        fragment: '',
        timestamp:false,
        direct:false,
        cache: {},
        init: function(fragment) {
            var self = this,
                url = window.location.href,
                regex = /^http:\/\/[^\/]*([^#]*)(#.*)?$/,
                mtch, requrl = '',
                title = document.title,
                anchor = '',
                elem, obj = null,
                timestamp;
            self.fragment = fragment;
            mtch = regex.exec(url);
            if (mtch && mtch[1]) {
                requrl = mtch[1];
                // alert(requrl);
            }
            is_post = /^\/\d{4}\/\d{2}\/.*\.html$/.test(requrl);
            if (is_post || requrl == '/about.html') {
                $('#reply').show();
            } else {
                $('#reply').hide();
            }
            if (mtch && mtch[2]) {
                anchor = mtch[2];
            } else {
                anchor = '';
            }
            elem = $(fragment).addClass('nowshow').data('timestamp','_' + (new Date()).getTime());
            obj = {
                title: title,
                requrl: requrl,
                elem: elem,
            }
            self.cache[requrl] = obj;
            timestamp = (new Date()).getTime();
            if (supportPjax) {
                window.history.replaceState({
                    'url': url,
                    'title': title,
                    'anchor': anchor,
                    'requrl': requrl,
                    'timestamp':timestamp
                }, title, url);
                window.onpopstate = function(e) {
                    if (e.state) {
                        self.pop = true;
                        if(self.timestamp > e.state.timestamp){
                            self.direct = 'BACK';
                        }
                        self.handlePop(e.state);
                    }
                }
            }
            self.bindEvent();
        },
        handlePop: function(state) {
            var self = this,
                requrl = state.requrl;
            if (self.cache[requrl]) {
                // alerady have cache data for the url
                self.handleData(self.cache[requrl], state);
            } else {
                // no cache for the url, to request new html and parse data
                self.handleState(state);
            }
        },
        // request new html and parse data
        handleState: function(state) {
            var self = this,
                html, doc, elem, data, regex = /<title>(.*?)<\/title>/,
                mtch;
            $.ajax({
                url: state.requrl,
                type: 'GET',
                dataType: 'html',
                beforeSend: function() {
                    $('div.overmap,div#loading').show();
                },
                success: function(htmlData) {
                    $('div.overmap,div#loading').hide();
                    if ((mtch = regex.exec(htmlData)) && mtch[1]) {
                        state.title = mtch[1];
                    }
                    html = $.parseHTML(htmlData);
                    doc = $(html);
                    elem = doc.find(self.fragment).data('timestamp','_' + (new Date()).getTime());
                    data = {
                        elem: elem,
                        title: state.title,
                        requrl: state.requrl,
                    };
                    self.handleData(data, state);
                },
                error: function() {}
            });
        },
        handleData: function(data, state) {
            var self = this,
                oldObj = $(self.fragment + '.nowshow'),
                newObj = data.elem,
                is_post = /^\/\d{4}\/\d{2}\/.*\.html$/.test(data.requrl);
            if (is_post || data.requrl == '/about.html') {
                $('#reply').show();
            } else {
                $('#reply').hide();
            }
            self.cache[data.requrl] = data;
            document.title = state.title || data.title;
            if (self.pop && self.direct == 'BACK') { // from left to right
                if(oldObj.data('timestamp') != newObj.data('timestamp') ){//fix issue #1
                   oldObj.css('margin-left', '0px');
                    newObj.css('margin-left', '0px').show().insertBefore(oldObj).animate({
                        'margin-left': '680px'
                    }, 300, function() {
                        newObj.addClass('nowshow');
                        oldObj.hide().removeClass('nowshow');
                        goAnchor(state.anchor);
                        loadComment();
                    }) 
                }else{
                    goAnchor(state.anchor);
                    loadComment();
                }
            } else { // form right to left
                if(oldObj.data('timestamp') != newObj.data('timestamp') ){//fix issue #1
                    newObj.css('margin-left', '0px').show().insertAfter(oldObj);
                    oldObj.animate({
                        'margin-left': '0px'
                    }, 300, function() {
                        newObj.css('margin-left', '680px').addClass('nowshow');
                        oldObj.hide().removeClass('nowshow');
                        goAnchor(state.anchor);
                        loadComment();
                    })
                }else{
                    goAnchor(state.anchor);
                    loadComment();
                }
            }
            if (!self.pop && supportPjax) {
                window.history.pushState({
                    url: state.url,
                    title: state.title,
                    anchor: state.anchor,
                    requrl: state.requrl,
                    timestamp:state.timestamp
                }, state.title, state.url);
            }
            self.pop = false;
            self.direct = false;
            self.timestamp = state.timestamp;
        },
        bindEvent: function() {
            var self = this;
            $('body').on('click', 'a.pjax', function() {
                // alert('click')
                var _this = this,
                    fragment = self.fragment,
                    url = $(this).attr('href'),
                    requrl, anchor, regex = /^([^#]*)(#.*)?$/,
                    mtch, state, rregex = /^http:\/\/[^\/]*([^#]*)(#.*)?$/,
                    rurl = window.location.href,
                    rrequrl, rmtch,timestamp = (new Date()).getTime();
                mtch = regex.exec(url);
                rmtch = rregex.exec(rurl);
                // console.log(mtch);
                if (mtch && mtch[1]) {
                    requrl = mtch[1];
                    // console.log(requrl)
                }
                if (rmtch && rmtch[1]) {
                    rrequrl = rmtch[1];
                    // console.log(rrequrl)
                }
                if (supportPjax && requrl == rrequrl) {
                    // if supportPjax and is now page, don't response
                    // if dont support pjax, 
                    // the location url will dont change when load otherpage,
                    // if you want back, the location url is same,but should reload.
                    return false;
                }
                if (mtch && mtch[2]) {
                    anchor = mtch[2];
                } else {
                    anchor = '';
                }
                state = {
                    url: url,
                    anchor: anchor,
                    requrl: requrl,
                    timestamp:timestamp
                }
                if (self.cache[requrl]) {
                    // alert('has cached')
                    self.handleData(self.cache[requrl], state);
                } else {
                    self.handleState(state);
                }
                return false;
            });
        }

    }
    pjax.init('div.vcontent');
});
