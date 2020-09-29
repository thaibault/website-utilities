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
    $DomNode, DomNodes as BaseDomNodes, Options as BaseOptions, Mapping
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
}
export type DomNodes<Type = string> = BaseDomNodes & {
    mediaQueryIndicator:Type
    scrollToTopButton:Type
    startUpAnimationClassPrefix:Type
    top:Type
    windowLoadingCover:Type
    windowLoadingSpinner:Type
}
export type $DomNodes = $DomNodes & DomNodes<$DomNode>
export type Options = Partial<BaseOptions> & {
    activateLanguageSupport:boolean
    additionalPageLoadingTimeInMilliseconds:number
    domain:string
    domNodes:DomNodes
    domNodeSelectorPrefix:string
    initialSectionName:string
    knownScrollEventNames:Array<string>
    language:InternationalisationOptions
    mediaQueryClassNameIndicator:Array<Array<string>>
    onChangeMediaQueryMode:Function
    onChangeToExtraSmallMode:Function
    onChangeToLargeMode:Function
    onChangeToMediumMode:Function
    onChangeToSmallMode:Function
    onStartUpAnimationComplete:Function
    onSwitchSection:Function
    onViewportMovesAwayFromTop:Function
    onViewportMovesToTop:Function
    scrollToTop:{
        button:{
            slideDistanceInPixel:number
            showAnimation:{duration:number|string}
            hideAnimation:{duration:number|string}
        },
        inLinearTime:boolean
        options:{duration:number|string}
    },
    startUpAnimationElementDelayInMiliseconds:number
    startUpHide:Mapping
    startUpShowAnimation:[Mapping, Mapping]
    switchToManualScrollingIndicator:(event:Event) => boolean
    tracking:{
        event:(
            category:string, action:string, label:string, value:any, data:any
        ) => void
        initial?:null|((key:string, sectionName:string) => void)
        key?:null|string
        sectionSwitch:(sectionName:string) => void
    }
    windowLoadingCoverHideAnimation:[Mapping, Mapping]
    windowLoadingSpinner:SpinnerOptions
    windowLoadedTimeoutAfterDocumentLoadedInMilliseconds:number
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
