## require

# region vim modline

# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:

# endregion

# region header

###!
    jQuery plugin for "jquery-1.9.1".

    Copyright see require on https://github.com/thaibault/require

    Conventions see require on https://github.com/thaibault/require

    @author t.sickert@gmail.com (Torben Sickert)
    @version 1.0 stable
    @fileOverview
    This module provides common logic for the whole webpage.
###

###*
    @name jQuery
    @see www.jquery.com
###
## standalone
## ((jQuery) ->
this.window.require([
    ['jQuery.Website', 'jquery-website-1.0.coffee'],
    ['jQuery.fn.carousel', 'bootstrap-2.3.1'],
    ['jQuery.fn.touchwipe', 'jquery-touchwipe.1.1.1']],
(jQuery) ->
##

# endregion

# region plugins

    ###*
        @memberOf jQuery
        @class
    ###
    class HomePage extends jQuery.Website.class

    # region private properties

        __name__: 'HomePage'

    # endregion

    # region protected properties 

        ###*
            Saves default options for manipulating the default behaviour.

            @property {Object}
        ###
        _options:
            trackingCode: 'UA-40192634-1'
            domNodes:
                navigationBar: 'div.navbar-wrapper'
                navigationButtons:
                    'div.navbar-wrapper ul.nav li a, a[href="#imprint"]'
                carousel: 'div.carousel.slide'
                dimensionIndicator:
                    'div.navbar-wrapper div.dimension-indicator'
                footer: 'div.footer'
            carouselOptions:
                interval: false
                pause: 'hover'

    # endregion

    # region public methods

        # region special methods

        ###*
            @description Initializes the interactive webapp.

            @param {Object} options An options object.

            @returns {jQuery.Tools} Returns the current instance.
        ###
        initialize: (options) ->
            this._options.domNodes.topDomNode =
                this._options.domNodes.navigationBar
            super options
            this._domNodes.carousel.carousel this._options.carouselOptions
            this.on this._domNodes.carousel, 'slide', =>
                this._domNodes.footer.fadeOut 'slow'
            this.on this._domNodes.carousel, 'slid', =>
                this._domNodes.footer.fadeIn 'slow'
            # NOTE: Cycling is more intuitive for reaction on wipe gestures.
            this._domNodes.carousel.carousel 'cycle'
            this

        # endregion

    # endregion

    # region protected methods

        # region event methods

        ###*
            @description This method triggers if the vieport moves to top.

            @returns {jQuery.Tools} Returns the current instance.
        ###
        _onVieportMovesToTop: ->
            # Fixes overlay movement caused by the menu positioning
            # transformation.
            this._domNodes.windowLoadingCover.css 'margin-top', '-20px'
            # Switch navigation bar from fixed positioning to static smooth
            # in smartphone mode.
            this._domNodes.navigationBar.addClass(
                this._options.domNodes.navigationOnTopIndicatorClass)
            super()
        ###*
            @description This method triggers if the vieport moves away from
                         top.

            @returns {jQuery.Tools} Returns the current instance.
        ###
        _onVieportMovesAwayFromTop: ->
            # Fixes overlay movement caused by the menu positioning
            # transformation.
            this._domNodes.windowLoadingCover.css 'margin-top', 0
            this._domNodes.navigationBar.removeClass(
                this._options.domNodes.navigationOnTopIndicatorClass)
            super()
        ###*
            @description This method triggers if the responsive design
                         switches to desktop mode.

            @returns {jQuery.Tools} Returns the current instance.
        ###
        _onChangeToDesktopMode: ->
            this._domNodes.dimensionIndicator.hide()
            super()
        ###*
            @description This method triggers if the responsive design
                         switches to tablet mode.

            @returns {jQuery.Tools} Returns the current instance.
        ###
        _onChangeToTabletMode: ->
            this._domNodes.dimensionIndicator.fadeOut 'slow', =>
                this._domNodes.dimensionIndicator.text(
                    'tablet-mode'
                ).fadeIn 'slow'
            super()
        ###*
            @description This method triggers if the responsive design
                         switches to smartphone mode.

            @returns {jQuery.Tools} Returns the current instance.
        ###
        _onChangeToSmartphoneMode: ->
            this._domNodes.dimensionIndicator.fadeOut 'slow', =>
                this._domNodes.dimensionIndicator.text(
                    'smartphone-mode'
                ).fadeIn 'slow'
            if this._vieportIsOnTop
                this._domNodes.navigationBar.addClass(
                    this._options.domNodes.navigationOnTopIndicatorClass)
            super()
        ###*
            @description Switches to given section.

            @param {String} hash Location to switch to.

            @returns {jQuery.Tools} Returns the current instance.
        ###
        _onSwitchSection: (hash) ->
            direction = false
            if jQuery.inArray(hash, ['next', 'prev']) isnt -1
                direction = hash
                hash = this._determineRelativeSections hash
            if hash.substr(0, 1) isnt '#'
                hash = "##{hash}"
            this._domNodes.navigationButtons.each (index, button) =>
                button = jQuery button
                sectionDomNode = button.parent 'li'
                if button.attr('href') is hash or (
                    index is 0 and hash is '#' and hash = button.attr('href')
                )
                    if not sectionDomNode.hasClass 'active'
                        this.debug "Switch to section \"#{hash}\"."
                        if direction
                            index = direction
                        if this._vieportIsOnTop
                            this._domNodes.carousel.carousel index
                        else
                            this._scrollToTop(=>
                                this._domNodes.carousel.carousel index)
                        sectionDomNode.addClass 'active'
                else
                    sectionDomNode.removeClass 'active'
            window.location.hash = hash
            super()
        ###*
            @description This method triggers if all startup animations are
                         ready.

            @returns {jQuery.Tools} Returns the current instance.
        ###
        _onStartUpAnimationComplete: ->
            # All start up effects are ready. Handle direct
            # section links.
            this._domNodes.navigationButtons.filter(
                "a[href=\"#{window.location.href.substr(
                    window.location.href.indexOf '#' )}\"]"
            ).trigger 'click',
            super()

        # endregion

        # region helper methods

        ###*
            @description This method triggers if viewport arrives at special
                         areas.

            @returns {jQuery.Tools} Returns the current instance.
        ###
        _bindScrollEvents: ->
            this.on window, 'scroll', =>
                distanceToTop = this._domNodes.window.scrollTop()
                if distanceToTop
                    menuHeight = this._domNodes.navigationBar.find(
                        'div.navbar'
                    ).outerHeight()
                    if distanceToTop < menuHeight
                        this._domNodes.carousel.css(
                            'margin-top', (menuHeight - distanceToTop) + 'px')
                else if not this._vieportIsOnTop
                    this._domNodes.carousel.css 'margin-top', 0
            super()
        ###*
            @description This method triggers if the responsive design
                         switches its mode. This method is called initially
                         on startup.

            @returns {jQuery.Tools} Returns the current instance.
        ###
        _triggerWindowResizeEvents: ->
            this._domNodes.scrollToTopButtons.css(
                'right', this._domNodes.footer.find('p').offset().left)
            super()
        ###*
            @description This method triggers after window is loaded.

            @returns {jQuery.Tools} Returns the current instance.
        ###
        _removeLoadingCover: ->
            window.setTimeout(
                =>
                    this._domNodes.windowLoadingCover.css 'margin-top', 0
                , this._options.addtionalPageLoadingTimeInMilliseconds)
            super()
        ###*
            @description This method adds triggers to switch section.

            @returns {jQuery.Tools} Returns the current instance.
        ###
        _addNavigationEvents: ->
            self = this._handleTouchWipe()
            super()
        ###*
            @description Determines current section to the right or the left.

            @param {String} hash Relative section ("next" or "prev"),

            @returns {String} Returns the absolute hash string.
        ###
        _determineRelativeSections: (hash) ->
            this._domNodes.navigationButtons.each (index, button) =>
                if jQuery(button).attr('href') is window.location.hash
                    # NOTE: We subtract 1 from navigation buttons length
                    # because we want to ignore the imprint section. And
                    # the index starts counting by zero.
                    numberOfButtons =
                        this._domNodes.navigationButtons.length - 1
                    if hash is 'next'
                        newIndex = (index + 1) % numberOfButtons
                    else if hash is 'prev'
                        # NOTE: Subtracting 1 in the residue class ring means
                        # adding the number of numbers minus 1. This prevents
                        # us from getting negative button indixes.
                        newIndex = (index + numberOfButtons - 1) %
                            numberOfButtons
                    hash = jQuery(
                        this._domNodes.navigationButtons[newIndex]
                    ).attr 'href'
                    false
            hash
        ###*
            @description Adds trigger to switch section on swipt gestures.

            @returns {jQuery.Tools} Returns the current instance.
        ###
        _handleTouchWipe: ->
            this._domNodes.parent.touchwipe(
                wipeLeft: =>
                    this.fireEvent 'switchSection', false, this, 'next'
                wipeRight: =>
                    this.fireEvent 'switchSection', false, this, 'prev'
                preventDefaultEvents: false)
            this

        # endregion

    # endregion

    # region handle jQuery extending

    ###* @ignore ###
    jQuery.HomePage = ->
        self = new HomePage
        self._controller.apply self, arguments

    # endregion

# endregion

## standalone ).call this, this.jQuery
)
