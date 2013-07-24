fq = 0
up = ->
	$wd = $ window
	$wd.scrollTop $wd.scrollTop() - 1
	fq = setTimeout "up()",40
	false
dn = ->
	$wd = $ window
	$wd.scrollTop $wd.scrollTop() + 1
	fq = setTimeout "dn()",40
	false
$ ->
	if window.opera
		if document.compatMode is "CSS1Compat"
			$body = $ html
		else
			$body = $ 'body'
	else
		$body = $ 'html,body'

	$('#up')
	.mouseover ->
		up()
	.mouseout ->
		clearTimeout fq
	.click ->
		$body.animate {scrollTop:0},500

	$('#down')
	.mouseover ->
		dn()
	.mouseout ->
		clearTimeout fq
	.click ->
		$body.animate {scrollTop:$('#footer').offset().top},500

	$('#comt')
	.click ->
		$body.animate {scrollTop:$('#comment').offset().top},500

	assetsPath = ->
		i = 0
		got = -1
		len = document.getElementsByTagname('link').length
		while i <= len and got is -1
			url = document.getElementsByTagname('link')[i].href
			got = url.indexOf '/default.css'
			i++
		url.replace /\/css\/default.css.*/g, ""
