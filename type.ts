// -*- coding: utf-8 -*-
/** @module type */
'use strict'
/* !
    region header
    [Project page](https://torben.website/website-utilities)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
import {KnownEventName} from 'web-component-wrapper/type'
// region exports
export interface DefaultOptions {
    additionalPageLoadingTimeInMilliseconds: number
    domain: string
    knownScrollEventNames: Array<KnownEventName>
    mediaQueryClassNameIndicator: Array<Array<string>>

    sectionNames: {
        managed: Array<string>
        unmanaged: Array<string>
    }

    selectors: {
        windowLoadingCover: string

        startUpAnimationClassPrefix: string

        top: string

        routerOutlet: string

        scrollToTopButtons: string

        priorityNavigation: string
        priorityNavigationOverflow: string
        priorityNavigationOverflowList: string
        priorityNavigationOverflowTitle: string
    }

    startUpAnimationElementDelayInMilliseconds: number

    tracking: boolean

    windowLoadedTimeoutAfterDocLoadedInMSec: number
}
export type Options = DefaultOptions

export interface TrackingItem {
    context?: string
    event: string
    eventType: string
    icon?: string
    label: string
    reference: string
    subject: string
    value?: number
    userInteraction: boolean
}
// endregion
