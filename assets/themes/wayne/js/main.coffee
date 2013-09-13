class Pjax
	constructor: (@option)->
		@isPop = false
		@dir = false
		@timeStamp = false
		@cache = {}
		@initPage()
		@initHistory()
		@bindEvent(@option.el or 'a.pjax')
	initPage: ()->
		url = window.location.href
		urlRegex = /^http:\/\/[^\/]*([^#]*)(#.*)?$/
		match = ''
		path = ''
		hash = ''
	initHistory: ()->
	pushState: ()->
	handlePop: ()->
	handleState: (state)->
		self = @
		titleRegex = /<title>(.*?)<\/title>/
		docDocument = null
		elem = ''
		data = ''
		titleMatch = ''
		$.ajax {
			url: state.requestURI
			type :'GET'
			dataType:'html'
			beforeSend: ->
				$(self.option.overlay).show()
				$(self.option.loading).show()
			success: (htmlData)->
				$(self.option.overlay).hide()
				$(self.option.loading).hide()

				if titleMatch = titleRegex.exec htmlData and titleMatch[1]
					state.title = titleMatch[1]

				docDocument = $ $.parseHTML(htmlData)

				elem = docDocument.find self.option.fragment
				elem.timeStamp = new Date().getTime()
				
				data = 
					elem:elem
					title:state.title
					requestURI:state.requestURI

				self.handleData data,state
			error: ->
		}
	handleData: (data,state)->
	bindEvent: (el)->
		self = @
		$('body').on 'click', el, ->

			fragment = self.fragment
			hash = ''
			clickURI = $('this').attr 'href'
			clickURIRegex = /^([^#]*)(#.*)?$/
			pageURIRegex = /^http:\/\/[^\/]*([^#]*)(#.*)?$/
			pageURI = window.location.href
			timeStamp = (new Date()).getTime()
			clickURIMatch = clickURIRegex.exec clickURI
			pageURIMatch = pageURIRegex.exec pageURI

			if clickURIMatch and clickURIMatch[1]
				requestURI = clickURIMatch[1]
			if pageURIMatch and pageURIMatch[1]
				nowURI = pageURIMatch[1]

			if self.supportPjax and requestURI is nowURI
				return false

			if clickURIMatch and clickURIMatch[2]
				hash = clickURIMatch[2]

			state = 
				url: clickURI
				hash: hash
				requestURI:requestURI
				timeStamp:timeStamp

			if self.cache[requestURI]
				self.handleData self.cache[requestURI],state
			else
				self.handleState state

			false
	supportPjax: do ->
		window.history && window.history.pushState && window.history.replaceState && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/)