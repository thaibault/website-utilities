// -*- coding: utf-8 -*-
/** @module type */
'use strict'
/* !
    region header
    [Project page](https://torben.website/website-utilities)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {
    Options as InternationalisationOptions
} from 'internationalisation/type'
import {SpinnerOptions} from 'spin.js'

import WebsiteUtilities from './index'
// endregion
// region exports
export interface DefaultOptions {
    additionalPageLoadingTimeInMilliseconds: number
    domain: string
    domNodeSelectorInfix: null | string
    domNodeSelectorPrefix: string
    initialSectionName: string
    knownScrollEventNames: Array<string>
    language: Partial<InternationalisationOptions>
    mediaQueryClassNameIndicator: Array<Array<string>>
    name: string
    scrollToTopButtonSlideDistanceInPixel: number
    selectors: {
        mediaQueryIndicator: string

        top: string
        scrollToTopButtons: string

        startUpAnimationClassPrefix: string

        windowLoadingCover: string
        windowLoadingSpinner: string
    }
    startUpAnimationElementDelayInMilliseconds: number
    tracking: boolean
    windowLoadingSpinner: SpinnerOptions
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
