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
describe(WebsiteUtilities._name, async ():Promise<void> => {
    const websiteUtilties:WebsiteUtilities = await $.WebsiteUtilties()
    // region tests
    // / region public methods
    // // region special
    test('initialize', ():void => assert.ok(websiteUtilities))
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
        // NOTE: Returns timeout id because of debounceing.
        assert.ok(website._onViewportMovesToTop().hasOwnProperty('clear'))
    })
    test('_onViewportMovesAwayFromTop', ():void => {
        website._onViewportMovesAwayFromTop()
        // NOTE: Returns timeout id because of debounceing.
        assert.ok(website._onViewportMovesAwayFromTop().hasOwnProperty(
            'clear'))
    })
    test('_onChangeMediaQueryMode', ():void =>
        assert.strictEqual(
            website._onChangeMediaQueryMode('old', 'new'), website)
    )
    test('_onChangeToLargeMode', ():void =>
        assert.strictEqual(
            website._onChangeToLargeMode('old', 'new'), website)
    )
    test('_onChangeToMediumMode', ():void =>
        assert.strictEqual(
            website._onChangeToMediumMode('old', 'new'), website)
    )
    test('_onChangeToSmallMode', ():void =>
        assert.strictEqual(
            website._onChangeToSmallMode('old', 'new'), website)
    )
    test('_onChangeToExtraSmallMode', ():void =>
        assert.strictEqual(
            website._onChangeToExtraSmallMode('old', 'new'), website)
    )
    test('_onSwitchSection', ():void =>
        assert.strictEqual(website._onSwitchSection('newSectionName'), website)
    )
    test('_onStartUpAnimationComplete', ():void =>
        assert.strictEqual(website._onStartUpAnimationComplete(), website)
    )
    // // endregion
    // // region helper
    test('_addMediaQueryChangeEvents', ():void =>
        assert.strictEqual(website._addMediaQueryChangeEvents(), website)
    )
    test('_triggerWindowResizeEvents', ():void =>
        assert.strictEqual(website._triggerWindowResizeEvents(), website)
    )
    test('_bindScrollEvents', ():void => assert.strictEqual(
        website._bindScrollEvents(), website)
    )
    test('_removeLoadingCover', async ():Promise<void> =>
        assert.strictEqual(await website._removeLoadingCover(), website)
    )
    test('_handleStartUpEffects', async ():Promise<void> =>
        assert.strictEqual(await website._handleStartUpEffects(10), website)
    )
    test('_addNavigationEvents', ():void =>
        assert.strictEqual(website._addNavigationEvents(), website)
    )
    test('_handleScrollToTopButton', ():void =>
        assert.strictEqual(website._handleScrollToTopButton(), website)
    )
    test('_handleAnalyticsInitialisation', ():void =>
        assert.strictEqual(website._handleAnalyticsInitialisation(), website)
    )
    // // endregion
    // / endregion
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
