# Bowling Example

Das ist ein Repo für das Bowling-Game_2.pdf von Philipp Dörner.

## Erklärung meiner Entscheidungen

### Kurzfristig

### Barrierefreiheit

Die Art der Darstellung von score-cell ist noch nicht ganz barrierefrei.

Hier sollte noch in score-cell.html visuell versteckter Text (via CSS Klasse .cdk-visually-hidden) hinzugefügt werden.

So kann dann eine Zelle auch im Fließtext durch einen Screenreader besser verstanden werden.

Ebenso sollten einzelne score-cells zu aria-live Regionen gemacht werden, damit nach einem "Werfen" dem User direkt die Änderungen zur Score vorgelesen werden.

### Zellen für Scores einzelner Würfe in eigene Komponente auslagern

Das war der einzige noch verbliebene sich wiederholende Teil wo man schauen könnte ob das sinnvoll wäre.

#### Kein SSR/SSG

Dieses Repo wurde zunächst ohne SSR/SSG angegangen, da dies zusätzliche Zeit zum konfigurieren gekostet hätte. Soweit mein Verständnis der Aufgabe geht, liegt der Fokus mehr auf generelle Code-Strukturierung.

Da dies zeitlich schnell machbar wäre, wäre je nach Anforderung und Zukunftsausblick SSR/SSG nachziehen eine der ersten Dinge.

#### Unit Testing

Dafür war keine Zeit mehr da. Hier kommt es in meinen Augen primär auf die Unternehmensinterne Testing-Strategie an, an die sich gehalten werden sollte und was die bisherigen Strukturen sind.

Gibt es eine dedizierte QA Abteilung?

Falls ja - Primär unit-test mit Vitest schreiben, Komponenten/Services jeweils entweder mocken, oder via Material TestBed-Harness vertesten. Bei Komponenten primär die Änderungen im HTML bzw. den Harnesses überprüfen, bei Services das der nach außen sichtbare State dem entspricht was man erwarten würde.
Der primäre Wert dieser Tests liegt langfristig gegenüber Code-Migrationen die lediglich Syntax ändern, aber keine Inhalte.

Falls nein - Wie groß ist der generelle Zeitdruck auf dem Projekt / Was ist die Testkultur dazu?
Falls ausreichend Zeit vorhanden ist: Integrationstests und zusätzlich dazu unit-tests wie vorher erwähnt.
Falls nicht ausreichend Zeit vorhanden ist: Ausschließlich Integrationstests. Diese sind der wichtigere Teil.

#### Weiteres Tooling

Je nachdem was im Unternehmen verwendet wird bzw. erlaubt ist:

- Eslint + Prettier
- [Sheriff Eslint-Plugin](https://sheriff.softarc.io/docs/installation) zum kontrollieren und limitieren welcher Ordner von welchen anderen Ordnern importieren darf
- (Falls AI Nutzung im Unternehmen erlaubt und verbreitet ist): Angular-MCP aufsetzen und gemeinsame (auch IDE spezifische) configs für AI-Toolings ins Repo verschieben

### Mittelfristig/Langfristig

#### State Management

Aufgrund der limitierten Zeit der Aufgabe habe ich jetzt nicht sofort einen Service rausgeholt bzw. Ngrx eingebunden, da dies zusätzlich Zeit gekostet hätte und für den _noch_ simplen Scope der Aufgabe zu viel gewesen wäre.

Je nachdem wie weitere Featurewünsche ausschauen würden wäre umbau des State Mangements auf NgRX mit Redux pattern sinnvoll, hierzu bräuchte es ein Stakeholder meeting um eine Idee zu kriegen wo die Reise hingeht.

#### Designsystem

Abhängig der Rahmenbedingungen kann man hier entweder:

- ein bestehendes einzuführen
- ein neues bauen (mit Storybook o.ä.) auf Basis existierender Designtokens
- ein neues bauen (mit Storybook o.ä.) ohne Designtokens einzuführen wenn Designtokens keinen Mehrwert liefern

#### i18n

Wäre die Art von Ding die man aufsetzt sofern von Produkt klar vorgegeben ist das man die Applikation Mehrsprachig anbieten will und den damit verbundenen Aufwand eingehen möchte.

Hier auch im idealfall an bestehende Übersetzungs-Mechanismen anknüpfen.
Per default würde ich zu Transloco neigen, falls man Übersetzungen zu Compile-Zeit haben möchte wäre die alternative angular-i18n.
