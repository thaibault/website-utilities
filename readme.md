<!-- !/usr/bin/env markdown
-*- coding: utf-8 -*-
region header
Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

License
-------

This library written by Torben Sickert stands under a creative commons naming
4.0 international license.
See https://creativecommons.org/licenses/by/4.0/deed.de
endregion -->

<!--|deDE:Projektstatus-->
<!--|frFR:Statut du projet-->
Project Status
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
[![web documentation](https://img.shields.io/website-up-down-green-red/https/tsickert.com/website-utilities.svg?label=web-documentation&style=for-the-badge)](https://tsickert.com/website-utilities)

<!--|deDE:Einsatzmöglichkeiten-->
<!--|frFR:Cas d'utilisation-->
Use case
--------

Building blocks for single page websites as a web component: wrap your page
into "website-utilities" and get a loading cover, start-up animations, hash
based navigation between sections, a scroll to top button, a navigation which
moves overflowing items into a menu and optional tracking. Base styles with
theme variables and the Open Sans fonts are included.
<!--deDE:
    Bausteine für Single-Page-Webseiten als Web Component: Umschließen Sie
    Ihre Seite mit "website-utilities" und erhalten Sie eine Ladeanzeige,
    Start-Animationen, hashbasierte Navigation zwischen Sektionen, einen
    "Nach oben"-Button, eine Navigation, die überzählige Einträge in ein Menü
    verschiebt, und optionales Tracking. Basis-Styles mit Theme-Variablen und
    die Schriften Open Sans sind enthalten.
-->
<!--frFR:
    Des briques pour sites web d'une seule page sous forme de web component:
    englobez votre page dans "website-utilities" et obtenez un écran de
    chargement, des animations de démarrage, une navigation par hash entre
    sections, un bouton de retour en haut, une navigation qui déplace les
    éléments en trop dans un menu et un suivi optionnel. Des styles de base
    avec variables de thème et les polices Open Sans sont inclus.
-->

<div class="wd-table-of-contents">
    <h2 id="content">Content<!--deDE:Inhalt--><!--frFR:Contenu--></h2>
    <!--wd-table-of-contents-->
</div>

<!--|deDE:Schnellstart-->
<!--|frFR:Démarrage rapide-->
Quick start
-----------

```bash
npm install website-utilities clientnode core-js web-component-wrapper
```

```JavaScript
import {api} from 'website-utilities'
import 'website-utilities/dist/fonts.css'
import 'website-utilities/dist/index.css'

api.register()
```

Without a package manager load the bundle, which contains all dependencies,
together with its styles. With npm it is available as
"website-utilities/bundle":
<!--deDE:
    Ohne Paketmanager laden Sie das Bundle, das alle Abhängigkeiten enthält,
    zusammen mit seinen Styles. Mit npm ist es als
    "website-utilities/bundle" verfügbar:
-->
<!--frFR:
    Sans gestionnaire de paquets, chargez le bundle, qui contient toutes les
    dépendances, avec ses styles. Avec npm, il est disponible sous
    "website-utilities/bundle":
-->

```HTML
<link
    href="https://unpkg.com/website-utilities@latest/dist/bundle/fonts.css"
    rel="stylesheet"
/>
<link
    href="https://unpkg.com/website-utilities@latest/dist/bundle/index.css"
    rel="stylesheet"
/>
<script type="module">
    import {
        api
    } from 'https://unpkg.com/website-utilities@latest/dist/bundle/index.js'

    api.register()
</script>
```

Then wrap your page:
<!--deDE:Umschließen Sie dann Ihre Seite:-->
<!--frFR:Englobez ensuite votre page:-->

```HTML
<div class="wu-window-loading-cover">Loading…</div>

<website-utilities
    class="wu"
    options="{sectionNames: {managed: ['about']}}"
>
    <header>
        <a href="#">Home</a>
        <a href="#about">About</a>
    </header>

    <main class="wu-router-outlet">
        <section data-website-utilities-section>
            <h1 class="wu-start-up-animation-number-1">Welcome</h1>
            <p class="wu-start-up-animation-number-2">Nice to see you.</p>
        </section>
        <section data-website-utilities-section="about">About us</section>
    </main>

    <a class="wu-scroll-to-top" href="#top">Top</a>
</website-utilities>
```

<!--|deDE:Sektionen-->
<!--|frFR:Sections-->
Sections
--------

The children of ".wu-router-outlet" are sections. The one with an empty
"data-website-utilities-section" attribute is the default, the others are
named. Names listed in "sectionNames.managed" are shown when the location
hash matches, e.g. "#about", the active one gets the class
"wu-section-active" and all others "wu-section-inactive" (hidden by the
included styles). Switches fade the sections and scroll back to top.
<!--deDE:
    Die Kinder von ".wu-router-outlet" sind Sektionen. Die mit leerem
    Attribut "data-website-utilities-section" ist die Standardsektion, die
    anderen sind benannt. In "sectionNames.managed" aufgeführte Namen werden
    angezeigt, wenn der Hash der Adresse passt, z. B. "#about", die aktive
    erhält die Klasse "wu-section-active" und alle anderen
    "wu-section-inactive" (durch die enthaltenen Styles ausgeblendet). Beim
    Wechsel werden die Sektionen überblendet und es wird nach oben gescrollt.
-->
<!--frFR:
    Les enfants de ".wu-router-outlet" sont des sections. Celle dont
    l'attribut "data-website-utilities-section" est vide est la section par
    défaut, les autres sont nommées. Les noms listés dans
    "sectionNames.managed" s'affichent lorsque le hash de l'adresse
    correspond, par exemple "#about", la section active reçoit la classe
    "wu-section-active" et toutes les autres "wu-section-inactive" (masquées
    par les styles inclus). Les changements effectuent un fondu des sections
    et remontent en haut de la page.
-->

Names in "sectionNames.unmanaged" are known hashes without own section, e.g.
anchors inside a page. Switching between them neither fades nor scrolls.
Navigation links to the current section get the class
"wu-priority-navigation__link--active".
<!--deDE:
    Namen in "sectionNames.unmanaged" sind bekannte Hashes ohne eigene
    Sektion, z. B. Anker innerhalb einer Seite. Ein Wechsel zwischen ihnen
    blendet weder über noch scrollt er. Navigationslinks zur aktuellen
    Sektion erhalten die Klasse "wu-priority-navigation__link--active".
-->
<!--frFR:
    Les noms dans "sectionNames.unmanaged" sont des hashs connus sans section
    propre, par exemple des ancres dans une page. Passer de l'un à l'autre ne
    provoque ni fondu ni défilement. Les liens de navigation vers la section
    courante reçoivent la classe "wu-priority-navigation__link--active".
-->

<!--|deDE:Laden und Start-Animationen-->
<!--|frFR:Chargement et animations de démarrage-->
Loading and start-up animations
-------------------------------

".wu-window-loading-cover" covers the page until it has been loaded and then
fades out. Afterwards elements with the classes
"wu-start-up-animation-number-1", "wu-start-up-animation-number-2" and so on
fade in one after another. Scrolling is disabled until the cover is gone.
<!--deDE:
    ".wu-window-loading-cover" verdeckt die Seite, bis sie geladen ist, und
    wird dann ausgeblendet. Danach werden Elemente mit den Klassen
    "wu-start-up-animation-number-1", "wu-start-up-animation-number-2" usw.
    nacheinander eingeblendet. Scrollen ist deaktiviert, bis die Ladeanzeige
    verschwunden ist.
-->
<!--frFR:
    ".wu-window-loading-cover" couvre la page jusqu'à son chargement puis
    disparaît en fondu. Ensuite, les éléments portant les classes
    "wu-start-up-animation-number-1", "wu-start-up-animation-number-2" et
    ainsi de suite apparaissent l'un après l'autre. Le défilement est
    désactivé jusqu'à la disparition de l'écran de chargement.
-->

<!--|deDE:Navigation-->
<!--|frFR:Navigation-->
Navigation
----------

- ".wu-scroll-to-top": Scrolls smoothly to the top on click. It gets the
  class "wu-scroll-down" when the page leaves the top, "wu-scroll-up" when
  it returns and "wu-top-settled" once it is back at the top.<!--deDE:".wu-scroll-to-top": Scrollt beim Klick sanft nach oben. Es erhält die Klasse "wu-scroll-down", wenn die Seite den oberen Rand verlässt, "wu-scroll-up", wenn sie zurückkehrt, und "wu-top-settled", sobald sie wieder oben ist.--><!--frFR:".wu-scroll-to-top": Remonte en douceur en haut lors d'un clic. Il reçoit la classe "wu-scroll-down" lorsque la page quitte le haut, "wu-scroll-up" lorsqu'elle y revient et "wu-top-settled" une fois revenue en haut.-->
- ".wu-priority-navigation": A navigation which moves items that do not fit
  into an overflow menu. It contains a ".wu-priority-navigation__list" of
  links with the class "wu-priority-navigation__link", ending with an item
  ".wu-priority-navigation__list__overflow-indicator", followed by an empty
  ".wu-priority-navigation__overflow-list".<!--deDE:".wu-priority-navigation": Eine Navigation, die Einträge, die nicht passen, in ein Überlaufmenü verschiebt. Sie enthält eine ".wu-priority-navigation__list" mit Links der Klasse "wu-priority-navigation__link", abgeschlossen von einem Eintrag ".wu-priority-navigation__list__overflow-indicator", gefolgt von einer leeren ".wu-priority-navigation__overflow-list".--><!--frFR:".wu-priority-navigation": Une navigation qui déplace les éléments qui ne tiennent pas dans un menu de débordement. Elle contient une ".wu-priority-navigation__list" de liens de classe "wu-priority-navigation__link", terminée par un élément ".wu-priority-navigation__list__overflow-indicator", suivie d'une ".wu-priority-navigation__overflow-list" vide.-->

```HTML
<nav class="wu-priority-navigation">
    <ul class="wu-priority-navigation__list">
        <li><a class="wu-priority-navigation__link" href="#">Home</a></li>
        <li>
            <a class="wu-priority-navigation__link" href="#about">About</a>
        </li>
        <li class="wu-priority-navigation__list__overflow-indicator">
            <div
                class="wu-priority-navigation__list__overflow-indicator__title"
            >
                <div
                    class="wu-priority-navigation__list__overflow-indicator__title__icon"
                ></div>
            </div>
        </li>
    </ul>
    <ul class="wu-priority-navigation__overflow-list"></ul>
</nav>
```

<!--|deDE:Konfiguration-->
<!--|frFR:Configuration-->
Configuration
-------------

Pass options as JavaScript object in the "options" attribute:
<!--deDE:Übergeben Sie Optionen als JavaScript-Objekt im Attribut "options":-->
<!--frFR:
    Passez les options sous forme d'objet JavaScript dans l'attribut
    "options":
-->

- "sectionNames": "default", "managed" and "unmanaged" section names.<!--deDE:"sectionNames": Die Sektionsnamen "default", "managed" und "unmanaged".--><!--frFR:"sectionNames": Les noms de section "default", "managed" et "unmanaged".-->
- "additionalPageLoadingTimeInMilliseconds": Keeps the loading cover longer.<!--deDE:"additionalPageLoadingTimeInMilliseconds": Hält die Ladeanzeige länger.--><!--frFR:"additionalPageLoadingTimeInMilliseconds": Garde l'écran de chargement plus longtemps.-->
- "startUpAnimationElementDelayInMilliseconds": Delay between start-up
  animation steps, 100 by default.<!--deDE:"startUpAnimationElementDelayInMilliseconds": Verzögerung zwischen den Schritten der Start-Animation, standardmäßig 100.--><!--frFR:"startUpAnimationElementDelayInMilliseconds": Délai entre les étapes de l'animation de démarrage, 100 par défaut.-->
- "windowLoadedTimeoutAfterDocLoadedInMSec": Removes the cover at the latest
  this long after the document is ready, 2000 by default.<!--deDE:"windowLoadedTimeoutAfterDocLoadedInMSec": Entfernt die Ladeanzeige spätestens so lange, nachdem das Dokument bereit ist, standardmäßig 2000.--><!--frFR:"windowLoadedTimeoutAfterDocLoadedInMSec": Retire l'écran de chargement au plus tard ce délai après que le document est prêt, 2000 par défaut.-->
- "minimumNumberOfMenuItems": Items always kept in the priority navigation,
  3 by default.<!--deDE:"minimumNumberOfMenuItems": Einträge, die immer in der Prioritätsnavigation bleiben, standardmäßig 3.--><!--frFR:"minimumNumberOfMenuItems": Éléments toujours conservés dans la navigation prioritaire, 3 par défaut.-->
- "selectors": Alternative selectors and class names for all elements
  above.<!--deDE:"selectors": Alternative Selektoren und Klassennamen für alle obigen Elemente.--><!--frFR:"selectors": Sélecteurs et noms de classe alternatifs pour tous les éléments ci-dessus.-->
- "tracking": Enables tracking, see below.<!--deDE:"tracking": Aktiviert das Tracking, siehe unten.--><!--frFR:"tracking": Active le suivi, voir ci-dessous.-->

<!--|deDE:Callbacks-->
<!--|frFR:Callbacks-->
### Callbacks

Set them as properties or as attributes like
"on-section-switch", where "parameters" holds the arguments:
<!--deDE:
    Setzen Sie sie als Eigenschaften oder als Attribute wie
    "on-section-switch", wobei "parameters" die Argumente enthält:
-->
<!--frFR:
    Définissez-les comme propriétés ou comme attributs comme
    "on-section-switch", où "parameters" contient les arguments:
-->

- "onSectionSwitch(sectionName, oldSectionName, event)": After a section
  switch.<!--deDE:"onSectionSwitch(sectionName, oldSectionName, event)": Nach einem Sektionswechsel.--><!--frFR:"onSectionSwitch(sectionName, oldSectionName, event)": Après un changement de section.-->
- "onLoaded" and "onStartUpAnimationComplete": When the cover is gone and
  when all start-up animations have finished.<!--deDE:"onLoaded" und "onStartUpAnimationComplete": Wenn die Ladeanzeige verschwunden ist und wenn alle Start-Animationen beendet sind.--><!--frFR:"onLoaded" et "onStartUpAnimationComplete": Lorsque l'écran de chargement a disparu et lorsque toutes les animations de démarrage sont terminées.-->
- "onViewportMovesAwayFromTop" and "onViewportMovesToTop": When the page is
  scrolled away from or back to the very top.<!--deDE:"onViewportMovesAwayFromTop" und "onViewportMovesToTop": Wenn die Seite vom oberen Rand weg- oder zu ihm zurückgescrollt wird.--><!--frFR:"onViewportMovesAwayFromTop" et "onViewportMovesToTop": Lorsque la page défile hors du haut ou y revient.-->
- "onLinkClick", "onButtonClick" and "onTrack": With tracking enabled.<!--deDE:"onLinkClick", "onButtonClick" und "onTrack": Bei aktiviertem Tracking.--><!--frFR:"onLinkClick", "onButtonClick" et "onTrack": Avec le suivi activé.-->

```HTML
<website-utilities
    on-section-switch="document.title = parameters[0] || 'Home'"
>
    ...
</website-utilities>
```

<!--|deDE:Tracking-->
<!--|frFR:Suivi-->
### Tracking

With "tracking": true, link and button clicks inside the component and
section switches are pushed as items with "event", "label", "reference" and
"subject" to "window.dataLayer", e.g. for Google Tag Manager. Returning false
from "onSectionSwitch", "onLinkClick", "onButtonClick" or "onTrack" skips the
corresponding item. "track(item)" adds own ones.
<!--deDE:
    Mit "tracking": true werden Link- und Button-Klicks innerhalb der
    Komponente sowie Sektionswechsel als Einträge mit "event", "label",
    "reference" und "subject" nach "window.dataLayer" geschrieben, z. B. für
    den Google Tag Manager. Gibt "onSectionSwitch", "onLinkClick",
    "onButtonClick" oder "onTrack" false zurück, entfällt der jeweilige
    Eintrag. "track(item)" fügt eigene hinzu.
-->
<!--frFR:
    Avec "tracking": true, les clics sur les liens et boutons dans le
    composant ainsi que les changements de section sont ajoutés comme
    éléments avec "event", "label", "reference" et "subject" à
    "window.dataLayer", par exemple pour Google Tag Manager. Retourner false
    depuis "onSectionSwitch", "onLinkClick", "onButtonClick" ou "onTrack"
    omet l'élément correspondant. "track(item)" en ajoute d'autres.
-->

<!--|deDE:Styles-->
<!--|frFR:Styles-->
Styles
------

"dist/index.css" contains the styles for all elements above and the theme as
CSS custom properties like "--wu-theme-primary", "dist/fonts.css" the Open
Sans fonts. With Sass you can configure the theme variables:
<!--deDE:
    "dist/index.css" enthält die Styles für alle obigen Elemente und das
    Theme als CSS Custom Properties wie "--wu-theme-primary",
    "dist/fonts.css" die Schriften Open Sans. Mit Sass können Sie die
    Theme-Variablen konfigurieren:
-->
<!--frFR:
    "dist/index.css" contient les styles de tous les éléments ci-dessus et le
    thème sous forme de propriétés CSS personnalisées comme
    "--wu-theme-primary", "dist/fonts.css" les polices Open Sans. Avec Sass,
    vous pouvez configurer les variables du thème:
-->

```SCSS
@use "website-utilities/src/variables" with ($theme-primary: #d55e5d);
@use "website-utilities/src/index";
```

<!--|deDE:Veröffentlichen-->
<!--|frFR:Publication-->
Deployment
----------

The command "website-utilities" publishes a built website to a GitHub Pages
repository: it pulls the repository, runs "yarn clear" and "yarn build",
replaces the repository's content (except ".git", ".github", "CNAME" and
"readme.md") with "dist" and commits and pushes the result. The repository
is expected next to the project as
"&lt;GIT_PRIVATE_AUTHOR_NAME&gt;.github.io" or at "PUBLIC_REPOSITORY_PATH"
and has to contain a "CNAME" file.
"USER_NAME_GITHUB" and "USER_EMAIL_GITHUB" set the commit author.
<!--deDE:
    Der Befehl "website-utilities" veröffentlicht eine gebaute Webseite in
    ein GitHub-Pages-Repository: Er holt den neuesten Stand des Repositorys,
    führt "yarn clear" und "yarn build" aus, ersetzt den Inhalt des
    Repositorys (außer ".git", ".github", "CNAME" und "readme.md") durch
    "dist" und committet und pusht das Ergebnis. Das Repository wird neben
    dem Projekt als "&lt;GIT_PRIVATE_AUTHOR_NAME&gt;.github.io" oder unter
    "PUBLIC_REPOSITORY_PATH" erwartet und muss eine Datei "CNAME" enthalten.
    "USER_NAME_GITHUB" und "USER_EMAIL_GITHUB" setzen den Commit-Autor.
-->
<!--frFR:
    La commande "website-utilities" publie un site web construit dans un
    dépôt GitHub Pages: elle récupère le dépôt, exécute "yarn clear" et
    "yarn build", remplace le contenu du dépôt (sauf ".git", ".github",
    "CNAME" et "readme.md") par "dist", puis commite et pousse le résultat.
    Le dépôt est attendu à côté du projet sous
    "&lt;GIT_PRIVATE_AUTHOR_NAME&gt;.github.io" ou à "PUBLIC_REPOSITORY_PATH"
    et doit contenir un fichier "CNAME". "USER_NAME_GITHUB" et
    "USER_EMAIL_GITHUB" définissent l'auteur du commit.
-->

The same is available as GitHub action. It installs the dependencies,
checks out the target repository and runs "yarn update:website", so the
website's "package.json" needs this script calling "website-utilities":
<!--deDE:
    Dasselbe gibt es als GitHub Action. Sie installiert die Abhängigkeiten,
    checkt das Ziel-Repository aus und führt "yarn update:website" aus, die
    "package.json" der Webseite braucht also dieses Skript, das
    "website-utilities" aufruft:
-->
<!--frFR:
    La même chose existe sous forme d'action GitHub. Elle installe les
    dépendances, récupère le dépôt cible et exécute "yarn update:website",
    le "package.json" du site doit donc contenir ce script appelant
    "website-utilities":
-->

```YAML
steps:
  - uses: thaibault/website-utilities@main
    with:
      pat-token: ${{ secrets.PAT_TOKEN_GITHUB }}
      repository: ${{ github.repository_owner }}/${{ github.repository_owner }}.github.io
      user_email_github: ${{ secrets.USER_EMAIL_GITHUB }}
      user_name_github: ${{ github.repository_owner }}
```

<!--|deDE:Entwicklung-->
<!--|frFR:Développement-->
Development
-----------

```bash
yarn install
yarn start
yarn test
```

"yarn start" serves a playground with all features.
<!--deDE:"yarn start" stellt eine Spielwiese mit allen Funktionen bereit.-->
<!--frFR:
    "yarn start" sert un terrain de jeu avec toutes les fonctionnalités.
-->
