#!/usr/bin/env require
# -*- coding: utf-8 -*-
# region header
# Copyright Torben Sickert (t.sickert["~at~"]gmail.com) 16.12.2012

# License
# -------

# This library written by Torben Sickert stand under a creative commons naming
# 3.0 unported license. see http://creativecommons.org/licenses/by/3.0/deed.de
# endregion
qunit = require 'qunit.js'
$ = require 'jquery'
require 'index'
qunit.start()
# region tests
## region mock-up
website = $.Website()
## endregion
## region public methods
## # region special
test 'initialize', -> ok website
### endregion
test 'disableScrolling|enableScrolling', ->
    strictEqual website.disableScrolling(), website
    strictEqual website.enableScrolling(), website
## endregion
## region protected methods
## # region event
test '_onViewportMovesToTop', ->
    website._onViewportMovesToTop()
    # NOTE: Returns timeout id because of debounceing.
    strictEqual typeof website._onViewportMovesToTop(), 'number'
test '_onViewportMovesAwayFromTop', ->
    website._onViewportMovesAwayFromTop()
    # NOTE: Returns timeout id because of debounceing.
    strictEqual typeof website._onViewportMovesAwayFromTop(), 'number'
test '_onChangeMediaQueryMode', ->
    strictEqual website._onChangeMediaQueryMode(), website
test '_onChangeToLargeMode', ->
    strictEqual website._onChangeToLargeMode(), website
test '_onChangeToMediumMode', ->
    strictEqual website._onChangeToMediumMode(), website
test '_onChangeToSmallMode', ->
    strictEqual website._onChangeToSmallMode(), website
test '_onChangeToExtraSmallMode', ->
    strictEqual website._onChangeToExtraSmallMode(), website
test '_onSwitchSection', -> strictEqual website._onSwitchSection(), website
test '_onStartUpAnimationComplete', ->
    strictEqual website._onStartUpAnimationComplete(), website
## # endregion
## # region helper
test '_addMediaQueryChangeEvents', ->
    strictEqual website._addMediaQueryChangeEvents(), website
test '_triggerWindowResizeEvents', ->
    strictEqual website._triggerWindowResizeEvents(), website
test '_bindScrollEvents', -> strictEqual website._bindScrollEvents(), website
test '_removeLoadingCover', ->
    strictEqual website._removeLoadingCover(), website
test '_handleStartUpEffects', ->
    strictEqual website._handleStartUpEffects(), website
test '_addNavigationEvents', ->
    strictEqual website._addNavigationEvents(), website
test '_handleScrollToTopButton', ->
    strictEqual website._handleScrollToTopButton(), website
test '_scrollToTop', -> strictEqual website._scrollToTop(), website
test '_handleAnalytics', ->
    strictEqual website._handleAnalytics(), website
## # endregion
## endregion
# endregion
# region vim modline
# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:
# endregion
