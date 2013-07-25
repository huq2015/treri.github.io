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
jquery ($)->
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

	$('#reply')
	.click ->
		$body.animate {scrollTop:$('#comment').offset().top},500

	goAnchor = (anchor) ->
		pos = 0
		if anchor
			if $(anchor).length > 0
				pos = $(anchor).offset().top
			else if $(".#{anchor[1..]}:visible").length > 0
				pos = $(".#{anchor[1..]}:visible").offset().top
		else 
			pos = 0

		$body.animate {
			scrollTop:pos
		},300

	goAnchor window.location.hash

	supportPjax = window.history and window.history.pushState and window.history.replaceState and not navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/)

	loadComment = ->
		$('div.comment').each ->
			if $(this).html() is '' and $(this).data('thread') and $(this).data('thread') isnt ''
				threadKey = $(this).data 'thread'
				el = document.createElement 'div'
				el.setAttribute 'data-thread-key',threadKey
				if supportPjax
					el.setAttribute 'data-url',window.location.href
				DUOSHUO.EmberThread el
				$(this).append el
				
	loadComment()

	pjax = {
		
	}