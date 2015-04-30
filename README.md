# TabAccordion

An accordion, that may change its display to tabbed content based on the screen width.

## Examples

* [examples/twitter-bootstrap.htm](https://rawgit.com/votum/tabaccordion/master/examples/twitter-bootstrap.htm)
* [examples/zurb-foundation.htm](https://rawgit.com/votum/tabaccordion/master/examples/zurb-foundation.htm)


## Old descriptions (based on a Twitter Bootstrap setup and in German)

Wir nutzen die „normalen“ Twitter Bootstrap Panels für die einzelnen Abschnitte und fügen einen Wrapper
mit der TB-Klasse `.panel-group` außen herum ein. Eine `.panel-group` ohne weitere
Angaben wird als Akkordeon dargestellt.

Die Kopfzeile und der Inhalt der einzelnen Akkordeon-/Tab-Abschnitte werden durch das TB Panel-Markup
bestimmt. So ist der `.panel-header` der klickbare Bereich zur Interaktion und der
`.panel-body` der Akkordeon-/Tab-Inhalt.

**Beispiel:**

```html
<div class="panel-group">
    <section class="panel panel-default">…</section>
    <section class="panel panel-default">…</section>
    <section class="panel panel-default">…</section>
</div>
```

### Darstellungn und Optionen

Eine `.panel-group` ohne weitere Angaben erzeugt ein Akkordeon auf allen Bildschirmgrößen
undn der erste Abschnitt wird geöffnet. Das Verhalten der `.panel-group` kann über folgende
Attribute gesteuert werden.

#### `data-panel-group-type`

Bestimmt wie das Element angezeigt wird – als Tabbed-Content oder Akkordeon.
Mögliche Werte sind:

- **`accordion`** Zeige die Inhalte in allen Fällen als Akkordeon. Das data-* Attribut kann hierbei entfallen, da dies der Standard ist.
- **`accordion-tabs`** Zeige die Inhalte auf Mobilgeräten als Akkordeon, auf Desktop als Tabbed-Content.
- **`accordion-mobile-only`** Zeige die Inhalte als normale Kacheln (Panels) an, aber lasse diese auf Mobilgeräten zu einem Akkordeon zusammen fallen. (Wie z.B. im Footer-Menü)

Es ist (gewollt) nicht möglich Tabs auf Mobilgeräten darzustellen, da diese meist zu wenig Raum in der horizontale haben. Dennoch können die obigen, im JavaScript Plugin definierten Werte, um weitere Varianten ergänzt werden.

#### `data-panel-group-all-closed`

Wenn dieses Attribut gesetzt ist gesetzt ist, wird beim laden der Seite kein Element geöffnet.
Das Attribut greift nicht bei Tab-Darstellung, da hier immer ein Element geöffnet sein muss.
Es wird kein Wert angegeben.

#### `data-panel-group-open`

Diese Option kann genutzt werden um ein bestimmten Abschnitt beim laden der Seite zu öffnen.
Der Wert ist ein Zähler, beginnend bei 1 für den ersten Abschnitt.

Die gleichzeitige Nutzung von `data-panel-group-all-closed` und
`data-panel-group-open` ist undefiniert und sollte vermieden werden.

### Beispiele

#### Beispiel #1: Nur Akkordeon

Beim ersten Beispiel ist `data-panel-group-open="2"` gesetzt, es wird also das zweite Element geöffnet.

```html
<div class="panel-group" data-panel-group-open="2">
    <section class="panel panel-default">…</section>
    <section class="panel panel-default">…</section>
    <section class="panel panel-default">…</section>
</div>
```

#### Beispiel #2: Mit Tabs ab MD-Breakpoint

Hier ist zusätzlich `data-panel-group-all-closed` gesetzt, es wird also (in der Akkordeon-Ansicht) kein Element geöffnet.

```html
<div class="panel-group" data-panel-group-type="accordion-tabs" data-panel-group-all-closed>
    <section class="panel panel-default">…</section>
    <section class="panel panel-default">…</section>
    <section class="panel panel-default">…</section>
</div>
```
