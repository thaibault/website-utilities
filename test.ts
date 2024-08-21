// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {beforeAll, describe, expect, test} from '@jest/globals'
import {$} from 'clientnode'

import WebsiteUtilities from './index'
// endregion
describe('WebsiteUtilities', ():void => {
    let websiteUtilities:WebsiteUtilities
    /*
        NOTE: Import plugins with side effects (augmenting "$" scope /
        registering plugin) when other imports are only used as type.
    */
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('internationalisation')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('./index')

    beforeAll(async ():Promise<void> => {
        websiteUtilities = (await $.WebsiteUtilities()) as WebsiteUtilities
    })
    // region tests
    /// region public methods
    //// region special
    test('initialize', () => {
        expect(websiteUtilities).toBeDefined()
    })
    //// endregion
    test('scrollToTop', () => {
        expect(websiteUtilities.scrollToTop()).toStrictEqual(websiteUtilities)
    })
    test('track', () => {
        expect(websiteUtilities.track({
            event: 'event',
            eventType: 'eventType',
            label: 'label',
            reference: 'reference',
            subject: 'subject',
            userInteraction: false
        })).toStrictEqual(websiteUtilities)
    })
    test('disableScrolling|enableScrolling', () => {
        expect(websiteUtilities.disableScrolling())
            .toStrictEqual(websiteUtilities)
        expect(websiteUtilities.enableScrolling())
            .toStrictEqual(websiteUtilities)
    })
    /// endregion
    /// region protected methods
    //// region event
    test('_onViewportMovesToTop', () => {
        // NOTE: Method is wrapped by the higher order debounce method.
        expect(websiteUtilities._onViewportMovesToTop())
            .toBeInstanceOf(Promise)
    })
    test('_onViewportMovesAwayFromTop', () => {
        // NOTE: Method is wrapped by the higher order debounce method.
        expect(websiteUtilities._onViewportMovesAwayFromTop())
            .toBeInstanceOf(Promise)
    })
    test('_onChangeMediaQueryMode', () => {
        websiteUtilities._onChangeMediaQueryMode('old', 'new')
        expect(true).toStrictEqual(true)
    })
    test('_onChangeToLargeMode', () => {
        websiteUtilities._onChangeToLargeMode('old', 'new')
        expect(true).toStrictEqual(true)
    })
    test('_onChangeToMediumMode', () => {
        websiteUtilities._onChangeToMediumMode('old', 'new')
        expect(true).toStrictEqual(true)
    })
    test('_onChangeToSmallMode', () => {
        websiteUtilities._onChangeToSmallMode('old', 'new')
        expect(true).toStrictEqual(true)
    })
    test('_onChangeToExtraSmallMode', () => {
        websiteUtilities._onChangeToExtraSmallMode('old', 'new')
        expect(true).toStrictEqual(true)
    })
    test('_onSwitchSection', () => {
        websiteUtilities._onSwitchSection('newSectionName')
        expect(true).toStrictEqual(true)
    })
    test('_onStartUpAnimationComplete', () => {
        void websiteUtilities._onStartUpAnimationComplete()
        expect(true).toStrictEqual(true)
    })
    //// endregion
    //// region helper
    test('_bindMediaQueryChangeEvents', () => {
        websiteUtilities._bindMediaQueryChangeEvents()
        expect(true).toStrictEqual(true)
    })
    test('_triggerWindowResizeEvents', () => {
        websiteUtilities._triggerWindowResizeEvents()
        expect(true).toStrictEqual(true)
    })
    test('_bindScrollEvents', () => {
        websiteUtilities._bindScrollEvents()
        expect(true).toStrictEqual(true)
    })
    test('_removeLoadingCover', async ():Promise<void> =>
        expect(websiteUtilities._removeLoadingCover())
            .resolves.not.toBeDefined()
    )
    test('_performStartUpEffects', async ():Promise<void> =>
        expect(websiteUtilities._performStartUpEffects(10))
            .resolves.not.toBeDefined()
    )
    test('_bindNavigationEvents', () => {
        websiteUtilities._bindNavigationEvents()
        expect(true).toStrictEqual(true)
    })
    test('_bindScrollToTopButton', () => {
        websiteUtilities._bindScrollToTopButton()
        expect(true).toStrictEqual(true)
    })
    test('_bindClickTracking', () => {
        websiteUtilities._bindClickTracking()
        expect(true).toStrictEqual(true)
    })
    //// endregion
    /// endregion
    // endregion
})
