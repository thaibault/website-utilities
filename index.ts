// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module website-utilities */
'use strict'
/* !
    region header
    [Project page](https://torben.website/website-utilities)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {
    $,
    $DomNodes,
    $T,
    capitalize,
    debounce,
    extend,
    format,
    globalContext,
    Mapping,
    NOOP,
    PlainObject,
    RecursivePartial,
    represent,
    timeout,
    Tools
} from 'clientnode'
import Internationalisation from 'internationalisation'
import {Spinner} from 'spin.js'

import {
    DefaultOptions, DomNodes, Options, TrackingItem, WebsiteUtilitiesFunction
} from './type'
// endregion
// region plugins/classes
/**
 * This plugin holds all needed methods to extend a whole website.
 * @property _defaultOptions - Options extended by the options given to the
 * initializer method.
 * @property _defaultOptions.activateLanguageSupport - Indicates whether
 * language support should be used or not.
 * @property _defaultOptions.additionalPageLoadingTimeInMilliseconds -
 * Additional time to wait until page will be indicated as loaded.
 * @property _defaultOptions.domNodes - Mapping of dom node descriptions to
 * their corresponding selectors.
 * @property _defaultOptions.domNodes.mediaQueryIndicator - Selector for
 * indicator dom node to use to trigger current media query mode.
 * @property _defaultOptions.domNodes.top - Selector to indicate that viewport
 * is currently on top.
 * @property _defaultOptions.domNodes.scrollToTopButton - Selector for
 * starting an animated scroll to top.
 * @property _defaultOptions.domNodes.startUpAnimationClassPrefix - Class name
 * selector prefix for all dom nodes to appear during start up animations.
 * @property _defaultOptions.domNodes.windowLoadingCover - Selector to the full
 * window loading cover dom node.
 * @property _defaultOptions.domNodes.windowLoadingSpinner - Selector to the
 * window loading spinner (on top of the window loading cover).
 * @property _defaultOptions.domNodeSelectorInfix - Selector infix for all
 * nodes to take into account.
 * @property _defaultOptions.domNodeSelectorPrefix - Selector prefix for all
 * nodes to take into account.
 * @property _defaultOptions.initialSectionName - Pre-selected section name.
 * @property _defaultOptions.knownScrollEventNames - Saves all known scroll
 * events in a space separated string.
 * @property _defaultOptions.language - Options for client side
 * internationalisation handler.
 * @property _defaultOptions.mediaQueryClassNameIndicator - Mapping of media
 * query class indicator names to internal event names.
 * @property _defaultOptions.onChangeMediaQueryMode - Callback to trigger if
 * media query mode changes.
 * @property _defaultOptions.onChangeToExtraSmallMode - Callback to trigger if
 * media query mode changes to extra small mode.
 * @property _defaultOptions.onChangeToLargeMode - Callback to trigger if media
 * query mode changes to large mode.
 * @property _defaultOptions.onChangeToMediumMode - Callback to trigger if
 * media query mode changes to medium mode.
 * @property _defaultOptions.onChangeToSmallMode - Callback to trigger if media
 * query mode changes to small mode.
 * @property _defaultOptions.onStartUpAnimationComplete - Callback to trigger
 * if all start up animations has finished.
 * @property _defaultOptions.onSwitchSection - Callback to trigger if current
 * section switches.
 * @property _defaultOptions.onViewportMovesAwayFromTop - Callback to trigger
 * when viewport moves away from top.
 * @property _defaultOptions.onViewportMovesToTop - Callback to trigger when
 * viewport arrives at top.
 * @property _defaultOptions.scrollToTop - Options for automated scroll top
 * animation.
 * @property _defaultOptions.scrollToTop.button - To top scroll button behavior
 * configuration.
 * @property _defaultOptions.scrollToTop.button.hideAnimationOptions -
 * Configures hide animation.
 * @property _defaultOptions.scrollToTop.button.showAnimationOptions -
 * Configures show animation.
 * @property _defaultOptions.scrollToTop.options - Scrolling animation options.
 * @property _defaultOptions.startUpAnimationElementDelayInMiliseconds - Delay
 * between two startup animated dom nodes in order.
 * @property _defaultOptions.startUpHide - Options for initially hiding dom
 * nodes showing on startup later.
 * @property _defaultOptions.startUpShowAnimation - Options for startup show in
 * animation.
 * @property _defaultOptions.switchToManualScrollingIndicator - Indicator
 * function to stop currently running scroll animations to let the user get
 * control of current scrolling behavior. Given callback gets an event object.
 * If the function returns "true" current animated scrolls will be stopped.
 * @property _defaultOptions.tracking - Tracking configuration to collect
 * user's behavior data.
 * @property _defaultOptions.tracking.buttonClick - Function to call on button
 * click events.
 * @property _defaultOptions.tracking.linkClick - Function to call on link
 * click events.
 * @property _defaultOptions.tracking.sectionSwitch - Function to call on
 * section switches.
 * @property _defaultOptions.tracking.track - Tracker call itself.
 * @property _defaultOptions.windowLoadingCoverHideAnimation - Options for
 * startup loading cover hide animation.
 * @property _defaultOptions.windowLoadingSpinner - Options for the window
 * loading cover spinner.
 * @property _defaultOptions.windowLoadedTimeoutAfterDocLoadedInMSec - Duration
 * after loading cover should be removed.
 * @property options - Finally configured given options.
 * @property $domNodes - Saves a set of references to all needed dom nodes.
 * @property currentMediaQueryMode - Saves current media query status depending
 * on available space in current browser window.
 * @property currentSectionName - Saves current section hash name.
 * @property languageHandler - Reference to the language switcher instance.
 * @property startUpAnimationIsComplete - Indicates whether start up animations
 * has finished.
 * @property viewportIsOnTop - Indicates whether current viewport is on top.
 * @property windowLoaded - Indicates whether window is already loaded.
 * @property windowLoadingSpinner - The window loading spinner instance.
 */
export class WebsiteUtilities extends Tools {
    static _defaultOptions:DefaultOptions = {
        activateLanguageSupport: true,
        additionalPageLoadingTimeInMilliseconds: 0,
        domain: 'auto',
        domNodes: {
            mediaQueryIndicator: '<div class="wu-media-query-indicator">',
            scrollToTopButton: 'a[href="#top"]',
            startUpAnimationClassPrefix: '.wu-start-up-animation-number-',
            top: 'header',
            windowLoadingCover:
                '.window-loading-cover, .wu-window-loading-cover',
            windowLoadingSpinner:
                '.window-loading-cover > div, .wu-window-loading-cover > div'
        } as unknown as DomNodes,
        domNodeSelectorInfix: 'wu',
        domNodeSelectorPrefix: 'body.{1}',
        initialSectionName: 'home',
        knownScrollEventNames: [
            'DOMMouseScroll',
            'keyup',
            'mousedown',
            'mousewheel',
            'scroll',
            'touchmove',
            'wheel'
        ],
        language: {},
        mediaQueryClassNameIndicator: [
            ['extraSmall', 'xs'],
            ['small', 'sm'],
            ['medium', 'md'],
            ['large', 'lg']
        ],
        name: 'WebsiteUtilities',
        onChangeMediaQueryMode: NOOP,
        onChangeToExtraSmallMode: NOOP,
        onChangeToLargeMode: NOOP,
        onChangeToMediumMode: NOOP,
        onChangeToSmallMode: NOOP,
        onViewportMovesAwayFromTop: NOOP,
        onViewportMovesToTop: NOOP,
        onSwitchSection: NOOP,
        onStartUpAnimationComplete: NOOP,
        scrollToTop: {
            button: {
                hideAnimationOptions: {},
                showAnimationOptions: {},
                slideDistanceInPixel: 30
            },
            options: {duration: 'fast'}
        },
        startUpAnimationElementDelayInMiliseconds: 100,
        startUpHide: {opacity: 0},
        startUpShowAnimation: {opacity: 1},
        switchToManualScrollingIndicator: (event:JQuery.Event):boolean => (
            typeof event.which === 'number' && event.which > 0 ||
            event.type === 'mousedown' ||
            event.type === 'mousewheel' ||
            event.type === 'touchmove'
        ),
        tracking: {
            buttonClick: function(
                this:WebsiteUtilities, $button:$T<HTMLButtonElement>
            ) {
                this.track({
                    event: 'buttonClick',
                    eventType: 'click',
                    label: $button.text(),
                    reference:
                        $button.attr('action') ||
                        $button.attr('target') ||
                        $button.attr('type') ||
                        $button.text(),
                    subject: 'button',
                    value: parseInt(
                        $button.attr('website-analytics-value') as string
                    ),
                    userInteraction: true
                })
            },
            linkClick: function(
                this:WebsiteUtilities, $link:$T<HTMLLinkElement>
            ):void {
                this.track({
                    event: 'linkClick',
                    eventType: 'click',
                    label: $link.text(),
                    reference:
                        $link.attr('href') ||
                        $link.attr('action') ||
                        $link.attr('target') ||
                        $link.attr('type') ||
                        $link.text(),
                    subject: 'link',
                    value: parseInt(
                        $link.attr('website-analytics-value') as string
                    ),
                    userInteraction: true
                })
            },
            sectionSwitch: function(
                this:WebsiteUtilities, sectionName:string
            ) {
                this.track({
                    event: 'sectionSwitch',
                    eventType: 'sectionSwitch',
                    label: sectionName,
                    reference:
                        `${globalContext.window.location.pathname}#` +
                        sectionName,
                    subject: 'url',
                    userInteraction: false
                })
            },
            track: (item:TrackingItem) => {
                globalContext.dataLayer?.push(item as unknown as PlainObject)
            }
        },
        windowLoadingCoverHideAnimation: {opacity: 0},
        windowLoadingSpinner: {
            animation: 'spinner-line-fade-quick',
            className: 'spinner',
            color: '#000',
            // Corner roundness (0..1)
            corners: 1,
            // 1: clockwise, -1: counterclockwise
            direction: 1,
            // CSS color or array of colors
            fadeColor: 'transparent',
            // Left position relative to parent in pixel
            left: 'auto',
            // The length of each line
            length: 23,
            // The number of lines to draw
            lines: 9,
            position: 'absolute',
            // The radius of the inner circle
            radius: 40,
            // The rotation offset
            rotate: 0,
            // Scales overall size of the spinner
            scale: 1,
            shadow: false,
            // Rounds per second
            speed: 1.1,
            // Top position relative to parent in pixel
            top: 'auto',
            // The line thickness
            width: 11,
            // The z-index (defaults to 2000000000)
            zIndex: 2e9
        },
        windowLoadedTimeoutAfterDocLoadedInMSec: 2000
    }

    options:Options = null as unknown as Options

    $domNodes:$DomNodes = null as unknown as $DomNodes

    currentMediaQueryMode = ''
    currentSectionName = 'home'

    languageHandler:Internationalisation|null = null

    startUpAnimationIsComplete = false

    viewportIsOnTop = false
    windowLoaded = false

    windowLoadingSpinner:null|Spinner = null
    // region public methods
    /// region special
    /**
     * Initializes the interactive web application.
     * @param options - An options object.
     * @returns Returns a promise containing the current instance.
     */
    initialize<R = Promise<WebsiteUtilities>>(
        options:RecursivePartial<Options> = {}
    ):R {
        super.initialize(extend(
            true, {} as Options, WebsiteUtilities._defaultOptions, options
        ))

        this.$domNodes = this.grabDomNodes(this.options.domNodes as Mapping)

        this.disableScrolling()

        return new Promise<WebsiteUtilities>((
            resolve:(value:WebsiteUtilities) => void
        ):void => {
            if (this.$domNodes.windowLoadingSpinner.length) {
                this.windowLoadingSpinner =
                    new Spinner(this.options.windowLoadingSpinner)
                this.windowLoadingSpinner.spin(
                    this.$domNodes.windowLoadingSpinner[0]
                )
            }

            this._bindScrollEvents()

            this.$domNodes.parent?.show()

            const onLoaded = ():void => {
                if (!this.windowLoaded) {
                    this.windowLoaded = true

                    void this._removeLoadingCover().then(():void => {
                        void this._performStartUpEffects()

                        resolve(this)
                    })
                }
            }
            $(():void => {
                void timeout(
                    onLoaded,
                    this.options.windowLoadedTimeoutAfterDocLoadedInMSec
                )
            })
            this.on(this.$domNodes.window, 'load', onLoaded)

            this._bindClickTracking()

            if (!this.options.language.logging)
                this.options.language.logging = this.options.logging
            if (this.options.activateLanguageSupport && !this.languageHandler)
                void $(this.$domNodes.parent as unknown as HTMLBodyElement)
                    .Internationalisation(this.options.language)
                    .then(($domNode:$T<HTMLBodyElement>):void => {
                        this.languageHandler =
                            $domNode.data('Internationalisation') as
                                Internationalisation<HTMLBodyElement>
                    })

            this._bindNavigationEvents()
            this._bindMediaQueryChangeEvents()
            this._triggerWindowResizeEvents()
        }) as unknown as R
    }
    // endregion
    /**
     * Scrolls to top of page. Runs the given function after viewport arrives.
     * @returns Returns the current instance.
     */
    scrollToTop():this {
        if (globalContext.document)
            $('html, body')
                .stop()
                .animate({scrollTop: 0}, this.options.scrollToTop.options)

        return this
    }
    /**
     * This method disables scrolling on the given web view.
     * @returns Returns the current instance.
     */
    disableScrolling():this {
        this.$domNodes.parent?.addClass('disable-scrolling')
            .on('touchmove', (event:Event) => {
                event.preventDefault()
            })

        return this
    }
    /**
     * This method disables scrolling on the given web view.
     * @returns Returns the current instance.
     */
    enableScrolling():this {
        if (this.$domNodes.parent) {
            this.$domNodes.parent.removeClass(
                ['disable-scrolling', 'touchmove']
            )
            this.off(this.$domNodes.parent)
        }

        return this
    }
    /**
     * Triggers an analytics event. All given arguments are forwarded to
     * configured analytics event code to defined their environment variables.
     * @param properties - Event tracking information.
     * @returns Returns the current instance.
     */
    track(
        properties:Omit<TrackingItem, 'context'|'value'> & {
            context?:string
            value?:number
        }
    ):this {
        if (
            Object.prototype.hasOwnProperty.call(
                globalContext.window, 'location'
            ) &&
            this.options.tracking
        ) {
            const trackingItem:TrackingItem = {
                context:
                    `${globalContext.window.location.pathname}#` +
                    this.currentSectionName,
                ...(properties as Omit<TrackingItem, 'context'>)
            }
            if (
                isNaN(trackingItem.value) ||
                typeof trackingItem.value !== 'number'
            )
                trackingItem.value = 1

            this.debug('Run tracking code: "event" with arguments:')
            this.debug(trackingItem)

            try {
                this.options.tracking.track(trackingItem)
            } catch (error) {
                this.warn(
                    `Problem in tracking "${represent(trackingItem)}": ` +
                    represent(error)
                )
            }
        }

        return this
    }
    // endregion
    // region protected methods
    /// region event
    /**
     * This method triggers if the viewport moves to top.
     * @returns Nothing.
     */
    _onViewportMovesToTop = debounce(():void => {
        if (this.$domNodes.scrollToTopButton.css('visibility') === 'hidden')
            this.$domNodes.scrollToTopButton.css('opacity', 0)
        else {
            this.options.scrollToTop.button.hideAnimationOptions.always = (
            ):$T => this.$domNodes.scrollToTopButton.css({
                bottom:
                    '-=' +
                    String(
                        this.options.scrollToTop.button.slideDistanceInPixel
                    ),
                display: 'none'
            })
            this.$domNodes.scrollToTopButton.finish().animate(
                {
                    bottom:
                        '+=' +
                        String(
                            this.options.scrollToTop.button
                                .slideDistanceInPixel
                        ),
                    opacity: 0
                },
                this.options.scrollToTop.button.hideAnimationOptions
            )
        }
    })
    /**
     * This method triggers if the viewport moves away from top.
     * @returns Nothing.
     */
    _onViewportMovesAwayFromTop = debounce(():void => {
        if (this.$domNodes.scrollToTopButton.css('visibility') === 'hidden')
            this.$domNodes.scrollToTopButton.css('opacity', 1)
        else
            this.$domNodes.scrollToTopButton
                .finish()
                .css({
                    bottom:
                        '+=' +
                        String(
                            this.options.scrollToTop.button
                                .slideDistanceInPixel
                        ),
                    display: 'block',
                    opacity: 0
                })
                .animate(
                    {
                        bottom:
                            '-=' +
                            String(
                                this.options.scrollToTop.button
                                    .slideDistanceInPixel
                            ),
                        queue: false,
                        opacity: 1
                    },
                    this.options.scrollToTop.button.showAnimationOptions
                )
    })
    /**
     * This method triggers if the responsive design switches to another mode.
     * @param _oldMode - Saves the previous mode.
     * @param _newMode - Saves the new mode.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onChangeMediaQueryMode(_oldMode:string, _newMode:string) {
        // Do nothing.
    }
    /**
     * This method triggers if the responsive design switches to large mode.
     * @param _oldMode - Saves the previous mode.
     * @param _newMode - Saves the new mode.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onChangeToLargeMode(_oldMode:string, _newMode:string) {
        // Do nothing.
    }
    /**
     * This method triggers if the responsive design switches to medium mode.
     * @param _oldMode - Saves the previous mode.
     * @param _newMode - Saves the new mode.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onChangeToMediumMode(_oldMode:string, _newMode:string) {
        // Do nothing.
    }
    /**
     * This method triggers if the responsive design switches to small mode.
     * @param _oldMode - Saves the previous mode.
     * @param _newMode - Saves the new mode.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onChangeToSmallMode(_oldMode:string, _newMode:string) {
        // Do nothing.
    }
    /**
     * This method triggers if the responsive design switches to extra small
     * mode.
     * @param _oldMode - Saves the previous mode.
     * @param _newMode - Saves the new mode.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onChangeToExtraSmallMode(_oldMode:string, _newMode:string) {
        // Do nothing.
    }
    /**
     * This method triggers if we change the current section.
     * @param sectionName - Contains the new section name.
     */
    _onSwitchSection(sectionName:string):void {
        if (
            Object.prototype.hasOwnProperty.call(
                globalContext.window, 'location'
            ) &&
            this.options.tracking?.sectionSwitch &&
            this.currentSectionName !== sectionName
        ) {
            this.currentSectionName = sectionName

            this.debug(
                'Run section switch tracking on section "' +
                `${this.currentSectionName}".`
            )

            try {
                this.options.tracking.sectionSwitch.call(
                    this, this.currentSectionName
                )
            } catch (error) {
                this.warn(
                    'Problem due to track section switch to "' +
                    `${this.currentSectionName}": ${represent(error)}`
                )
            }
        }
    }
    /**
     * This method is complete if last startup animation was initialized.
     */
    _onStartUpAnimationComplete() {
        this.startUpAnimationIsComplete = true
    }
    // endregion
    /// region helper
    /**
     * This method adds triggers for responsive design switches.
     */
    _bindMediaQueryChangeEvents() {
        this.on(
            this.$domNodes.window,
            'resize',
            this._triggerWindowResizeEvents.bind(this)
        )
    }
    /**
     * This method triggers if the responsive design switches its mode.
     * @param parameters - All arguments will be appended to the event handler
     * callbacks.
     */
    _triggerWindowResizeEvents(...parameters:Array<unknown>):void {
        for (
            const classNameMapping of
            this.options.mediaQueryClassNameIndicator
        ) {
            if (this.$domNodes.parent)
                this.$domNodes
                    .mediaQueryIndicator
                    .prependTo(this.$domNodes.parent)
                    .addClass(`hidden-${classNameMapping[1]}`)

            if (
                this.$domNodes.mediaQueryIndicator.is(':hidden') &&
                classNameMapping[0] !== this.currentMediaQueryMode
            ) {
                this.fireEvent(
                    'changeMediaQueryMode',
                    false,
                    this,
                    this.currentMediaQueryMode,
                    classNameMapping[0],
                    ...parameters
                )

                this.fireEvent(
                    `changeTo${capitalize(classNameMapping[0])}Mode`,
                    false,
                    this,
                    this.currentMediaQueryMode,
                    classNameMapping[0],
                    ...parameters
                )

                this.currentMediaQueryMode = classNameMapping[0]
            }

            this.$domNodes.mediaQueryIndicator.removeClass(
                `hidden-${classNameMapping[1]}`
            )
        }
    }
    /**
     * This method triggers if view port arrives at special areas.
     * @param parameters - All arguments will be appended to the event handler
     * callbacks.
     */
    _bindScrollEvents(...parameters:Array<unknown>):void {
        const $bodyHTML = $('body, html')
        const $scrollTarget:$T = this.$domNodes.window ?
            $bodyHTML.add(this.$domNodes.window) :
            $bodyHTML
        $scrollTarget.on(
            this.options.knownScrollEventNames.join(' '),
            (event:JQuery.Event):void => {
                /*
                    NOTE: Stop automatic scrolling if the user wants to scroll
                    manually.
                */
                if (this.options.switchToManualScrollingIndicator(event))
                    $scrollTarget.stop(true)
            }
        )

        this.on(
            this.$domNodes.window,
            'scroll',
            ():void => {
                if (this.$domNodes.window?.scrollTop()) {
                    if (this.viewportIsOnTop) {
                        this.viewportIsOnTop = false

                        this.fireEvent(
                            'viewportMovesAwayFromTop',
                            false,
                            this,
                            ...parameters
                        )
                    }
                } else if (!this.viewportIsOnTop) {
                    this.viewportIsOnTop = true

                    this.fireEvent(
                        'viewportMovesToTop', false, this, ...parameters
                    )
                }
            }
        )

        if (this.$domNodes.window?.scrollTop()) {
            this.viewportIsOnTop = false
            this.fireEvent(
                'viewportMovesAwayFromTop', false, this, ...parameters
            )
        } else {
            this.viewportIsOnTop = true
            this.fireEvent('viewportMovesToTop', false, this, ...parameters)
        }
    }
    /**
     * This method triggers after window is loaded.
     * @returns Promise resolving to nothing when loading cover has been
     * removed.
     */
    async _removeLoadingCover():Promise<void> {
        await timeout(this.options.additionalPageLoadingTimeInMilliseconds)

        // Hide startup animation dom nodes to show them step by step.
        $(format(
            '[class^="{1}"], [class*=" {1}"]',
            this.sliceDomNodeSelectorPrefix(
                this.options.domNodes.startUpAnimationClassPrefix
            ).substr(1)
        )).css(this.options.startUpHide)

        await new Promise<void>((resolve:() => void):void => {
            if (this.$domNodes.windowLoadingCover.length) {
                this.enableScrolling()

                this.$domNodes.windowLoadingCover.animate(
                    this.options.windowLoadingCoverHideAnimation,
                    {always: () => {
                        resolve()
                    }}
                )
            } else
                resolve()
        })
    }
    /**
     * This method handles the given start up effect step.
     * @param elementNumber - The current startup step.
     * @returns Promise resolving to nothing when start up effects have been
     * finished.
     */
    async _performStartUpEffects(elementNumber = 1):Promise<void> {
        // Stop and delete spinner instance.
        this.$domNodes.windowLoadingCover.hide()

        if (this.windowLoadingSpinner)
            this.windowLoadingSpinner.stop()

        if ($(format(
            '[class^="{1}"], [class*=" {1}"]',
            this.sliceDomNodeSelectorPrefix(
                this.options.domNodes.startUpAnimationClassPrefix
            ).substring(1)
        )).length) {
            await timeout(
                this.options.startUpAnimationElementDelayInMiliseconds
            )

            let lastElementTriggered = false

            const $domNode:$T = $(
                this.options.domNodes.startUpAnimationClassPrefix +
                String(elementNumber)
            )

            $domNode.animate(
                this.options.startUpShowAnimation,
                {
                    always: () => {
                        if (lastElementTriggered)
                            this.fireEvent('startUpAnimationComplete')
                    }
                }
            )

            if ($(
                this.options.domNodes.startUpAnimationClassPrefix +
                String(elementNumber + 1)
            ).length)
                await this._performStartUpEffects(elementNumber + 1)
            else
                lastElementTriggered = true
        } else
            this.fireEvent('startUpAnimationComplete')
    }
    /**
     * This method adds triggers to switch section.
     */
    _bindNavigationEvents() {
        globalContext.window.addEventListener(
            'hashchange',
            (event:Event):void => {
                if (this.startUpAnimationIsComplete)
                    this.fireEvent(
                        'switchSection',
                        false,
                        this,
                        location.hash.substring('#'.length),
                        event
                    )
            },
            false
        )

        this._bindScrollToTopButton()
    }
    /**
     * Adds trigger to scroll top buttons.
     */
    _bindScrollToTopButton() {
        this.on(
            this.$domNodes.scrollToTopButton,
            'click',
            (event:Event):void => {
                event.preventDefault()

                this.scrollToTop()
            }
        )
    }
    /**
     * Executes the page tracking code.
     */
    _bindClickTracking() {
        if (this.options.tracking) {
            if (this.options.tracking.linkClick)
                this.on(
                    this.$domNodes.parent?.find('a'),
                    'click',
                    (event:JQuery.Event & {target:HTMLLinkElement}) => {
                        this.options.tracking?.linkClick?.call(
                            this, $(event.target), event
                        )
                    }
                )

            if (this.options.tracking.buttonClick)
                this.on(
                    this.$domNodes.parent?.find('button'),
                    'click',
                    (event:JQuery.Event & {target:HTMLButtonElement}) => {
                        this.options.tracking?.buttonClick?.call(
                            this, $(event.target), event
                        )
                    }
                )
        }
    }
    /// endregion
    // endregion
}
export default WebsiteUtilities
// endregion
// region handle $ extending
$.WebsiteUtilities = ((...parameters:Array<unknown>):unknown =>
    Tools.controller(WebsiteUtilities, parameters)
) as WebsiteUtilitiesFunction
$.WebsiteUtilities.class = WebsiteUtilities
// endregion
