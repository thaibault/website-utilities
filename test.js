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
import type {Window} from 'webOptimizer/type'
import type Website from './index'
// endregion
// region declaration
declare var TARGET:string
declare var module:{hot:Object}
// endregion
// region types
type JQueryFunction = (object:any) => Object
// endregion
const qunit:Object = (TARGET === 'node') ? require('qunit-cli') : require(
    'qunitjs')
browserAPI((window:Window, alreadyLoaded:boolean):void => {
    /*
        NOTE: We have to define window globally before jQuery is loaded to
        ensure that all jquery instances share the same window object.
    */
    if (typeof global !== 'undefined' && global !== window) {
        global.window = window
        for (const key in window)
            if (window.hasOwnProperty(key) && !global.hasOwnProperty(key))
                global[key] = window[key]
    }
    const $:JQueryFunction = require('jquery')
    $.context = window.document
    require('./index')
    if (TARGET === 'node')
        qunit.load()
    else if (!alreadyLoaded)
        qunit.start()
    // region tests
    // / region mock-up
    const website:Website = $.Website()
    // / endregion
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
        module.hot.dispose(():void => {
            /*
                NOTE: We have to delay status indicator reset because qunits
                status updates are delayed as well.
            */
            setTimeout(():void => {
                if (!$('.fail').length) {
                    window.document.title = '✔ test'
                    $('#qunit-banner').removeClass('qunit-fail').addClass(
                        'qunit-pass')
                }
            }, 0)
            $('#qunit-tests').html('')
        })
    }
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
