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
});
