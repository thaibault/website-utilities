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
    extend,
    fadeIn,
    fadeOut,
    getText,
    globalContext,
    Logger,
    Mapping,
    NOOP,
    onDocumentReady,
    preventDefault,
    represent,
    timeout
} from 'clientnode'
import {func, object} from 'clientnode/property-types'
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
 * @property _defaultOptions.initialSectionName - Pre-selected section name.
 * @property _defaultOptions.knownScrollEventNames - Saves all known scroll
 * events in a space separated string.
 * @property _defaultOptions.language - Options for client side
 * internationalization handler.
 * @property _defaultOptions.mediaQueryClassNameIndicator - Mapping of media
 * query class indicator names to internal event names.
 * @property _defaultOptions.selectors - Mapping of dom node descriptions to
 * their corresponding selectors.
 * @property _defaultOptions.selectors.top - Selector to indicate that viewport
 * is currently on top.
 * @property _defaultOptions.selectors.scrollToTopButtons - Selectors for
 * starting an animated scroll to top.
 * @property _defaultOptions.selectors.startUpAnimationClassPrefix - Class name
 * selector prefix for all dom nodes to appear during start up animations.
 * @property _defaultOptions.selectors.windowLoadingCover - Selector to the full
 * window loading cover dom node.
 * @property _defaultOptions.startUpAnimationElementDelayInMilliseconds - Delay
 * between two startup animated dom nodes in order.
 * @property _defaultOptions.tracking - Indicates whether tracking should be
 * used or not.
 * @property _defaultOptions.windowLoadedTimeoutAfterDocLoadedInMSec - Duration
 * after loading cover should be removed.
 * @property options - Finally configured given options.
 * @property currentMediaQueryMode - Saves current media query status depending
 * on available space in current browser window.
 * @property currentSectionName - Saves current section hash name.
 * @property startUpAnimationIsComplete - Indicates whether start up animations
 * has finished.
 * @property continueAutoScrolling - Indicates whether auto scrolling should
 * continue or not. Gets set to "false" if user wants to scroll manually.
 * @property viewportIsOnTop - Indicates whether current viewport is on top.
 * @property windowLoaded - Indicates whether window is already loaded.
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
        startUpAnimationElementDelayInMilliseconds: 100,
        windowLoadedTimeoutAfterDocLoadedInMSec: 2000,

        domain: 'auto',
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
        mediaQueryClassNameIndicator: [
            ['extraSmall', 'xs'],
            ['small', 'sm'],
            ['medium', 'md'],
            ['large', 'lg']
        ],

        sectionNames: ['home'],

        selectors: {
            scrollToTopButtons: '.wu-scroll-to-top',
            section: '.wu-section',
            startUpAnimationClassPrefix: 'wu-start-up-animation-number-',
            top: '.wu-header',
            windowLoadingCover: '.wu-window-loading-cover'
        },

        tracking: false
    }

    readonly self = WebsiteUtilities

    currentMediaQueryMode = ''
    currentSectionName = 'home'

    startUpAnimationIsComplete = false
    continueAutoScrolling = false

    viewportIsOnTop: boolean | undefined
    windowLoaded = false
    /// region dom nodes
    scrollToTopButtonDomNodes: NodeListOf<HTMLElement> | null = null

    sectionDomNode: HTMLElement | null = null
    sectionDomNodes: Mapping<HTMLElement> = {}

    topDomNode: HTMLElement | null = null

    windowLoadingCoverDomNode: HTMLElement | null = null
    /// endregion
    // region api properties
    @property({type: object})
        options = {} as Options

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
        onSwitchSection: (this: WebsiteUtilities, event?: Event) => void = NOOP

    @property({type: func})
        onViewportMovesAwayFromTop: (
            this: WebsiteUtilities, event?: Event
        ) => void = NOOP
    @property({type: func})
        onViewportMovesToTop: (this: WebsiteUtilities, event?: Event) => void =
            NOOP

    @property({type: func})
        onSwitchToManualScrollingIndicator: (event: Event) => boolean =
            () => true

    @property({type: func})
        onLoaded: () => void = NOOP

    @property({type: func})
        onButtonClick = function(this: WebsiteUtilities, event: Event) {
            const button = event.target as HTMLElement
            const content = getText(button).join(' ')

            void this.onTrack({
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
        onSectionSwitch = async function(
            this: WebsiteUtilities,
            sectionName: string,
            _oldSectionName: string,
            _event?: Event
        ): Promise<void> {
            if (!globalContext.window?.location)
                return

            await this.onTrack({
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

            void this.onTrack({
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
        onTrack = function(
            this: WebsiteUtilities, item: TrackingItem
        ): Promise<void> {
            if (this.options.tracking)
                (globalContext as {dataLayer?: Array<TrackingItem>})
                    .dataLayer?.push(item)

            return Promise.resolve()
        }
    // endregion
    // region public
    /// region live-cycle
    /**
     * Defines dynamic getter and setter interface and resolves configuration
     * object. Initializes the map implementation.
     */
    constructor() {
        super()
        /*
            Babels property declaration transformation overwrites defined
            properties at the end of an implicit constructor. So we have to
            redefined them as long as we want to declare expected component
            interface properties to enable static type checks.
        */
        this.defineGetterAndSetterInterface()
    }
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
     * Updates controlled dom elements.
     * @param reason - Why an update has been triggered.
     */
    async render(reason?: string): Promise<void> {
        console.log('A')
        await super.render(reason)

        if (Object.keys(this.options).length === 0)
            this.onUpdateAttribute('options', '{}')

        this.grabDomNodes()

        this.disableScrolling()
        this._bindScrollEvents()
        this._bindClickTracking()
        this._bindNavigationEvents()

        const onLoaded = () => {
            if (!this.windowLoaded) {
                this.windowLoaded = true

                void this._removeLoadingCover().then(() => {
                    void this._performStartUpEffects()

                    this.onLoaded()
                })
            }
        }
        void onDocumentReady(() => {
            void timeout(
                onLoaded,
                this.options.windowLoadedTimeoutAfterDocLoadedInMSec
            )
        })
        if (globalContext.window)
            this.addSecureEventListener(
                globalContext.window, 'load', onLoaded
            )

        await this._initializeRouting()
    }
    // endregion
    grabDomNodes(): void {
        this.topDomNode = this.root.querySelector(this.options.selectors.top)
        this.scrollToTopButtonDomNodes = this.root.querySelectorAll(
            this.options.selectors.scrollToTopButtons
        )

        this.sectionDomNode =
            this.root.querySelector(this.options.selectors.section)
        for (const domNode of this.sectionDomNode?.children ?? []) {
            const name = domNode.getAttribute('data-website-utilities-section')
            if (name && this.options.sectionNames.includes(name))
                this.sectionDomNodes[name] = domNode as HTMLElement
        }

        this.windowLoadingCoverDomNode =
            this.root.parentElement?.querySelector(
                this.options.selectors.windowLoadingCover
            ) ?? null
    }
    /**
     * Scrolls to top of page smoothly via being interruptible.
     */
    interruptableScrollToTop() {
        const durationInMilliseconds = 500 // Dauer in ms
        const start = window.pageYOffset
        const startTime = performance.now()

        this.continueAutoScrolling = true

        // Animation-Funktion
        const step = (currentTime: DOMHighResTimeStamp) => {
            if (!this.continueAutoScrolling)
                return

            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / durationInMilliseconds, 1)

            // Easing (optional for soft start / stopp animation)
            const ease = progress * (2 - progress)

            window.scrollTo(0, start * (1 - ease))

            if (progress < 1)
                requestAnimationFrame(step)
            else
                this.continueAutoScrolling = false
        }

        requestAnimationFrame(step)
    }
    /**
     * Scrolls to top of page smoothly.
     */
    scrollToTop() {
        if (globalContext.document)
            window.scrollTo({top: 0, behavior: 'smooth'})
    }
    /**
     * This method disables scrolling on the given web view.
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
     */
    async track(
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
                await this.onTrack(trackingItem)
            } catch (error) {
                log.warn(
                    `Problem in tracking "${represent(trackingItem)}":`,
                    represent(error)
                )
            }
        }
    }
    // endregion
    // region protected methods
    /// region event
    /**
     * This method triggers if the viewport moves to top.
     */
    _onViewportMovesToTop() {
        this._finishScrollToTopButtonTransition()

        for (const domNode of this.scrollToTopButtonDomNodes ?? []) {
            const cancel = () => {
                domNode.removeEventListener('transitionend', setSettledClass)
                domNode.removeEventListener('transitioncancel', cancel)
            }
            const setSettledClass = () => {
                if (this.viewportIsOnTop)
                    domNode.classList.add('wu-top-settled')

                cancel()
            }

            domNode.addEventListener(
                'transitionend', setSettledClass, {once: true}
            )
            domNode.addEventListener('transitioncancel', cancel, {once: true})

            domNode.classList.add('wu-scroll-up')
        }
    }
    /**
     * This method triggers if the viewport moves away from top.
     */
    async _onViewportMovesAwayFromTop() {
        this._finishScrollToTopButtonTransition('wu-top-settled')

        /*
            NOTE: We need to render the none setteled state beforehand to make
            sure the transition will be performed by browser.
        */
        await timeout()

        this._finishScrollToTopButtonTransition()

        for (const domNode of this.scrollToTopButtonDomNodes ?? [])
            domNode.classList.add('wu-scroll-down')
    }
    /**
     * This method triggers if we change the current section.
     * @param sectionName - Contains the new section name.
     * @param event - Optional event which triggered the switch.
     */
    async switchSection(sectionName: string, event?: Event): Promise<void> {
        if (
            globalContext.window &&
            'location' in globalContext.window &&
            Object.prototype.hasOwnProperty.call(
                this.sectionDomNodes, sectionName
            )
        ) {
            if (this.currentSectionName === sectionName) {
                this.sectionDomNodes[this.currentSectionName].style.display =
                    'none'
                this.sectionDomNodes[sectionName].style.display = 'initial'
            } else {
                this.interruptableScrollToTop()

                await fadeOut(this.sectionDomNodes[this.currentSectionName])
                this.sectionDomNodes[this.currentSectionName].style.display =
                    'none'
                this.sectionDomNodes[sectionName].style.display = 'initial'
                await fadeIn(this.sectionDomNodes[sectionName])
            }

            const oldSectionName = this.currentSectionName
            this.currentSectionName = sectionName

            log.debug(
                `Run section switch from "${oldSectionName}" to`,
                `"${this.currentSectionName}".`
            )

            try {
                await this.onSectionSwitch.call(
                    this, this.currentSectionName, oldSectionName, event
                )
            } catch (error) {
                log.warn(
                    'Problem due to call section switch callback on section',
                    `"${this.currentSectionName}": ${represent(error)}`
                )
            }
        }
    }
    // endregion
    /// region helper
    /**
     * Handle section switches.
     * @returns Promise resolving when routing initialization has been
     * finished.
     */
    _initializeRouting() {
        this.currentSectionName = this.options.initialSectionName

        const newSectionName = (
            globalContext.location?.hash &&
            this.options.initialSectionName !==
                globalContext.location.hash.substring('#'.length)
        ) ?
            globalContext.location.hash.substring('#'.length) :
            this.currentSectionName

        return this.switchSection(newSectionName)
    }

    /**
     * Removes class names from scroll to top buttons to stop running
     * transitions.
     * @param classNames - Optional class names to remove.
     */
    _finishScrollToTopButtonTransition(
        classNames: Array<string> | string = ['wu-scroll-down', 'wu-scroll-up']
    ) {
        for (const domNode of this.scrollToTopButtonDomNodes ?? [])
            domNode.classList.remove(
                ...([] as Array<string>).concat(classNames)
            )
    }
    /**
     * This method triggers if view port arrives at special areas.
     */
    _bindScrollEvents(): void {
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
                                NOTE: Stop automatic scrolling if the user
                                wants to scroll manually.
                            */
                            if (this.onSwitchToManualScrollingIndicator(event))
                                this.continueAutoScrolling = false
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

                            void this._onViewportMovesAwayFromTop().then(
                                this.onViewportMovesAwayFromTop.bind(
                                    this, event
                                )
                            )
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

            void this._onViewportMovesAwayFromTop().then(() => {
                this.onViewportMovesAwayFromTop.call(this)
            })
        } else {
            this.viewportIsOnTop = true

            for (const domNode of this.scrollToTopButtonDomNodes ?? [])
                domNode.classList.add('wu-top-settled')
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
        for (const domNode of this.root.querySelectorAll(
            '[class^="' +
            `${this.options.selectors.startUpAnimationClassPrefix}"], ` +
            '[class*=" ' +
            `${this.options.selectors.startUpAnimationClassPrefix}"]`
        ))
            (domNode as HTMLElement).style.opacity = '0'

        if (this.windowLoadingCoverDomNode) {
            this.enableScrolling()

            await fadeOut(this.windowLoadingCoverDomNode)
        }
    }
    /**
     * This method handles the given start up effect step.
     * @returns Promise resolving to nothing when start up effects have been
     * finished.
     */
    async _performStartUpEffects(): Promise<void> {
        const animationPromises: Array<Promise<void>> = []
        let elementNumber = 1
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            const domNodesToAnimate = this.root.querySelectorAll(
                '.' +
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

            for (const domNode of domNodesToAnimate)
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
                        void this.switchSection(
                            location.hash.substring('#'.length), event
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

                    this.interruptableScrollToTop()
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

if ((globalContext as Mapping<boolean>).AUTO_DEFINE_WEBSITE_UTILITIES)
    api.register()
// endregion
