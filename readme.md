<!-- !/usr/bin/env markdown
-*- coding: utf-8 -*-
region header
Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

License
-------

This library written by Torben Sickert stand under a creative commons naming
3.0 unported license. See https://creativecommons.org/licenses/by/3.0/deed.de
endregion -->

Project status
--------------

[![npm](https://img.shields.io/npm/v/website-utilities?color=%23d55e5d&label=npm%20package%20version&logoColor=%23d55e5d&style=for-the-badge)](https://www.npmjs.com/package/website-utilities)
[![npm downloads](https://img.shields.io/npm/dy/website-utilities.svg?style=for-the-badge)](https://www.npmjs.com/package/website-utilities)

[![build](https://img.shields.io/github/actions/workflow/status/thaibault/website-utilities/build.yaml?style=for-the-badge)](https://github.com/thaibault/website-utilities/actions/workflows/build.yaml)

[![check types](https://img.shields.io/github/actions/workflow/status/thaibault/website-utilities/check-types.yaml?label=check%20types&style=for-the-badge)](https://github.com/thaibault/website-utilities/actions/workflows/check-types.yaml)
[![lint](https://img.shields.io/github/actions/workflow/status/thaibault/website-utilities/lint.yaml?label=lint&style=for-the-badge)](https://github.com/thaibault/website-utilities/actions/workflows/lint.yaml)
[![test](https://img.shields.io/github/actions/workflow/status/thaibault/website-utilities/test-coverage-report.yaml?label=test&style=for-the-badge)](https://github.com/thaibault/website-utilities/actions/workflows/test-coverage-report.yaml)

[![code coverage](https://img.shields.io/coverallsCoverage/github/thaibault/website-utilities?label=code%20coverage&style=for-the-badge)](https://coveralls.io/github/thaibault/website-utilities)

[![documentation website](https://img.shields.io/website-up-down-green-red/https/torben.website/website-utilities.svg?label=documentation-website&style=for-the-badge)](https://torben.website/website-utilities)

<!--|deDE:Einsatzmöglichkeiten-->
Use cases
---------

<ul>
    <li>Predefined scroll events<!--deDE:Vordefinierte Scroll-Events--></li>
    <li>
        Client side internationalization support
        <!--deDE:Klientseitiger Internationalisierungs-Support-->
    </li>
    <li>
        Viewport is on top position detection
        <!--deDE:
            Erkennung wenn der sichbare Bereich der Website am obigen Rand ist
            und setzten entsprechender Events
        -->
    </li>
    <li>
        Triggering media-query change events
        <!--deDE:
            Auslösen von definierten Events wenn media-querys im responsive
             Design gewechselt werden.
        -->
    </li>
    <li>
        Handling page load animation
        <!--deDE:
            Ermöglichen von Animationen während die Webanwendung im Hintergrund
            geladen wird.
        -->
    </li>
    <li>
        Section switching transitions
        <!--deDE:Animationen zum Übergang einzelner Sektionen-->
    </li>
    <li>
        Simple section detection via url hashes
        <!--deDE:Erkennung der aktuellen Sektion anhand url Hashes-->
    </li>
    <li>Handle google tracking.<!--deDE:Verbindung zu google tracking.--></li>
</ul>

<!--Place for automatic generated table of contents.-->
<div class="doc-toc" style="display:none">
    <!--|deDE:Inhalt-->
    <h2 id="content">Content</h2>
</div>

<!--|deDE:Installation-->
Installation
------------

<!--|deDE:Klassische Dom-Integration-->
### Classical dom injection

You can simply download the compiled version as zip file here and inject it
after needed dependencies:
<!--deDE:
    Du kannst einfach das Plugin als Zip-Archiv herunterladen und per
    Script-Tag in deine Webseite integrieren:
-->

```HTML
<script
    src="https://code.jquery.com/jquery-3.6.0.min.js"
    integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
    crossorigin="anonymous"
></script>
<script
    src="https://torben.website/clientnode/data/distributionBundle/index.js"
></script>
<script
    src="https://torben.website/internationalisation/data/distributionBundle/index.js"
></script>
<!--Inject downloaded file:
<script src="index.js"></script>
-->
<!--Or integrate via cdn:-->
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<!--Inject downloaded file:-->
<script src="index.compiled.js"></script>
<!--Or integrate via cdn:
<script
    src="https://torben.website/website-utilities/data/distributionBundle/index.js"
></script>
-->
```

The compiled bundle supports AMD, commonjs, commonjs2 and variable injection
into given context (UMD) as export format: You can use a module bundler if you
want.
<!--deDE:
    Das kompilierte Bundle unterstützt AMD, commonjs, commonjs2 und
    Variable-Injection in den gegebenen Context (UMD) als Export-Format:
    Dadurch können verschiedene Module-Bundler genutzt werden.
-->

<!--|deDE:Paket-Management und Modul-Komposition-->
### Package managed and module bundled

If you are using npm as package manager you can simply add this tool to your
**package.json** as dependency:
<!--deDE:
    Nutzt du npm als Paket-Manager, dann solltest du einfach deine
    <strong>package.json</strong> erweitern:
-->

```JSON
...
"dependencies": {
    ...
    "website-utilities": "latest",
    ...
},
...
```

After updating your packages you can simply depend on this script and let
a module bundler do the hard stuff or access it via an exported variable name
in given context.
<!--deDE:
    Nach einem Update deiner Pakete kannst du dieses Plugin einfach in deine
    JavaScript-Module importieren oder die exportierte Variable im gegebenen
    Context referenzieren.
-->

```JavaScript
...
$ = require('website-utilities')
...
$.Website().isEquivalentDom('<div>', '<script>') // false
...

...
import Website from 'website-utilities'
class SpecialWebsite extends Website...
Website({options..})
// or
import {$} from 'website-utilities'
$.Website().isEquivalentDom('<div>', '<script>') // false
class SpecialWebsite extends $.Website.class ...
// or
Website = require('website-utilities').default
value instanceof Website
// or
$ = require('website-utilities').$
$.Website()
...
```

<!--deDE:Verwendung-->
Usage
-----

Here you can see the initialisation with all available plugin options:
<!--deDE:
    Hier werden alle möglichen Optionen die beim Initialisieren des Plugins
    gesetzt werden können angegeben:
-->

```HTML
<script
    src="https://code.jquery.com/jquery-3.6.0.min.js"
    integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
    crossorigin="anonymous"
></script>
<script
    src="https://torben.website/clientnode/data/distributionBundle/index.js"
></script>
<script
    src="https://torben.website/internationalisation/data/distributionBundle/index.js"
></script>
<!--Inject downloaded file:
<script src="index.js"></script>
-->
<!--Or integrate via cdn:-->
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<!--Inject downloaded file:-->
<script src="index.compiled.js"></script>
<!--Or integrate via cdn:
<script
    src="https://torben.website/website-utilities/data/distributionBundle/index.js"
></script>

<script>
    $(($) => $.Website({
        activateLanguageSupport: true,
        additionalPageLoadingTimeInMilliseconds: 0,
        domain: 'auto',
        domNode: {
            mediaQueryIndicator: '<div class="media-query-indicator">',
            top: '> div.navbar-wrapper',
            scrollToTopButton: 'a[href="#top"]',
            startUpAnimationClassPrefix:
                '.website-start-up-animation-number-',
            windowLoadingCover: 'div.website-window-loading-cover',
            windowLoadingSpinner: 'div.website-window-loading-cover > div'
        },
        domNodeSelectorPrefix: 'body.{1}',
        knownScrollEventNames:
            'scroll mousedown wheel DOMMouseScroll mousewheel keyup ' +
            'touchmove',
        language: {},
        mediaQueryClassNameIndicator: [
            ['extraSmall', 'xs'], ['small', 'sm'], ['medium', 'md'],
            ['large', 'lg']
        ],
        onViewportMovesToTop: $.noop(),
        onViewportMovesAwayFromTop: $.noop(),
        onChangeToLargeMode: $.noop(),
        onChangeToMediumMode: $.noop(),
        onChangeToSmallMode: $.noop(),
        onChangeToExtraSmallMode: $.noop(),
        onChangeMediaQueryMode: $.noop(),
        onSwitchSection: $.noop(),
        onStartUpAnimationComplete: $.noop(),
        startUpAnimationElementDelayInMilliseconds: 100,
        startUpShowAnimation: [{opacity: 1}, {}],
        startUpHide: {opacity: 0},
        switchToManualScrollingIndicator: (event:Object):boolean => (
            event.which > 0 || event.type === 'mousedown' ||
            event.type === 'mousewheel' || event.type === 'touchmove'),
        scrollToTop: {
            inLinearTime: true,
            options: {duration: 'normal'},
            button: {
                slideDistanceInPixel: 30,
                showAnimation: {duration: 'normal'},
                hideAnimation: {duration: 'normal'}
            }
        },
        trackingCode: null,
        windowLoadingCoverHideAnimation: [{opacity: 0}, {}],
        windowLoadingSpinner: {
            lines: 9, // The number of lines to draw
            length: 23, // The length of each line
            width: 11, // The line thickness
            radius: 40, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 75, // The rotation offset
            color: '#000', // #rgb or #rrggbb
            speed: 1.1, // Rounds per second
            trail: 58, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        },
        windowLoadedTimeoutAfterDocumentLoadedInMilliseconds: 3000
    }))
</script>
```
