#!/usr/bin/env require

# region vim modline

# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:

# endregion

# region header

###!
    Copyright see require on https://github.com/thaibault/require

    Conventions see require on https://github.com/thaibault/require

    @author t.sickert@gmail.com (Torben Sickert)
    @version 1.0 stable
    @fileOverview
    This module provides common logic for the whole web page.
###

## standalone
## do ($=this.jQuery) ->
this.require.scopeIndicator = 'jQuery.Website'
this.require([
    ['less.Parser', 'less-1.5.0']

    'jquery-tools-1.0.coffee', ['jQuery.scrollTo', 'jquery-scrollTo-1.4.3.1']
    ['jQuery.fn.spin', 'jquery-spin-1.2.8']
    ['jQuery.fn.hashchange', 'jquery-observeHashChange-1.0']
    'jquery-lang-1.0.coffee'
], (less, lessParser, $) ->
##

# endregion

# region plugins/classes

    ###*
        @memberOf $
        @class
    ###
    class Website extends $.Tools.class

    # region properties

        ###*
            Holds the class name to provide inspection features.

            @property {String}
        ###
        __name__: 'Website'

    # endregion

    # region public methods

        # region special

        ###*
            @description Initializes the interactive web application.

            @param {Object} options An options object.

            @returns {$.Website} Returns the current instance.
        ###
        initialize: (
            options={}, @_parentOptions={
                logging: false
                domNodeSelectorPrefix: 'body.{1}'
                onViewportMovesToTop: $.noop()
                onViewportMovesAwayFromTop: $.noop()
                onChangeToDesktopMode: $.noop()
                onChangeToTabletMode: $.noop()
                onChangeToSmartphoneMode: $.noop()
                onChangeMediaQueryMode: $.noop()
                onSwitchSection: $.noop()
                onStartUpAnimationComplete: $.noop()
                additionalPageLoadingTimeInMilliseconds: 0
                googleTrackingCode: 'UA-0-0'
                mediaQueryCssIndicator:
                    extraSmall: 'xs', small: 'sm', medium: 'md', large: 'lg'
                domNode:
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
            }, @_viewportIsOnTop=true, @_currentMediaQueryMode='',
            @languageHandler=null, @__googleAnalyticsCode='''
                var _gaq = _gaq || [];
                  _gaq.push(['_setAccount', '{1}']);
                  _gaq.push(['_trackPageview']);

                  (function() {
                    var ga = document.createElement('script');
                    ga.type = 'text/javascript'; ga.async = true;
                    ga.src = ('https:' === document.location.protocol ?
                              'https://ssl' : 'http://www') +
                              '.google-analytics.com/ga.js';
                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(ga, s);
                  })();
            '''
        ) ->
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
            )._triggerWindowResizeEvents()._handleGoogleAnalytics(
                this._options.trackingCode)
            if not this._options.language.logging?
                this._options.language.logging = this._options.logging
            if this._options.activateLanguageSupport
                this._languageHandler = $.Lang this._options.language
            this

        # endregion

    # endregion

    # region protected methods

        # region event

        ###*
            @description This method triggers if the viewport moves to top.

            @returns {$.Website} Returns the current instance.
        ###
        _onViewportMovesToTop: ->
            if this.$domNodes.scrollToTopButtons.css(
                'visibility'
            ) isnt 'hidden'
                this.$domNodes.scrollToTopButtons.animate(
                    {bottom: '+=30', opacity: 0},
                    {duration: 'normal', always: =>
                        this.$domNodes.scrollToTopButtons.css(
                            'bottom', '-=30')})
            this
        ###*
            @description This method triggers if the viewport moves away from
                         top.

            @returns {$.Website} Returns the current instance.
        ###
        _onViewportMovesAwayFromTop: ->
            if this.$domNodes.scrollToTopButtons.css(
                'visibility'
            ) isnt 'hidden'
                this.$domNodes.scrollToTopButtons.css(
                    bottom: '+=30', display: 'block', opacity: 0
                ).animate(
                    {bottom: '-=30', queue: false, opacity: 1},
                    {duration: 'normal'})
            this
        ###*
            @description This method triggers if the responsive design
                         switches to another mode.

            @param {String} oldMode Saves the previous mode.
            @param {String} newMode Saves the new mode.

            @returns {$.Website} Returns the current instance.
        ###
        _onChangeMediaQueryMode: (oldMode, newMode) -> this
        ###*
            @description This method triggers if the responsive design
                         switches to large mode.

            @param {String} oldMode Saves the previous mode.
            @param {String} newMode Saves the new mode.

            @returns {$.Website} Returns the current instance.
        ###
        _onChangeToLargeMode: (oldMode, newMode) -> this
        ###*
            @description This method triggers if the responsive design
                         switches to medium mode.

            @param {String} oldMode Saves the previous mode.
            @param {String} newMode Saves the new mode.

            @returns {$.Website} Returns the current instance.
        ###
        _onChangeToMediumMode: (oldMode, newMode) -> this
        ###*
            @description This method triggers if the responsive design
                         switches to small mode.

            @param {String} oldMode Saves the previous mode.
            @param {String} newMode Saves the new mode.

            @returns {$.Website} Returns the current instance.
        ###
        _onChangeToSmallMode: (oldMode, newMode) -> this
        ###*
            @description This method triggers if the responsive design
                         switches to extra small mode.

            @param {String} oldMode Saves the previous mode.
            @param {String} newMode Saves the new mode.

            @returns {$.Website} Returns the current instance.
        ###
        _onChangeToExtraSmallMode: (oldMode, newMode) -> this
        ###*
            @description This method triggers if we change the current section.

            @param {String} sectionName Contains the new section name.

            @returns {$.Website} Returns the current instance.
        ###
        _onSwitchSection: (sectionName) -> this
        ###*
            @description This method is complete if last startup animation
                         was initialized.

            @returns {$.Website} Returns the current instance.
        ###
        _onStartUpAnimationComplete: -> this

        # endregion

        # region helper

        ###*
            @description This method adds triggers for responsive design
                         switches.

            @returns {$.Website} Returns the current instance.
        ###
        _addMediaQueryChangeEvents: ->
            this.on this.$domNodes.window, 'resize', this.getMethod(
                this._triggerWindowResizeEvents)
            this
        ###*
            @description This method triggers if the responsive design
                         switches its mode.

            @returns {$.Website} Returns the current instance.
        ###
        _triggerWindowResizeEvents: ->
            $.each this._options.mediaQueryCssIndicator, (name, value) =>
                this.$domNodes.parent.addClass "hidden-#{value}"
                if(this.$domNodes.parent.is(':hidden') and
                   name isnt this._currentMediaQueryMode)
                    this.fireEvent.apply(
                        this, [
                            this.stringFormat('changeMediaQueryMode',
                            name.substr(0, 1).toUpperCase() + name.substr 1),
                            false, this, this._currentMediaQueryMode, name
                        ].concat this.argumentsObjectToArray arguments
                    )
                    this.fireEvent.apply(
                        this, [
                            this.stringFormat('changeTo{1}Mode',
                            name.substr(0, 1).toUpperCase() + name.substr 1),
                            false, this, this._currentMediaQueryMode, name
                        ].concat this.argumentsObjectToArray arguments
                    )
                    this._currentMediaQueryMode = name
                this.$domNodes.parent.removeClass "hidden-#{value}"
            this
        ###*
            @description This method triggers if view port arrives at special
                         areas.

            @returns {$.Website} Returns the current instance.
        ###
        _bindScrollEvents: ->
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
        ###*
            @description This method triggers after window is loaded.

            @returns {$.Website} Returns the current instance.
        ###
        _removeLoadingCover: ->
            window.setTimeout(=>
                # Hide startup animation dom nodes to show them step by step.
                $(
                    '[class^="' +
                    this.sliceDomNodeSelectorPrefix(
                        this._options.domNode
                            .startUpAnimationClassPrefix
                    ).substr(1) + '"]'
                ).hide()
                this.$domNodes.windowLoadingCover.fadeOut(
                    this._options.windowLoadingCoverFadeOut)
            , this._options.additionalPageLoadingTimeInMilliseconds)
            this
        ###*
            @description This method handles the given start up effect step.

            @param {Number} elementNumber The current start up step.

            @returns {$.Website} Returns the current instance.
        ###
        _handleStartUpEffects: (elementNumber) ->
            # Stop and delete spinner instance.
            this.$domNodes.windowLoadingSpinner.spin false
            elementNumber = 1 if not $.isNumeric elementNumber
            window.setTimeout((=>
                $(
                    this._options.domNode.startUpAnimationClassPrefix +
                    elementNumber
                ).fadeIn this._options.startUpFadeIn
                if $(this._options.domNode.startUpAnimationClassPrefix +
                     (elementNumber + 1)).length
                    this._handleStartUpEffects elementNumber + 1
                else
                    this.fireEvent 'startUpAnimationComplete'
            ), this._options.startUpAnimationElementDelayInMiliseconds)
            this
        ###*
            @description This method adds triggers to switch section.

            @returns {$.Website} Returns the current instance.
        ###
        _addNavigationEvents: ->
            this.$domNodes.window.hashchange(=>
                this.fireEvent 'switchSection', false,
                this, window.location.hash)
            this._handleScrollToTopButton()
        ###*
            @description Adds trigger to scroll top buttons.

            @returns {$.Website} Returns the current instance.
        ###
        _handleScrollToTopButton: ->
            this.on(
                this.$domNodes.scrollToTopButtons, 'click', (event) =>
                    event.preventDefault()
                    this._scrollToTop()
            )
            this.$domNodes.scrollToTopButtons.hide()
            this
        ###*
            @description Scrolls to top of page. Runs the given function after
                         viewport arrives.

            @param {Function} onAfter Callback to call after effect has
                                      finished.

            @returns {$.Website} Returns the current instance.
        ###
        _scrollToTop: (onAfter=$.noop()) ->
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
        ###*
            @description Scrolls to top of page. Runs the given function after
                         viewport arrives.

            @param {String} trackingCode Google's javaScript embedding code
                                         snippet.

            @returns {$.Website} Returns the current instance.
        ###
        _handleGoogleAnalytics: (trackingCode) ->
            try
                (new Function(this.stringFormat(
                    this.__googleAnalyticsCode, trackingCode
                )))()
            catch exception
                this.warn(
                    'Problem in google analytics code snippet: {1}',
                    exception)
            this

        # endregion

    # endregion

    # region handle $ extending

    ###* @ignore ###
    $.Website = -> $.Tools().controller Website, arguments
    ###* @ignore ###
    $.Website.class = Website

    # endregion

# endregion

## standalone
)
