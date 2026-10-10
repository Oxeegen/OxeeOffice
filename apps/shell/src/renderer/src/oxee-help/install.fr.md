# Installer OxeeOffice

Chaque version est publiée sur la page des versions, **github.com/Oxeegen/OxeeOffice/releases**.

## Choisir le fichier pour votre machine

| Plateforme                           | Configuration requise                         | Fichier                              |
| ------------------------------------ | --------------------------------------------- | ------------------------------------ |
| **Windows**                          | Windows 10 ou 11, Intel/AMD (x64)             | `OxeeOffice-<version>-setup.exe`     |
| **Linux** — Debian / Ubuntu          | x86_64, Ubuntu 22.04 ou plus récent           | `oxeeoffice_<version>_amd64.deb`     |
| **Linux** — Fedora / RHEL / openSUSE | x86_64, Fedora 35+, RHEL 9+, Leap 15.6+       | `oxeeoffice-<version>.x86_64.rpm`    |
| **Linux** — autres distributions     | x86_64, FUSE 2                                | `OxeeOffice-<version>.AppImage`      |

Les versions précédentes restent sur la page des versions.

## Sous Windows

Lancez l’installateur `.exe`. Il n’est pas encore signé : si SmartScreen le bloque, choisissez **Informations complémentaires ▸ Exécuter quand même**. Il ajoute OxeeOffice au menu Démarrer et associe `.docx`, `.xlsx`, `.pptx`, `.pdf` et les autres formats, pour qu’un double-clic ouvre le fichier. Installer par-dessus un OxeeOffice existant le met à jour en conservant vos paramètres et votre historique.

## Sous Linux

**Debian / Ubuntu**

```sh
sudo apt install ./oxeeoffice_<version>_amd64.deb
```

**Fedora / RHEL / openSUSE**

```sh
sudo dnf install ./oxeeoffice-<version>.x86_64.rpm     # famille Fedora / RHEL
sudo zypper install ./oxeeoffice-<version>.x86_64.rpm  # openSUSE
```

**AppImage** — s’exécute sur place, sans installation :

```sh
chmod +x OxeeOffice-<version>.AppImage
./OxeeOffice-<version>.AppImage
```

Il faut le runtime FUSE 2. Pour s’en passer, lancez-le avec `--appimage-extract-and-run`.

## Mises à jour

L’installateur Windows et l’AppImage se mettent à jour eux-mêmes : quand une nouvelle version paraît, OxeeOffice la propose, et **Aide ▸ Rechercher les mises à jour…** vérifie à la demande. Une installation `.deb` ou `.rpm` se met à jour en installant le nouveau paquet.

**Paramètres ▸ À propos** indique la version installée et l’adresse du projet.

![Paramètres ▸ À propos, avec la version installée, le canal de mise à jour et le lien GitHub du projet](img/install.png)

## La ligne de commande est incluse

Chaque installation fournit une commande `genoffice` qui s’appuie sur les mêmes moteurs que la fenêtre, si bien que les deux sont toujours d’accord sur un fichier. `genoffice install-cli` l’ajoute à votre `PATH`. Voir **Ligne de commande et agents** pour ce qu’elle permet.
