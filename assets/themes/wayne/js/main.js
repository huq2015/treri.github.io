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

function loadComment(){
    $('div.comment').each(function(){
        if( $(this).html() == '' && $(this).data('thread') && $(this).data('thread') != ''){
            var threadKey = $(this).data('thread');
            var el = document.createElement('div');//该div不需要设置class="ds-thread"
            el.setAttribute('data-thread-key', threadKey);//必选参数
            el.setAttribute('data-url', window.location.href);//必选参数
            DUOSHUO.EmbedThread(el);
            $(this).append(el);
        }
    })
}
loadComment();

var slide = {
    nowPage:0,
    handlePage:0,
    pop:false,
    fragment:'',
    cache:{},
    init:function(fragment){
        var self = this,
            url = window.location.href,
            regex = /^http:\/\/[^\/]*([^#]*)(#.*)?$/,
            mtch,
            requrl = '',
            title = document.title,
            anchor = '',
            elem,
            obj = null;
        self.fragment = fragment;
        mtch = regex.exec(url);
        if(mtch && mtch[1]){
            requrl = mtch[1];
            // alert(requrl);
        }
        if(mtch && mtch[2]){
            anchor = mtch[2];
        }else{
            anchor = '';
        }
        elem = $(fragment).addClass('nowshow');
        obj = {
            title:title,
            requrl:requrl,
            elem:elem,
        }
        self.cache[requrl] = obj;
        self.nowObj = elem;
        if(supportPjax){
            window.history.replaceState({'url':url,'title':title,'anchor':anchor,requrl:requrl},title,url);
            window.onpopstate = function(e){
                if(e.state){
                    self.pop = true;
                    self.handlePop(e.state);
                }
            }
        }
        self.bindEvent();
    },
    handlePop:function(state){
        var self = this,
            requrl = state.requrl;
        if(state.init){ // 当后退到标签页再返回的时候,会出现当前div被隐藏的情况,所以这种情况下不处理
            return false;
        }
        if(self.cache[requrl]){
            // alerady have cache data for the url
            self.handleData(self.cache[requrl],state);
        }else{
            // no cache for the url, to request new html and parse data
            self.handleState(state);
        }
    },
    // request new html and parse data
    handleState:function(state){ 
        var self = this,
            html,
            doc,
            elem,
            data,
            regex = /<title>(.*?)<\/title>/,
            mtch;
        $.ajax({
            url:state.requrl,
            type:'GET',
            dataType:'html',
            beforeSend:function(){},
            success:function(htmlData){
                if( (mtch = regex.exec(htmlData)) && mtch[1]) {
                    state.title = mtch[1];
                }
                html = $.parseHTML(htmlData);
                doc = $(html);
                elem = doc.find(self.fragment);
                data = {
                    elem:elem,
                    title:state.title,
                    requrl:state.requrl,
                };
                self.handleData(data,state);
            },
            error:function(){}
        });
    },
    handleData:function(data,state){
        var self = this,
            oldObj = $(self.fragment + '.nowshow'),
            newObj = data.elem,
            anchor = [],
            topixel = 0;
        self.cache[data.requrl] = data;
        document.title = state.title || data.title;
        // loadComment();
        if(self.pop){// from left to right
            oldObj.css('margin-left','0px');
            newObj.css('margin-left','0px').show().insertBefore(oldObj).animate({'margin-left':'680px'},300,function(){
                newObj.addClass('nowshow');
                oldObj.hide().removeClass('nowshow');
                if(state.anchor){
                    anchor = $(state.anchor);
                    topixel = anchor.offset().top;
                }else{
                    topixel = 0;
                }
                $body.animate({scrollTop:topixel},300);
                loadComment();
            })
        }else{// form right to left
            newObj.css('margin-left','0px').show().insertAfter(oldObj);
            oldObj.animate({'margin-left':'0px'},300,function(){
                newObj.css('margin-left','680px').addClass('nowshow');
                oldObj.hide().removeClass('nowshow');
                if(state.anchor){
                    anchor = $(state.anchor);
                    topixel = anchor.offset().top;
                }else{
                    topixel = 0;
                }
                $body.animate({scrollTop:topixel},300);
                loadComment();
            })
        }
        if(!self.pop && supportPjax){
            window.history.pushState({url:state.url,title:state.title,anchor:state.anchor,requrl:state.requrl},state.title,state.url);
        }
        self.pop = false;
    },
    bindEvent:function(){
        var self = this;
        $('body').on('click','a.pjax',function(){
            // alert('click')
            var _this = this,
                fragment = self.fragment,
                url = $(this).attr('href'),
                requrl,
                anchor,
                regex = /^([^#]*)(#.*)?$/,
                mtch,
                state,
                rregex = /^http:\/\/[^\/]*([^#]*)(#.*)?$/,
                rurl = window.location.href,
                rrequrl,
                rmtch;
            mtch = regex.exec(url);
            rmtch = rregex.exec(rurl);
            // console.log(mtch);
            if(mtch && mtch[1]){
                requrl = mtch[1];
                // console.log(requrl)
            }
            if(rmtch && rmtch[1]){
                rrequrl = rmtch[1];
                // console.log(rrequrl)
            }
            if(requrl == rrequrl){ // is now page, don't response
                return false;
            }
            if(mtch && mtch[2]){
                anchor = mtch[2];
            }else{
                anchor = '';
            }
            state = {
                url:url,
                anchor:anchor,
                requrl:requrl
            }
            if(self.cache[requrl]){
                // alert('has cached')
                self.handleData(self.cache[requrl],state);
            }else{
                self.handleState(state);
            }
            return false;
        });
    }

}
slide.init('div.vcontent');


});
