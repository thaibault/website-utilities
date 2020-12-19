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
import {$} from 'clientnode'

import WebsiteUtilities from './index'
// endregion
describe(WebsiteUtilities._name, ():void => {
    let websiteUtilities:WebsiteUtilities
    beforeAll(async ():Promise<void> => {
        websiteUtilities = await $.WebsiteUtilities()
    })
    // region tests
    // / region public methods
    // // region special
    test('initialize', ():void => expect(websiteUtilities).toBeDefined())
    // // endregion
    test('scrollToTop', ():void =>
        expect(websiteUtilities.scrollToTop()).toStrictEqual(websiteUtilities)
    )
    test('disableScrolling|enableScrolling', ():void => {
        expect(websiteUtilities.disableScrolling())
            .toStrictEqual(websiteUtilities)
        expect(websiteUtilities.enableScrolling())
            .toStrictEqual(websiteUtilities)
    })
    // / endregion
    // / region protected methods
    // // region event
    test('_onViewportMovesToTop', ():void => {
        websiteUtilities._onViewportMovesToTop()
        // NOTE: Returns timeout id because of debouncing.
        expect(websiteUtilities._onViewportMovesToTop())
            .toHaveProperty('clear')
    })
    test('_onViewportMovesAwayFromTop', ():void => {
        websiteUtilities._onViewportMovesAwayFromTop()
        // NOTE: Returns timeout id because of debouncing.
        expect(websiteUtilities._onViewportMovesAwayFromTop())
            .toHaveProperty('clear')
    })
    test('_onChangeMediaQueryMode', ():void =>
        expect(websiteUtilities._onChangeMediaQueryMode('old', 'new'))
            .toStrictEqual(websiteUtilities)
    )
    test('_onChangeToLargeMode', ():void =>
        expect(websiteUtilities._onChangeToLargeMode('old', 'new'))
            .toStrictEqual(websiteUtilities)
    )
    test('_onChangeToMediumMode', ():void =>
        expect(websiteUtilities._onChangeToMediumMode('old', 'new'))
            .toStrictEqual(websiteUtilities)
    )
    test('_onChangeToSmallMode', ():void =>
        expect(websiteUtilities._onChangeToSmallMode('old', 'new'))
            .toStrictEqual(websiteUtilities)
    )
    test('_onChangeToExtraSmallMode', ():void =>
        expect(websiteUtilities._onChangeToExtraSmallMode('old', 'new'))
            .toStrictEqual(websiteUtilities)
    )
    test('_onSwitchSection', ():void =>
        expect(websiteUtilities._onSwitchSection('newSectionName'))
            .toStrictEqual(websiteUtilities)
    )
    test('_onStartUpAnimationComplete', ():void =>
        expect(websiteUtilities._onStartUpAnimationComplete())
            .toStrictEqual(websiteUtilities)
    )
    // // endregion
    // // region helper
    test('_addMediaQueryChangeEvents', ():void =>
        expect(websiteUtilities._addMediaQueryChangeEvents())
            .toStrictEqual(websiteUtilities)
    )
    test('_triggerWindowResizeEvents', ():void =>
        expect(websiteUtilities._triggerWindowResizeEvents())
            .toStrictEqual(websiteUtilities)
    )
    test('_bindScrollEvents', ():void =>
        expect(websiteUtilities._bindScrollEvents())
            .toStrictEqual(websiteUtilities)
    )
    test('_removeLoadingCover', async ():Promise<void> =>
        expect(websiteUtilities._removeLoadingCover())
            .resolves.toStrictEqual(websiteUtilities)
    )
    test('_handleStartUpEffects', async ():Promise<void> =>
        expect(websiteUtilities._handleStartUpEffects(10))
            .resolves.toStrictEqual(websiteUtilities)
    )
    test('_addNavigationEvents', ():void =>
        expect(websiteUtilities._addNavigationEvents())
            .toStrictEqual(websiteUtilities)
    )
    test('_handleScrollToTopButton', ():void =>
        expect(websiteUtilities._handleScrollToTopButton())
            .toStrictEqual(websiteUtilities)
    )
    test('_initializeTracking', ():void =>
        expect(websiteUtilities._initializeTracking())
            .toStrictEqual(websiteUtilities)
    )
    // // endregion
    // / endregion
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
