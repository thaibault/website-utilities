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

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {
    camelCaseToDelimited,
    CONTINUE_AUTO_SCROLLING,
    extend,
    fadeIn,
    fadeOut,
    getText,
    getParents,
    globalContext,
    interruptableScrollTo,
    Lock,
    Logger,
    Mapping,
    NOOP,
    onDocumentReady,
    preventDefault,
    represent,
    timeout,
    trailingThrottle
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
 * This plugin holds common methods to extend a whole website.
 * @property _defaultOptions - Options extended by the options given to the
 * initializer method.
 * @property _defaultOptions.additionalPageLoadingTimeInMilliseconds -
 * Additional time to wait until page will be indicated as loaded.
 * @property _defaultOptions.selectors - Mapping of dom node descriptions to
 * their corresponding selectors.
 * @property _defaultOptions.selectors.top - Selector to indicate that viewport
 * is currently on top.
 * @property _defaultOptions.selectors.scrollToTopButtons - Selectors for
 * starting an animated scroll to top.
 * @property _defaultOptions.selectors.startUpAnimationClassPrefix - Class name
 * selector prefix for all dom nodes to appear during startup animations.
 * @property _defaultOptions.selectors.windowLoadingCover - Selector to the full
 * window loading cover dom node.
 * @property _defaultOptions.startUpAnimationElementDelayInMilliseconds - Delay
 * between two startup animated dom nodes in order.
 * @property _defaultOptions.tracking - Indicates whether tracking should be
 * used or not.
 * @property _defaultOptions.windowLoadedTimeoutAfterDocLoadedInMSec - Duration
 * after loading cover should be removed.
 * @property options - Finally configured given options.
 * @property currentSectionName - Saves current section hash name.
 * @property startUpAnimationIsComplete - Indicates whether startup animations
 * have finished.
 * @property viewportIsOnTop - Indicates whether current viewport is on top.
 * @property windowLoaded - Indicates whether the window is already loaded.
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
 * @property onStartUpAnimationComplete - Callback to trigger if all startup
 * animations have finished.
 * @property onSwitchSection - Callback to trigger if the current section
 * switches.
 * @property onViewportMovesAwayFromTop - Callback to trigger when viewport
 * moves away from top.
 * @property onViewportMovesToTop - Callback to trigger when viewport arrives
 * at top.
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

        sectionNames: {
            default: '',
            managed: ['home'],
            unmanaged: []
        },

        selectors: {
            windowLoadingCover: '.wu-window-loading-cover',

            startUpAnimationClassPrefix: 'wu-start-up-animation-number-',

            top: '.wu-header',

            routerOutlet: '.wu-router-outlet',

            scrollToTopButtons: '.wu-scroll-to-top',

            priorityNavigationClassName: 'wu-priority-navigation',
            priorityNavigationOverflowOpenClassName:
                'wu-priority-navigation--overflow-open',
            priorityNavigationOverflowResizingClassName:
                'wu-priority-navigation--resizing',

            activeNavigationItemClassName:
                'wu-priority-navigation__link--active',

            priorityNavigationListItemHideClassName:
                'wu-priority-navigation__list__item--hide',
            priorityNavigationOverflowIndicatorClassName:
                'wu-priority-navigation__list__overflow-indicator',
            priorityNavigationOverflowIndicatorShowClassName:
                'wu-priority-navigation__list__overflow-indicator--show',

            priorityNavigationOverflowList:
                '.wu-priority-navigation__overflow-list'
        },

        minimumNumberOfMenuItems: 3,
        tracking: false
    }

    readonly self = WebsiteUtilities
    // region api properties
    @property({type: object})
        options = {} as Options

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
        onUnfocusResponsiveMenu: (
            this: WebsiteUtilities, event: Event, clickWasInMenu: boolean
        ) => boolean | undefined = NOOP

    @property({type: func})
        onLoaded: () => void = NOOP

    @property({type: func})
        onButtonClick = function(
            this: WebsiteUtilities, _event: Event
        ): Promise<false | undefined> {
            return Promise.resolve(undefined)
        }
    @property({type: func})
        onSectionSwitch = function(
            this: WebsiteUtilities,
            _sectionName: string,
            _oldSectionName: string,
            _event?: Event
        ): Promise<false | undefined> {
            return Promise.resolve(undefined)
        }
    @property({type: func})
        onLinkClick = function(
            this: WebsiteUtilities, _event: Event
        ): Promise<false | undefined> {
            return Promise.resolve(undefined)
        }
    @property({type: func})
        onTrack = function(
            this: WebsiteUtilities, _item: TrackingItem
        ): Promise<false | undefined> {
            return Promise.resolve(undefined)
        }
    // endregion
    currentSectionName = ''

    startUpAnimationIsComplete = false
    viewportIsOnTop: boolean | undefined

    observerDeregisters: Array<() => void> = []

    static windowLoaded = false
    private static switchSectionLock = new Lock<void>()
    /// region dom nodes
    windowLoadingCoverDomNode: HTMLElement | null = null

    topDomNode: HTMLElement | null = null

    priorityNavigationDomNodes: NodeListOf<HTMLElement> | null = null

    routerOutletDomNode: HTMLElement | null = null
    sectionDomNodes: {default?: HTMLElement} & Mapping<HTMLElement> = {}

    scrollToTopButtonDomNodes: NodeListOf<HTMLElement> | null = null
    /// endregion
    // region public
    /// region live-cycle
    /**
     * Defines dynamic getter and setter interface and resolves the
     * configuration object. Initializes the map implementation.
     */
    constructor() {
        super()
        /*
            Babel's property declaration transformation overwrites defined
            properties at the end of an implicit constructor. So we have to
            redefine them as long as we want to declare expected component
            interface properties to enable static type checks.
        */
        this.defineGetterAndSetterInterface()
    }
    /**
     * Triggered when ever a given attribute has changed and triggers to update
     * configured dom content.
     * @param name - Attribute name which was updates.
     * @param newValue - New updated value.
     * @returns Promise resolving when attribute has been updated.
     */
    async onUpdateAttribute(name: string, newValue: string): Promise<void> {
        await super.onUpdateAttribute(name, newValue)

        if (name === 'options')
            this._extendOptions()
    }
    /**
     * Updates controlled dom elements.
     * @param reason - Why an update has been triggered.
     * @param resolveRendering - Indicates whether rendering should be resolved
     * finally. Should be set to "false" via super calls in inherited render
     * methods which do further dom manipulations afterward and resolve the
     * rendering process by their own.
     * @returns A promise resolving when rendering has finished. A promise may
     * be needed for classes inheriting from this class.
     */
    async render(reason = 'unknown', resolveRendering = true): Promise<void> {
        await super.render(reason, false)

        if (Object.keys(this.options).length === 0)
            this._extendOptions()

        this.disableScrolling()

        if (!this.self.windowLoaded) {
            const onLoaded = () => {
                if (!this.self.windowLoaded) {
                    this.self.windowLoaded = true

                    void this._removeLoadingCover().then(() => {
                        this.enableScrolling()

                        void this._performStartUpEffects().then(() => {
                            this.addMenuHighlighterViewTransition()
                        })

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
        }

        await this.waitForNestedComponentRendering()

        this.grabDomNodes()

        this._bindScrollEvents()
        this._bindClickTracking()

        await this._initializeRouting()
        this.initializePriorityNavigation()

        await this.resolveRenderingPromiseIfSet(reason, resolveRendering)
    }
    /**
     * Frees some memory.
     */
    disconnectedCallback() {
        super.disconnectedCallback()
        for (const deregister of this.observerDeregisters)
            deregister()
    }
    // endregion
    grabDomNodes(): void {
        this.topDomNode =
            this.hostDomNode.querySelector(this.options.selectors.top)
        this.scrollToTopButtonDomNodes = this.hostDomNode.querySelectorAll(
            this.options.selectors.scrollToTopButtons
        )

        this.priorityNavigationDomNodes = this.hostDomNode.querySelectorAll(
            `.${this.options.selectors.priorityNavigationClassName}`
        )

        this.routerOutletDomNode =
            this.hostDomNode.querySelector(this.options.selectors.routerOutlet)
        for (const domNode of this.routerOutletDomNode?.children ?? []) {
            const name =
                domNode.getAttribute('data-website-utilities-section')
            if (name === '')
                this.sectionDomNodes.default = domNode as HTMLElement
            else if (name && this.options.sectionNames.managed.includes(name))
                this.sectionDomNodes[name] = domNode as HTMLElement
        }

        this.windowLoadingCoverDomNode =
            this.hostDomNode.querySelector(
                this.options.selectors.windowLoadingCover
            ) ??
            this.hostDomNode.parentElement?.querySelector(
                this.options.selectors.windowLoadingCover
            ) ??
            globalContext.document?.body.querySelector(
                this.options.selectors.windowLoadingCover
            ) ??
            null
    }
    /**
     * This method disables scrolling on the given web view.
     */
    disableScrolling() {
        if (!this.hostDomNode.parentElement)
            return

        this.hostDomNode.parentElement.classList.add('wu-disable-scrolling')
        this.addSecureEventListener(
            this.hostDomNode.parentElement, 'touchmove', preventDefault
        )
    }
    /**
     * This method disables scrolling on the given web view.
     */
    enableScrolling() {
        if (!this.hostDomNode.parentElement)
            return

        this.hostDomNode.parentElement.classList.remove('wu-disable-scrolling')
        this.hostDomNode.parentElement.classList.remove('touchmove')
        this.hostDomNode.parentElement.removeEventListener(
            'touchmove', preventDefault
        )
    }
    /**
     * Triggers an analytics event. All given arguments are forwarded to
     * configured analytics event code to define to their environment
     * variables.
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
                await this._onTrack(trackingItem)
            } catch (error) {
                log.warn(
                    `Problem in tracking "${represent(trackingItem)}":`,
                    represent(error)
                )
            }
        }
    }
    initializePriorityNavigation() {
        const {selectors} = this.options
        const overflowIndicatorClassName =
            selectors.priorityNavigationOverflowIndicatorClassName
        const overflowIndicatorShowClassName =
            selectors.priorityNavigationOverflowIndicatorShowClassName

        if (this.priorityNavigationDomNodes?.length === 0)
            return

        for (const domNode of this.priorityNavigationDomNodes || [])
            for (const item of domNode.querySelectorAll(
                `[href="#${this.currentSectionName}"]`
            ))
                item.classList.add(selectors.activeNavigationItemClassName)

        const setupOverflowMenu = () => {
            for (const menuDomNode of this.priorityNavigationDomNodes || []) {
                const allMenuItemsDomNode: NodeListOf<HTMLElement> =
                    menuDomNode.querySelectorAll('ul > li')

                const menuItemDomNodes: Array<HTMLElement> =
                    Array.from(allMenuItemsDomNode)
                        .filter((domNode) =>
                            !domNode.classList.contains(
                                overflowIndicatorClassName
                            )
                        )
                // Checking top position of first item (sometimes changes)
                const firstTopPosition = allMenuItemsDomNode[0].offsetTop

                let wrappedElements = []
                for (const domNode of menuItemDomNodes) {
                    const topPosition: number = domNode.offsetTop

                    if (topPosition !== firstTopPosition)
                        wrappedElements.push(domNode)
                }
                if (
                    (menuItemDomNodes.length - wrappedElements.length) <
                    this.options.minimumNumberOfMenuItems
                )
                    wrappedElements = menuItemDomNodes.slice()

                const overflowMenu =
                    menuDomNode.querySelector(`.${overflowIndicatorClassName}`)
                if (wrappedElements.length) {
                    // Clone set before altering
                    const newSet = wrappedElements.map((domNode) => {
                        const copy =
                            domNode.cloneNode(true) as HTMLElement
                        /*
                            NOTE: We remove all inline styles to remove running
                            transitions and instance-specific styling which
                            might not be useful in stacked menu.
                        */
                        for (const domNode of copy.querySelectorAll('[style]'))
                            domNode.removeAttribute('style')
                        return copy
                    })

                    // Hide ones that we're moving
                    for (const domNode of wrappedElements)
                        domNode.classList.add(
                            selectors.priorityNavigationListItemHideClassName
                        )

                    // Add wrapped elements to dropdown
                    const overflowNavigationList = menuDomNode.querySelector(
                        selectors.priorityNavigationOverflowList
                    )
                    if (overflowNavigationList)
                        for (const domNode of newSet)
                            overflowNavigationList.append(domNode)

                    if (overflowMenu)
                        overflowMenu
                            .classList
                            .add(overflowIndicatorShowClassName)
                } else if (overflowMenu)
                    overflowMenu
                        .classList
                        .remove(overflowIndicatorShowClassName)
            }
        }

        for (const domNode of this.hostDomNode.querySelectorAll(
            `.${overflowIndicatorClassName}`
        )) {
            const menuDomNode: HTMLElement | null =
                domNode.closest(`.${selectors.priorityNavigationClassName}`)

            this.addSecureEventListener(
                domNode,
                'click',
                () => {
                    menuDomNode?.classList.toggle(
                        selectors.priorityNavigationOverflowOpenClassName
                    )
                }
            )

            if (!globalContext.document)
                continue
            /*
                Listen for clicks anywhere on the webpage to close overflow
                menu.
            */
            this.addSecureEventListener(
                globalContext.document,
                'click',
                (event) => {
                    if (menuDomNode?.classList.contains(
                        selectors.priorityNavigationOverflowOpenClassName
                    )) {
                        const clickWasInMenu = Boolean(
                            event.target &&
                            getParents(event.target as Node)
                                .some((parentDomNode) =>
                                    menuDomNode === parentDomNode
                                )
                        )
                        const result =
                            this.onUnfocusResponsiveMenu(event, clickWasInMenu)
                        if (
                            result === true ||
                            !clickWasInMenu && result !== false
                        )
                            menuDomNode.classList.remove(
                                selectors
                                    .priorityNavigationOverflowOpenClassName
                            )
                    }
                }
            )
        }

        for (const menuDomNode of this.priorityNavigationDomNodes || []) {
            const update = trailingThrottle(
                () => {
                    /*
                        NOTE: Skip update if overflow menu is currently open
                        to avoid interrupting CSS transitions (toggling
                        display:none/inline-block on the indicator kills
                        running transitions).
                    */
                    if (menuDomNode.classList.contains(
                        selectors.priorityNavigationOverflowOpenClassName
                    ))
                        return

                    menuDomNode.classList.add(
                        selectors.priorityNavigationOverflowResizingClassName
                    )

                    for (const domNode of menuDomNode.querySelectorAll(
                        selectors.priorityNavigationOverflowList
                    ))
                        while (domNode.firstChild)
                            domNode.removeChild(domNode.firstChild)

                    for (const domNode of menuDomNode.querySelectorAll(
                        `.${overflowIndicatorClassName}`
                    ))
                        domNode.classList.remove(
                            overflowIndicatorShowClassName
                        )

                    for (const domNode of menuDomNode.querySelectorAll(
                        'ul > li'
                    ))
                        if (!domNode.classList.contains(
                            selectors
                                .priorityNavigationOverflowIndicatorClassName
                        ))
                            domNode.classList.remove(
                                selectors
                                    .priorityNavigationListItemHideClassName
                            )

                    setupOverflowMenu()

                    menuDomNode.classList.remove(
                        selectors.priorityNavigationOverflowResizingClassName
                    )
                },
                20
            )

            const observer = new ResizeObserver(update)
            this.observerDeregisters.push(() => {
                observer.unobserve(menuDomNode)
            })
            observer.observe(menuDomNode)
        }

        setupOverflowMenu()
    }
    addMenuHighlighterViewTransition() {
        if (!globalContext.document)
            return

        const styleDomNode= document.createElement('style')
        styleDomNode.type = 'text/css'
        const styles = `
            .wu-priority-navigation
            .wu-priority-navigation__link--active::after {
                view-transition-name: wu-menu-highlight;
            }
        `
        styleDomNode.appendChild(globalContext.document.createTextNode(styles))

        globalContext.document.getElementsByTagName('head')[0]
            .appendChild(styleDomNode)
    }
    activateNavigationItemHighlighters(sectionName: string) {
        const className = this.options.selectors.activeNavigationItemClassName
        for (const domNode of this.priorityNavigationDomNodes || []) {
            for (const item of domNode.querySelectorAll(`.${className}`))
                item.classList.remove(className)

            for (const item of domNode.querySelectorAll(
                `[href="#${sectionName}"]`
            ))
                item.classList.add(className)
        }
    }
    triggerNavigationItemHighlighterSwitching(sectionName: string) {
        if (globalContext.document?.startViewTransition) {
            globalContext.document.startViewTransition(() => {
                this.activateNavigationItemHighlighters(sectionName)
            })

            return
        }

        this.activateNavigationItemHighlighters(sectionName)
    }
    // endregion
    // region protected methods
    /// region event
    async _onButtonClick(event: Event) {
        if (await this.onButtonClick(event) === false)
            return

        const button = event.target as HTMLElement
        const content = getText(button).join(' ')

        void this._onTrack({
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
    async _onSectionSwitch(
        sectionName: string, oldSectionName: string, event?: Event
    ): Promise<void> {
        if (
            await this.onSectionSwitch(sectionName, oldSectionName, event) ===
                false
        )
            return

        if (!globalContext.window?.location)
            return

        await this._onTrack({
            event: 'sectionSwitch',
            eventType: 'sectionSwitch',
            label: sectionName,
            reference:
                `${globalContext.window.location.pathname}#${sectionName}`,
            subject: 'url',
            userInteraction: false
        })
    }
    async _onLinkClick(event: Event): Promise<void> {
        if (await this.onLinkClick(event) === false)
            return

        const link = event.target as HTMLElement
        const content = getText(link).join(' ')

        void this._onTrack({
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
                link.getAttribute('website-analytics-value') ||
                '1'
            ),
            userInteraction: true
        })
    }
    async _onTrack(item: TrackingItem): Promise<void> {
        if (await this.onTrack(item) === false)
            return

        if (this.options.tracking)
            (globalContext as {dataLayer?: Array<TrackingItem>})
                .dataLayer?.push(item)
    }
    /**
     * This method triggers if the viewport moves to the top.
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
     * This method triggers if the viewport moves away from the top.
     */
    async _onViewportMovesAwayFromTop() {
        this._finishScrollToTopButtonTransition('wu-top-settled')

        /*
            NOTE: We need to render the none-setteled state beforehand to make
            sure browser will perform the transition.
        */
        await timeout()

        this._finishScrollToTopButtonTransition()

        for (const domNode of this.scrollToTopButtonDomNodes ?? [])
            domNode.classList.add('wu-scroll-down')
    }
    /**
     * This method triggers if we change the current section.
     * @param sectionName - Contains the new section name.
     * @param event - Optional event that triggered the switch.
     * @returns Promise resolving when the section switch has been finished.
     */
    async switchSection(sectionName: string, event?: Event): Promise<void> {
        if (
            globalContext.window &&
            'location' in globalContext.window &&
            (
                sectionName === '' ||
                this.options.sectionNames.managed.includes(sectionName) ||
                this.options.sectionNames.unmanaged.includes(sectionName)
            )
        ) {
            const oldSectionDomNode = Object.prototype.hasOwnProperty.call(
                this.sectionDomNodes, this.currentSectionName
            ) ?
                this.sectionDomNodes[this.currentSectionName] :
                this.sectionDomNodes.default ?? null
            const newSectionDomNode = Object.prototype.hasOwnProperty.call(
                this.sectionDomNodes, sectionName
            ) ?
                this.sectionDomNodes[sectionName] :
                this.sectionDomNodes.default ?? null

            await this.self.switchSectionLock.acquire()

            this.triggerNavigationItemHighlighterSwitching(sectionName)

            log.debug(
                `Run section switch from "${this.currentSectionName}" to`,
                `"${sectionName}".`
            )

            if (this.currentSectionName === sectionName) {
                if (oldSectionDomNode) {
                    oldSectionDomNode.classList.remove('wu-section-active')
                    oldSectionDomNode.classList.add('wu-section-inactive')
                }

                if (newSectionDomNode) {
                    newSectionDomNode.classList.remove('wu-section-inactive')
                    newSectionDomNode.classList.add('wu-section-active')
                }
            } else if (!(
                this.options.sectionNames.unmanaged.includes(sectionName) &&
                this.options.sectionNames.unmanaged.includes(
                    this.currentSectionName
                )
            )) {
                interruptableScrollTo()

                if (oldSectionDomNode) {
                    await fadeOut(oldSectionDomNode)
                    oldSectionDomNode.classList.remove('wu-section-active')
                    oldSectionDomNode.classList.add('wu-section-inactive')
                }

                if (newSectionDomNode) {
                    newSectionDomNode.classList.remove('wu-section-inactive')
                    newSectionDomNode.classList.add('wu-section-active')
                    await fadeIn(newSectionDomNode)
                }
            }

            const oldSectionName = this.currentSectionName
            this.currentSectionName = sectionName

            try {
                await this._onSectionSwitch(
                    this.currentSectionName, oldSectionName, event
                )
            } catch (error) {
                log.warn(
                    'Problem due to call section switch callback on section',
                    `"${this.currentSectionName}": ${represent(error)}`
                )
            }

            await this.self.switchSectionLock.release()
        }
    }
    // endregion
    /// region helper
    /**
     * Extends given options by default options.
     */
    _extendOptions() {
        /*
            NOTE: Using the internal setter avoids triggering an additional
            rendering.
        */
        this.setPropertyValue(
            'options',
            extend<Options>(true, {}, this.self._defaultOptions, this.options)
        )
    }
    /**
     * Handle section switches.
     * @returns Promise resolving when routing initialization has been
     * finished.
     */
    _initializeRouting() {
        if (this.currentSectionName === '')
            this.currentSectionName = this.options.sectionNames.default

        this._bindNavigationEvents()

        const sectionNameCandidate =
            globalContext.location?.hash &&
            globalContext.location.hash.substring('#'.length)

        if (
            sectionNameCandidate &&
            (
                this.options.sectionNames.managed.includes(
                    sectionNameCandidate
                ) ||
                this.options.sectionNames.unmanaged.includes(
                    sectionNameCandidate
                )
            )
        )
            this.currentSectionName = sectionNameCandidate

        for (const domNode of Object.values(this.sectionDomNodes))
            domNode.classList.add('wu-section-inactive')

        return this.switchSection(
            sectionNameCandidate || this.currentSectionName
        )
    }
    /**
     * Removes class names from scroll-to-top buttons to stop running
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
     * This method triggers if the view port arrives at special areas.
     */
    _bindScrollEvents(): void {
        if (!globalContext.document)
            return

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
                        this.onViewportMovesToTop(event)
                    }
                }
            )

        if (globalContext.window?.scrollY) {
            this.viewportIsOnTop = false

            void this._onViewportMovesAwayFromTop().then(() => {
                this.onViewportMovesAwayFromTop()
            })
        } else {
            this.viewportIsOnTop = true

            for (const domNode of this.scrollToTopButtonDomNodes ?? [])
                domNode.classList.add('wu-top-settled')

            this._onViewportMovesToTop()
            this.onViewportMovesToTop()
        }
    }
    /**
     * This method triggers after the window is loaded.
     * @returns Promise resolving to nothing when loading cover has been
     * removed.
     */
    async _removeLoadingCover(): Promise<void> {
        await timeout(this.options.additionalPageLoadingTimeInMilliseconds)

        // Hide startup animation dom nodes to show them step by step.
        for (const domNode of this.hostDomNode.querySelectorAll(
            '[class^="' +
            `${this.options.selectors.startUpAnimationClassPrefix}"], ` +
            '[class*=" ' +
            `${this.options.selectors.startUpAnimationClassPrefix}"]`
        ))
            (domNode as HTMLElement).style.opacity = '0'

        if (this.windowLoadingCoverDomNode)
            await fadeOut(this.windowLoadingCoverDomNode)
    }
    /**
     * This method handles the given startup effect step.
     * @returns Promise resolving to nothing when startup effects have been
     * finished.
     */
    async _performStartUpEffects(): Promise<void> {
        const animationPromises: Array<Promise<void>> = []
        let elementNumber = 1
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            const domNodesToAnimate: NodeListOf<HTMLElement> =
                this.hostDomNode.querySelectorAll(
                    '.' +
                    this.options.selectors.startUpAnimationClassPrefix +
                    String(elementNumber)
                )

            if (domNodesToAnimate.length === 0) {
                await Promise.all(animationPromises)
                this.startUpAnimationIsComplete = true
                this.onStartUpAnimationComplete()
                break
            }

            await timeout(
                this.options.startUpAnimationElementDelayInMilliseconds
            )

            for (const domNode of domNodesToAnimate) {
                domNode.style.removeProperty('opacity')
                const handler = fadeIn(domNode)
                animationPromises.push(handler.then(() => {
                    handler.resetStyles()
                }))
            }

            elementNumber += 1
        }
    }
    /**
     * This method adds triggers to switch the section.
     */
    _bindNavigationEvents() {
        if (globalContext.window)
            this.addSecureEventListener(
                globalContext.window,
                'hashchange',
                (event: Event) => {
                    if (this.startUpAnimationIsComplete) {
                        const newSectionNameCandidate =
                            location.hash.substring('#'.length)

                        void this.switchSection(newSectionNameCandidate, event)
                    }
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

                    interruptableScrollTo()
                }
            )
    }
    /**
     * Executes the page tracking code.
     */
    _bindClickTracking() {
        if (this.options.tracking) {
            for (const domNode of this.hostDomNode.querySelectorAll('a'))
                this.addSecureEventListener(
                    domNode,
                    'click',
                    (event) => {
                        void this._onLinkClick(event)
                    }
                )

            for (const domNode of this.hostDomNode.querySelectorAll('button'))
                this.addSecureEventListener(
                    domNode,
                    'click',
                    (event) => {
                        void this._onButtonClick(event)
                    }
                )
        }
    }
    /// endregion
    // endregion
}
// endregion
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
