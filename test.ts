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
describe('WebsiteUtilities', ():void => {
    let websiteUtilities:WebsiteUtilities
    /*
        NOTE: Import plugin with side effects (augmenting "$" scope /
        registering plugin) when other imports are only used as type.
    */
    require('./index')
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
    test('track', ():void =>
        expect(websiteUtilities.track({
            event: 'event',
            eventType: 'eventType',
            label: 'label',
            reference: 'reference',
            subject: 'subject',
            userInteraction: false
        })).toStrictEqual(websiteUtilities)
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
    test('_onViewportMovesToTop', ():void =>
        // NOTE: Method is wrapped by the higher order debounce method.
        expect(websiteUtilities._onViewportMovesToTop())
            .toBeInstanceOf(Promise)
    )
    test('_onViewportMovesAwayFromTop', ():void =>
        // NOTE: Method is wrapped by the higher order debounce method.
        expect(websiteUtilities._onViewportMovesAwayFromTop())
            .toBeInstanceOf(Promise)
    )
    test('_onChangeMediaQueryMode', ():void =>
        expect(websiteUtilities._onChangeMediaQueryMode('old', 'new'))
            .not.toBeDefined()
    )
    test('_onChangeToLargeMode', ():void =>
        expect(websiteUtilities._onChangeToLargeMode('old', 'new'))
            .not.toBeDefined()
    )
    test('_onChangeToMediumMode', ():void =>
        expect(websiteUtilities._onChangeToMediumMode('old', 'new'))
            .not.toBeDefined()
    )
    test('_onChangeToSmallMode', ():void =>
        expect(websiteUtilities._onChangeToSmallMode('old', 'new'))
            .not.toBeDefined()
    )
    test('_onChangeToExtraSmallMode', ():void =>
        expect(websiteUtilities._onChangeToExtraSmallMode('old', 'new'))
            .not.toBeDefined()
    )
    test('_onSwitchSection', ():void =>
        expect(websiteUtilities._onSwitchSection('newSectionName'))
            .not.toBeDefined()
    )
    test('_onStartUpAnimationComplete', ():void =>
        expect(websiteUtilities._onStartUpAnimationComplete())
            .not.toBeDefined()
    )
    // // endregion
    // // region helper
    test('_bindMediaQueryChangeEvents', ():void =>
        expect(websiteUtilities._bindMediaQueryChangeEvents())
            .not.toBeDefined()
    )
    test('_triggerWindowResizeEvents', ():void =>
        expect(websiteUtilities._triggerWindowResizeEvents()).not.toBeDefined()
    )
    test('_bindScrollEvents', ():void =>
        expect(websiteUtilities._bindScrollEvents()).not.toBeDefined()
    )
    test('_removeLoadingCover', async ():Promise<void> =>
        expect(websiteUtilities._removeLoadingCover())
            .resolves.not.toBeDefined()
    )
    test('_performStartUpEffects', async ():Promise<void> =>
        expect(websiteUtilities._performStartUpEffects(10))
            .resolves.not.toBeDefined()
    )
    test('_bindNavigationEvents', ():void =>
        expect(websiteUtilities._bindNavigationEvents()).not.toBeDefined()
    )
    test('_bindScrollToTopButton', ():void =>
        expect(websiteUtilities._bindScrollToTopButton()).not.toBeDefined()
    )
    test('_bindClickTracking', ():void =>
        expect(websiteUtilities._bindClickTracking()).not.toBeDefined()
    )
    // // endregion
    // / endregion
    // endregion
})
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
