function up() {
    $wd = $(window);
    $wd.scrollTop($wd.scrollTop() - 1);
    fq = setTimeout("up()", 40)
}
console.log('history',window.history)
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


window.slide ={
    pop: false,
    _oldurl:'',
    cache:{},
    _nowPage: 0,
    _handlePage:0,
    init:function(){
        var self = this;
        var url = document.location.pathname;
        self._oldurl = url;
        console.log('url',url);
        var anchor = document.location.hash;
        var title = document.title;
        var fragment;
        var press;
        if($('#pagination').length > 0){
            fragment = 'ul.listing';
            self._nowPage = parseInt($('#pagination a.current').data('page'));
            press = $('#pagination a.current');
        }else{
            fragment = 'div.vcontent';
        }
        self.cache[url] = {
            'title': title,
            'data': $(fragment),
            'url':url,
            'fragment':fragment
        };
        if(anchor){
            self.cache[url]['anchor'] = anchor;
        }
        if(supportPjax){
            var state = {
                url:url,
                title:title,
                page:self._nowPage
            };
            window.history.replaceState(state,state.title,state.url);
            console.log('history',window.history)
            window.onpopstate = function(e){
                console.log(e);
                if(e.state){
                    self._handlePop(e.state);
                }
            }
        }
        return self;
    },
    bindEvent:function(select){
        var self = this;
        $('body').on('click',select,function(e){
            var $_this = $(this);
            var press = $_this;
            var url = $_this.attr('href');
            var fragment = $_this.data('fragment');
            // $_this.addClass('current').siblings().removeClass('current');
            self._handlePage = $_this.data('page') ? parseInt($_this.data('page')) : 9999999;
            self._handleUrl(url,fragment,press);
            return false;
        })
    },
    _handlePop:function(state){
        var self = this;
        self.pop = true;
        self._handlePage = state.page;
        console.log('_handlePop',state)
        self._handleUrl(state.url,state.fragment);
    },
    _handleUrl:function(url,fragment,press){
        console.log('_handleUrl ' ,url);
        var self = this;
        var pathname = document.location.pathname;
        //console.log(pathname);
        //console.log(url);
        if( url == self._oldurl ){
            console.log('same')
            return;
        }
        console.log('next')
        if(self.cache[url]){
            console.log('has cache');
            self._handleData(self.cache[url]);
        }else{
            console.log('get data');
            self._getData(url,fragment,press,function(data){
                self._handleData(data);
            }) 
        }
    },
    _getData:function(url,fragment,press,callback){
        var ary = url.split('#');
        var link = ary[0];
        var anchor;
        if(ary[1]){
            anchor = '#' + ary[1];
        }
        $.ajax({
            'url': url,
            'dataType':'html',
            'type':'GET',
            beforeSend:function(){

            },
            success:function(htmldata){
                var title;
                var matches = htmldata.match(/<title>(.*?)<\/title>/);
                if (matches) {
                    title = matches[1];
                }
                var html = $.parseHTML(htmldata);
                var $html = $(html);
                var $data = $html.find(fragment);
                var obj = {
                    'title':title,
                    'data':$data,
                    'url':url,
                    'fragment':fragment,
                    'press':press
                };
                if(anchor){
                    obj.anchor = anchor;
                }
                callback(obj);
            },
            error:function(html){
                console.log(html);
            }
        });
    },
    _handleData:function(data){
        var self = this;
        document.title = data.title;
        var anchor = data.anchor;
        var _goto;
        var state;
        if(data.press.length > 0){
            data.press.addClass('current').siblings().removeClass('current');
        }
        if(anchor && $(anchor).length > 0){
            _goto = $(anchor).offset().top;
        }else{
            _goto = 0;
        }
        if(supportPjax && !self.pop){
            state = {
                title: data.title,
                url:data.url,
                page:self._handlePage
            }
            console.log('state',state);
            console.log('history 181',window.history)
                window.history.pushState(state,state.title,state.url);
            console.log('history 183',window.history)
        }
        
        var fragment = data.fragment;
        var $oldObj = $(fragment + ':visible');
        var $newObj = data.data;
        if(self._handlePage < self._nowPage){
            $oldObj.css('margin-left','0px');
            $newObj.css('margin-left','0px').show().insertBefore($oldObj).animate({'margin-left':'680px'},300,function(){
                $oldObj.hide();
                $body.animate({scrollTop:_goto},300);
            });
        }else{
            $newObj.css('margin-left','0px').show().insertAfter($oldObj);
            $oldObj.animate({'margin-left':'0px'},300,function(){
                $oldObj.hide();
                $newObj.css('margin-left','680px');
                $body.animate({scrollTop:_goto},300);
            })
        }
        self.cache[data.url] = data;
        self._oldurl = data.url;
        self._nowPage = self._handlePage;
        self.pop = false;
    }
}

slide.init().bindEvent('#pagination a');

});