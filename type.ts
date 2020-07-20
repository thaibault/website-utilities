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
import {ExtendableOptions as BaseOptions} from 'clientnode/type'
import {Scope as BaseScope} from 'internationalisation'
// endregion
// region exports
export type WebsiteUtilitiesFunction = (...parameter:Array<any>) => any
export interface Scope extends BaseScope {
    WebsiteUtilities:WebsiteUtilitiesFunction;
}
declare global {
    interface JQuery extends Scope {}
}
export type Options = BaseOptions & {
}
export type AnalyticsCode = {
    initial:string;
    sectionSwitch:string;
    event:string;
}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
