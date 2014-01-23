#!/usr/bin/env require
# -*- coding: utf-8 -*-

# region vim modline

# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:

# endregion

# region header

# Copyright Torben Sickert 16.12.2012

# License
# -------

# This library written by Torben Sickert stand under a creative commons naming
# 3.0 unported license. see http://creativecommons.org/licenses/by/3.0/deed.de

module 'website'

# endregion

# region tests

    # region mock-up

website = $.Website()

    # endregion

    # region public methods

        # region special

test 'initialize', -> ok website

        # endregion

    # endregion

    # region protected methods

        # region event

test '_onViewportMovesToTop', ->
    website._onViewportMovesToTop()
    # NOTE: Returns undefined because of debouncouing.
    strictEqual website._onViewportMovesToTop(), undefined
test '_onViewportMovesAwayFromTop', ->
    website._onViewportMovesAwayFromTop()
    # NOTE: Returns undefined because of debouncouing.
    strictEqual website._onViewportMovesAwayFromTop(), undefined
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

        # endregion

        # region helper

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
test '_handleGoogleAnalytics', ->
    strictEqual website._handleGoogleAnalytics(), website

        # endregion

    # endregion

# endregion
