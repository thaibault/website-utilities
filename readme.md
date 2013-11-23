<!-- region modline

vim: set tabstop=4 shiftwidth=4 expandtab:
vim: foldmethod=marker foldmarker=region,endregion:

endregion

region header

Copyright Torben Sickert 16.12.2012

License
   This library written by Torben Sickert stand under a creative commons
   naming 3.0 unported license.
   see http://creativecommons.org/licenses/by/3.0/deed.de

endregion -->

Use case<!--deDE:Einsatz--><!--frFR:Utilisier-->
------------------------------------------------

This plugin provides reusable web application features, like:
<!--deDE:
    Diese Pluhin bietet eine Reihe von wiederverwendbaren
    Webanwendungs-Features:
-->

*   Predefined scroll events
    <!--deDE:Vordefinierte Scroll-Events-->
*   Client side internationalization support
    <!--deDE:Klientseitiger Internationalisierungs-Support-->
*   Viewport is on top position detection
    <!--deDE:
        Erkennung wenn der sichbare Bereich der Website am obigen Rand ist und
        setzten entsprechender Events
    -->
*   Triggering media-query change events
    <!--deDE:
        Auslösen von definierten Events wenn media-querys im responsive Design
        gewechselt werden.
    -->
*   Handling page load animation
    <!--deDE:
        Ermöglichen von Animationen während die Webanwendung im Hintergrund
        geladen wird.
    -->
*   Section switching transitions
    <!--deDE:Animationen zum Übergang einzelner Sektionen-->
*   Simple section detection via url hashes
    <!--deDE:Erkennung der aktuellen Sektion anhand url Hashes-->

Usage<!--deDE:Verwendung-->
---------------------------

Here you can see all available plugin options:
<!--deDE:
    Hier werden alle möglichen Optionen die beim Initialisieren des Plugins
    gesetzt werden können angegeben:
-->

    #!/usr/bin/env javaScript

    $.Website({
        logging: false,
        domNodeSelectorPrefix: 'body.{1}',
        onViewportMovesToTop: $.noop(),
        onViewportMovesAwayFromTop: $.noop(),
        onChangeToDesktopMode: $.noop(),
        onChangeToTabletMode: $.noop(),
        onChangeToSmartphoneMode: $.noop(),
        onChangeMediaQueryMode: $.noop(),
        onSwitchSection: $.noop(),
        onStartUpAnimationComplete: $.noop(),
        additionalPageLoadingTimeInMilliseconds: 0,
        googleTrackingCode: 'UA-0-0',
        mediaQueryCssIndicator: {
            extraSmall: 'xs', small: 'sm', medium: 'md', large: 'lg'
        },
        domNode: {
            top: 'div.navigation-bar',
            scrollToTopButtons: 'a[href="#top"]',
            startUpAnimationClassPrefix: '.start-up-animation-number-',
            windowLoadingCover: '> div.window-loading-cover',
            windowLoadingSpinner: '> div.window-loading-cover > div'
        },
        startUpFadeInOptions: {
            easing: 'swing',
            duration: 'slow'
        },
        windowLoadingCoverFadeOutOptions: {
            easing: 'swing',
            duration: 'slow'
        },
        startUpAnimationElementDelayInMiliseconds: 100,
        windowLoadingSpinnerOptions: {
            lines: 9, # The number of lines to draw
            length: 23, # The length of each line
            width: 11, # The line thickness
            radius: 40, # The radius of the inner circle
            corners: 1, # Corner roundness (0..1)
            rotate: 75, # The rotation offset
            color: '#000', # #rgb or #rrggbb
            speed: 1.1, # Rounds per second
            trail: 58, # Afterglow percentage
            shadow: false, # Whether to render a shadow
            hwaccel: false, # Whether to use hardware acceleration
            className: 'spinner', # CSS class to assign to the spinner
            zIndex: 2e9, # The z-index (defaults to 2000000000)
            top: 'auto', # Top position relative to parent in px
            left: 'auto' # Left position relative to parent in px
        },
        activateLanguageSupport: true,
        language: {},
        scrollInLinearTime: false,
        scrollToTop: duration: 'slow'
    });
