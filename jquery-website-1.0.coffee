#!/usr/bin/env require

# region vim modline

# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:

# endregion

# region header

###
[Project page](https://thaibault.github.com/jQuery-website)

This module provides common logic for the whole web page.

Copyright
---------

Torben Sickert 16.12.2012

License
-------

This library written by Torben Sickert stand under a creative commons naming
3.0 unported license. see http://creativecommons.org/licenses/by/3.0/deed.de

Extending this module
---------------------

For conventions see require on https://github.com/thaibault/require

Author
------

t.sickert@gmail.com (Torben Sickert)

Version
-------

1.0 stable
###

## standalone
## do ($=this.jQuery) ->
this.require.scopeIndicator = 'jQuery.Website'
this.require [
    ['less.Parser', 'less-1.5.0']

    'jquery-tools-1.0.coffee', ['jQuery.scrollTo', 'jquery-scrollTo-1.4.3.1']
    ['jQuery.fn.spin', 'jquery-spin-1.2.8']
    ['jQuery.fn.hashchange', 'jquery-observeHashChange-1.0']
    'jquery-lang-1.0.coffee'
], (less, lessParser, $) ->
##

# endregion

# region plugins/classes

    class Website extends $.Tools.class
        ###This plugin holds all needed methods to extend a whole website.###

    # region properties

        ###
            **__name__ {String}**
            Holds the class name to provide inspection features.
        ###
        __name__: 'Website'

    # endregion

    # region public methods

        # region special

        initialize: (
            options={}, @_parentOptions={
                logging: false
                domNodeSelectorPrefix: 'body.{1}'
                onViewportMovesToTop: $.noop()
                onViewportMovesAwayFromTop: $.noop()
                onChangeToLargeMode: $.noop()
                onChangeToMediumMode: $.noop()
                onChangeToSmallMode: $.noop()
                onChangeToExtraSmallMode: $.noop()
                onChangeMediaQueryMode: $.noop()
                onSwitchSection: $.noop()
                onStartUpAnimationComplete: $.noop()
                additionalPageLoadingTimeInMilliseconds: 0
                trackingCode: 'UA-0-0'
                mediaQueryCssIndicator: [
                    ['extraSmall', 'xs'], ['small', 'sm'], ['medium', 'md']
                    ['large', 'lg']
                ],
                domNode:
                    mediaQueryIndicator: '<div class="media-query-indicator">'
                    top: 'div.navigation-bar'
                    scrollToTopButtons: 'a[href="#top"]'
                    startUpAnimationClassPrefix: '.start-up-animation-number-'
                    windowLoadingCover: '> div.window-loading-cover'
                    windowLoadingSpinner: '> div.window-loading-cover > div'
                startUpFadeIn:
                    easing: 'swing'
                    duration: 'slow'
                windowLoadingCoverFadeOut:
                    easing: 'swing'
                    duration: 'slow'
                startUpAnimationElementDelayInMiliseconds: 100
                windowLoadingSpinner:
                    lines: 9 # The number of lines to draw
                    length: 23 # The length of each line
                    width: 11 # The line thickness
                    radius: 40 # The radius of the inner circle
                    corners: 1 # Corner roundness (0..1)
                    rotate: 75 # The rotation offset
                    color: '#000' # #rgb or #rrggbb
                    speed: 1.1 # Rounds per second
                    trail: 58 # Afterglow percentage
                    shadow: false # Whether to render a shadow
                    hwaccel: false # Whether to use hardware acceleration
                    className: 'spinner' # CSS class to assign to the spinner
                    zIndex: 2e9 # The z-index (defaults to 2000000000)
                    top: 'auto' # Top position relative to parent in px
                    left: 'auto' # Left position relative to parent in px
                activateLanguageSupport: true
                language: {}
                scrollInLinearTime: false
                scrollToTop: duration: 'slow'
                domain: 'auto'
            }, @startUpAnimationIsComplete=false, @_viewportIsOnTop=true,
            @_currentMediaQueryMode='', @languageHandler=null,
            @__googleAnalyticsCode='''
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', '{1}', '{2}');
ga('send', 'pageview');'''
        ) ->
            ###
                Initializes the interactive web application.

                **options {Object}**    - An options object.

                **returns {$.Website}** - Returns the current instance.
            ###
            # Wrap event methods with debouncing handler.
            this._onViewportMovesToTop = this.debounce(
                this.getMethod this._onViewportMovesToTop)
            this._onViewportMovesAwayFromTop = this.debounce(
                this.getMethod this._onViewportMovesAwayFromTop)
            this._options = $.extend(
                true, {}, this._parentOptions, this._options)
            super options
            this.$domNodes = this.grabDomNode this._options.domNode
            this._options.windowLoadingCoverFadeOut.always =
                this.getMethod this._handleStartUpEffects
            this.$domNodes.windowLoadingSpinner.spin(
                this._options.windowLoadingSpinner)
            this._bindScrollEvents().$domNodes.parent.show()
            this.$domNodes.window.ready this.getMethod(
                this._removeLoadingCover)
            this._addNavigationEvents()._addMediaQueryChangeEvents(
            )._triggerWindowResizeEvents()._handleGoogleAnalytics()
            if not this._options.language.logging?
                this._options.language.logging = this._options.logging
            if this._options.activateLanguageSupport
                this._languageHandler = $.Lang this._options.language
            this

        # endregion

    # endregion

    # region protected methods

        # region event

        _onViewportMovesToTop: ->
            ###
                This method triggers if the viewport moves to top.

                **returns {$.Website}** - Returns the current instance.
            ###
            if this.$domNodes.scrollToTopButtons.css(
                'visibility'
            ) isnt 'hidden'
                this.$domNodes.scrollToTopButtons.animate(
                    {bottom: '+=30', opacity: 0},
                    {duration: 'normal', always: =>
                        this.$domNodes.scrollToTopButtons.css(
                            'bottom', '-=30')})
            this
        _onViewportMovesAwayFromTop: ->
            ###
                This method triggers if the viewport moves away from top.

                **returns {$.Website}** - Returns the current instance.
            ###
            if this.$domNodes.scrollToTopButtons.css(
                'visibility'
            ) isnt 'hidden'
                this.$domNodes.scrollToTopButtons.css(
                    bottom: '+=30', display: 'block', opacity: 0
                ).animate(
                    {bottom: '-=30', queue: false, opacity: 1},
                    {duration: 'normal'})
            this
        _onChangeMediaQueryMode: (oldMode, newMode) ->
            ###
                This method triggers if the responsive design switches to
                another mode.

                **oldMode {String}**    - Saves the previous mode.

                **newMode {String}**    - Saves the new mode.

                **returns {$.Website}** - Returns the current instance.
            ###
            this
        _onChangeToLargeMode: (oldMode, newMode) ->
            ###
                This method triggers if the responsive design switches to large
                mode.

                **oldMode {String}**    - Saves the previous mode.

                **newMode {String}**    - Saves the new mode.

                **returns {$.Website}** - Returns the current instance.
            ###
            this
        _onChangeToMediumMode: (oldMode, newMode) ->
            ###
                This method triggers if the responsive design switches to
                medium mode.

                **oldMode {String}**    - Saves the previous mode.

                **newMode {String}**    - Saves the new mode.

                **returns {$.Website}** - Returns the current instance.
            ###
            this
        _onChangeToSmallMode: (oldMode, newMode) ->
            ###
                This method triggers if the responsive design switches to small
                mode.

                **oldMode {String}**    - Saves the previous mode.

                **newMode {String}**    - Saves the new mode.

                **returns {$.Website}** - Returns the current instance.
            ###
            this
        _onChangeToExtraSmallMode: (oldMode, newMode) ->
            ###
                This method triggers if the responsive design switches to extra
                small mode.

                **oldMode {String}**    - Saves the previous mode.

                **newMode {String}**    - Saves the new mode.

                **returns {$.Website}** - Returns the current instance.
            ###
            this
        _onSwitchSection: (sectionName) ->
            ###
                This method triggers if we change the current section.

                **sectionName {String}** - Contains the new section name.

                **returns {$.Website}**  - Returns the current instance.
            ###
            this
        _onStartUpAnimationComplete: ->
            ###
                This method is complete if last startup animation was
                initialized.

                **returns {$.Website}** - Returns the current instance.
            ###
            this.startUpAnimationIsComplete = true
            this

        # endregion

        # region helper

        _addMediaQueryChangeEvents: ->
            ###
                This method adds triggers for responsive design switches.

                **returns {$.Website}** - Returns the current instance.
            ###
            this.on this.$domNodes.window, 'resize', this.getMethod(
                this._triggerWindowResizeEvents)
            this
        _triggerWindowResizeEvents: ->
            ###
                This method triggers if the responsive design switches its
                mode.

                **returns {$.Website}** - Returns the current instance.
            ###
            $.each this._options.mediaQueryCssIndicator, (key, value) =>
                this.$domNodes.mediaQueryIndicator.prependTo(
                    this.$domNodes.parent
                ).addClass(
                    "hidden-#{value[1]}")
                if(this.$domNodes.mediaQueryIndicator.is(':hidden') and
                   value[0] isnt this._currentMediaQueryMode)
                    this.fireEvent.apply(
                        this, [
                            'changeMediaQueryMode', false, this,
                            this._currentMediaQueryMode, value[0]
                        ].concat this.argumentsObjectToArray arguments
                    )
                    this.fireEvent.apply(
                        this, [
                            this.stringFormat(
                                'changeTo{1}Mode',
                                value[0].substr(0, 1).toUpperCase() +
                                value[0].substr 1
                            ), false, this, this._currentMediaQueryMode,
                            value[0]
                        ].concat this.argumentsObjectToArray arguments
                    )
                    this._currentMediaQueryMode = value[0]
                this.$domNodes.mediaQueryIndicator.removeClass(
                    "hidden-#{value[1]}")
            this
        _bindScrollEvents: ->
            ###
                This method triggers if view port arrives at special areas.

                **returns {$.Website}** - Returns the current instance.
            ###
            this.on window, 'scroll', =>
                if this.$domNodes.window.scrollTop()
                    if this._viewportIsOnTop
                        this._viewportIsOnTop = false
                        this.fireEvent.apply this, [
                            'viewportMovesAwayFromTop', false, this
                        ].concat this.argumentsObjectToArray arguments
                else if not this._viewportIsOnTop
                    this._viewportIsOnTop = true
                    this.fireEvent.apply this, [
                        'viewportMovesToTop', false, this
                    ].concat this.argumentsObjectToArray arguments
            this
        _removeLoadingCover: ->
            ###
                This method triggers after window is loaded.

                **returns {$.Website}** - Returns the current instance.
            ###
            window.setTimeout(=>
                # Hide startup animation dom nodes to show them step by step.
                $(this.stringFormat(
                    '[class^="{1}"], [class*=" {1}"]',
                    this.sliceDomNodeSelectorPrefix(
                        this._options.domNode.startUpAnimationClassPrefix
                    ).substr(1))
                ).hide()
                this.$domNodes.windowLoadingCover.fadeOut(
                    this._options.windowLoadingCoverFadeOut)
            , this._options.additionalPageLoadingTimeInMilliseconds)
            this
        _handleStartUpEffects: (elementNumber) ->
            ###
                This method handles the given start up effect step.

                **elementNumber {Number}** - The current start up step.

                **returns {$.Website}**    - Returns the current instance.
            ###
            # Stop and delete spinner instance.
            this.$domNodes.windowLoadingSpinner.spin false
            elementNumber = 1 if not $.isNumeric elementNumber
            window.setTimeout((=>
                lastElementTriggered = false
                this._options.startUpFadeIn.always = =>
                    if lastElementTriggered
                        this.fireEvent 'startUpAnimationComplete'
                $(
                    this._options.domNode.startUpAnimationClassPrefix +
                    elementNumber
                ).fadeIn this._options.startUpFadeIn
                if $(this._options.domNode.startUpAnimationClassPrefix +
                     (elementNumber + 1)).length
                    this._handleStartUpEffects elementNumber + 1
                else
                    lastElementTriggered = true
            ), this._options.startUpAnimationElementDelayInMiliseconds)
            this
        _addNavigationEvents: ->
            ###
                This method adds triggers to switch section.

                **returns {$.Website}** - Returns the current instance.
            ###
            this.$domNodes.window.hashchange(=>
                this.fireEvent 'switchSection', false,
                this, window.location.hash)
            this._handleScrollToTopButton()
        _handleScrollToTopButton: ->
            ###
                Adds trigger to scroll top buttons.

                **returns {$.Website}** - Returns the current instance.
            ###
            this.on(
                this.$domNodes.scrollToTopButtons, 'click', (event) =>
                    event.preventDefault()
                    this._scrollToTop()
            )
            this.$domNodes.scrollToTopButtons.hide()
            this
        _scrollToTop: (onAfter=$.noop()) ->
            ###
                Scrolls to top of page. Runs the given function after viewport
                arrives.

                **onAfter {Function}**  - Callback to call after effect has
                                          finished.

                **returns {$.Website}** - Returns the current instance.
            ###
            this._options.scrollToTop.onAfter = onAfter
            if this._options.scrollInLinearTime
                distanceToTopInPixel = this.$domNodes.window.scrollTop()
                # Scroll as fast as we have distance to top.
                this._options.scrollToTop.duration = distanceToTopInPixel
                $.scrollTo(
                    {top: "-=#{distanceToTopInPixel}", left: '+=0'},
                    this._options.scrollToTop)
            else
                $.scrollTo {top: 0, left: 0}, this._options.scrollToTop
            this
        _handleGoogleAnalytics: () ->
            ###
                Executes the page tracking code.

                **returns {$.Website}**   - Returns the current instance.
            ###
            this.debug(
                "Run analytics code: \"#{this.__googleAnalyticsCode}\"",
                this._options.trackingCode, this._options.domain)
            try
                (new Function(this.stringFormat(
                    this.__googleAnalyticsCode, this._options.trackingCode,
                    this._options.domain
                )))()
            catch exception
                this.warn(
                    'Problem in google analytics code snippet: {1}',
                    exception)
            this

        # endregion

    # endregion

    # region handle $ extending

    $.Website = -> $.Tools().controller Website, arguments
    $.Website.class = Website

    # endregion

# endregion
