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
    camelCaseToDelimited,
    capitalize, createDomNodes,
    debounce,
    extend,
    fadeIn,
    fadeOut,
    format,
    getText,
    globalContext,
    isHidden,
    Logger,
    Mapping,
    NOOP,
    onDocumentReady,
    preventDefault,
    represent,
    timeout
} from 'clientnode'
import {func, object} from 'clientnode/property-types'
import {Spinner} from 'spin.js'
import {property} from 'web-component-wrapper/decorator'
import {WebComponentAPI} from 'web-component-wrapper/type'
import {Web} from 'web-component-wrapper/Web'

import {DefaultOptions, Options, TrackingItem} from './type'
// endregion
export const log = new Logger({name: 'website-utilities'})
// region plugins/classes
/**
 * This plugin holds all needed methods to extend a whole website.
 * @property _defaultOptions - Options extended by the options given to the
 * initializer method.
 * @property _defaultOptions.additionalPageLoadingTimeInMilliseconds -
 * Additional time to wait until page will be indicated as loaded.
 * @property _defaultOptions.domNodeSelectorInfix - Selector infix for all
 * nodes to take into account.
 * @property _defaultOptions.domNodeSelectorPrefix - Selector prefix for all
 * nodes to take into account.
 * @property _defaultOptions.initialSectionName - Pre-selected section name.
 * @property _defaultOptions.knownScrollEventNames - Saves all known scroll
 * events in a space separated string.
 * @property _defaultOptions.language - Options for client side
 * internationalization handler.
 * @property _defaultOptions.mediaQueryClassNameIndicator - Mapping of media
 * query class indicator names to internal event names.
 * @property _defaultOptions.scrollToTopButtonSlideDistanceInPixel - Distance
 * to slide up until fading out.
 * @property _defaultOptions.selectors - Mapping of dom node descriptions to
 * their corresponding selectors.
 * @property _defaultOptions.selectors.mediaQueryIndicator - Selector for
 * indicator dom node to use to trigger current media query mode.
 * @property _defaultOptions.selectors.top - Selector to indicate that viewport
 * is currently on top.
 * @property _defaultOptions.selectors.scrollToTopButton - Selector for
 * starting an animated scroll to top.
 * @property _defaultOptions.selectors.startUpAnimationClassPrefix - Class name
 * selector prefix for all dom nodes to appear during start up animations.
 * @property _defaultOptions.selectors.windowLoadingCover - Selector to the full
 * window loading cover dom node.
 * @property _defaultOptions.selectors.windowLoadingSpinner - Selector to the
 * window loading spinner (on top of the window loading cover).
 * @property _defaultOptions.startUpAnimationElementDelayInMilliseconds - Delay
 * between two startup animated dom nodes in order.
 * @property _defaultOptions.tracking - Indicates whether tracking should be
 * used or not.
 * @property _defaultOptions.windowLoadingSpinner - Options for the window
 * loading cover spinner.
 * @property _defaultOptions.windowLoadedTimeoutAfterDocLoadedInMSec - Duration
 * after loading cover should be removed.
 * @property options - Finally configured given options.
 * @property currentMediaQueryMode - Saves current media query status depending
 * on available space in current browser window.
 * @property currentSectionName - Saves current section hash name.
 * @property startUpAnimationIsComplete - Indicates whether start up animations
 * has finished.
 * @property viewportIsOnTop - Indicates whether current viewport is on top.
 * @property windowLoaded - Indicates whether window is already loaded.
 * @property windowLoadingSpinner - The window loading spinner instance.
 * @property mediaQueryIndicatorDomNodes - Dom nodes to indicate current media
 * query mode.
 * @property onChangeMediaQueryMode - Callback to trigger if media query mode
 * changes.
 * @property onChangeToExtraSmallMode - Callback to trigger if media query mode
 * changes to extra small mode.
 * @property onChangeToLargeMode - Callback to trigger if media query mode
 * changes to large mode.
 * @property onChangeToMediumMode - Callback to trigger if media query mode
 * changes to medium mode.
 * @property onChangeToSmallMode - Callback to trigger if media query mode
 * changes to small mode.
 * @property onStartUpAnimationComplete - Callback to trigger if all start up
 * animations has finished.
 * @property onSwitchSection - Callback to trigger if current section switches.
 * @property onViewportMovesAwayFromTop - Callback to trigger when viewport
 * moves away from top.
 * @property onViewportMovesToTop - Callback to trigger when viewport arrives
 * at top.
 * @property onSwitchToManualScrollingIndicator - Indicator
 * function to stop currently running scroll animations to let the user get
 * control of current scrolling behavior. Given callback gets an event object.
 * If the function returns "true" current animated scrolls will be stopped.
 * @property onButtonClick - Function to call on button click events.
 * @property onLinkClick - Function to call on link click events.
 * @property onSectionSwitch - Function to call on section switches.
 * @property onTrack - Tracker call itself.
 */
export class WebsiteUtilities<
    TElement = HTMLElement,
    ExternalProperties extends Mapping<unknown> = Mapping<unknown>,
    InternalProperties extends Mapping<unknown> = Mapping<unknown>
> extends Web<TElement, ExternalProperties, InternalProperties> {
    static _name = 'WebsiteUtilities'

    static _defaultOptions: DefaultOptions = {
        additionalPageLoadingTimeInMilliseconds: 0,
        domain: 'auto',
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
        scrollToTopButtonSlideDistanceInPixel: 30,
        selectors: {
            mediaQueryIndicator:
                '<div class="wu-media-query-indicator"></div>',
            scrollToTopButtons: 'a[href="#top"]',
            startUpAnimationClassPrefix: '.wu-start-up-animation-number-',
            top: 'header',
            windowLoadingCover: '.wu-window-loading-cover',
            windowLoadingSpinner: '.wu-window-loading-cover > div'
        },

        startUpAnimationElementDelayInMilliseconds: 100,

        tracking: false,

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

    readonly self = WebsiteUtilities

    @property({type: object})
        options = {} as Options

    currentMediaQueryMode = ''
    currentSectionName = 'home'

    startUpAnimationIsComplete = false

    viewportIsOnTop = false
    windowLoaded = false

    windowLoadingSpinner: null | Spinner = null
    /// region dom nodes
    mediaQueryIndicatorDomNode: HTMLElement | null = null

    scrollToTopButtonDomNodes: NodeListOf<HTMLElement> | null = null

    topDomNode: HTMLElement | null = null

    windowLoadingCoverDomNode: HTMLElement | null = null
    windowLoadingSpinnerDomNode: HTMLElement | null = null
    /// endregion
    @property({type: func})
        onChangeMediaQueryMode: (
            this: WebsiteUtilities,
            oldMediaQueryMode: string,
            newMediaQueryMode: string,
            event?: Event
        ) => void = NOOP
    @property({type: func})
        onChangeToExtraSmallMode: (
            this: WebsiteUtilities, oldMediaQueryMode: string, event?: Event
        ) => void = NOOP
    @property({type: func})
        onChangeToLargeMode: (
            this: WebsiteUtilities, oldMediaQueryMode: string, event?: Event
        ) => void = NOOP
    @property({type: func})
        onChangeToMediumMode: (
            this: WebsiteUtilities, oldMediaQueryMode: string, event?: Event
        ) => void = NOOP
    @property({type: func})
        onChangeToSmallMode: (
            this: WebsiteUtilities, oldMediaQueryMode: string, event?: Event
        ) => void = NOOP

    @property({type: func})
        onStartUpAnimationComplete: (this: WebsiteUtilities) => void = NOOP

    @property({type: func})
        onSwitchSection: (this: WebsiteUtilities) => void = NOOP

    @property({type: func})
        onViewportMovesAwayFromTop: (
            this: WebsiteUtilities, event?: Event
        ) => void = NOOP
    @property({type: func})
        onViewportMovesToTop: (this: WebsiteUtilities, event?: Event) => void =
            NOOP

    @property({type: func})
        onSwitchToManualScrollingIndicator: (event: Event) => boolean = (
            event: Event & {which?: number}
        ): boolean => (
            typeof event.which === 'number' && event.which > 0 ||
            event.type === 'mousedown' ||
            event.type === 'mousewheel' ||
            event.type === 'touchmove'
        )

    @property({type: func})
        onLoaded: () => void = NOOP

    @property({type: func})
        onButtonClick = function(this: WebsiteUtilities, event: Event) {
            const button = event.target as HTMLElement
            const content = getText(button).join(' ')

            this.onTrack({
                event: 'buttonClick',
                eventType: 'click',
                label: content,
                reference:
                    button.getAttribute('action') ||
                    button.getAttribute('target') ||
                    button.getAttribute('type') ||
                    content,
                subject: 'button',
                value: parseInt(
                    button.getAttribute(
                        'website-analytics-value'
                    ) ||
                    '1'
                ),
                userInteraction: true
            })
        }
    @property({type: func})
        onSectionSwitch = function(
            this: WebsiteUtilities, sectionName: string, _event?: Event
        ) {
            if (!globalContext.window?.location)
                return

            this.onTrack({
                event: 'sectionSwitch',
                eventType: 'sectionSwitch',
                label: sectionName,
                reference:
                    `${globalContext.window.location.pathname}#${sectionName}`,
                subject: 'url',
                userInteraction: false
            })
        }
    @property({type: func})
        onLinkClick = function(
            this: WebsiteUtilities, event: Event
        ) {
            const link = event.target as HTMLElement
            const content = getText(link).join(' ')

            this.onTrack({
                event: 'linkClick',
                eventType: 'click',
                label: content,
                reference:
                    link.getAttribute('href') ||
                    link.getAttribute('action') ||
                    link.getAttribute('target') ||
                    link.getAttribute('type') ||
                    content,
                subject: 'link',
                value: parseInt(
                    link.getAttribute(
                        'website-analytics-value'
                    ) ||
                    '1'
                ),
                userInteraction: true
            })
        }
    @property({type: func})
        onTrack = function(item: TrackingItem) {
            (globalContext as {dataLayer: Array<TrackingItem>})
                .dataLayer?.push(item)
        }
    // region public
    /// region live-cycle
    /**
     * Triggered when ever a given attribute has changed and triggers to update
     * configured dom content.
     * @param name - Attribute name which was updates.
     * @param newValue - New updated value.
     */
    onUpdateAttribute(name: string, newValue: string) {
        super.onUpdateAttribute(name, newValue)

        if (name === 'options')
            this.options = extend<Options>(
                true,
                {} as Options,
                this.self._defaultOptions,
                this.options
            )
    }
    /**
     * Initializes the interactive web application.
     */
    connectedCallback(): void {
        if (Object.keys(this.options).length === 0)
            this.onUpdateAttribute('options', '{}')

        this.disableScrolling()

        this.grabDomNodes()

        if (this.windowLoadingSpinnerDomNode) {
            this.windowLoadingSpinner =
                new Spinner(this.options.windowLoadingSpinner)
            this.windowLoadingSpinner.spin(
                this.windowLoadingSpinnerDomNode
            )
        }

        this._bindScrollEvents()

        if (this.root.parentElement)
            this.root.parentElement.style.visibility = 'visible'

        const onLoaded = () => {
            if (!this.windowLoaded) {
                this.windowLoaded = true

                void this._removeLoadingCover().then(() => {
                    void this._performStartUpEffects()

                    this.onLoaded()
                })
            }
        }
        onDocumentReady(() => {
            void timeout(
                onLoaded,
                this.options.windowLoadedTimeoutAfterDocLoadedInMSec
            )
        })
        if (globalContext.window)
            this.addSecureEventListener(
                globalContext.window, 'load', onLoaded
            )

        this._bindClickTracking()

        this._bindNavigationEvents()
        if (globalContext.window)
            this.addSecureEventListener(
                globalContext.window,
                'resize',
                this._triggerWindowResizeEvents.bind(this)
            )
        this._triggerWindowResizeEvents()
    }
    // endregion
    grabDomNodes(): void {
        this.scrollToTopButtonDomNodes = this.root.querySelectorAll(
            this.options.selectors.scrollToTopButtons
        )

        this.topDomNode = this.root.querySelector(this.options.selectors.top)

        this.windowLoadingCoverDomNode =
            this.root.querySelector(this.options.selectors.windowLoadingCover)
        this.windowLoadingSpinnerDomNode = this.root.querySelector(
            this.options.selectors.windowLoadingSpinner
        )
    }
    /**
     * Scrolls to top of page. Runs the given function after viewport arrives.
     * @returns Returns the current instance.
     */
    scrollToTop() {
        if (globalContext.document)
            window.scrollTo({top: 0, behavior: 'smooth'})
    }
    /**
     * This method disables scrolling on the given web view.
     * @returns Returns the current instance.
     */
    disableScrolling() {
        if (!this.root.parentElement)
            return

        this.root.parentElement.classList.add('disable-scrolling')
        this.addSecureEventListener(
            this.root.parentElement, 'touchmove', preventDefault
        )
    }
    /**
     * This method disables scrolling on the given web view.
     * @returns Returns the current instance.
     */
    enableScrolling() {
        if (!this.root.parentElement)
            return

        this.root.parentElement.classList.remove('disable-scrolling')
        this.root.parentElement.classList.remove('touchmove')
        this.root.parentElement.removeEventListener(
            'touchmove', preventDefault
        )
    }
    /**
     * Triggers an analytics event. All given arguments are forwarded to
     * configured analytics event code to defined their environment variables.
     * @param properties - Event tracking information.
     * @returns Returns the current instance.
     */
    track(
        properties: Omit<TrackingItem, 'context' | 'value'> & {
            context?: string
            value?: number
        }
    ) {
        if (globalContext.window?.location && this.options.tracking) {
            const trackingItem: TrackingItem = {
                context:
                    `${globalContext.window.location.pathname}#` +
                    this.currentSectionName,
                ...(properties as Omit<TrackingItem, 'context'>)
            }
            if (
                typeof trackingItem.value !== 'number' ||
                isNaN(trackingItem.value)
            )
                trackingItem.value = 1

            log.debug('Run tracking code: "event" with arguments:')
            log.debug(trackingItem)

            try {
                this.onTrack(trackingItem)
            } catch (error) {
                log.warn(
                    `Problem in tracking "${represent(trackingItem)}":`,
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
    _onViewportMovesToTop = debounce((): void => {
        if (Array.from(this.scrollToTopButtonDomNodes ?? []).some((domNode) =>
            domNode.style.visibility === 'hidden'
        ))
            for (const domNode of this.scrollToTopButtonDomNodes ?? [])
                domNode.style.opacity = '0'
        else {
            this.options.scrollToTop.button.hideAnimationOptions.always = (
            ): $T => {
                for (const domNode of this.scrollToTopButtonDomNodes || []) {
                    domNode.style.bottom = String(
                        parseInt(domNode.style.bottom) -
                        this.options.scrollToTopButtonSlideDistanceInPixel
                    )
                    domNode.style.display = 'none'
                }
            }
            this.scrollToTopButtons.finish().animate(
                {
                    bottom:
                        '+=' +
                        String(
                            this.options.scrollToTopButtonSlideDistanceInPixel
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
    _onViewportMovesAwayFromTop = debounce((): void => {
        if (this.scrollToTopButtons.some((domNode) =>
            domNode.style.display === 'hidden'
        ))
            for (const domNode of this.scrollToTopButtons)
                domNode.style.opacity = '1'
        else
            for (const domNode of this.scrollToTopButtons)
                domNode
                    .finish()
                    .css({
                        bottom:
                            '+=' +
                            String(
                                this.options.scrollToTopButtonSlideDistanceInPixel
                            ),
                        display: 'block',
                        opacity: 0
                    })
                    .animate(
                        {
                            bottom:
                                '-=' +
                                String(
                                    this.options
                                        .scrollToTopButtonSlideDistanceInPixel
                                ),
                            queue: false,
                            opacity: 1
                        },
                        this.options.scrollToTop.button.showAnimationOptions
                    )
    })
    /**
     * This method triggers if we change the current section.
     * @param sectionName - Contains the new section name.
     */
    _onSwitchSection(sectionName: string): void {
        if (
            globalContext.window &&
            'location' in globalContext.window &&
            this.options.tracking &&
            this.currentSectionName !== sectionName
        ) {
            this.currentSectionName = sectionName

            log.debug(
                'Run section switch tracking on section',
                `"${this.currentSectionName}".`
            )

            try {
                this.onSectionSwitch.call(this, this.currentSectionName)
            } catch (error) {
                log.warn(
                    'Problem due to track section switch to',
                    `"${this.currentSectionName}": ${represent(error)}`
                )
            }
        }
    }
    // endregion
    /// region helper
    /**
     * This method triggers if the responsive design switches its mode.
     * @param event - Event object if existing.
     */
    _triggerWindowResizeEvents(event?: Event): void {
        for (
            const classNameMapping of this.options.mediaQueryClassNameIndicator
        ) {
            if (this.root.parentElement) {
                this.mediaQueryIndicatorDomNode =
                    createDomNodes(this.options.selectors.mediaQueryIndicator)
                this.root.parentElement.prepend(
                    this.mediaQueryIndicatorDomNode
                )
                this.mediaQueryIndicatorDomNode.classList.add(
                    `hidden-${classNameMapping[1]}`
                )
            }

            if (
                this.mediaQueryIndicatorDomNode &&
                isHidden(this.mediaQueryIndicatorDomNode) &&
                classNameMapping[0] !== this.currentMediaQueryMode
            ) {
                this.onChangeMediaQueryMode.call(
                    this,
                    this.currentMediaQueryMode,
                    classNameMapping[0],
                    event
                )

                this[
                    `changeTo${capitalize(classNameMapping[0])}Mode` as
                        'onChangeToExtraSmallMode'
                ].call(this, this.currentMediaQueryMode, event)

                this.currentMediaQueryMode = classNameMapping[0]
            }

            for (const domNode of this.mediaQueryIndicatorDomNodes)
                domNode.classList.remove(`hidden-${classNameMapping[1]}`)
        }
    }
    /**
     * This method triggers if view port arrives at special areas.
     * @param parameters - All arguments will be appended to the event handler
     * callbacks.
     */
    _bindScrollEvents(...parameters: Array<unknown>): void {
        if (!globalContext.document)
            return

        for (const node of [
            globalContext.document.body,
            globalContext.document.querySelector('html'),
            globalContext.window
        ])
            for (const eventName of this.options.knownScrollEventNames)
                if (node)
                    this.addSecureEventListener(
                        node,
                        eventName,
                        (event: Event) => {
                            /*
                                NOTE: Stop automatic scrolling if the user wants to
                                scroll manually.
                            */
                            if (this.onSwitchToManualScrollingIndicator(event))
                                node.stop(true)
                        }
                    )

        if (globalContext.window)
            this.addSecureEventListener(
                globalContext.window,
            'scroll',
                (event: Event): void => {
                    if (globalContext.window?.scrollY) {
                        if (this.viewportIsOnTop) {
                            this.viewportIsOnTop = false

                            this._onViewportMovesAwayFromTop()
                            this.onViewportMovesAwayFromTop.call(this, event)
                        }
                    } else if (!this.viewportIsOnTop) {
                        this.viewportIsOnTop = true

                        this._onViewportMovesToTop()
                        this.onViewportMovesToTop.call(this, event)
                    }
                }
            )

        if (globalContext.window?.scrollY) {
            this.viewportIsOnTop = false
            this._onViewportMovesAwayFromTop()
            this.onViewportMovesAwayFromTop.call(this)
        } else {
            this.viewportIsOnTop = true
            this._onViewportMovesToTop()
            this.onViewportMovesToTop.call(this)
        }
    }
    /**
     * This method triggers after window is loaded.
     * @returns Promise resolving to nothing when loading cover has been
     * removed.
     */
    async _removeLoadingCover(): Promise<void> {
        await timeout(this.options.additionalPageLoadingTimeInMilliseconds)

        // Hide startup animation dom nodes to show them step by step.
        for (const domNode of this.root.querySelectorAll(format(
            '[class^="{1}"], [class*=" {1}"]',
            this.options.selectors.startUpAnimationClassPrefix
        ).substring(1)))
            (domNode as HTMLElement).style.visibility = 'hidden'

        if (this.windowLoadingCoverDomNode) {
            this.enableScrolling()

            return fadeOut(this.windowLoadingCoverDomNode)
        }

        return Promise.resolve()
    }
    /**
     * This method handles the given start up effect step.
     * @returns Promise resolving to nothing when start up effects have been
     * finished.
     */
    async _performStartUpEffects(): Promise<void> {
        // Stop and delete spinner instance.
        if (this.windowLoadingCoverDomNode)
            this.windowLoadingCoverDomNode.style.display = 'none'

        if (this.windowLoadingSpinner)
            this.windowLoadingSpinner.stop()

        const animationPromises: Array<Promise<void>> = []
        let elementNumber = 1
        while (true) {
            const domNodesToAnimate = this.root.querySelectorAll(
                this.options.selectors.startUpAnimationClassPrefix +
                String(elementNumber)
            )

            if (domNodesToAnimate.length === 0) {
                await Promise.all(animationPromises)
                this.startUpAnimationIsComplete = true
                this.onStartUpAnimationComplete.call(this)
                break
            }

            await timeout(
                this.options.startUpAnimationElementDelayInMilliseconds
            )

            for (const domNode of this.root.querySelectorAll(
                this.options.selectors.startUpAnimationClassPrefix +
                String(elementNumber)
            ))
                animationPromises.push(fadeIn(domNode as HTMLElement))

            elementNumber += 1
        }
    }
    /**
     * This method adds triggers to switch section.
     */
    _bindNavigationEvents() {
        if (globalContext.window)
            this.addSecureEventListener(
                globalContext.window,
                'hashchange',
                (event: Event) => {
                    if (this.startUpAnimationIsComplete)
                        this.onSectionSwitch.call(
                            this, location.hash.substring('#'.length), event
                        )
                }
            )

        this._bindScrollToTopButton()
    }
    /**
     * Adds trigger to scroll top buttons.
     */
    _bindScrollToTopButton() {
        for (const domNode of this.scrollToTopButtonDomNodes || [])
            this.addSecureEventListener(
                domNode,
                'click',
                (event: Event) => {
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
            for (const domNode of this.root.querySelectorAll('a'))
                this.addSecureEventListener(
                    domNode, 'click', this.onButtonClick.bind(this)
                )

            for (const domNode of this.root.querySelectorAll('button'))
                this.addSecureEventListener(
                    domNode, 'click', this.onButtonClick.bind(this)
                )
        }
    }
    /// endregion
    // endregion
}

export const api: WebComponentAPI<
    HTMLElement, Mapping<unknown>, Mapping<unknown>, typeof Web
> = {
    component: WebsiteUtilities,
    register: (
        tagName: string = camelCaseToDelimited(WebsiteUtilities._name)
    ) => {
        customElements.define(tagName, WebsiteUtilities)
    }
}
export default WebsiteUtilities
// endregion
