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
import browserAPI from 'webOptimizer/browserAPI'
import type {BrowserAPI} from 'webOptimizer/type'
import type Website from './index'
// endregion
// region declaration
declare var DEBUG:boolean
declare var TARGET_TECHNOLOGY:string
// endregion
// region types
type JQueryFunction = (object:any) => Object
// endregion
let QUnit:Object
if (typeof TARGET_TECHNOLOGY === 'undefined' || TARGET_TECHNOLOGY === 'node')
    QUnit = require('qunit-cli')
else
    QUnit = DEBUG ? require('qunitjs') : (
        require('script!qunitjs') && window.QUnit)
browserAPI((browserAPI:BrowserAPI):void => {
    const $:JQueryFunction = require('jquery')
    $.context = browserAPI.window.document
    require('./index')
    // region configuration
    QUnit.config = $.extend(QUnit.config || {}, {
        /*
        notrycatch: true,
        noglobals: true,
        */
        altertitle: true,
        autostart: true,
        fixture: '',
        hidepassed: false,
        maxDepth: 3,
        reorder: false,
        requireExpects: false,
        testTimeout: 30 * 1000,
        scrolltop: false
    })
    const website:Website = $.Website()
    // endregion
    // region tests
    // / region public methods
    // // region special
    QUnit.test('initialize', (assert:Object):void => assert.ok(website))
    // // endregion
    QUnit.test('disableScrolling|enableScrolling', (assert:Object):void => {
        assert.strictEqual(website.disableScrolling(), website)
        assert.strictEqual(website.enableScrolling(), website)
    })
    // / endregion
    // / region protected methods
    // // region event
    QUnit.test('_onViewportMovesToTop', (assert:Object):void => {
        website._onViewportMovesToTop()
        // NOTE: Returns timeout id because of debounceing.
        assert.strictEqual(
            typeof website._onViewportMovesToTop(),
            typeof setTimeout(():void => {}, 0))
    })
    QUnit.test('_onViewportMovesAwayFromTop', (assert:Object):void => {
        website._onViewportMovesAwayFromTop()
        // NOTE: Returns timeout id because of debounceing.
        assert.strictEqual(
            typeof website._onViewportMovesAwayFromTop(),
            typeof setTimeout(():void => {}, 0))
    })
    QUnit.test('_onChangeMediaQueryMode', (assert:Object):void =>
        assert.strictEqual(
            website._onChangeMediaQueryMode('old', 'new'), website))
    QUnit.test('_onChangeToLargeMode', (assert:Object):void =>
        assert.strictEqual(
            website._onChangeToLargeMode('old', 'new'), website))
    QUnit.test('_onChangeToMediumMode', (assert:Object):void =>
        assert.strictEqual(
            website._onChangeToMediumMode('old', 'new'), website))
    QUnit.test('_onChangeToSmallMode', (assert:Object):void =>
        assert.strictEqual(
            website._onChangeToSmallMode('old', 'new'), website))
    QUnit.test('_onChangeToExtraSmallMode', (assert:Object):void =>
        assert.strictEqual(
            website._onChangeToExtraSmallMode('old', 'new'), website))
    QUnit.test('_onSwitchSection', (assert:Object):void => assert.strictEqual(
        website._onSwitchSection('newSectionName'), website))
    QUnit.test('_onStartUpAnimationComplete', (assert:Object):void =>
        assert.strictEqual(website._onStartUpAnimationComplete(), website))
    // // endregion
    // // region helper
    QUnit.test('_addMediaQueryChangeEvents', (assert:Object):void =>
        assert.strictEqual(website._addMediaQueryChangeEvents(), website))
    QUnit.test('_triggerWindowResizeEvents', (assert:Object):void =>
        assert.strictEqual(website._triggerWindowResizeEvents(), website))
    QUnit.test('_bindScrollEvents', (assert:Object):void => assert.strictEqual(
        website._bindScrollEvents(), website))
    QUnit.test('_removeLoadingCover', (assert:Object):void =>
        assert.strictEqual(website._removeLoadingCover(), website))
    QUnit.test('_handleStartUpEffects', (assert:Object):void =>
        assert.strictEqual(website._handleStartUpEffects(10), website))
    QUnit.test('_addNavigationEvents', (assert:Object):void =>
        assert.strictEqual(website._addNavigationEvents(), website))
    QUnit.test('_handleScrollToTopButton', (assert:Object):void =>
        assert.strictEqual(website._handleScrollToTopButton(), website))
    QUnit.test('_scrollToTop', (assert:Object):void => assert.strictEqual(
        website._scrollToTop(), website))
    QUnit.test('_handleAnalyticsInitialisation', (assert:Object):void =>
        assert.strictEqual(website._handleAnalyticsInitialisation(), website))
    // // endregion
    // / endregion
    // endregion
    if (
        typeof TARGET_TECHNOLOGY === 'undefined' ||
        TARGET_TECHNOLOGY === 'node'
    )
        QUnit.load()
    // region hot module replacement handler
    /*
        NOTE: hot module replacement doesn't work with async tests yet since
        qunit is not resetable yet:

        if (typeof module === 'object' && 'hot' in module && module.hot) {
            module.hot.accept()
            // IgnoreTypeCheck
            module.hot.dispose(():void => {
                QUnit.reset()
                console.clear()
            }
        }
    */
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
