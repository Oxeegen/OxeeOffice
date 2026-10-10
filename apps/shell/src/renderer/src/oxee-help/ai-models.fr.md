# Modèles IA et paramètres

## Fournisseurs et modèles

Les modèles et les clés se configurent dans les Paramètres (le bouton **Paramètres** en bas à gauche de l’accueil) :

![La fenêtre des paramètres](img/settings-general.png)

- **Oxeegen** est le fournisseur par défaut. Dans **Paramètres ▸ Modèle IA**, choisissez votre région avec **US** ou **EU** (chaque région a ses propres clés), collez votre clé API Oxeegen, et le point de terminaison se remplit tout seul. Les modèles sont **Oxee Max** (par défaut), **Pro**, **Flash** et **Instant**.
- **Changez de modèle à tout moment** avec la pastille de modèle en bas de chaque panneau IA ; le choix s’applique dans tous les éditeurs ouverts. **Gérer les modèles…**, en fin de liste, ouvre cette page des Paramètres.
- Les modèles Oxee utilisent leurs propres réglages serveur : OxeeOffice n’envoie ni température ni limite de sortie. Les étapes qui exécutent un plan — rédiger les diapositives, vérifier leur mise en page, écrire de longs documents — demandent au modèle de répondre sans sa phase de raisonnement, et prennent quelques secondes.
- **Points de terminaison personnalisés (BYOK)** : Paramètres ▸ IA prend une URL de base et une clé API par protocole — compatible OpenAI, Anthropic, Gemini, DeepSeek, DashScope (qwen) et plus. Les clés sont stockées dans le fichier de paramètres de l'application sur cet ordinateur et envoyées uniquement dans les en-têtes de requête.
- Un fournisseur différent peut être choisi par capacité dans **Paramètres ▸ Médias IA et recherche** : la recherche web et d’images passe par **Brave** (collez une clé API Brave dans l’entrée de recherche Oxeegen), la génération d’images par **OpenAI** `gpt-image-2.5-flare` avec votre clé OpenAI, et l’analyse d’images et de vidéos par les modèles Oxee.
- **Tester la connexion** : vérifie que le point de terminaison est joignable et que le modèle est visible avant d’enregistrer.
- Les URL de base peuvent porter un chemin et une chaîne de requête (style passerelle) ; les chemins de point de terminaison sont concaténés correctement.

## Intégration CLI (classe Codex)

- Les paramètres acceptent le chemin d’un programme CLI local (les répertoires personnel non ASCII et un préfixe ~ fonctionnent ; ~ est développé automatiquement) ; Détecter les modèles sonde les modèles disponibles du CLI.
- La validation vérifie uniquement l’existence — aucune restriction de jeu de caractères.

## Quand les changements s’appliquent

- Les changements de modèle et de point de terminaison s’appliquent immédiatement ; une conversation en cours conserve l’ancienne configuration jusqu’à son tour suivant.
