import type { Mapping } from 'clientnode';
import type { WebComponentAPI } from 'web-component-wrapper/type';
import type { DefaultOptions, Options, TrackingItem } from './type';
import { Logger } from 'clientnode';
import { Web } from 'web-component-wrapper/Web';
export declare const log: Logger;
/**
 * This plugin holds common methods to extend a whole website.
 * @property _defaultOptions - Options extended by the options given to the
 * initializer method.
 * @property _defaultOptions.additionalPageLoadingTimeInMilliseconds -
 * Additional time to wait until page will be indicated as loaded.
 * @property _defaultOptions.selectors - Mapping of dom node descriptions to
 * their corresponding selectors.
 * @property _defaultOptions.selectors.scrollToTopButtons - Selectors for
 * starting an animated scroll to top.
 * @property _defaultOptions.selectors.startUpAnimationClassPrefix - Class name
 * selector prefix for all dom nodes to appear during startup animations.
 * @property _defaultOptions.selectors.windowLoadingCover - Selector to the full
 * window loading cover dom node.
 * @property _defaultOptions.startUpAnimationElementDelayInMilliseconds - Delay
 * between two startup animated dom nodes in order.
 * @property _defaultOptions.tracking - Indicates whether tracking should be
 * used or not.
 * @property _defaultOptions.windowLoadedTimeoutAfterDocLoadedInMSec - Duration
 * after loading cover should be removed.
 * @property options - Finally configured given options.
 * @property currentSectionName - Saves current section hash name.
 * @property startUpAnimationIsComplete - Indicates whether startup animations
 * have finished.
 * @property viewportIsOnTop - Indicates whether current viewport is on top.
 * @property windowLoaded - Indicates whether the window is already loaded.
 * @property onStartUpAnimationComplete - Callback to trigger if all startup
 * animations have finished.
 * @property onViewportMovesAwayFromTop - Callback to trigger when viewport
 * moves away from top.
 * @property onViewportMovesToTop - Callback to trigger when viewport arrives
 * at top.
 * @property onButtonClick - Function to call on button click events.
 * @property onLinkClick - Function to call on link click events.
 * @property onSectionSwitch - Function to call on section switches.
 * @property onTrack - Tracker call itself.
 */
export declare class WebsiteUtilities<TElement = HTMLElement, ExternalProperties extends Mapping<unknown> = Mapping<unknown>, InternalProperties extends Mapping<unknown> = Mapping<unknown>> extends Web<TElement, ExternalProperties, InternalProperties> {
    static _name: string;
    static _defaultOptions: DefaultOptions;
    readonly self: typeof WebsiteUtilities;
    options: Options;
    onStartUpAnimationComplete: (this: WebsiteUtilities) => void;
    onViewportMovesAwayFromTop: (this: WebsiteUtilities, event?: Event) => void;
    onViewportMovesToTop: (this: WebsiteUtilities, event?: Event) => void;
    onUnfocusResponsiveMenu: (this: WebsiteUtilities, event: Event, clickWasInMenu: boolean) => boolean | undefined;
    onLoaded: () => void;
    onButtonClick: (this: WebsiteUtilities, _event: Event) => Promise<false | undefined>;
    onSectionSwitch: (this: WebsiteUtilities, _sectionName: string, _oldSectionName: string, _event?: Event) => Promise<false | undefined>;
    onLinkClick: (this: WebsiteUtilities, _event: Event) => Promise<false | undefined>;
    onTrack: (this: WebsiteUtilities, _item: TrackingItem) => Promise<false | undefined>;
    currentSectionName: string;
    startUpAnimationIsComplete: boolean;
    viewportIsOnTop: boolean | undefined;
    observerDeregisters: Array<() => void>;
    static windowLoaded: boolean;
    private static switchSectionLock;
    windowLoadingCoverDomNode: HTMLElement | null;
    priorityNavigationDomNodes: NodeListOf<HTMLElement> | null;
    routerOutletDomNode: HTMLElement | null;
    sectionDomNodes: {
        default?: HTMLElement;
    } & Mapping<HTMLElement>;
    scrollToTopButtonDomNodes: NodeListOf<HTMLElement> | null;
    /**
     * Defines dynamic getter and setter interface and resolves the
     * configuration object. Initializes the map implementation.
     */
    constructor();
    /**
     * Triggered when ever a given attribute has changed and triggers to update
     * configured dom content.
     * @param name - Attribute name which was updates.
     * @param newValue - New updated value.
     * @returns Promise resolving when attribute has been updated.
     */
    onUpdateAttribute(name: string, newValue: string): Promise<void>;
    /**
     * Updates controlled dom elements.
     * @param reason - Why an update has been triggered.
     * @param resolveRendering - Indicates whether rendering should be resolved
     * finally. Should be set to "false" via super calls in inherited render
     * methods which do further dom manipulations afterward and resolve the
     * rendering process by their own.
     * @returns A promise resolving when rendering has finished. A promise may
     * be needed for classes inheriting from this class.
     */
    render(reason?: string, resolveRendering?: boolean): Promise<void>;
    /**
     * Should free up memory listeners related to deprecated HTML.
     * @param reason - Description why rendering is necessary.
     * @param reRenderReason - Description why a re-rendering is necessary.
     */
    unRender(reason?: string, reRenderReason?: string): void;
    grabDomNodes(): void;
    /**
     * This method disables scrolling on the given web view.
     */
    disableScrolling(): void;
    /**
     * This method disables scrolling on the given web view.
     */
    enableScrolling(): void;
    /**
     * Triggers an analytics event. All given arguments are forwarded to
     * configured analytics event code to define to their environment
     * variables.
     * @param properties - Event tracking information.
     */
    track(properties: Omit<TrackingItem, 'context' | 'value'> & {
        context?: string;
        value?: number;
    }): Promise<void>;
    initializePriorityNavigation(): void;
    addMenuHighlighterViewTransition(): void;
    activateNavigationItemHighlighters(sectionName: string): void;
    triggerNavigationItemHighlighterSwitching(sectionName: string): void;
    _onButtonClick(event: Event): Promise<void>;
    _onSectionSwitch(sectionName: string, oldSectionName: string, event?: Event): Promise<void>;
    _onLinkClick(event: Event): Promise<void>;
    _onTrack(item: TrackingItem): Promise<void>;
    /**
     * This method triggers if the viewport moves to the top.
     */
    _onViewportMovesToTop(): void;
    /**
     * This method triggers if the viewport moves away from the top.
     */
    _onViewportMovesAwayFromTop(): Promise<void>;
    /**
     * This method triggers if we change the current section.
     * @param sectionName - Contains the new section name.
     * @param event - Optional event that triggered the switch.
     * @returns Promise resolving when the section switch has been finished.
     */
    switchSection(sectionName: string, event?: Event): Promise<void>;
    /**
     * Extends given options by default options.
     */
    _extendOptions(): void;
    /**
     * Switches to the section referenced by the current location hash if it
     * differs from the current section. Hash changes are ignored until start
     * up animations are complete, so this catches up on them.
     * @returns Promise resolving when a potential section switch has been
     * finished.
     */
    _switchToLocationSection(): Promise<void>;
    /**
     * Handle section switches.
     * @returns Promise resolving when routing initialization has been
     * finished.
     */
    _initializeRouting(): Promise<void>;
    /**
     * Removes class names from scroll-to-top buttons to stop running
     * transitions.
     */
    _finishScrollToTopButtonTransition(): void;
    /**
     * This method triggers if the view port arrives at special areas.
     */
    _bindScrollEvents(): void;
    /**
     * This method triggers after the window is loaded.
     * @returns Promise resolving to nothing when loading cover has been
     * removed.
     */
    _removeLoadingCover(): Promise<void>;
    /**
     * This method handles the given startup effect step.
     * @returns Promise resolving to nothing when startup effects have been
     * finished.
     */
    _performStartUpEffects(): Promise<void>;
    /**
     * This method adds triggers to switch the section.
     */
    _bindNavigationEvents(): void;
    /**
     * Adds trigger to scroll top buttons.
     */
    _bindScrollToTopButton(): void;
    /**
     * Executes the page tracking code.
     */
    _bindClickTracking(): void;
}
export declare const api: WebComponentAPI<HTMLElement, Mapping<unknown>, Mapping<unknown>, typeof Web>;
export default WebsiteUtilities;
