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
    $DomNode, ExtendableOptions as BaseOptions, Mapping
} from 'clientnode/type'
import {
    Options as InternationalisationOptions, Scope as BaseScope
} from 'internationalisation/type'
import {SpinnerOptions} from 'spin.js'
// endregion
// region exports
export type WebsiteUtilitiesFunction = (...parameter:Array<any>) => any
export interface Scope extends BaseScope {
    WebsiteUtilities:WebsiteUtilitiesFunction;
}
declare global {
    interface JQuery extends Scope {}
}
export type DomNodes<Type = string> = {
    mediaQueryIndicator:Type;
    scrollToTopButton:Type;
    startUpAnimationClassPrefix:Type;
    top:Type;
    windowLoadingCover:Type;
    windowLoadingSpinner:Type;
}
export type $DomNodes = DomNodes<$DomNode>
export type Options = BaseOptions & {
    activateLanguageSupport:boolean;
    additionalPageLoadingTimeInMilliseconds:number;
    domain:string;
    domNode:DomNodes;
    domNodeSelectorPrefix:string;
    knownScrollEventNames:Array<string>;
    language:InternationalisationOptions;
    mediaQueryClassNameIndicator:Array<Array<string>>;
    onChangeMediaQueryMode:Function;
    onChangeToExtraSmallMode:Function;
    onChangeToLargeMode:Function;
    onChangeToMediumMode:Function;
    onChangeToSmallMode:Function;
    onStartUpAnimationComplete:Function;
    onSwitchSection:Function;
    onViewportMovesAwayFromTop:Function;
    onViewportMovesToTop:Function;
    scrollToTop:{
        button:{
            slideDistanceInPixel:number;
            showAnimation:{duration:number|string};
            hideAnimation:{duration:number|string};
        },
        inLinearTime:boolean;
        options:{duration:number|string};
    },
    startUpAnimationElementDelayInMiliseconds:number;
    startUpHide:Mapping;
    startUpShowAnimation:[Mapping, Mapping];
    switchToManualScrollingIndicator:(event:Event) => boolean;
    trackingCode?:null|string;
    windowLoadingCoverHideAnimation:[Mapping, Mapping];
    windowLoadingSpinner:SpinnerOptions;
    windowLoadedTimeoutAfterDocumentLoadedInMilliseconds:number;
}
export type AnalyticsCode = {
    event:string;
    initial:string;
    sectionSwitch:string;
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
