# Studentportal

Dockerfile started via https://docs.docker.com/guides/nodejs/containerize/

## Requirements
You need a working Docker-compose or Podman-compose installation.

## How to run the first time
Docker
```
docker compose up --detach
```
Podman
```
podman compose up --detach
```

## Ho to run any time
Docker
```
docker compose up --detach --build --force-recreate
```
Podman
```
podman compose up --detach --build --force-recreate
```

## How to access
Just use http://localhost:3001 in your browser!

## Story:

Das StudentPortal präsentiert sich als typische Plattform für Studierende mit Kursübersichten, Profilen, Noten und Zahlungsinformationen. Doch hinter dieser schlichten Oberfläche arbeitet eine zentrale Datenbank, die alles miteinander verknüpft: Anmeldedaten führen zu persönlichen Profilen, diese zu Kursen, Noten und Gebühren. Jede Eingabe, jeder Klick löst im Hintergrund einen präzisen Datenfluss aus. Wer die Seiten aufmerksam durchgeht, erkennt, wo sensible Informationen befinden. 

## Ziel:
Gib dich auf die Suche. Lies jede Seite, durchstöbere verfügbare Funktionen und überlege, wie Daten organisiert sind. Sammle beobachtbare Hinweise über Datenflüsse, Formulare und mögliche Stellen, an denen sensible Informationen auftauchen. Teste wie du die Daten für dich selbst zu Nutzen verschaffst von der Datenbank und gewinne.
