<!-- !/usr/bin/env markdown
-*- coding: utf-8 -*-
region header
Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

License
-------

This library written by Torben Sickert stands under a creative commons naming
3.0 unported license. See https://creativecommons.org/licenses/by/3.0/deed.de
endregion -->

Project status
--------------

[![npm](https://img.shields.io/npm/v/website-utilities?color=%23d55e5d&label=npm%20package%20version&logoColor=%23d55e5d&style=for-the-badge)](https://www.npmjs.com/package/website-utilities)
[![npm downloads](https://img.shields.io/npm/dy/website-utilities.svg?style=for-the-badge)](https://www.npmjs.com/package/website-utilities)

[![build](https://img.shields.io/github/actions/workflow/status/thaibault/website-utilities/build.yaml?style=for-the-badge)](https://github.com/thaibault/website-utilities/actions/workflows/build.yaml)
[![build push package](https://img.shields.io/github/actions/workflow/status/thaibault/website-utilities/build-package-and-push.yaml?label=build%20push%20package&style=for-the-badge)](https://github.com/thaibault/website-utilities/actions/workflows/build-package-and-push.yaml)

[![check types](https://img.shields.io/github/actions/workflow/status/thaibault/website-utilities/check-types.yaml?label=check%20types&style=for-the-badge)](https://github.com/thaibault/website-utilities/actions/workflows/check-types.yaml)
[![lint](https://img.shields.io/github/actions/workflow/status/thaibault/website-utilities/lint.yaml?label=lint&style=for-the-badge)](https://github.com/thaibault/website-utilities/actions/workflows/lint.yaml)
[![test](https://img.shields.io/github/actions/workflow/status/thaibault/website-utilities/test-coverage-report.yaml?label=test&style=for-the-badge)](https://github.com/thaibault/website-utilities/actions/workflows/test-coverage-report.yaml)

[![code coverage](https://img.shields.io/coverallsCoverage/github/thaibault/website-utilities?label=code%20coverage&style=for-the-badge)](https://coveralls.io/github/thaibault/website-utilities)

[![deploy web documentation](https://img.shields.io/github/actions/workflow/status/thaibault/website-utilities/deploy-web-documentation.yaml?label=deploy%20web%20documentation&style=for-the-badge)](https://github.com/thaibault/website-utilities/actions/workflows/deploy-web-documentation.yaml)
[![web documentation](https://img.shields.io/website-up-down-green-red/https/torben.website/website-utilities.svg?label=web-documentation&style=for-the-badge)](https://torben.website/website-utilities)

<!--|deDE:Einsatzmöglichkeiten-->
Use cases
---------

<ul>
    <li>Predefined scroll events<!--deDE:Vordefinierte Scroll-Events--></li>
    <li>
        Full window loading cover which disappears when the page has been
        loaded
        <!--deDE:
            Bildschirmfüllende Ladeanzeige, die verschwindet, sobald die Seite
            geladen wurde
        -->
    </li>
    <li>
        Ordered start up animations for arbitrary dom nodes
        <!--deDE:
            Der Reihe nach ablaufende Start-Animationen für beliebige
            DOM-Knoten
        -->
    </li>
    <li>
        Hash based routing with section switching and corresponding events
        <!--deDE:
            Hash-basiertes Routing mit Sektionswechsel und zugehörigen Events
        -->
    </li>
    <li>
        Interruptible animated smooth scrolling to internal link targets
        <!--deDE:
            Unterbrechbares, animiertes und weiches Scrollen zu internen
            Linkzielen
        -->
    </li>
    <li>
        Configurable scroll to top button with scroll direction aware state
        classes
        <!--deDE:
            Konfigurierbarer "Nach-oben-scrollen"-Button mit Zustandsklassen,
            die die Scrollrichtung berücksichtigen
        -->
    </li>
    <li>
        Responsive priority navigation with automatically managed overflow menu
        <!--deDE:
            Responsive Prioritäts-Navigation mit automatisch verwaltetem
            Überlauf-Menü
        -->
    </li>
    <li>
        Navigation item highlighting of the currently visible section including
        view transition support
        <!--deDE:
            Hervorhebung des Navigationselements der aktuell sichtbaren Sektion
            inklusive Unterstützung für View-Transitions
        -->
    </li>
    <li>
        Programmatically enabling and disabling of page scrolling
        <!--deDE:
            Programmatisches Aktivieren und Deaktivieren des Seiten-Scrollens
        -->
    </li>
    <li>
        Media query mode change callbacks (extra small, small, medium and
        large)
        <!--deDE:
            Callbacks bei Wechsel des Media-Query-Modus (extra klein, klein,
            mittel und groß)
        -->
    </li>
    <li>
        Optional analytics tracking of link, button and section switch events
        via a generic data layer
        <!--deDE:
            Optionales Analyse-Tracking von Link-, Button- und
            Sektionswechsel-Events über einen generischen Data-Layer
        -->
    </li>
</ul>

<div class="wd-table-of-contents">
    <h2 id="content">Content<!--deDE:Inhalt--></h2>
    <!--wd-table-of-contents-->
</div>

<!--|deDE:Installation-->
Installation
------------

You can install via package manager, simply download the compiled version as
zip file here and inject or request via CDN in HTML:
<!--deDE:
    Sie können das Paket über den Paketmanager installieren oder einfach die
    kompilierte Version als ZIP-Datei hier herunterladen und in HTML einbinden
    oder über ein CDN abrufen:
-->
<!--frFR:
    Vous pouvez installer le paquet via le gestionnaire de paquets ou
    simplement télécharger ici la version compilée sous forme de fichier ZIP,
    puis l'intégrer dans une page HTML ou la récupérer via un CDN:
-->

```bash
npm install website-utilities
```

<!--deDE:Verwendung-->
Usage
-----

Here you can see a complete initialization example.
<!--deDE:
    Hier können Sie ein Komplettbeispiel der Initialisierung sehen.
-->
<!--frFR:
    Ici vous pouvez voir un exemple complet d'initialisation.
-->

```JavaScript
import {
    api
} from 'https://unpkg.com/website-utilities@latest/dist/bundle/index.js'

api.register()
```
