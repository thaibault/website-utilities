# region vim modline

# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:

# endregion

# region header

# Copyright Torben Sickert 16.12.2012

# License
#    This library written by Torben Sickert stand under a creative commons
#    naming 3.0 unported license.
#    see http://creativecommons.org/licenses/by/3.0/deed.de

module 'Website'

# endregion

# region tests

    # region public methods

        # region special

test 'initialize', ->

        # endregion

    # endregion

    # region protected methods

        # region event

test '_onViewportMovesToTop', ->
test '_onViewportMovesAwayFromTop', ->
test '_onChangeMediaQueryMode', ->
test '_onChangeToLargeMode', ->
test '_onChangeToMediumMode', ->
test '_onChangeToSmallMode', ->
test '_onChangeToExtraSmallMode', ->
test '_onSwitchSection', ->
test '_onStartUpAnimationComplete', ->

        # endregion

        # region helper

test '_addMediaQueryChangeEvents', ->
test '_triggerWindowResizeEvents', ->
test '_bindScrollEvents', ->
test '_removeLoadingCover', ->
test '_handleStartUpEffects', ->
test '_addNavigationEvents', ->
test '_handleScrollToTopButton', ->
test '_scrollToTop', ->
test '_handleGoogleAnalytics', ->

        # endregion

    # endregion

# endregion
