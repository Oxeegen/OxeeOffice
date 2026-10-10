# Paramètres, langue, thème et intégrations MCP

## Ouvrir les paramètres

Le bouton **Paramètres** en bas à gauche de l’accueil ouvre le panneau des paramètres. Il comporte cinq sections : Modèle IA, Médias IA et recherche, Général, Intégrations et À propos.

![Paramètres ▸ Général, où se trouvent la langue, le thème et l’enregistrement automatique](img/settings-general.png)

La configuration des modèles a son propre article ; dans **Médias IA et recherche**, vous activez, par fournisseur, la génération d’images, l’analyse d’images, l’analyse vidéo, la recherche web et la recherche de fichiers locaux.

## Langue

- Les paramètres proposent **21 langues d’interface** : anglais, chinois simplifié, japonais, coréen, français, allemand, espagnol, thaï, indonésien, russe, arabe, portugais, italien, polonais, tchèque, néerlandais, malais, hébreu, hindi, chinois traditionnel, vietnamien.
- Le changement s’applique immédiatement et est conservé ; la barre de menus native est reconstruite dans la langue choisie.

## Thème

Clair / Sombre / Suivre le système. Suivre le système suit l’apparence de l’OS, et les éditeurs changent de apparence en même temps sans clignotement.

## Général

OxeeOffice n’envoie aucune statistique d’utilisation : Général n’a donc pas d’interrupteur pour cela.

- **Position de la barre latérale IA** (à gauche ou à droite), **Taille du texte du panneau IA** et **Correction orthographique dans le chat IA**.
- **Ouvrir le panneau IA dans les nouveaux documents** — désactivé, un nouveau document démarre avec le panneau replié, à un clic de là.
- **Enregistrer automatiquement tous les documents** active l'enregistrement automatique par défaut dans tous les éditeurs ; vous pouvez toujours le désactiver pour une fenêtre.
- **Emplacement d'enregistrement** avec un bouton **Modifier** et **Application par défaut pour les documents Office** pour attribuer .docx / .xlsx / .pptx à OxeeOffice.

## Médias IA et recherche

Ce ne sont pas des interrupteurs : chaque capacité choisit le fournisseur qui la sert, et la clé et l'URL de base d'un fournisseur sont saisies une seule fois et partagées :

- **Recherche web**, **Génération d'images**, **Analyse d'images** et **Analyse vidéo**, chacune avec un fournisseur, un modèle, une clé et une URL de base.
- **Recherche de fichiers locaux** s'exécute sur cette machine. Dessous se trouve le **Reclassement Jev**, **désactivé par défaut**. Activez-le et les extraits des 20 meilleurs résultats locaux — jusqu'à 1 200 caractères par document, plus les noms de fichiers et de dossiers — sont envoyés au modèle Jev de TypeSafe pour être réordonnés par pertinence. Désactivé, rien ne quitte l'appareil.

## À propos

- **Version**, le lien GitHub du projet et un bouton **Star on GitHub**.
- **Canal de mise à jour** : OxeeOffice publie un seul canal, Stable et Bêta reçoivent donc les mêmes versions. Quand une nouvelle version paraît, OxeeOffice la propose ; **Aide ▸ Rechercher les mises à jour…** vérifie à la demande.

## Associations d’applications par défaut

Les paramètres peuvent enregistrer OxeeOffice comme gestionnaire de .docx / .xlsx / .pptx / .pdf et formats similaires (enregistrement d’application par défaut au niveau de la plateforme ; confirmez lorsque l’on vous le demande).

## Mentions relatives aux logiciels tiers et mises à jour

- Aide ▸ Mentions relatives aux logiciels tiers : l’inventaire complet des licences open source livré avec l’application.
- Aide ▸ Vérifier les mises à jour : déclenche une vérification manuelle ; une version plus récente propose l’installation.

## Intégration MCP (pour les utilisateurs avancés / clients IA)

**Intégrations** est le panneau qui relie OxeeOffice à un agent de codage, et il a son propre article : Connecter un agent de codage. La version courte — choisissez une voie (la ligne de commande, ou MCP), suivez la section correspondante, puis ouvrez une nouvelle conversation et posez votre question.

![Paramètres ▸ Intégrations : les trois étapes, puis les lignes de compétences et les options MCP](img/settings-integrations.png)

Sous **Serveur HTTP local**, l’application peut aussi lancer le serveur elle-même — un interrupteur d’activation et un port —, et **Avancé** ajoute l’URL du test de santé et le fichier journal, au lieu de le laisser à l’assistant. Elle n’écoute que sur localhost.

## Aide-mémoire de la ligne de commande

| Commande           | Ce qu’elle fait                 |
| ------------------ | ------------------------------- |
| `genoffice <file>` | ouvrir un fichier               |
| `genoffice mcp`    | démarrer le serveur MCP local   |
| `genoffice --help` | toutes les commandes et options |
