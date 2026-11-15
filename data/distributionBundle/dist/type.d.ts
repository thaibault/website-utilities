export interface DefaultOptions {
    additionalPageLoadingTimeInMilliseconds: number;
    startUpAnimationElementDelayInMilliseconds: number;
    windowLoadedTimeoutAfterDocLoadedInMSec: number;
    domain: string;
    sectionNames: {
        default: string;
        managed: Array<string>;
        unmanaged: Array<string>;
    };
    selectors: {
        windowLoadingCover: string;
        startUpAnimationClassPrefix: string;
        routerOutlet: string;
        scrollToTopButtons: string;
        scrollToTopScrollTopSettledStateClassName: string;
        scrollToTopScrollUpStateClassName: string;
        scrollToTopScrollDownStateClassName: string;
        priorityNavigationClassName: string;
        priorityNavigationOverflowOpenClassName: string;
        priorityNavigationShowOverflowIndicatorClassName: string;
        priorityNavigationOverflowResizingClassName: string;
        activeNavigationItemClassName: string;
        priorityNavigationListItemHideClassName: string;
        priorityNavigationOverflowIndicatorClassName: string;
        priorityNavigationOverflowList: string;
    };
    minimumNumberOfMenuItems: number;
    tracking: boolean;
}
export type Options = DefaultOptions;
export interface TrackingItem {
    context?: string;
    event: string;
    eventType: string;
    icon?: string;
    label: string;
    reference: string;
    subject: string;
    value?: number;
    userInteraction: boolean;
}
