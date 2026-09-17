<p align="center">
  <img src="../../brand/assets/icon.png" alt="OxeeOffice" width="128">
</p>

<h1 align="center">OxeeOffice</h1>

<p align="center">
  <sub><a href="../../README.md">English</a> · <strong>Français</strong></sub>
</p>

<p align="center"><b>La suite bureautique IA d'Oxeegen.</b><br>
Fichiers Word, Excel, PowerPoint et PDF, modifiés par vous et votre IA, enregistrés dans leurs formats natifs —
sur les modèles d'Oxeegen.</p>

<p align="center">
  <a href="../../LICENSE"><img src="https://img.shields.io/github/license/Oxeegen/OxeeOffice?color=5E4AF5" alt="Licence : Apache-2.0"></a>
  <a href="https://github.com/Oxeegen/OxeeOffice/releases/latest"><img src="https://img.shields.io/github/v/release/Oxeegen/OxeeOffice?color=5E4AF5" alt="Dernière version"></a>
  <a href="https://github.com/Oxeegen/OxeeOffice/releases"><img src="https://img.shields.io/github/downloads/Oxeegen/OxeeOffice/total?color=5E4AF5" alt="Téléchargements"></a>
  <img src="https://img.shields.io/badge/plateforme-Windows%20%7C%20Linux-5E4AF5" alt="Plateformes : Windows et Linux">
</p>

<p align="center">
  <a href="#download"><b>Télécharger</b></a> ·
  <a href="#command-line-and-agent-skill"><b>CLI</b></a> ·
  <a href="#mcp-server"><b>MCP</b></a> ·
  <a href="https://www.oxeegen.com"><b>Oxeegen</b></a> ·
  <a href="../../PRIVACY.md"><b>Confidentialité</b></a>
</p>

OxeeOffice est une suite bureautique de bureau pour Windows et Linux. Elle ouvre et
enregistre des fichiers natifs `.docx`, `.xlsx` et `.pptx`, permet d'éditer des PDF,
du Markdown et du HTML, et place un agent IA à côté de chaque document — pas une
simple fenêtre de chat greffée sur le côté, mais un éditeur qui lit le fichier,
effectue la modification, et vous montre exactement ce qu'il a touché.

- **Formats natifs, préservés à l'octet près.** Seul ce que vous modifiez est
  réécrit. Le reste du fichier est conservé à l'identique, si bien que vos documents
  continuent de fonctionner dans Word, Excel et PowerPoint.
- **Une IA que vous pouvez vérifier.** Les modifications arrivent sous forme de suivi
  des modifications et de diffs, avec une restauration en un clic. Les feuilles de
  calcul reçoivent de vraies formules, pas des chiffres collés. Les diapositives et
  les pages sont générées directement sur le canevas et restent entièrement
  modifiables.
- **Local par conception.** L'ouverture, l'édition, l'enregistrement et la
  conversion des fichiers se font sur votre machine. Les conversions
  PDF → Word / Excel / PowerPoint, Markdown → Word et HTML → Word s'exécutent toutes
  en local. Seuls les appels à l'IA quittent la machine, vers le fournisseur de
  votre choix.
- **Les modèles Oxeegen par défaut.** L'IA tourne sur l'inférence auto-hébergée
  d'Oxeegen, compatible OpenAI. Vous pouvez aussi utiliser votre propre clé pour
  Claude, OpenAI, Gemini, DeepSeek, Mistral, OpenRouter et d'autres, ou tout point de
  terminaison compatible OpenAI, serveurs locaux compris.
- **Scriptable et prêt pour les agents.** L'application embarque une ligne de
  commande et un skill pour Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot,
  OpenCode et Windsurf, si bien qu'un agent de codage peut créer, convertir, lire et
  modifier de vrais fichiers Office sur votre machine sans ouvrir de fenêtre.
- **Mises à jour automatiques.** Les applications installées consultent les versions
  publiées sur ce dépôt et proposent chaque nouvelle version.

**À télécharger :** [Windows](https://github.com/Oxeegen/OxeeOffice/releases/latest) (x64) ·
[Linux](https://github.com/Oxeegen/OxeeOffice/releases/latest) (deb, rpm, AppImage) —
détails et prérequis dans la section [Télécharger](#download).

## Les applications

Six éditeurs, un seul panneau IA, et une ligne de commande pour votre agent de codage.

### 1 · Docs — ouvrez et modifiez des `.docx` avec une IA que vous pouvez vérifier

<table>
<tr>
<td width="50%"><img src="../assets/readme/docs-report.webp" alt="Docs affichant une page de rapport annuel à deux colonnes avec une image de couverture pleine largeur, un tableau de KPI ombré, un en-tête et un pied de page, à un zoom de 80 % avec le panneau IA réduit"></td>
<td width="50%"><img src="../assets/readme/docs-ai.webp" alt="Docs : une présentation d'entreprise avec une image de bannière ; l'IA a resserré la section Overview et inséré une nouvelle section à puces, et le panneau propose une restauration en un clic"></td>
</tr>
<tr>
<td><b>Ouvre le fichier comme Word le met en page</b> — sections à deux colonnes, images pleine page, tableaux ombrés, en-têtes et pieds de page, pagination fondée sur les métriques de ligne de Word. Styles, commentaires, suivi des modifications, équations et annotations manuscrites font l'aller-retour sans être altérés.</td>
<td><b>Demandez la modification</b> — l'IA lit les blocs dont elle a besoin, réécrit la section Overview et insère une nouvelle section à puces. Chaque intervention de l'IA est un instantané que vous pouvez restaurer ; avec le <b>Suivi des modifications</b> activé, les changements arrivent sous forme de révisions à la manière de Word.</td>
</tr>
</table>

### 2 · Sheets — des `.xlsx` avec des formules et des graphiques vivants, pas des chiffres collés

<table>
<tr>
<td width="50%"><img src="../assets/readme/sheets-ai.webp" alt="Sheets : l'IA a ajouté une feuille Summary avec le chiffre d'affaires par région et par catégorie à l'aide de formules SUMIF, ainsi qu'un graphique en colonnes, et indique 43 modifications appliquées avec un bouton Annuler"></td>
<td width="50%"><img src="../assets/readme/sheets-qa.webp" alt="Sheets : interrogée sur la région ayant généré le plus de chiffre d'affaires au T2, l'IA répond Europe avec la répartition par catégorie et cite les cellules utilisées sous forme de liens, à côté de la feuille Orders"></td>
</tr>
<tr>
<td><b>Construisez-la</b> — à partir d'une seule phrase, l'agent ajoute une feuille Summary avec de vraies formules <code>SUMIF</code> par région et par catégorie, insère un graphique en colonnes, et applique les 43 modifications en un seul lot annulable.</td>
<td><b>Interrogez-la</b> — les questions sur le classeur reviennent avec le raisonnement et les cellules exactes utilisées, sous forme de citations cliquables. En coulisses : un moteur <code>.xlsx</code> en Rust, des tableaux croisés dynamiques, des segments, la mise en forme conditionnelle et le traçage des formules.</td>
</tr>
</table>

### 3 · Slides — d'un prompt à une présentation `.pptx`

<img src="../assets/readme/slides-generate.webp" alt="Time-lapse de Slides générant la présentation investisseurs Aurora Home : l'IA planifie la trame narrative dans le panneau, les diapositives apparaissent une à une sur le canevas, et la présentation terminée se conclut sur la demande finale" width="100%">

<table>
<tr>
<td width="50%"><img src="../assets/readme/slides-cover.webp" alt="Slides : la diapositive de couverture d'une présentation investisseurs Aurora Home générée par l'IA sur le canevas, avec le prompt d'origine d'une ligne et le résumé par l'IA de ce qu'elle a construit dans le panneau"></td>
<td width="50%"><img src="../assets/readme/slides-ai.webp" alt="Slides : la diapositive de clôture, mise en forme, de la même présentation de 11 diapositives, avec le bandeau de miniatures à gauche et le panneau IA résumant la trame narrative"></td>
</tr>
<tr>
<td><b>Une ligne en entrée</b> — « Créer une présentation investisseurs de 10 diapositives pour Aurora Home… ». L'IA planifie la trame narrative, recherche les chiffres, et rédige chaque diapositive directement sur le canevas, sous forme d'un véritable <code>.pptx</code>.</td>
<td><b>Une présentation terminée en sortie</b> — des diapositives mises en forme avec une typographie et des visuels cohérents et un appel à l'action final ; continuez à modifier avec les masques, les mises en page, les repères intelligents et le recadrage non destructif, ou demandez au panneau de restyler, réécrire et réorganiser.</td>
</tr>
</table>

### 4 · PDF — modifiez le texte d'un PDF sur place, convertissez un PDF en Word en local

<table>
<tr>
<td width="50%"><img src="../assets/readme/pdf-edit.webp" alt="PDF : le mode Modifier le texte délimite chaque bloc de texte de la page pour une modification sur place, tandis que le panneau IA répond à une question sur le rapport avec des citations de page"></td>
<td width="50%"><img src="../assets/readme/pdf-convert.webp" alt="Docs affichant un document Word converti localement à partir du PDF de bilan trimestriel Helios, ouvert dans un second onglet à côté du PDF d'origine"></td>
</tr>
<tr>
<td><b>Modifiez à l'intérieur de la page</b> — le mode <b>Modifier le texte</b> délimite chaque bloc de texte pour une nouvelle saisie sur place ; le flux de contenu est réécrit via PDFium avec les polices d'origine, et non par une annotation de recouvrement. Interrogez l'IA sur un long rapport et obtenez des réponses avec citations de page.</td>
<td><b>Convertissez en local</b> — <b>Convertisseur PDF → PDF vers Word</b> produit un <code>.docx</code> modifiable qui s'ouvre dans Docs à côté de la source, avec titres, lignes de statistiques et paragraphes intacts. Les cibles Excel et PowerPoint fonctionnent de la même façon ; les pages scannées passent par l'OCR du système.</td>
</tr>
</table>

### 5 · HTML — un générateur IA de pages et d'interfaces, brief de design d'abord

Indiquez à quoi sert la page et à qui elle s'adresse. L'IA propose d'abord un
**brief de design** — accroche, palette, typographie et orientations stylistiques —
puis construit un fichier `.html` autonome à partir de ces jetons.

<img src="../assets/readme/html-restyle-motion.webp" alt="Time-lapse de HTML restylant la page d'accueil Lumen : une seule demande dans le panneau transforme la page sombre Midnight Studio en version chaleureuse Solar Daybreak, tandis que chaque section et tout le texte restent en place" width="100%">

<table>
<tr>
<td width="50%"><img src="../assets/readme/html-ai.webp" alt="HTML : une page d'accueil générée pour une lampe de bureau solaire dans l'orientation sombre Midnight Studio, affichée dans l'aperçu en direct avec le panneau IA résumant la page qu'elle vient de construire"></td>
<td width="50%"><img src="../assets/readme/html-restyle.webp" alt="La même page d'accueil Lumen restylée par l'IA dans l'orientation chaleureuse Solar Daybreak : fond papier, titres à empattements et accent orange, avec toutes les sections et tout le texte conservés"></td>
</tr>
<tr>
<td><b>Générée à partir d'un seul prompt</b> — une accroche forte, des cartes de fonctionnalités, une grille tarifaire et un formulaire de liste d'attente, construits dans l'orientation Midnight Studio. Cliquez sur n'importe quel élément pour le restyler, double-cliquez pour modifier le texte, ou passez à la vue source CodeMirror.</td>
<td><b>Même design, nouvelle orientation</b> — une seule demande <b>Affiner l'UI</b> remplace les jetons du brief et la page suit : papier chaud, typographie éditoriale à empattements, accent orange soleil, sans rien réécrire. Présentez en plein écran, ou exportez en PDF ou en document Word natif et modifiable.</td>
</tr>
</table>
<table>
<tr>
<td width="50%"><img src="../assets/readme/html-dashboard.webp" alt="HTML : un tableau de bord personnel généré pour un designer freelance dans un style lin chaleureux, avec un rail latéral gauche, une salutation à empattements et quatre cartes de métriques"></td>
<td width="50%"><img src="../assets/readme/html-report.webp" alt="HTML : un rapport de données sur le marché des véhicules électriques généré dans un style journal grand format, avec un titre à empattements, un chiffre phare de 17,3 millions et une ligne de statistiques"></td>
</tr>
<tr>
<td><b>Maquettes d'interface</b> — le modèle « tableau de bord personnel » transforme un persona en une mise en page fonctionnelle : rail latéral, salutation, courbe des heures facturables, cartes de factures et de taux d'occupation, le tout en vrai HTML que vous pouvez confier à un développeur.</td>
<td><b>Récits de données</b> — le modèle « rapport de données » construit une page éditoriale grand format : titre à empattements, un chiffre phare, une ligne de statistiques séparée par un filet, des graphiques SVG intégrés et une note méthodologique.</td>
</tr>
</table>

### 6 · Markdown — un éditeur par blocs sur du `.md` brut, avec Demander à l'IA

<table>
<tr>
<td width="50%"><img src="../assets/readme/markdown-ai.webp" alt="Markdown : un paragraphe sélectionné affiche une bulle de demande à l'IA avec une instruction saisie et des suggestions telles que Polish, Make more concise, Expand et Fix grammar, ainsi que des boutons Send now et Add to queue"></td>
<td width="50%"><img src="../assets/readme/markdown-render.webp" alt="Markdown affichant un document de notes de lancement avec un tableau, un diagramme de flux Mermaid et une liste de tâches, avec les prompts de démarrage du panneau IA à gauche"></td>
</tr>
<tr>
<td><b>Interrogez l'IA sur une sélection</b> — sélectionnez n'importe quel passage et le bouton <b>Demander à l'IA</b> apparaît : saisissez une instruction ou choisissez une suggestion, envoyez-la immédiatement, ou mettez en file plusieurs modifications ancrées et exécutez-les en une seule passe. La même entrée existe dans chaque application.</td>
<td><b>Rendu à l'écran, enregistré en Markdown brut</b> — titres, listes, tableaux, images, blocs de code et diagrammes Mermaid dans un éditeur par blocs Tiptap, réécrits en <code>.md</code> brut, avec un export <b>Markdown → Word</b> entièrement local.</td>
</tr>
</table>

### 7 · CLI — votre agent de codage pilote OxeeOffice, sur votre machine

OxeeOffice embarque une ligne de commande et un skill d'agent. Installez le skill et
Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, OpenCode ou Windsurf peuvent
créer, convertir, lire et modifier de vrais fichiers Office avec les mêmes moteurs que
les applications, sans ouvrir de fenêtre.

<img src="../assets/readme/cli-deck-in-app.webp" alt="Slides affichant une présentation de huit diapositives sur le Système solaire qu'un agent de codage a construite via la ligne de commande : la diapositive de couverture sur le canevas, huit miniatures à gauche et le panneau IA ouvert" width="100%">

<table>
<tr>
<td width="50%"><img src="../assets/readme/cli-slides-grid.webp" alt="Les huit diapositives rendues de la présentation Système solaire côte à côte : couverture, chronologie de l'exploration, quatre chiffres clés, graphique en barres des diamètres planétaires, mondes rocheux contre géantes, le chiffre phare des 99,8 % du Soleil, la grille des quatre géantes et les points à retenir"></td>
<td width="50%"><img src="../assets/readme/cli-integrations.webp" alt="Réglages, page Intégrations : le skill installé dans Claude Code, avec des boutons Installer à côté de Codex et Cursor"></td>
</tr>
<tr>
<td><b>Un seul prompt à votre agent</b> — « Construis une présentation de huit diapositives sur le Système solaire. » L'agent lit le skill, écrit une feuille de style, un plan et une spécification de page par diapositive, et laisse <code>slides check</code> rejeter tout ce qui déborde ou se chevauche avant que <code>create</code> n'assemble le <code>.pptx</code> et que <code>slides render</code> ne renvoie un PNG par diapositive à examiner.</td>
<td><b>Installez une fois, depuis Réglages → Intégrations</b> — OxeeOffice liste les agents de codage qu'il trouve sur cet ordinateur et écrit le skill dans chacun de ceux que vous choisissez. Ou téléchargez le skill en zip, ou lancez <code>npx skills add Oxeegen/OxeeOffice</code>. Voir <a href="#command-line-and-agent-skill">Ligne de commande et skill d'agent</a>.</td>
</tr>
</table>

### 8 · MCP — les mêmes outils via le Model Context Protocol

Chaque commande est aussi un outil MCP. Claude Code, Claude Desktop, Cursor et tout
autre client MCP peuvent démarrer le serveur eux-mêmes, sans skill à installer ni
fenêtre ouverte. Un second serveur, HTTP, intégré à l'application permet à un agent de
construire un document Word dans un onglet d'éditeur visible pendant que vous regardez.

<img src="../assets/readme/mcp-deck-motion.webp" alt="Time-lapse de Claude Code construisant un dossier investisseurs de huit diapositives sur les énergies renouvelables via le serveur MCP : il recherche des chiffres et des photos, vérifie chaque image candidate, écrit la feuille de style et le plan, ajoute une page vérifiée à la fois, assemble le .pptx et rend chaque diapositive ; la présentation terminée s'ouvre ensuite dans Slides" width="100%">

<table>
<tr>
<td width="50%"><img src="../assets/readme/mcp-deck-in-app.webp" alt="Slides affichant la présentation Renewable Energy 2026 de huit diapositives que Claude Code a construite via le serveur MCP : la diapositive de couverture avec une photographie de parc éolien sur le canevas et huit miniatures à gauche"></td>
<td width="50%"><img src="../assets/readme/mcp-integrations.webp" alt="Réglages, page Intégrations, partie MCP : la commande claude mcp add en une ligne pour Claude Code, le bloc JSON pour Cursor, Claude Desktop et les autres clients MCP, et l'option de serveur HTTP local en dessous"></td>
</tr>
<tr>
<td><b>Un prompt, aucun terminal</b> — « Construis un dossier investisseurs de huit diapositives sur les énergies renouvelables en 2026, avec une vraie photo en couverture. » L'agent récupère chiffres et photos avec <code>search</code>, vérifie chaque image avec <code>media</code>, construit la présentation page par page en vérifiant chacune par rapport au plan et à la palette, puis rend chaque diapositive sous forme d'image qu'il peut examiner et reprend les pages qui ne lui conviennent pas.</td>
<td><b>Connectez une fois, depuis Réglages → Intégrations</b> — copiez la ligne <code>claude mcp add</code> pour Claude Code, ou le bloc JSON dans Cursor, Claude Desktop ou tout autre client MCP. Voir <a href="#mcp-server">Serveur MCP</a>.</td>
</tr>
</table>

## Pourquoi OxeeOffice

- **Propulsé par Oxeegen.** L'IA tourne sur l'inférence d'Oxeegen, avec un point de
  terminaison régional configurable par utilisateur — sans compte ni abonnement tiers.
- **À vous de l'exécuter.** Applications natives pour Windows et Linux ; les fichiers
  restent sur votre disque et chaque modification, enregistrement et conversion
  s'effectue sur votre machine.
- **De vrais fichiers Office.** `.docx`, `.xlsx` et `.pptx` natifs, préservés à
  l'octet près : les parties du fichier que vous n'avez pas touchées sont copiées
  telles quelles.
- **Une IA qui modifie le document lui-même.** Suivi des modifications dans Docs,
  formules et graphiques vivants dans Sheets, diapositives dessinées sur le canevas,
  chaque intervention de l'IA étant un instantané que vous pouvez restaurer.
- **Le PDF, sérieusement.** Modifiez le texte à l'intérieur de la page, et convertissez
  un PDF en Word, Excel ou PowerPoint en local, avec l'OCR du système pour les scans.
- **Markdown et HTML aussi**, avec le même panneau IA et un export local vers Word.
- **Scriptable.** Une ligne de commande, un skill d'agent et un serveur MCP mettent
  chaque moteur au service de vos agents de codage, toujours en local.
- **Open source**, sous licence Apache-2.0, et gratuit.

## Moteurs IA

**Oxeegen** est le fournisseur par défaut : le chat et l'analyse d'images et de vidéos
tournent sur les modèles d'Oxeegen (Max, Pro, Flash, Instant) via son point de
terminaison compatible OpenAI. Dans **Réglages → Modèle IA**, choisissez votre région
(**US** ou **EU** — chacune a ses propres clés) et collez votre clé API Oxeegen ; le
point de terminaison est renseigné pour vous. Changez de modèle à tout moment depuis le
sélecteur en haut du panneau IA de chaque éditeur : ce modèle planifie avec le
raisonnement activé, puis rédige les diapositives, vérifie leur mise en page et rédige
les longs documents avec le raisonnement désactivé.
Aucune clé n'est jamais intégrée aux builds, puisque les versions sont publiques.

Sous **Médias IA et recherche**, la recherche web et d'images passe par **Brave
Search** — collez une clé API Brave dans l'entrée de recherche Oxeegen — et la
génération d'images utilise **OpenAI** (`gpt-image-2.5-flare`, qualité moyenne) avec
votre clé OpenAI, en attendant qu'Oxeegen propose ses propres modèles d'images.

**Ou utilisez votre propre clé.** Réglages → Modèle IA propose aussi Claude, OpenAI,
Gemini, DeepSeek, Kimi, GLM, Qwen, Doubao, MiniMax, Grok, Mistral, OpenRouter, Requesty
et OpenCode Zen/Go, ainsi qu'un emplacement personnalisé pour tout point de terminaison
compatible OpenAI (URL de base + clé), serveurs de modèles locaux compris. La recherche
et les médias ont leurs propres fournisseurs par fonctionnalité sous **Médias IA et
recherche**.

Toute la suite propose les thèmes clair, sombre et système. Les thèmes ne changent que
l'affichage : les exports, les impressions et les fichiers enregistrés conservent
toujours les couleurs propres au document.

<a id="command-line-and-agent-skill"></a>

## Ligne de commande et skill d'agent

Tout ce que les applications peuvent faire à un fichier, la ligne de commande peut le
faire depuis un terminal : inspecter, convertir, créer, lire et modifier du Word, de
l'Excel, du PowerPoint, du PDF, du Markdown et du HTML avec les mêmes moteurs, sans
interface graphique. Elle s'installe avec OxeeOffice, ne nécessite aucun runtime
propre et n'envoie jamais un document nulle part. Associée au **skill d'agent**
fourni, elle transforme un agent de codage en un véritable assistant documentaire qui
produit de vrais fichiers Office plutôt que des approximations en Markdown.

> Dans cette version, la commande s'appelle encore **`genoffice`** ; elle deviendra
> `oxeeoffice` dans une prochaine version, tout comme le nom du serveur MCP et le
> skill. Les exemples ci-dessous utilisent le nom actuel.

**Fonctionne avec :** Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, OpenCode
et Windsurf dès l'installation, tout autre agent qui lit des skills, et, via le
[serveur MCP](#mcp-server), Claude Desktop et tout client MCP.

### Installer le skill

| Comment | Ce qui se passe |
| --- | --- |
| **Réglages → Intégrations** dans l'application | Liste les agents trouvés sur cet ordinateur ; un clic écrit le skill dans chacun de ceux que vous choisissez. Un bouton **Mettre à jour** apparaît lorsqu'une version embarque un skill plus récent. |
| **Télécharger en zip** sur la même page | Le format que claude.ai, les applications de bureau Claude et d'autres assistants acceptent comme skill téléversé. |
| `npx skills add Oxeegen/OxeeOffice` | Installe depuis ce dépôt dans tout agent compatible avec les skills. |

Ouvrez ensuite une nouvelle conversation et demandez un document. Le skill apprend à
l'agent quand recourir à la ligne de commande, comment lire un fichier avant de le
modifier, et comment vérifier son propre travail.

### Démarrage rapide depuis le terminal

```bash
genoffice --version
genoffice info report.docx --json                  # headings and blocks; or sheets, slides, pages
genoffice convert report.md --to pdf               # md/html/docx/xlsx/pptx → pdf, pdf → docx/xlsx/pptx, …
genoffice create --type docx --from notes.md --out notes.docx
genoffice create --type xlsx --from table.json --out sales.xlsx   # "=SUM(B2:B9)" cells stay live formulas
genoffice docs read report.docx --range 0-9 --json # then `docs apply --ops edits.json` edits in place
genoffice render report.docx --out shots/          # one PNG per page, to look at what you made
genoffice open sales.xlsx                          # hand the result to the editor
```

Chaque commande affiche un résumé d'une ligne, ou un seul objet JSON avec `--json`.
Les modifications sont atomiques : une opération rejetée laisse le fichier intact et
renvoie une erreur explicative. `genoffice help` liste les commandes disponibles ; la
référence complète se trouve dans [packages/cli/README.md](../../packages/cli/README.md)
(en anglais).

### Construire une présentation depuis un agent

Un agent qui suit le flux de travail par étapes du skill exécute à peu près ceci, et
la ligne de commande vérifie chaque étape avant de passer à la suivante :

```bash
genoffice capabilities --json                        # which cloud tools are configured
genoffice guide slides design                        # the deck workflow and layout library
genoffice slides check deck/outline.json --json      # outline checked
genoffice slides check deck/pages/01.json --json     # builds one slide, audits overflow and overlap
…                                                    # one page file per slide, fixed until each check is clean
genoffice create --type pptx --spec deck/pages --outline deck/outline.json --out deck/briefing.pptx --json
genoffice slides render deck/briefing.pptx --out deck/shots --json
genoffice slides audit deck/briefing.pptx --json
genoffice open deck/briefing.pptx
```

Aucun appel à un modèle n'a lieu dans la ligne de commande : l'agent réfléchit, la
ligne de commande construit et vérifie, et le résultat s'ouvre dans OxeeOffice ou
PowerPoint comme un `.pptx` ordinaire.

<a id="mcp-server"></a>

## Serveur MCP

Les mêmes commandes sont disponibles comme outils
[Model Context Protocol](https://modelcontextprotocol.io), pour les assistants qui ne
peuvent pas exécuter de terminal ou auxquels vous préférez ne pas en donner un. Il
existe deux façons de s'y connecter, toutes deux présentées avec des extraits prêts à
copier dans **Réglages → Intégrations → MCP** :

| Voie | Ce que c'est |
| --- | --- |
| **A · `genoffice mcp`** (recommandé) | Un serveur stdio que l'assistant démarre lui-même ; OxeeOffice n'a pas besoin d'être ouvert. Un outil par commande (`info`, `convert`, `create_*`, `docs_*`, `sheet_*`, `slides_*`, `render`, `guide`, `search`, `image`, `media`, `open`), plus le flux de présentation par étapes `deck_start` → `deck_page` → `deck_build` → `deck_replace`. |
| **B · Serveur HTTP local** | Tourne dans l'application sur `http://127.0.0.1:3093/mcp`. Ses outils pilotent un onglet d'éditeur Word visible, pour que vous voyiez le document prendre forme. Désactivé par défaut ; activez-le dans le même panneau de réglages. |

```bash
# Claude Code
claude mcp add --transport stdio genoffice -- genoffice mcp
```

```jsonc
// Cursor, Claude Desktop ou tout autre client MCP
{ "mcpServers": { "genoffice": { "command": "genoffice", "args": ["mcp"] } } }
```

`genoffice` désigne ici la ligne de commande fournie avec l'application — sous Windows
`%LOCALAPPDATA%\Programs\OxeeOffice\resources\cli\genoffice.cmd`, sous Linux
`/usr/bin/genoffice` ; le panneau de réglages affiche le chemin exact de votre
installation. Les fonctionnalités cloud (`search`, `image`, `media`) passent par le
fournisseur configuré dans OxeeOffice ; tout le reste tourne en local, et
`GENOFFICE_ALLOWED_ROOTS` limite chaque outil aux dossiers que vous indiquez.

<a id="download"></a>

## Télécharger

| Plateforme | Prérequis | Téléchargement |
| --- | --- | --- |
| **Windows** (x64) | Windows 10+, Intel/AMD | [`OxeeOffice-<version>-setup.exe`](https://github.com/Oxeegen/OxeeOffice/releases/latest) |
| **Linux** — Debian / Ubuntu | x86_64, glibc 2.34+ (Ubuntu 22.04 ou plus récent) | [`oxeeoffice_<version>_amd64.deb`](https://github.com/Oxeegen/OxeeOffice/releases/latest) |
| **Linux** — Fedora / RHEL / openSUSE | x86_64, glibc 2.34+ (Fedora 35+, RHEL 9+, Leap 15.6+) | [`oxeeoffice-<version>.x86_64.rpm`](https://github.com/Oxeegen/OxeeOffice/releases/latest) |
| **Linux** — autres distributions | x86_64, glibc 2.34+, FUSE 2 | [`OxeeOffice-<version>.AppImage`](https://github.com/Oxeegen/OxeeOffice/releases/latest) |

L'installateur Windows et l'AppImage se mettent à jour d'eux-mêmes ; les installations
deb et rpm se mettent à jour via le gestionnaire de paquets. Les installateurs ne sont
pas signés : au premier lancement, Windows SmartScreen affiche un avertissement —
choisissez **Informations complémentaires → Exécuter quand même**. Aucune version macOS
n'est proposée : sans certificat Apple Developer, Gatekeeper refuse l'application.

Les nouveautés de chaque version sont dans [CHANGELOG.md](../../CHANGELOG.md) (en anglais).

<details>
<summary><b>Installation sous Linux</b></summary>

Le paquet deb s'installe avec apt — il récupère les dépendances et ajoute OxeeOffice
au menu des applications :

```bash
sudo apt install ./oxeeoffice_<version>_amd64.deb
```

Sur Fedora / la famille RHEL / openSUSE, installez plutôt le paquet rpm :

```bash
sudo dnf install ./oxeeoffice-<version>.x86_64.rpm     # Fedora / famille RHEL
sudo zypper install ./oxeeoffice-<version>.x86_64.rpm  # openSUSE
```

L'AppImage s'exécute sur place : installez le runtime FUSE 2 (`sudo apt install libfuse2` ;
sur Ubuntu 24.04 le paquet s'appelle `libfuse2t64`), rendez le fichier exécutable, puis
lancez-le :

```bash
chmod +x OxeeOffice-<version>.AppImage
./OxeeOffice-<version>.AppImage
```

</details>

## Fonctionnement

Sept applications Electron — Docs, Sheets, Slides, PDF, Markdown, HTML et la fenêtre à
onglets qui les réunit — partagent une même couche moteur faite de paquets TypeScript
purs, plus un sidecar Rust pour le `.xlsx`. Le fichier d'origine fait toujours foi :
les modifications sont appliquées sous forme de correctifs ciblés, et tout ce que
l'éditeur n'a pas touché traverse l'aller-retour intact.

```
open docx ─► archive original by hash (never touched)
          ─► parse word/document.xml into a block tree, each block anchored to its original XML
          ─► Tiptap editor (manual + AI editing, dirty tracking)
save      ─► dirty blocks → OOXML fragments (referencing existing styles only)
          ─► splice into the original document.xml; untouched blocks keep their bytes
          ─► repack the zip; every other entry is copied byte-for-byte
```

## Développement

```bash
npm install
npm test             # engine + app unit tests
npm run typecheck    # tsc --noEmit across every workspace
npm run dev          # all six editors + shell against Vite dev servers
npm run dev:docs     # a single app (same pattern works per workspace)
```

L'application Sheets nécessite une chaîne d'outils Rust pour son sidecar xlsx (`cargo`
dans le PATH). Les installateurs sont construits par le workflow de release. La
configuration, les vérifications, les releases et les pull requests sont décrites dans
[CONTRIBUTING.md](../../CONTRIBUTING.md) (en anglais).

## Assistance

- **Signalez un bug ou proposez une fonctionnalité** dans les
  [issues GitHub](https://github.com/Oxeegen/OxeeOffice/issues).

## FAQ

<details>
<summary><b>OxeeOffice est-il gratuit ?</b></summary>

Oui. Les applications sont gratuites et open source, sous licence Apache-2.0. Les
fonctionnalités IA utilisent l'inférence Oxeegen ou la clé du fournisseur que vous
configurez.

</details>

<details>
<summary><b>OxeeOffice peut-il ouvrir les fichiers Microsoft Word, Excel et PowerPoint ?</b></summary>

Oui. OxeeOffice ouvre et enregistre des fichiers natifs `.docx`, `.xlsx` et `.pptx`.
L'enregistrement préserve le fichier à l'octet près : les parties que vous n'avez pas
touchées sont réécrites à l'identique, si bien que les documents continuent de
fonctionner dans Microsoft Office.

</details>

<details>
<summary><b>OxeeOffice fonctionne-t-il hors ligne ?</b></summary>

L'édition des documents est entièrement locale — les fichiers ne quittent jamais votre
machine pour être ouverts, modifiés, enregistrés ou convertis. Les fonctionnalités IA
ont besoin d'une connexion réseau vers Oxeegen ou vers le fournisseur que vous avez
configuré.

</details>

<details>
<summary><b>OxeeOffice peut-il modifier des PDF, ou les convertir en Word ?</b></summary>

Oui aux deux : une véritable édition du texte et des images d'un PDF, qui réécrit le
flux de contenu de la page avec les polices d'origine, et des conversions PDF → Word /
Excel / PowerPoint entièrement en local, avec l'OCR du système pour les pages scannées.

</details>

<details>
<summary><b>Puis-je utiliser un autre modèle d'IA ou ma propre clé API ?</b></summary>

Oui. Oxeegen est le fournisseur par défaut, et les réglages acceptent aussi des clés
pour Claude, OpenAI, Gemini, DeepSeek et d'autres, ou tout point de terminaison
compatible OpenAI, serveurs de modèles locaux compris.

</details>

<details>
<summary><b>Puis-je piloter OxeeOffice depuis Claude Code, Codex, Cursor ou un script ?</b></summary>

Oui, avec la ligne de commande et le skill d'agent fournis, ou avec le serveur MCP.
Voir [Ligne de commande et skill d'agent](#command-line-and-agent-skill).

</details>

<details>
<summary><b>OxeeOffice collecte-t-il des données ?</b></summary>

Non. Les builds d'OxeeOffice n'envoient aucune statistique d'utilisation : ils ne
reçoivent jamais d'identifiants d'analytics, et le workflow de release échoue si un
paquet en contient. Les documents restent sur votre machine ; seules les requêtes IA
que vous faites sont envoyées, au fournisseur que vous avez configuré.
Voir [PRIVACY.md](../../PRIVACY.md) (en anglais).

</details>

## Sécurité

Voir [SECURITY.md](../../SECURITY.md) (en anglais) pour signaler une vulnérabilité, la
sécurité des processus (isolation des renderers, validation IPC, contrôle des liens
externes) et les modèles de menace liés au contenu généré par l'IA.

## Licence

OxeeOffice est un logiciel open source distribué sous [licence Apache 2.0](../../LICENSE).
Les mentions d'attribution et de composants tiers se trouvent dans [NOTICE](../../NOTICE).

Le dossier `ee/` relève d'une licence distincte ([ee/LICENSE](../../ee/LICENSE)) et ne fait
pas partie des builds d'OxeeOffice.

Maintenu par [Oxeegen](https://oxeegen.com).
