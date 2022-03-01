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
    DomNodes as BaseDomNodes,
    FirstParameter,
    Mapping,
    Options as BaseOptions,
    ProcedureFunction,
    $TStatic,
    $T
} from 'clientnode/type'
import {
    Options as InternationalisationOptions
} from 'internationalisation/type'
import {SpinnerOptions} from 'spin.js'

import WebsiteUtilities from './index'
// endregion
// region exports
export type WebsiteUtilitiesFunction =
    ((..._parameters:Array<unknown>) => any) &
    {class:typeof WebsiteUtilities}
declare global {
    interface JQueryStatic {
        WebsiteUtilities:WebsiteUtilitiesFunction
    }

    const dataLayer:Array<unknown>
}

export type DomNodes<Type = string> = BaseDomNodes<Type> & {
    mediaQueryIndicator:Type
    scrollToTopButton:Type
    startUpAnimationClassPrefix:Type
    top:Type
    windowLoadingCover:Type
    windowLoadingSpinner:Type
}

export interface DefaultOptions {
    activateLanguageSupport:boolean
    additionalPageLoadingTimeInMilliseconds:number
    domain:string
    domNodes:DomNodes
    domNodeSelectorPrefix:string
    initialSectionName:string
    knownScrollEventNames:Array<string>
    language:Partial<InternationalisationOptions>
    mediaQueryClassNameIndicator:Array<Array<string>>
    name:string
    onChangeMediaQueryMode:ProcedureFunction
    onChangeToExtraSmallMode:ProcedureFunction
    onChangeToLargeMode:ProcedureFunction
    onChangeToMediumMode:ProcedureFunction
    onChangeToSmallMode:ProcedureFunction
    onStartUpAnimationComplete:ProcedureFunction
    onSwitchSection:ProcedureFunction
    onViewportMovesAwayFromTop:ProcedureFunction
    onViewportMovesToTop:ProcedureFunction
    scrollToTop:{
        button:{
            hideAnimationOptions:JQuery.EffectsOptions<HTMLElement>
            showAnimationOptions:JQuery.EffectsOptions<HTMLElement>
            slideDistanceInPixel:number
        },
        options:JQuery.EffectsOptions<HTMLElement>
    },
    startUpAnimationElementDelayInMiliseconds:number
    /*
        NOTE: We cannot use type helper "Parameters" (or "FirstParameter" which
        is based on "Parameters") since this grabs always last (often wrong)
        overloaded signature.
    */
    startUpHide:Mapping<number|string>
    startUpShowAnimation:FirstParameter<$T['animate']>
    switchToManualScrollingIndicator:(event:JQuery.Event) => boolean
    tracking?:{
        buttonClick?:(
            this:WebsiteUtilities,
            $link:$T<HTMLButtonElement>,
            event:JQuery.Event
        ) => void
        linkClick?:(
            this:WebsiteUtilities,
            $link:$T<HTMLLinkElement>,
            event:JQuery.Event
        ) => void
        sectionSwitch?:(this:WebsiteUtilities, sectionName:string) => void
        track:(item:TrackingItem) => void
    }
    windowLoadingCoverHideAnimation:FirstParameter<$T['animate']>
    windowLoadingSpinner:SpinnerOptions
    windowLoadedTimeoutAfterDocumentLoadedInMilliseconds:number
}
export type Options = BaseOptions & DefaultOptions

export type TrackingItem = {
    context:string
    event:string
    eventType:string
    icon?:string
    label:string
    reference:string
    subject:string
    value:number
    userInteraction:boolean
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
