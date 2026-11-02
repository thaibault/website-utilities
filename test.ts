// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {globalContext, RecursivePartial, timeout} from 'clientnode'

import {
    afterEach, beforeAll, describe, expect, jest, test
} from '@jest/globals'
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter'

import WebsiteUtilities, {api, log} from './index'
import type {Options, TrackingItem} from './type'
// endregion
describe('WebsiteUtilities', (): void => {
    const instances: Array<WebsiteUtilities> = []
    const resizeObserverCallbacks: Array<() => void> = []
    /**
     * Creates, connects and renders a new component instance.
     * @param content - Inner html to use.
     * @param options - Options to apply via attribute.
     * @param properties - Additional properties to set before connecting.
     * @returns Promise resolving to rendered instance.
     */
    const create = async (
        content = '',
        options: RecursivePartial<Options> = {},
        properties: Partial<WebsiteUtilities> = {}
    ): Promise<WebsiteUtilities> => {
        const domNode = document.createElement('website-utilities') as
            WebsiteUtilities
        domNode.setAttribute('options', JSON.stringify(options))
        Object.assign(domNode, properties)
        domNode.innerHTML = content
        document.body.appendChild(domNode)

        await domNode.renderState.promise

        instances.push(domNode)

        return domNode
    }
    /**
     * Mocks the current vertical scroll position.
     * @param position - Position to set.
     */
    /**
     * Replaces the logger's warn method to check expected warnings silently.
     * @returns Spy recording all warnings.
     */
    const spyOnWarnings = () =>
        jest.spyOn(log, 'warn').mockImplementation(() => Promise.resolve())
    const setScrollY = (position: number) => {
        Object.defineProperty(
            globalContext.window,
            'scrollY',
            {configurable: true, value: position}
        )
    }

    beforeAll(() => {
        if (typeof globalContext.ResizeObserver === 'undefined')
            (globalContext as {ResizeObserver: unknown}).ResizeObserver =
                class {
                    constructor(callback: () => void) {
                        resizeObserverCallbacks.push(callback)
                    }
                    observe() {
                        // Nothing to do.
                    }
                    unobserve() {
                        // Nothing to do.
                    }
                }

        api.register()
    })
    afterEach(() => {
        jest.restoreAllMocks()

        for (const domNode of instances.splice(0))
            domNode.remove()

        resizeObserverCallbacks.splice(0)
        setScrollY(0)
        globalContext.location?.replace('#')
    })
    // region tests
    /*
        NOTE: Has to run first since the window loaded state is shared between
        all instances.
    */
    test('loading and start up effects', async (): Promise<void> => {
        let onComplete: () => void = () => {
            // Will be replaced.
        }
        const completed = new Promise<void>((resolve) => {
            onComplete = resolve
        })
        let loaded = false

        const domNode = await create(
            '<div class="wu-window-loading-cover"></div>' +
            '<div class="wu-start-up-animation-number-1">a</div>' +
            '<div class="other wu-start-up-animation-number-2">b</div>',
            {
                startUpAnimationElementDelayInMilliseconds: 0,
                windowLoadedTimeoutAfterDocLoadedInMSec: 0
            },
            {
                onLoaded: () => {
                    loaded = true
                },
                onStartUpAnimationComplete: onComplete
            }
        )

        expect(document.body.classList.contains('wu-disable-scrolling'))
            .toStrictEqual(true)

        await completed

        expect(WebsiteUtilities.windowLoaded).toStrictEqual(true)
        expect(loaded).toStrictEqual(true)
        expect(domNode.startUpAnimationIsComplete).toStrictEqual(true)
        expect(document.body.classList.contains('wu-disable-scrolling'))
            .toStrictEqual(false)
        for (const animatedDomNode of domNode.querySelectorAll<HTMLElement>(
            '[class*="wu-start-up-animation-number-"]'
        ))
            expect(animatedDomNode.style.opacity).toStrictEqual('')

        // Menu highlighter view transition styles have been added.
        await timeout()
        expect(Array.from(document.head.querySelectorAll('style')).some(
            (style) => style.textContent.includes('wu-menu-highlight')
        )).toStrictEqual(true)
    })
    test('options attribute update', async (): Promise<void> => {
        const domNode = await create()

        await domNode.onUpdateAttribute(
            'options', JSON.stringify({domain: 'example.com'})
        )
        // Wait for triggered re-rendering.
        await timeout(50)

        expect(domNode.options.domain).toStrictEqual('example.com')
        expect(domNode.options.selectors.top).toStrictEqual('.wu-header')
    })
    test('scrolling state', async (): Promise<void> => {
        const movements: Array<string> = []
        const domNode = await create(
            '<a class="wu-scroll-to-top" href="#">top</a>',
            {},
            {
                onViewportMovesAwayFromTop: () => {
                    movements.push('away')
                },
                onViewportMovesToTop: () => {
                    movements.push('top')
                }
            }
        )
        const button = domNode.querySelector('.wu-scroll-to-top') as
            HTMLElement

        expect(domNode.viewportIsOnTop).toStrictEqual(true)
        expect(button.classList.contains('wu-top-settled')).toStrictEqual(true)
        expect(button.classList.contains('wu-scroll-up')).toStrictEqual(true)

        setScrollY(100)
        globalContext.window?.dispatchEvent(new Event('scroll'))
        await timeout()
        await timeout()

        expect(domNode.viewportIsOnTop).toStrictEqual(false)
        expect(button.classList.contains('wu-top-settled')).toStrictEqual(false)
        expect(button.classList.contains('wu-scroll-up')).toStrictEqual(false)
        expect(button.classList.contains('wu-scroll-down')).toStrictEqual(true)

        // Further scrolling does not trigger anything new.
        globalContext.window?.dispatchEvent(new Event('scroll'))

        setScrollY(0)
        globalContext.window?.dispatchEvent(new Event('scroll'))

        expect(domNode.viewportIsOnTop).toStrictEqual(true)
        expect(button.classList.contains('wu-scroll-up')).toStrictEqual(true)
        expect(button.classList.contains('wu-top-settled')).toStrictEqual(false)

        button.dispatchEvent(new Event('transitionend'))
        expect(button.classList.contains('wu-top-settled')).toStrictEqual(true)

        // A canceled transition does not set the settled state.
        domNode._onViewportMovesToTop()
        button.classList.remove('wu-top-settled')
        button.dispatchEvent(new Event('transitioncancel'))
        button.dispatchEvent(new Event('transitionend'))
        expect(button.classList.contains('wu-top-settled')).toStrictEqual(false)

        const event = new Event('click', {cancelable: true})
        button.dispatchEvent(event)
        expect(event.defaultPrevented).toStrictEqual(true)

        expect(movements).toStrictEqual(['top', 'away', 'top'])
    })
    test('initially scrolled', async (): Promise<void> => {
        setScrollY(100)
        let movedAway = false

        const domNode = await create(
            '<a class="wu-scroll-to-top" href="#">top</a>',
            {},
            {
                onViewportMovesAwayFromTop: () => {
                    movedAway = true
                }
            }
        )
        await timeout()
        await timeout()

        expect(domNode.viewportIsOnTop).toStrictEqual(false)
        expect(movedAway).toStrictEqual(true)
        expect(domNode.querySelector('.wu-scroll-to-top')?.classList.contains(
            'wu-scroll-down'
        )).toStrictEqual(true)
    })
    test('section switching', async (): Promise<void> => {
        const switches: Array<Array<string>> = []
        const domNode = await create(
            '<div class="wu-router-outlet">' +
            '<div data-website-utilities-section="">default</div>' +
            '<div data-website-utilities-section="home">home</div>' +
            '<div data-website-utilities-section="about">about</div>' +
            '<div data-website-utilities-section="unknown">unknown</div>' +
            '<div>no section</div>' +
            '</div>',
            {sectionNames: {managed: ['home', 'about'], unmanaged: ['a', 'b']}},
            {
                onSectionSwitch: (name: string, oldName: string) => {
                    switches.push([name, oldName])

                    return Promise.resolve(undefined)
                }
            }
        )
        const [defaultSection, home, about] = Array.from(
            domNode.querySelectorAll<HTMLElement>(
                '[data-website-utilities-section]'
            )
        )

        expect(Object.keys(domNode.sectionDomNodes).sort())
            .toStrictEqual(['about', 'default', 'home'])
        expect(defaultSection.classList.contains('wu-section-active'))
            .toStrictEqual(true)

        await domNode.switchSection('about')
        expect(domNode.currentSectionName).toStrictEqual('about')
        expect(about.classList.contains('wu-section-active'))
            .toStrictEqual(true)
        expect(defaultSection.classList.contains('wu-section-inactive'))
            .toStrictEqual(true)

        // Switching to the same section only ensures class names.
        await domNode.switchSection('about')
        expect(about.classList.contains('wu-section-active'))
            .toStrictEqual(true)

        // Not known sections are ignored.
        await domNode.switchSection('unknown')
        expect(domNode.currentSectionName).toStrictEqual('about')

        // Unmanaged sections use the default section dom node.
        await domNode.switchSection('a')
        expect(defaultSection.classList.contains('wu-section-active'))
            .toStrictEqual(true)
        // Switching between unmanaged sections does not animate.
        await domNode.switchSection('b')
        expect(domNode.currentSectionName).toStrictEqual('b')

        await domNode.switchSection('home')
        expect(home.classList.contains('wu-section-active')).toStrictEqual(true)

        expect(switches).toStrictEqual([
            ['', ''],
            ['about', ''],
            ['about', 'about'],
            ['a', 'about'],
            ['b', 'a'],
            ['home', 'b']
        ])
    })
    test('section switching via hash', async (): Promise<void> => {
        globalContext.location?.replace('#about')

        let onSwitch: (name: string) => void = () => {
            // Will be replaced.
        }
        const domNode = await create(
            '<div class="wu-router-outlet">' +
            '<div data-website-utilities-section="home">home</div>' +
            '<div data-website-utilities-section="about">about</div>' +
            '</div>',
            {sectionNames: {managed: ['home', 'about']}},
            {
                onSectionSwitch: (name: string) => {
                    onSwitch(name)

                    return Promise.resolve(undefined)
                }
            }
        )
        expect(domNode.currentSectionName).toStrictEqual('about')
        // Start up effects have already been performed by another instance.
        expect(domNode.startUpAnimationIsComplete).toStrictEqual(true)

        const switched = new Promise<string>((resolve) => {
            onSwitch = resolve
        })
        globalContext.location?.replace('#home')
        globalContext.window?.dispatchEvent(new Event('hashchange'))

        await expect(switched).resolves.toStrictEqual('home')
    })
    test('section switch callback failure', async (): Promise<void> => {
        const warn = spyOnWarnings()
        const domNode = await create('', {tracking: true}, {
            onSectionSwitch: () => Promise.reject(new Error('failure'))
        })

        await expect(domNode.switchSection('home')).resolves.toBeUndefined()
        expect(domNode.currentSectionName).toStrictEqual('home')

        // Initial and explicit switch have been reported.
        expect(warn).toHaveBeenCalledTimes(2)
        expect(warn.mock.calls[1][1]).toContain('"home"')
    })
    test('tracking', async (): Promise<void> => {
        const dataLayer: Array<TrackingItem> = []
        ;(globalContext as {dataLayer?: Array<TrackingItem>}).dataLayer =
            dataLayer

        try {
            const domNode = await create(
                '<a href="#about" website-analytics-value="3">link</a>' +
                '<a>plain link</a>' +
                '<button type="submit">button</button>' +
                '<button action="send">action button</button>',
                {sectionNames: {managed: ['home', 'about']}, tracking: true}
            )
            const [link, plainLink] = Array.from(domNode.querySelectorAll('a'))
            const [button, actionButton] =
                Array.from(domNode.querySelectorAll('button'))

            // Initial section switch has been tracked.
            expect(dataLayer.map((item) => item.event))
                .toStrictEqual(['sectionSwitch'])
            dataLayer.splice(0)

            link.click()
            plainLink.click()
            button.click()
            actionButton.click()
            await timeout()

            expect(dataLayer.map((item) => [
                item.event, item.reference, item.value
            ])).toStrictEqual([
                ['linkClick', '#about', 3],
                ['linkClick', 'plain link', 1],
                ['buttonClick', 'submit', 1],
                ['buttonClick', 'send', 1]
            ])
            dataLayer.splice(0)

            await domNode.track({
                event: 'custom',
                eventType: 'custom',
                label: 'label',
                reference: 'reference',
                subject: 'subject',
                userInteraction: false,
                value: NaN
            })
            expect(dataLayer).toHaveLength(1)
            expect(dataLayer[0].value).toStrictEqual(1)
            expect(dataLayer[0].context).toStrictEqual('/#')
            dataLayer.splice(0)

            // Callbacks can prevent tracking.
            domNode.onLinkClick = () => Promise.resolve(false)
            domNode.onButtonClick = () => Promise.resolve(false)
            domNode.onSectionSwitch = () => Promise.resolve(false)
            link.click()
            button.click()
            await domNode.switchSection('home')
            await timeout()
            expect(dataLayer).toHaveLength(0)

            domNode.onTrack = () => Promise.resolve(false)
            await domNode.track({
                event: 'custom',
                eventType: 'custom',
                label: 'label',
                reference: 'reference',
                subject: 'subject',
                userInteraction: false
            })
            expect(dataLayer).toHaveLength(0)

            // Failing trackers do not break the caller.
            const warn = spyOnWarnings()
            domNode.onTrack = () => Promise.reject(new Error('failure'))
            await expect(domNode.track({
                event: 'custom',
                eventType: 'custom',
                label: 'label',
                reference: 'reference',
                subject: 'subject',
                userInteraction: false
            })).resolves.toBeUndefined()
            expect(warn).toHaveBeenCalledTimes(1)
            expect(warn.mock.calls[0][0]).toContain('Problem in tracking')
        } finally {
            delete (globalContext as {dataLayer?: Array<TrackingItem>})
                .dataLayer
        }
    })
    test('tracking disabled', async (): Promise<void> => {
        let tracked = false
        const domNode = await create('<a href="#">link</a>', {}, {
            onTrack: () => {
                tracked = true

                return Promise.resolve(undefined)
            }
        })

        await domNode.track({
            event: 'custom',
            eventType: 'custom',
            label: 'label',
            reference: 'reference',
            subject: 'subject',
            userInteraction: false
        })
        domNode.querySelector('a')?.click()
        await timeout()

        // Only the initial section switch reaches the tracker callback.
        expect(tracked).toStrictEqual(true)
        tracked = false
        await domNode.track({
            event: 'custom',
            eventType: 'custom',
            label: 'label',
            reference: 'reference',
            subject: 'subject',
            userInteraction: false
        })
        expect(tracked).toStrictEqual(false)
    })
    describe('priority navigation', (): void => {
        const navigation = (numberOfItems: number) =>
            '<nav class="wu-priority-navigation"><ul>' +
            Array.from({length: numberOfItems}, (_, index) =>
                `<li><a href="#item-${String(index)}">` +
                `<span style="color: red">item ${String(index)}</span>` +
                '</a></li>'
            ).join('') +
            '<li class="wu-priority-navigation__list__overflow-indicator">' +
            '<ul class="wu-priority-navigation__overflow-list"></ul>' +
            '</li></ul></nav>'
        const showIndicatorClassName =
            'wu-priority-navigation--show-overflow-indicator'
        const openClassName = 'wu-priority-navigation--overflow-open'
        const hideClassName = 'wu-priority-navigation__list__item--hide'

        test('enough space', async (): Promise<void> => {
            const domNode = await create(
                navigation(3),
                {sectionNames: {default: 'item-1'}}
            )
            const menu = domNode.querySelector('nav') as HTMLElement

            expect(menu.classList.contains(showIndicatorClassName))
                .toStrictEqual(false)
            expect(domNode.querySelector(
                '.wu-priority-navigation__overflow-list'
            )?.children).toHaveLength(0)
            expect(
                domNode.querySelector('[href="#item-1"]')?.classList.contains(
                    'wu-priority-navigation__link--active'
                )
            ).toStrictEqual(true)
        })
        test('too few items', async (): Promise<void> => {
            const domNode = await create(navigation(2))
            const menu = domNode.querySelector('nav') as HTMLElement
            const overflowList = domNode.querySelector(
                '.wu-priority-navigation__overflow-list'
            ) as HTMLElement

            expect(menu.classList.contains(showIndicatorClassName))
                .toStrictEqual(true)
            expect(overflowList.children).toHaveLength(2)
            expect(overflowList.querySelectorAll('[style]')).toHaveLength(0)
            expect(menu.querySelectorAll(`.${hideClassName}`))
                .toHaveLength(2)
        })
        test('wrapped items', async (): Promise<void> => {
            const domNode = await create(navigation(4), {
                minimumNumberOfMenuItems: 1
            })
            const menu = domNode.querySelector('nav') as HTMLElement
            const items = Array.from(menu.querySelectorAll(':scope > ul > li'))
            Object.defineProperty(items[3], 'offsetTop', {value: 20})

            // Resizing re-calculates overflowing items.
            for (const callback of resizeObserverCallbacks)
                callback()
            await timeout(50)

            expect(menu.classList.contains(showIndicatorClassName))
                .toStrictEqual(true)
            expect(items[3].classList.contains(hideClassName))
                .toStrictEqual(true)
            expect(items[2].classList.contains(hideClassName))
                .toStrictEqual(false)
            expect(domNode.querySelector(
                '.wu-priority-navigation__overflow-list'
            )?.children).toHaveLength(1)

            // Repeated resizing replaces previously moved items.
            for (const callback of resizeObserverCallbacks)
                callback()
            await timeout(50)
            expect(domNode.querySelector(
                '.wu-priority-navigation__overflow-list'
            )?.children).toHaveLength(1)

            // No updates while overflow menu is open.
            menu.classList.add(openClassName)
            Object.defineProperty(items[2], 'offsetTop', {value: 20})
            for (const callback of resizeObserverCallbacks)
                callback()
            await timeout(50)
            expect(items[2].classList.contains(hideClassName))
                .toStrictEqual(false)
        })
        test('overflow menu toggling', async (): Promise<void> => {
            let unfocusResult: boolean | undefined
            const domNode = await create(navigation(2), {}, {
                onUnfocusResponsiveMenu: () => unfocusResult
            })
            const menu = domNode.querySelector('nav') as HTMLElement
            const indicator = domNode.querySelector(
                '.wu-priority-navigation__list__overflow-indicator'
            ) as HTMLElement
            const outside = document.createElement('div')
            document.body.appendChild(outside)

            try {
                // Clicks outside a closed menu change nothing.
                outside.click()
                expect(menu.classList.contains(openClassName))
                    .toStrictEqual(false)

                indicator.click()
                expect(menu.classList.contains(openClassName))
                    .toStrictEqual(true)

                // Clicks inside the menu keep it open.
                ;(menu.querySelector('a') as HTMLElement).click()
                expect(menu.classList.contains(openClassName))
                    .toStrictEqual(true)

                // Callback can force closing for inside clicks.
                unfocusResult = true
                ;(menu.querySelector('a') as HTMLElement).click()
                expect(menu.classList.contains(openClassName))
                    .toStrictEqual(false)

                // Callback can prevent closing for outside clicks.
                unfocusResult = false
                indicator.click()
                outside.click()
                expect(menu.classList.contains(openClassName))
                    .toStrictEqual(true)

                unfocusResult = undefined
                outside.click()
                expect(menu.classList.contains(openClassName))
                    .toStrictEqual(false)
            } finally {
                outside.remove()
            }
        })
        test('highlighter switching', async (): Promise<void> => {
            const domNode = await create(navigation(3))
            const isActive = (index: number) => Boolean(
                domNode.querySelector(`[href="#item-${String(index)}"]`)
                    ?.classList.contains('wu-priority-navigation__link--active')
            )

            domNode.triggerNavigationItemHighlighterSwitching('item-0')
            expect(isActive(0)).toStrictEqual(true)

            const document = globalContext.document as Document
            let transitions = 0
            Object.defineProperty(document, 'startViewTransition', {
                configurable: true,
                value: (callback: () => void) => {
                    transitions += 1
                    callback()
                }
            })
            try {
                domNode.triggerNavigationItemHighlighterSwitching('item-2')
            } finally {
                Reflect.deleteProperty(document, 'startViewTransition')
            }

            expect(transitions).toStrictEqual(1)
            expect(isActive(0)).toStrictEqual(false)
            expect(isActive(2)).toStrictEqual(true)
        })
    })
    // endregion
})
