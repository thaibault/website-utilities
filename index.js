// @flow
// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module jQuery-website */
'use strict'
/* !
    region header
    [Project page](http://torben.website/jQuery-website)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See http://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import $ from 'jquery'
import 'jQuery-tools'
import Lang from 'jQuery-lang'
import 'jQuery-scrollTo'
import 'jQuery-spin'
/* eslint-disable no-duplicate-imports */
import type {$DomNode} from 'jQuery-tools'
/* eslint-enable no-duplicate-imports */
// endregion
// region types
export type AnalyticsCode = {
    initial:string;
    sectionSwitch:string;
    event:string;
}
// endregion
const context:Object = (():Object => {
    if ($.type(window) === 'undefined') {
        if ($.type(global) === 'undefined')
            return ($.type(module) === 'undefined') ? {} : module
        return global
    }
    return window
})()
if (!('document' in context) && 'context' in $)
    context.document = $.context
// region plugins/classes
/**
 * This plugin holds all needed methods to extend a whole website.###
 * @extends jQuery-tools:Tools
 * @property static:_name - Defines this class name to allow retrieving them
 * after name mangling.
 * @property _options - Options extended by the options given to the
 * initializer method.
 * @property _parentOptions - Saves default options to extend by options given
 * to the initializer method.
 * @property _parentOptions.domNodeSelectorPrefix {string} - Selector prefix
 * for all nodes to take into account.
 * @property _parantOptions.onViewportMovesToTop {Function} - Callback to
 * trigger when viewport arrives at top.
 * @property _parantOptions.onViewportMovesAwayFromTop {Function} - Callback to
 * trigger when viewport moves away from top.
 * @property _parentOptions.onChangeToLargeMode {Function} - Callback to
 * trigger if media query mode changes to large mode.
 * @property _parentOptions.onChangeToMediumMode {Function} - Callback to
 * trigger if media query mode changes to medium mode.
 * @property _parentOptions.onChangeToSmallMode {Function} - Callback to
 * trigger if media query mode changes to small mode.
 * @property _parentOptions.onChangeToExtraSmallMode {Function} - Callback to
 * trigger if media query mode changes to extra small mode.
 * @property _parentOptions.onChangeMediaQueryMode {Function} - Callback to
 * trigger if media query mode changes.
 * @property _parentOptions.onSwitchSection {Function} - Callback to trigger
 * if current section switches.
 * @property _parentOptions.onStartUpAnimationComplete {Function} - Callback to
 * trigger if all start up animations has finished.
 * @property _parentOptions.knownScrollEventNames {string} - Saves all known
 * scroll events in a space separated string.
 * @property _parentOption.switchToManualScrollingIndicator {Function} -
 * Indicator function to stop currently running scroll animations to let the
 * user get control of current scrolling behavior. Given callback gets an event
 * object. If the function returns "true" current animated scrolls will be
 * stopped.
 * @property _parentOptions.additionalPageLoadingTimeInMilliseconds {Number} -
 * Additional time to wait until page will be indicated as loaded.
 * @property _parentOptions.trackingCode - Analytic tracking code to collect
 * user behavior data.
 * @property _parentOptions.mediaQueryClassNameIndicator
 * {Array.Array.<string>} - Mapping of media query class indicator names to
 * internal event names.
 * @property _parentOptions.domNode {Object.<string, string>} - Mapping of
 * dom node descriptions to their corresponding selectors.
 * @property _parentOptions.domNode.mediaQueryIndicator {string} - Selector
 * for indicator dom node to use to trigger current media query mode.
 * @property _parentOptions.domNode.top {string} - Selector to indicate that
 * viewport is currently on top.
 * @property _parentOptions.domNode.scrollToTopButton {string} - Selector for
 * starting an animated scroll to top.
 * @property _parentOption.domNode.startUpAnimationClassPrefix {string} -
 * Class name selector prefix for all dom nodes to appear during start up
 * animations.
 * @property _parentOptions.domNode.windowLoadingCover {string} - Selector
 * to the full window loading cover dom node.
 * @property _parentOptions.domNode.windowLoadingSpinner {string} - Selector
 * to the window loading spinner (on top of the window loading cover).
 * @property _parentOption.startUpFadeIn {Object} - Options for startup
 * fade in animation.
 * @property _parentOptions.windowLoadingCoverFadeOut {Object} - Options for
 * startup loading cover fade out animation.
 * @property _parentOptions.startUpAnimationElementDelayInMiliseconds {number}
 * - Delay between two startup animated dom nodes in order.
 * @property _parentOptions.windowLoadingSpinner {Object} - Options for the
 * window loading cover spinner.
 * @property _parentOptions.activateLanguageSupport {boolean} - Indicates
 * weather language support should be used or not.
 * @property _parentOptions.language {Object} - Options for client side
 * internationalisation handler.
 * @property _parentOptions.scrollTop {Object} - Options for automated scroll
 * top animation.
 * @property _parentOptions.domain {string} - Sets current domain name. If
 * "auto" is given it will be determined automatically.
 * @property startUpAnimationIsComplete - Indicates weather start up animations
 * has finished.
 * @property currentSectionName - Saves current section hash name.
 * @property viewportIsOnTop - Indicates weather current viewport is on top.
 * @property currentMediaQueryMode - Saves current media query status depending
 * on available space in current browser window.
 * @property languageHandler - Reference to the language switcher instance.
 * @property _analyticsCode - Saves analytics code snippets to use for
 * referenced situations.
 * @property _analyticsCode.initial {string} - Initial string to use for
 * analyses on.
 * @property _analyticsCode.sectionSwitch {string} - Code to execute on each
 * section switch. Current page is available via "{1}" string formatting.
 * @property _analyticsCod.event {string} - Code to execute on each fired
 * event.
 */
class Website extends $.Tools.class {
    // region static properties
    static _name:string = 'Website'
    // endregion
    // region dynamic properties
    _parentOptions:Object
    startUpAnimationIsComplete:boolean
    currentSectionName:string
    viewportIsOnTop:boolean
    currentMediaQueryMode:string
    languageHandler:?Lang
    _analyticsCode:AnalyticsCode;
    // endregion
    // region public methods
    // / region special
    /**
     * Initializes the interactive web application.
     * @param options - An options object.
     * @param parentOptions - A default options object.
     * @param startUpAnimationIsComplete - If set to "true", no start up
     * animation will be performed.
     * @param currentSectionName - Initial section name to use.
     * @param viewportIsOnTop - Indicates weather viewport is on top initially.
     * @param currentMediaQueryMode - Initial media query mode to use (until
     * first window resize event could trigger a change).
     * @param languageHandler - Language handler instance to use.
     * @param analyticsCode - Analytic code snippet to use.
     * @returns Returns the current instance.
     */
    initialize(
        options:Object = {}, parentOptions:Object = {
            domNodeSelectorPrefix: 'body.{1}',
            onViewportMovesToTop: $.noop(),
            onViewportMovesAwayFromTop: $.noop(),
            onChangeToLargeMode: $.noop(),
            onChangeToMediumMode: $.noop(),
            onChangeToSmallMode: $.noop(),
            onChangeToExtraSmallMode: $.noop(),
            onChangeMediaQueryMode: $.noop(),
            onSwitchSection: $.noop(),
            onStartUpAnimationComplete: $.noop(),
            knownScrollEventNames:
                'scroll mousedown wheel DOMMouseScroll mousewheel keyup ' +
                'touchmove',
            switchToManualScrollingIndicator: (event:Object):boolean => (
                event.which > 0 || event.type === 'mousedown' ||
                event.type === 'mousewheel' || event.type === 'touchmove'),
            additionalPageLoadingTimeInMilliseconds: 0,
            trackingCode: null,
            mediaQueryClassNameIndicator: [
                ['extraSmall', 'xs'], ['small', 'sm'], ['medium', 'md'],
                ['large', 'lg']
            ],
            domNode: {
                mediaQueryIndicator: '<div class="media-query-indicator">',
                top: '> div.navbar-wrapper',
                scrollToTopButton: 'a[href="#top"]',
                startUpAnimationClassPrefix:
                    '.website-start-up-animation-number-',
                windowLoadingCover: 'div.website-window-loading-cover',
                windowLoadingSpinner: 'div.website-window-loading-cover > div'
            },
            startUpFadeIn: {
                easing: 'swing',
                duration: 'slow'
            },
            windowLoadingCoverFadeOut: {
                easing: 'swing',
                duration: 'slow'
            },
            startUpAnimationElementDelayInMiliseconds: 100,
            windowLoadingSpinner: {
                lines: 9, // The number of lines to draw
                length: 23, // The length of each line
                width: 11, // The line thickness
                radius: 40, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 75, // The rotation offset
                color: '#000', // #rgb or #rrggbb
                speed: 1.1, // Rounds per second
                trail: 58, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left: 'auto' // Left position relative to parent in px
            },
            activateLanguageSupport: true,
            language: {},
            scrollToTop: {
                inLinearTime: true,
                options: {duration: 'normal'},
                button: {
                    slideDistanceInPixel: 30,
                    showAnimation: {duration: 'normal'},
                    hideAnimation: {duration: 'normal'}
                }
            },
            domain: 'auto'
        }, startUpAnimationIsComplete:boolean = false,
        currentSectionName:?string = null,
        viewportIsOnTop:boolean = false, currentMediaQueryMode:string = '',
        languageHandler:?Lang = null, analyticsCode:AnalyticsCode = {
            initial: `
                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=` +
                    'i[r]||function(){' +
                '(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*' +
                    'new window.Date();' +
                'a=s.createElement(o),m=s.getElementsByTagName(o)[0];' +
                    'a.async=1;a.src=g;' +
                'm.parentNode.insertBefore(a,m)})(' +
                "window,document,'script','//www.google-analytics.com/" +
                    "analytics.js','ga');" +
                `window.ga('create', '{1}', '{2}');
                window.ga('set', 'anonymizeIp', true);
                window.ga('send', 'pageview', {page: '{3}'});
            `,
            sectionSwitch: "window.ga('send', 'pageview', {page: '{1}'});",
            event: `window.ga(
                'send', 'event', eventCategory, eventAction, eventLabel,
                eventValue, eventData);
            `
        }
    ):Website {
        this._parentOptions = parentOptions
        this.startUpAnimationIsComplete = startUpAnimationIsComplete
        this.viewportIsOnTop = viewportIsOnTop
        this.currentMediaQueryMode = currentMediaQueryMode
        this.languageHandler = languageHandler
        this._analyticsCode = analyticsCode
        if (currentSectionName)
            this.currentSectionName = currentSectionName
        else if ('location' in context && context.location.hash)
            this.currentSectionName = context.location.hash.substring(
                '#'.length)
        else
            this.currenSectionName = 'home'
        // Wrap event methods with debounceing handler.
        this._onViewportMovesToTop = this.constructor.debounce(this.getMethod(
            this._onViewportMovesToTop))
        this._onViewportMovesAwayFromTop = this.constructor.debounce(
            this.getMethod(this._onViewportMovesAwayFromTop))
        this._options = $.extend(
            true, {}, this._parentOptions, this._options)
        super.initialize(options)
        this.$domNodes = this.grabDomNode(this._options.domNode)
        this.disableScrolling()._options.windowLoadingCoverFadeOut.always =
            this.getMethod(this._handleStartUpEffects)
        this.$domNodes.windowLoadingSpinner.spin(
            this._options.windowLoadingSpinner)
        this._bindScrollEvents().$domNodes.parent.show()
        if ('window' in this.$domNodes)
            this.on(this.$domNodes.window, 'load', ():void => {
                this.windowLoaded = true
                this._removeLoadingCover()
            })
        this._addNavigationEvents()._addMediaQueryChangeEvents(
        )._triggerWindowResizeEvents()._handleAnalyticsInitialisation()
        if (!this._options.language.logging)
            this._options.language.logging = this._options.logging
        if (this._options.activateLanguageSupport && !this.languageHandler)
            this.languageHandler = $.Lang(this._options.language)
        return this
    }
    // endregion
    /**
     * This method disables scrolling on the given web view.
     * @returns Returns the current instance.
     */
    disableScrolling():Website {
        this.$domNodes.parent.addClass('disable-scrolling').on(
            'touchmove', (event:Object):void => event.preventDefault())
        return this
    }
    /**
     * This method disables scrolling on the given web view.
     * @returns Returns the current instance.
     */
    enableScrolling():Website {
        this.off(this.$domNodes.parent.removeClass(
            'disable-scrolling', 'touchmove'))
        return this
    }
    /**
     * Triggers an analytics event. All given arguments are forwarded to
     * configured analytics event code to defined their environment variables.
     * @returns Returns the current instance.
     */
    triggerAnalyticsEvent():Website {
        if (
            this._options.trackingCode &&
            this._options.trackingCode !== '__none__' &&
            'location' in context &&
            context.location.hostname !== 'localhost'
        ) {
            this.debug(
                "Run analytics code: \"#{this._analyticsCode.event}\" with " +
                'arguments:')
            this.debug(arguments)
            try {
                (new Function(
                    'eventCategory', 'eventAction', 'eventLabel', 'eventData',
                    'eventValue', this._analyticsCode.event
                )).apply(this, arguments)
            } catch (exception) {
                this.warn(
                    'Problem in google analytics event code snippet: {1}',
                    exception)
            }
        }
        return this
    }
    // endregion
    // region protected methods
    // / region event
    /**
     * This method triggers if the viewport moves to top.
     * @returns Returns the current instance.
     */
    _onViewportMovesToTop():Website {
        if (this.$domNodes.scrollToTopButton.css('visibility') === 'hidden')
            this.$domNodes.scrollToTopButton.css('opacity', 0)
        else {
            this._options.scrollToTop.button.hideAnimation.always = (
            ):void => {
                this.$domNodes.scrollToTopButton.css(
                    'bottom',
                        '-=' +
                        this._options.scrollToTop.button.slideDistanceInPixel)
            }
            this.$domNodes.scrollToTopButton.finish().animate({
                bottom: '+=' +
                    this._options.scrollToTop.button.slideDistanceInPixel,
                opacity: 0
            }, this._options.scrollToTop.button.hideAnimation)
        }
        return this
    }
    /**
     * This method triggers if the viewport moves away from top.
     * @returns Returns the current instance.
     */
    _onViewportMovesAwayFromTop():Website {
        if (this.$domNodes.scrollToTopButton.css('visibility') === 'hidden')
            this.$domNodes.scrollToTopButton.css('opacity', 1)
        else
            this.$domNodes.scrollToTopButton.finish().css({
                bottom: '+=' +
                    this._options.scrollToTop.button.slideDistanceInPixel,
                display: 'block',
                opacity: 0
            }).animate({
                bottom: '-=' +
                    this._options.scrollToTop.button.slideDistanceInPixel,
                queue: false,
                opacity: 1
            }, this._options.scrollToTop.button.showAnimation)
        return this
    }
    /* eslint-disable no-unused-vars */
    /**
     * This method triggers if the responsive design switches to another mode.
     * @param oldMode - Saves the previous mode.
     * @param newMode - Saves the new mode.
     * @returns Returns the current instance.
     */
    _onChangeMediaQueryMode(oldMode:string, newMode:string):Website {
        return this
    }
    /**
     * This method triggers if the responsive design switches to large mode.
     * @param oldMode - Saves the previous mode.
     * @param newMode - Saves the new mode.
     * @returns Returns the current instance.
     */
    _onChangeToLargeMode(oldMode:string, newMode:string):Website {
        return this
    }
    /**
     * This method triggers if the responsive design switches to medium mode.
     * @param oldMode - Saves the previous mode.
     * @param newMode - Saves the new mode.
     * @returns Returns the current instance.
     */
    _onChangeToMediumMode(oldMode:string, newMode:string):Website {
        return this
    }
    /**
     * This method triggers if the responsive design switches to small mode.
     * @param oldMode - Saves the previous mode.
     * @param newMode - Saves the new mode.
     * @returns Returns the current instance.
     */
    _onChangeToSmallMode(oldMode:string, newMode:string):Website {
        return this
    }
    /**
     * This method triggers if the responsive design switches to extra small
     * mode.
     * @param oldMode - Saves the previous mode.
     * @param newMode - Saves the new mode.
     * @returns Returns the current instance.
     */
    _onChangeToExtraSmallMode(oldMode:string, newMode:string):Website {
        return this
    }
    /* eslint-enable no-unused-vars */
    /**
     * This method triggers if we change the current section.
     * @param sectionName - Contains the new section name.
     * @returns Returns the current instance.
     */
    _onSwitchSection(sectionName:string):Website {
        if (
            this._options.trackingCode &&
            this._options.trackingCode !== '__none__' &&
            'location' in context &&
            context.location.hostname !== 'localhost' &&
            this.currentSectionName !== sectionName
        ) {
            this.currentSectionName = sectionName
            this.debug(
                `Run analytics code: "${this._analyticsCode.sectionSwitch}"`,
                this.currentSectionName)
            try {
                (new Function(this.constructor.stringFormat(
                    this._analyticsCode.sectionSwitch, this.currentSectionName
                )))()
            } catch (exception) {
                this.warn(
                    'Problem in analytics section switch code snippet: {1}',
                    exception)
            }
        }
        return this
    }
    /**
     * This method is complete if last startup animation was initialized.
     * @returns Returns the current instance.
     */
    _onStartUpAnimationComplete():Website {
        this.startUpAnimationIsComplete = true
        return this
    }
    // endregion
    // / region helper
    /**
     * This method adds triggers for responsive design switches.
     * @returns Returns the current instance.
     */
    _addMediaQueryChangeEvents():Website {
        this.on(this.$domNodes.window, 'resize', this.getMethod(
            this._triggerWindowResizeEvents))
        return this
    }
    /**
     * This method triggers if the responsive design switches its mode.
     * @returns Returns the current instance.
     */
    _triggerWindowResizeEvents():Website {
        $.each(this._options.mediaQueryClassNameIndicator, (
            index:string, classNameMapping:string
        ):void => {
            this.$domNodes.mediaQueryIndicator.prependTo(
                this.$domNodes.parent
            ).addClass(`hidden-${classNameMapping[1]}`)
            if (
                this.$domNodes.mediaQueryIndicator.is(':hidden') &&
                classNameMapping[0] !== this.currentMediaQueryMode
            ) {
                this.fireEvent.apply(
                    this, [
                        'changeMediaQueryMode', false, this,
                        this.currentMediaQueryMode, classNameMapping[0]
                    ].concat(this.constructor.argumentsObjectToArray(
                        arguments)))
                this.fireEvent.apply(
                    this, [
                        this.constructor.stringFormat(
                            `changeTo{1}Mode`,
                            this.constructor.stringCapitalize(
                                classNameMapping[0])
                        ), false, this, this.currentMediaQueryMode,
                        classNameMapping[0]
                    ].concat(this.constructor.argumentsObjectToArray(
                        arguments)))
                this.currentMediaQueryMode = classNameMapping[0]
            }
            this.$domNodes.mediaQueryIndicator.removeClass(
                `hidden-${classNameMapping[1]}`)
        })
        return this
    }
    /**
     * This method triggers if view port arrives at special areas.
     * @returns Returns the current instance.
     */
    _bindScrollEvents():Website {
        // Stop automatic scrolling if the user wants to scroll manually.
        if (!('window' in this.$domNodes))
            return this
        const $scrollTarget:$DomNode = $('body, html').add(
            this.$domNodes.window)
        $scrollTarget.on(this._options.knownScrollEventNames, (
            event:Object
        ):void => {
            if (this._options.switchToManualScrollingIndicator(event))
                $scrollTarget.stop(true)
        })
        this.on(this.$domNodes.window, 'scroll', ():void => {
            if (this.$domNodes.window.scrollTop()) {
                if (this.viewportIsOnTop) {
                    this.viewportIsOnTop = false
                    this.fireEvent.apply(this, [
                        'viewportMovesAwayFromTop', false, this
                    ].concat(this.constructor.argumentsObjectToArray(
                        arguments)))
                }
            } else if (!this.viewportIsOnTop) {
                this.viewportIsOnTop = true
                this.fireEvent.apply(this, [
                    'viewportMovesToTop', false, this
                ].concat(this.constructor.argumentsObjectToArray(arguments)))
            }
        })
        if (this.$domNodes.window.scrollTop()) {
            this.viewportIsOnTop = false
            this.fireEvent.apply(this, [
                'viewportMovesAwayFromTop', false, this
            ].concat(this.constructor.argumentsObjectToArray(arguments)))
        } else {
            this.viewportIsOnTop = true
            this.fireEvent.apply(this, [
                'viewportMovesToTop', false, this
            ].concat(this.constructor.argumentsObjectToArray(arguments)))
        }
        return this
    }
    /**
     * This method triggers after window is loaded.
     * @returns Returns the current instance.
     */
    _removeLoadingCover():Website {
        setTimeout(():void => {
            // Hide startup animation dom nodes to show them step by step.
            $(this.constructor.stringFormat(
                '[class^="{1}"], [class*=" {1}"]',
                this.sliceDomNodeSelectorPrefix(
                    this._options.domNode.startUpAnimationClassPrefix
                ).substr(1)
            )).hide()
            if (this.$domNodes.windowLoadingCover.length) {
                this.enableScrolling().$domNodes.windowLoadingCover.fadeOut(
                    this._options.windowLoadingCoverFadeOut)
            } else
                this._options.windowLoadingCoverFadeOut.always()
        }, this._options.additionalPageLoadingTimeInMilliseconds)
        return this
    }
    /**
     * This method handles the given start up effect step.
     * @param elementNumber - The current start up step.
     * @returns Returns the current instance.
     */
    _handleStartUpEffects(elementNumber:number):Website {
        // Stop and delete spinner instance.
        this.$domNodes.windowLoadingSpinner.spin(false)
        if (!$.isNumeric(elementNumber))
            elementNumber = 1
        if ($(this.constructor.stringFormat(
            '[class^="{1}"], [class*=" {1}"]',
            this.sliceDomNodeSelectorPrefix(
                this._options.domNode.startUpAnimationClassPrefix
            ).substr(1)
        )).length)
            setTimeout(():void => {
                let lastElementTriggered:boolean = false
                this._options.startUpFadeIn.always = ():void => {
                    if (lastElementTriggered)
                        this.fireEvent('startUpAnimationComplete')
                }
                $(
                    this._options.domNode.startUpAnimationClassPrefix +
                    elementNumber
                ).fadeIn(this._options.startUpFadeIn)
                if ($(
                    this._options.domNode.startUpAnimationClassPrefix +
                    (elementNumber + 1)
                ).length)
                    this._handleStartUpEffects(elementNumber + 1)
                else
                    lastElementTriggered = true
            }, this._options.startUpAnimationElementDelayInMiliseconds)
        else
            this.fireEvent('startUpAnimationComplete')
        return this
    }
    /**
     * This method adds triggers to switch section.
     * @returns Returns the current instance.
     */
    _addNavigationEvents():Website {
        if ('addEventListener' in context)
            context.addEventListener('hashchange', ():void => {
                if (this.startUpAnimationIsComplete)
                    this.fireEvent(
                        'switchSection', false, this, location.hash.substring(
                            '#'.length))
            }, false)
        return this._handleScrollToTopButton()
    }
    /**
     * Adds trigger to scroll top buttons.
     * @returns Returns the current instance.
     */
    _handleScrollToTopButton():Website {
        this.on(this.$domNodes.scrollToTopButton, 'click', (
            event:Object
        ):void => {
            event.preventDefault()
            this._scrollToTop()
        })
        return this
    }
    /**
     * Scrolls to top of page. Runs the given function after viewport arrives.
     * @param onAfter - Callback to call after effect has finished.
     * @returns Returns the current instance.
     */
    _scrollToTop(onAfter:Function = $.noop()):Website {
        if (!('document' in context))
            return this
        this._options.scrollToTop.options.onAfter = onAfter
        /*
            NOTE: This is a workaround to avoid a bug in "jQuery.scrollTo()"
            expecting this property exists.
        */
        Object.defineProperty(context.document, 'body', {value: $('body')[0]})
        if (this._options.scrollToTop.inLinearTime) {
            const distanceToTopInPixel:number =
                this.$domNodes.window.scrollTop()
            // Scroll four times faster as we have distance to top.
            this._options.scrollToTop.options.duration =
                distanceToTopInPixel / 4
            this.$domNodes.window.scrollTo(
                {top: `-=${distanceToTopInPixel}`, left: '+=0'},
                this._options.scrollToTop.options)
        } else
            $(window).scrollTo(
                {top: 0, left: 0}, this._options.scrollToTop.options)
        return this
    }
    /**
     * Executes the page tracking code.
     * @returns Returns the current instance.
     */
    _handleAnalyticsInitialisation():Website {
        if (
            this._options.trackingCode &&
            this._options.trackingCode !== '__none__' &&
            'location' in context &&
            context.location.hostname !== 'localhost'
        ) {
            this.debug(
                `Run analytics code: "${this._analyticsCode.initial}"`,
                this._options.trackingCode, this._options.domain,
                this.currentSectionName)
            try {
                (new Function(this.constructor.stringFormat(
                    this._analyticsCode.initial, this._options.trackingCode,
                    this._options.domain, this.currentSectionName
                )))()
            } catch (exception) {
                this.warn(
                    'Problem in analytics initial code snippet: {1}',
                    exception)
            }
            this.on(this.$domNodes.parent.find('a, button'), 'click', (
                event:Object
            ):void => {
                const $domNode:$DomNode = $(event.target)
                this.triggerAnalyticsEvent(
                    this.currentSectionName, 'click', $domNode.text(),
                    event.data || {}, $domNode.attr(
                        'website-analytics-value'
                    ) || 1)
            })
        }
        return this
    }
    // / endregion
    // endregion
}
// endregion
$.Website = function():any {
    return $.Tools().controller(Website, arguments)
}
$.Website.class = Website
/** The jQuery-website plugin class. */
export default Website
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
