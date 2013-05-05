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