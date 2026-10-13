# SchaltLab

Schaltplan-Editor für den Unterricht – Schwester zu PAP-Editor und IBD-Editor.
Läuft im Browser (eine einzige HTML-Datei) und als Desktop-Version (Electron).

## Funktionen

- Bauteile per Drag & Drop (Potentialschiene mit einstellbarer Spannung, GND-Schiene, Masse, Widerstand,
  Kondensator, Elko, Spule, Diode, LED, NPN, PNP, N-/P-MOSFET, OPV, Taster, Schalter, Anschluss)
- Mikrocontroller-Boards mit den Pins in der Anordnung der echten Platine: ESP32 PICO-KIT V1,
  Raspberry Pi Pico 2 W, ESP32-C3 Mini (Super Mini); die Beschriftung dreht beim Drehen und Spiegeln mit
- Leitungen rechtwinklig, automatische Verbindungspunkte, Bauteile drehen/spiegeln (Leitungen laufen mit)
- Eigene Bauteile zeichnen und ins Menü aufnehmen (Bauteil-Editor), Bibliotheken als Datei teilen
- Zoomen mit Mausrad, Trackpad oder iPad (zwei Finger) und Zoom-Knöpfen
- Speichern/Laden als JSON, Export als PNG, JPG und SVG
- Die komplette Bedienung steht im Programm unter „Hilfe & Bedienung“

## Web-Version

`app/index.html` ist die komplette Anwendung – auf den Webspace legen (zusammen mit `favicon.svg`,
`favicon-32.png`, `apple-touch-icon.png`) oder lokal im Browser öffnen.
Für die Desktop-Version wird dieselbe Datei verwendet; es gibt keinen zweiten Code-Stand.

## Einbettung in andere Web-Apps (`?embed=1`)

Der Editor lässt sich per iframe einbinden (z. B. im Projektmanagement-Tool) – mit demselben
Protokoll wie PAP- und IBD-Editor. Mit `?embed=1` erscheinen die Buttons „In Projekt übernehmen“ und „Schließen“.

| Richtung       | Nachricht                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| Editor -> Host | `{source:'schaltplan-editor', event:'ready'}`                                                           |
| Host -> Editor | `{target:'schaltplan-editor', action:'load', diagram:<JSON wie „Speichern“ oder null>, title, downloads:true}` |
| Editor -> Host | `{source:'schaltplan-editor', event:'save', diagram:<JSON>, svg:<SVG-Text>}`                            |
| Editor -> Host | `{source:'schaltplan-editor', event:'exit'}`                                                            |
| Editor -> Host | `{source:'schaltplan-editor', event:'download', name, mime, blob:<Blob>}`                               |

- Der Editor nimmt nur Nachrichten seines Eltern-Fensters an und schickt Diagrammdaten nur an den Origin,
  von dem `load` kam. Der Host sollte umgekehrt `event.origin` und `event.source` prüfen.
- Mit `downloads:true` übergibt der Editor Speichern/PNG/JPG/SVG per `download`-Nachricht an den Host
  (Browser blockieren Downloads im iframe oft). Der Host speichert dann selbst, Beispielcode siehe README des PAP-Editors.
- Eigene Bauteile, die in der Zeichnung vorkommen, stecken im `diagram`-JSON (`customs`).

## Desktop-Version starten (zum Entwickeln)

```
npm install
npm start
```

## Installer bauen

```
npm run dist
```

Die Pakete landen in `dist/` (Windows: Installer + portable .exe, macOS: .dmg für Intel und Apple Silicon,
Linux: AppImage + .deb). Gebaut wird immer für das System, auf dem der Befehl läuft.

## Release auf GitHub

1. Version in `package.json` erhöhen (z. B. `1.0.1`), committen.
2. Tag setzen und pushen:
   ```
   git tag v1.0.1
   git push origin v1.0.1
   ```
3. Die Action `.github/workflows/release.yml` baut für Windows, macOS und Linux und legt auf GitHub
   einen **Release-Entwurf** an. Dort Text ergänzen und „Publish release“ klicken.

Der Name des Repositorys steht in `package.json` unter `build.publish` (`juchemGDG/SchaltLab`) –
bei einem anderen Namen dort anpassen.

## Hinweise zu den Installern

- **macOS:** Die App ist nicht bei Apple notarisiert. Beim ersten Start Rechtsklick auf die App → „Öffnen“.
- **Windows:** SmartScreen warnt bei unsignierten Programmen → „Weitere Informationen“ → „Trotzdem ausführen“.
  Die portable .exe braucht keine Installation und keine Admin-Rechte.
- Eigene Bauteile werden im Browser bzw. im Benutzerprofil der App gespeichert und zusätzlich mit jeder
  Zeichnung abgelegt.

## Logo

`logo.svg` (Vorlage), `build/icon.png` (1024 px, Basis für alle App-Icons), `build/icon.ico` (Windows).
