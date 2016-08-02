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
import type {Browser} from 'webOptimizer/type'
import type Website from './index'
// endregion
// region declaration
declare var TARGET:string
// endregion
// region types
type JQueryFunction = (object:any) => Object
// endregion
const qunit:Object = (TARGET === 'node') ? require('qunit-cli') : require(
    'qunitjs')
browserAPI((
    browser:Browser, alreadyLoaded:boolean
):void => browser.window.document.addEventListener('DOMContentLoaded', (
):void => {
    // region initialize global context
    /*
        NOTE: We have to define window globally before anything is loaded to
        ensure that all future instances share the same window object.
    */
    if (typeof global !== 'undefined' && global !== browser.window) {
        global.window = browser.window
        for (const key in browser.window)
            if (browser.window.hasOwnProperty(key) && !global.hasOwnProperty(
                key
            ))
                global[key] = browser.window[key]
    }
    // endregion
    const $:JQueryFunction = require('jquery')
    $.context = browser.window.document
    require('./index')
    // region mock-up
    const website:Website = $.Website()
    // endregion
    if (TARGET === 'node')
        qunit.load()
    else if (!alreadyLoaded)
        qunit.start()
    // region tests
    // / region public methods
    // // region special
    qunit.test('initialize', ():void => qunit.ok(website))
    // // endregion
    qunit.test('disableScrolling|enableScrolling', ():void => {
        qunit.strictEqual(website.disableScrolling(), website)
        qunit.strictEqual(website.enableScrolling(), website)
    })
    // / endregion
    // / region protected methods
    // // region event
    qunit.test('_onViewportMovesToTop', ():void => {
        website._onViewportMovesToTop()
        // NOTE: Returns timeout id because of debounceing.
        qunit.strictEqual(
            typeof website._onViewportMovesToTop(),
            typeof setTimeout(():void => {}, 0))
    })
    qunit.test('_onViewportMovesAwayFromTop', ():void => {
        website._onViewportMovesAwayFromTop()
        // NOTE: Returns timeout id because of debounceing.
        qunit.strictEqual(
            typeof website._onViewportMovesAwayFromTop(),
            typeof setTimeout(():void => {}, 0))
    })
    qunit.test('_onChangeMediaQueryMode', ():void => qunit.strictEqual(
        website._onChangeMediaQueryMode('old', 'new'), website))
    qunit.test('_onChangeToLargeMode', ():void => qunit.strictEqual(
        website._onChangeToLargeMode('old', 'new'), website))
    qunit.test('_onChangeToMediumMode', ():void => qunit.strictEqual(
        website._onChangeToMediumMode('old', 'new'), website))
    qunit.test('_onChangeToSmallMode', ():void => qunit.strictEqual(
        website._onChangeToSmallMode('old', 'new'), website))
    qunit.test('_onChangeToExtraSmallMode', ():void => qunit.strictEqual(
        website._onChangeToExtraSmallMode('old', 'new'), website))
    qunit.test('_onSwitchSection', ():void => qunit.strictEqual(
        website._onSwitchSection('newSectionName'), website))
    qunit.test('_onStartUpAnimationComplete', ():void => qunit.strictEqual(
        website._onStartUpAnimationComplete(), website))
    // // endregion
    // // region helper
    qunit.test('_addMediaQueryChangeEvents', ():void => qunit.strictEqual(
        website._addMediaQueryChangeEvents(), website))
    qunit.test('_triggerWindowResizeEvents', ():void => qunit.strictEqual(
        website._triggerWindowResizeEvents(), website))
    qunit.test('_bindScrollEvents', ():void => qunit.strictEqual(
        website._bindScrollEvents(), website))
    qunit.test('_removeLoadingCover', ():void => qunit.strictEqual(
        website._removeLoadingCover(), website))
    qunit.test('_handleStartUpEffects', ():void => qunit.strictEqual(
        website._handleStartUpEffects(10), website))
    qunit.test('_addNavigationEvents', ():void => qunit.strictEqual(
        website._addNavigationEvents(), website))
    qunit.test('_handleScrollToTopButton', ():void => qunit.strictEqual(
        website._handleScrollToTopButton(), website))
    qunit.test('_scrollToTop', ():void => qunit.strictEqual(
        website._scrollToTop(), website))
    qunit.test('_handleAnalyticsInitialisation', ():void => qunit.strictEqual(
        website._handleAnalyticsInitialisation(), website))
    // // endregion
    // / endregion
    // endregion
    // region hot module replacement handler
    if (typeof module === 'object' && 'hot' in module && module.hot) {
        module.hot.accept()
        // IgnoreTypeCheck
        module.hot.dispose(():void => {
            /*
                NOTE: We have to delay status indicator reset because qunits
                status updates are delayed as well.
            */
            setTimeout(():void => {
                if (!$('.fail').length) {
                    browser.window.document.title = '✔ test'
                    $('#qunit-banner').removeClass('qunit-fail').addClass(
                        'qunit-pass')
                }
            }, 0)
            $('#qunit-tests').html('')
            console.clear()
        })
    }
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
