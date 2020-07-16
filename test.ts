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
import registerTest from 'clientnode/test'
import type Website from './index'
// endregion
registerTest(async function(
    roundType:string, targetTechnology:?string, $:any
):Promise<void> {
    require('./index')
    const website:Website = await $.Website()
    // region tests
    // / region public methods
    // // region special
    this.test('initialize', (assert:Object):void => assert.ok(website))
    // // endregion
    this.test('scrollToTop', (assert:Object):void => assert.strictEqual(
        website.scrollToTop(), website))
    this.test('disableScrolling|enableScrolling', (assert:Object):void => {
        assert.strictEqual(website.disableScrolling(), website)
        assert.strictEqual(website.enableScrolling(), website)
    })
    // / endregion
    // / region protected methods
    // // region event
    this.test('_onViewportMovesToTop', (assert:Object):void => {
        website._onViewportMovesToTop()
        // NOTE: Returns timeout id because of debounceing.
        assert.ok(website._onViewportMovesToTop().hasOwnProperty('clear'))
    })
    this.test('_onViewportMovesAwayFromTop', (assert:Object):void => {
        website._onViewportMovesAwayFromTop()
        // NOTE: Returns timeout id because of debounceing.
        assert.ok(website._onViewportMovesAwayFromTop().hasOwnProperty(
            'clear'))
    })
    this.test('_onChangeMediaQueryMode', (assert:Object):void =>
        assert.strictEqual(
            website._onChangeMediaQueryMode('old', 'new'), website))
    this.test('_onChangeToLargeMode', (assert:Object):void =>
        assert.strictEqual(
            website._onChangeToLargeMode('old', 'new'), website))
    this.test('_onChangeToMediumMode', (assert:Object):void =>
        assert.strictEqual(
            website._onChangeToMediumMode('old', 'new'), website))
    this.test('_onChangeToSmallMode', (assert:Object):void =>
        assert.strictEqual(
            website._onChangeToSmallMode('old', 'new'), website))
    this.test('_onChangeToExtraSmallMode', (assert:Object):void =>
        assert.strictEqual(
            website._onChangeToExtraSmallMode('old', 'new'), website))
    this.test('_onSwitchSection', (assert:Object):void => assert.strictEqual(
        website._onSwitchSection('newSectionName'), website))
    this.test('_onStartUpAnimationComplete', (assert:Object):void =>
        assert.strictEqual(website._onStartUpAnimationComplete(), website))
    // // endregion
    // // region helper
    this.test('_addMediaQueryChangeEvents', (assert:Object):void =>
        assert.strictEqual(website._addMediaQueryChangeEvents(), website))
    this.test('_triggerWindowResizeEvents', (assert:Object):void =>
        assert.strictEqual(website._triggerWindowResizeEvents(), website))
    this.test('_bindScrollEvents', (assert:Object):void => assert.strictEqual(
        website._bindScrollEvents(), website))
    this.test('_removeLoadingCover', async (assert:Object):Promise<void> =>
        assert.strictEqual(await website._removeLoadingCover(), website))
    this.test('_handleStartUpEffects', async (assert:Object):Promise<void> =>
        assert.strictEqual(await website._handleStartUpEffects(10), website))
    this.test('_addNavigationEvents', (assert:Object):void =>
        assert.strictEqual(website._addNavigationEvents(), website))
    this.test('_handleScrollToTopButton', (assert:Object):void =>
        assert.strictEqual(website._handleScrollToTopButton(), website))
    this.test('_handleAnalyticsInitialisation', (assert:Object):void =>
        assert.strictEqual(website._handleAnalyticsInitialisation(), website))
    // // endregion
    // / endregion
    // endregion
}, 'full')
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
