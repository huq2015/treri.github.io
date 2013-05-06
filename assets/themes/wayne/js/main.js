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


var slide = {
    _nowObj : null,
    _pop: false,
    cache:{},
    _handleObj:null,
    _tmp:{},
    init:function(){
        var self = this;
        var url = window.location.href;
        var hash = window.location.hash;
        var title = document.title;
        var fragment;
        var obj;
        if($('#pagination').length > 0){
            fragment = 'ul.homelisting';
        }else{
            fragment = 'div.vcontent';
        }
        obj = {
            url: url,
            title: title,
            id:'init',
            hash:hash,
            fragment:fragment
        };
        self.cache[obj.id] = obj;
        self.cache[obj.id].data = $(fragment);
        self._nowObj = $(fragment);
        if(supportPjax){
            window.history.replaceState({url:url,title:title,id:obj.id},title,url);
            window.onpopstate = function(e){
                if(e.state){
                    self._pop = true;
                    self._handlePop(e.state);
                }
            }
        }
        return self;
    },
    bindEvent:function(){
        var self = this;
        $body.on('click','.pjax',function(){
            var $_this = $(this);
            var id = $_this.attr('id');
            var seed;
            if(($_this).hasClass('used')){
                return false;
            }else{
                if($_this.hasClass('cached')){
                    console.log("$_this.attr('class')",$_this.attr('class'))
                    // id = $_this.attr('id');
                    // console.log(seed);
                    self._tmp = self.cache[id];
                    console.log('self._tmp 90',self._tmp);
                    self._handleData();
                }else{
                    // seed = "" + (new Date()).getTime();
                    $_this.addClass('cached');
                    console.log($_this);
                    // $_this.addClass(seed).addClass(seed);
                    var url = $_this.attr('href');
                    console.log('url',url);
                    self._tmp['url'] = url;
                    var fragment = $_this.data('fragment');
                    self._tmp['fragment'] = fragment;
                    console.log(fragment);
                    var ary = url.split('#');
                    var link = ary[0];
                    var hash;
                    // console.log($_this);
                    if(ary[1]) {
                        var hash = '#' + ary[1];
                    }
                    if(hash){
                        self._tmp['hash'] = hash;
                    }
                    self._tmp['id'] = id;
                    console.log('self._tmp 115',self._tmp);
                    self._handleUrl();
                }
                // console.log(seed);
                return false;
            }
            return false;
        })
    },
    _handlePop:function(state){
        var self = this;
        console.log('state',state);
        if($(state.id).length>0){
            $(state.id).click();
        }else{
            self._tmp = self.cache['init'];
            self._handleData(); 
        }
        // if($(state.seed).length > 0){
        //     console.log('has elem');
        //     $(state.seed).click();
        // }else{
            // console.log('has no elem')
        // }
    },
    _handleUrl:function(){
        var self = this;
        $.ajax({
            url:self._tmp['url'],
            dataType:'html',
            type:'GET',
            beforeSend:function(){},
            success:function(htmlData){
                var title;
                var matches = htmlData.match(/<title>(.*?)<\/title>/);
                if (matches) {
                    title = matches[1];
                }
                var html = $.parseHTML(htmlData);
                var $html = $(html);
                var $data = $html.find(self._tmp['fragment']);
                self._tmp['title'] = title;
                self._tmp['data'] = $data;
                console.log('self._tmp 151',self._tmp);
                self._handleData();
            },
            error:function(){
                console.log('error');
            }
        });
    },
    _handleData:function(){
        var self = this;
        var state = {
            url:self._tmp['url'],
            title:self._tmp['title'],
            id:self._tmp['id']?self._tmp['id']:'',
        }
        if(supportPjax && !self._pop){
            window.history.pushState(state,state.title,state.url);
        }
        if(self._pop){
            self._nowObj.css('margin-left','0px');
            self._tmp['data'].css('margin-left','0').show().insertBefore(self._nowObj).animate({'margin-left':'680px'},3000,function(){
                self._nowObj.hide();
                self._nowObj = self._tmp['data'];
                self._tmp = {}; 
            })
        }else{
            self._tmp['data'].css('margin-left','0px').show().insertAfter(self._nowObj);
            self._nowObj.animate({'margin-left':'0px'},3000,function(){
                self._nowObj.hide();
                self._tmp['data'].css('margin-left','680px');
                self._nowObj = self._tmp['data'];
                self._tmp = {}; 
            })
        }
        self._nowObj = self._tmp['data'];
        self.cache[self._tmp['id']] = self._tmp;
        console.log('self.cache',self.cache);
        self._pop = false;
    }

}
slide.init().bindEvent();





// window.slide ={
//     pop: false,
//     _oldurl:'',
//     cache:{},
//     _nowPage: 0,
//     _handlePage:0,
//     init:function(){
//         var self = this;
//         var url = document.location.pathname;
//         self._oldurl = url;
//         console.log('url',url);
//         var anchor = document.location.hash;
//         var title = document.title;
//         var fragment;
//         var press;
//         if($('#pagination').length > 0){
//             fragment = 'ul.listing';
//             self._nowPage = parseInt($('#pagination a.current').data('page'));
//             press = $('#pagination a.current');
//         }else{
//             fragment = 'div.vcontent';
//         }
//         self.cache[url] = {
//             'title': title,
//             'data': $(fragment),
//             'url':url,
//             'fragment':fragment
//         };
//         if(anchor){
//             self.cache[url]['anchor'] = anchor;
//         }
//         if(supportPjax){
//             var state = {
//                 url:url,
//                 title:title,
//                 page:self._nowPage
//             };
//             window.history.replaceState(state,state.title,state.url);
//             console.log('history',window.history)
//             window.onpopstate = function(e){
//                 console.log(e);
//                 if(e.state){
//                     self._handlePop(e.state);
//                 }
//             }
//         }
//         return self;
//     },
//     bindEvent:function(select){
//         var self = this;
//         $('body').on('click',select,function(e){
//             var $_this = $(this);
//             var press = $_this;
//             var url = $_this.attr('href');
//             var fragment = $_this.data('fragment');
//             // $_this.addClass('current').siblings().removeClass('current');
//             self._handlePage = $_this.data('page') ? parseInt($_this.data('page')) : 9999999;
//             self._handleUrl(url,fragment,press);
//             return false;
//         })
//     },
//     _handlePop:function(state){
//         var self = this;
//         self.pop = true;
//         self._handlePage = state.page;
//         console.log('_handlePop',state)
//         self._handleUrl(state.url,state.fragment);
//     },
//     _handleUrl:function(url,fragment,press){
//         console.log('_handleUrl ' ,url);
//         var self = this;
//         var pathname = document.location.pathname;
//         //console.log(pathname);
//         //console.log(url);
//         if( url == self._oldurl ){
//             console.log('same')
//             return;
//         }
//         console.log('next')
//         if(self.cache[url]){
//             console.log('has cache');
//             self._handleData(self.cache[url]);
//         }else{
//             console.log('get data');
//             self._getData(url,fragment,press,function(data){
//                 self._handleData(data);
//             }) 
//         }
//     },
//     _getData:function(url,fragment,press,callback){
//         var ary = url.split('#');
//         var link = ary[0];
//         var anchor;
//         if(ary[1]){
//             anchor = '#' + ary[1];
//         }
//         $.ajax({
//             'url': url,
//             'dataType':'html',
//             'type':'GET',
//             beforeSend:function(){

//             },
//             success:function(htmldata){
//                 var title;
//                 var matches = htmldata.match(/<title>(.*?)<\/title>/);
//                 if (matches) {
//                     title = matches[1];
//                 }
//                 var html = $.parseHTML(htmldata);
//                 var $html = $(html);
//                 var $data = $html.find(fragment);
//                 var obj = {
//                     'title':title,
//                     'data':$data,
//                     'url':url,
//                     'fragment':fragment,
//                     'press':press
//                 };
//                 if(anchor){
//                     obj.anchor = anchor;
//                 }
//                 callback(obj);
//             },
//             error:function(html){
//                 console.log(html);
//             }
//         });
//     },
//     _handleData:function(data){
//         var self = this;
//         document.title = data.title;
//         var anchor = data.anchor;
//         var _goto;
//         var state;
//         if(data.press.length > 0){
//             data.press.addClass('current').siblings().removeClass('current');
//         }
//         if(anchor && $(anchor).length > 0){
//             _goto = $(anchor).offset().top;
//         }else{
//             _goto = 0;
//         }
//         if(supportPjax && !self.pop){
//             state = {
//                 title: data.title,
//                 url:data.url,
//                 page:self._handlePage
//             }
//             console.log('state',state);
//             console.log('history 181',window.history)
//                 window.history.pushState(state,state.title,state.url);
//             console.log('history 183',window.history)
//         }
        
//         var fragment = data.fragment;
//         var $oldObj = $(fragment + ':visible');
//         var $newObj = data.data;
//         if(self._handlePage < self._nowPage){
//             $oldObj.css('margin-left','0px');
//             $newObj.css('margin-left','0px').show().insertBefore($oldObj).animate({'margin-left':'680px'},300,function(){
//                 $oldObj.hide();
//                 $body.animate({scrollTop:_goto},300);
//             });
//         }else{
//             $newObj.css('margin-left','0px').show().insertAfter($oldObj);
//             $oldObj.animate({'margin-left':'0px'},300,function(){
//                 $oldObj.hide();
//                 $newObj.css('margin-left','680px');
//                 $body.animate({scrollTop:_goto},300);
//             })
//         }
//         self.cache[data.url] = data;
//         self._oldurl = data.url;
//         self._nowPage = self._handlePage;
//         self.pop = false;
//     }
// }
// slide.init().bindEvent('#pagination a');

});