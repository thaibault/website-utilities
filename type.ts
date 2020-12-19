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
    $DomNode
} from 'clientnode/type'
import {
    Options as InternationalisationOptions, Scope as BaseScope
} from 'internationalisation/type'
import {SpinnerOptions} from 'spin.js'
// endregion
// region exports
export type WebsiteUtilitiesFunction = (...parameter:Array<any>) => any
export interface Scope extends BaseScope {
    WebsiteUtilities:WebsiteUtilitiesFunction
}
declare global {
    interface JQuery extends Scope {}
    const dataLayer:Array<any>
}
export type DomNodes<Type = string> = BaseDomNodes<Type> & {
    mediaQueryIndicator:Type
    scrollToTopButton:Type
    startUpAnimationClassPrefix:Type
    top:Type
    windowLoadingCover:Type
    windowLoadingSpinner:Type
}
export type $DomNodes = DomNodes<$DomNode>
export type Options = Partial<BaseOptions> & {
    activateLanguageSupport:boolean
    additionalPageLoadingTimeInMilliseconds:number
    domain:string
    domNodes:DomNodes
    domNodeSelectorPrefix:string
    initialSectionName:string
    knownScrollEventNames:Array<string>
    language:Partial<InternationalisationOptions>
    mediaQueryClassNameIndicator:Array<Array<string>>
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
            hideAnimation:{duration:number|string}
            showAnimation:{duration:number|string}
            slideDistanceInPixel:number
        },
        inLinearTime:boolean
        options:ScrollToOptions
    },
    startUpAnimationElementDelayInMiliseconds:number
    startUpHide:FirstParameter<$DomNode['css']>
    startUpShowAnimation:Parameters<$DomNode['animate']>
    switchToManualScrollingIndicator:(event:Event) => boolean
    tracking:{
        event:(
            category:string, action:string, label:string, value?:any, data?:any
        ) => void
        initial?:null|((key:string, sectionName:string) => void)
        key?:null|string
        sectionSwitch:(sectionName:string) => void
    }
    windowLoadingCoverHideAnimation:Parameters<$DomNode['animate']>
    windowLoadingSpinner:SpinnerOptions
    windowLoadedTimeoutAfterDocumentLoadedInMilliseconds:number
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
