// @flow
// #!/usr/bin/env node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See http://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import type {$Deferred, $DomNode} from 'clientnode'
import registerTest from 'clientnode/test'
import type Website from './index'
// endregion
registerTest(function(
    roundType:string, targetTechnology:?string, $:any
):void {
    require('./index')
    const website:Website = $.Website()
    // region tests
    // / region public methods
    // // region special
    this.test('initialize', (assert:Object):void => assert.ok(website))
    // // endregion
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
        assert.strictEqual(
            typeof website._onViewportMovesToTop(),
            typeof setTimeout(():void => {}, 0))
    })
    this.test('_onViewportMovesAwayFromTop', (assert:Object):void => {
        website._onViewportMovesAwayFromTop()
        // NOTE: Returns timeout id because of debounceing.
        assert.strictEqual(
            typeof website._onViewportMovesAwayFromTop(),
            typeof setTimeout(():void => {}, 0))
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
    this.test('_removeLoadingCover', (assert:Object):void =>
        assert.strictEqual(website._removeLoadingCover(), website))
    this.test('_handleStartUpEffects', (assert:Object):void =>
        assert.strictEqual(website._handleStartUpEffects(10), website))
    this.test('_addNavigationEvents', (assert:Object):void =>
        assert.strictEqual(website._addNavigationEvents(), website))
    this.test('_handleScrollToTopButton', (assert:Object):void =>
        assert.strictEqual(website._handleScrollToTopButton(), website))
    this.test('_scrollToTop', (assert:Object):void => assert.strictEqual(
        website._scrollToTop(), website))
    this.test('_handleAnalyticsInitialisation', (assert:Object):void =>
        assert.strictEqual(website._handleAnalyticsInitialisation(), website))
    // // endregion
    // / endregion
    // endregion
}, ['withJQuery'])
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
