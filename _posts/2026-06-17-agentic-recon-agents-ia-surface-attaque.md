---
lang: fr
layout: post
permalink: /attack-surface
title: "Agentic recon : quand les agents IA deviennent une surface d’attaque découvrable"
description: "Les agents IA exposés ne sont plus seulement des chatbots : ce sont des applications connectées, outillées et parfois découvrables depuis Internet. Une nouvelle discipline de reconnaissance offensive émerge pour identifier, cartographier et exploiter leurs capacités."
author: cedric
date: 2026-06-17 09:27:35 +0300
tags: [agentic, ia, threat, reconnaissance, attack-surface, mcp, owasp]
image: '/images/covers/attack-surface.jpeg'
featured:
---

# Agentic recon : quand les agents IA deviennent une surface d’attaque découvrable

La prochaine grande surface d’attaque de l’IA ne sera peut-être pas le modèle lui-même. Elle sera l’ensemble des **agents IA exposés**, mal inventoriés, connectés à des outils d’entreprise, parfois publiés trop largement, et suffisamment prévisibles pour être découverts à grande échelle.

Pendant les deux dernières années, la sécurité de l’IA générative s’est beaucoup concentrée sur la **prompt injection**, les fuites de données et les hallucinations. Ces risques restent importants. Mais l’arrivée des agents IA change la dynamique : un agent n’est pas seulement une interface conversationnelle. C’est une application capable d’observer, de planifier, d’utiliser des outils, d’interroger des sources de connaissance et parfois d’exécuter des actions.

La question n’est donc plus seulement : *peut-on manipuler le modèle ?*  
Elle devient : **peut-on trouver l’agent, comprendre ses capacités, cartographier ses outils, puis l’utiliser comme point d’entrée ?**

C’est exactement le sujet mis en lumière par Zenity Labs dans son article **“Agentic Recon: Discovering and Mapping Public AI Agents”**, qui introduit la notion d’**agentic recon** : une méthode de reconnaissance visant à découvrir des agents IA déployés publiquement et à en déduire les capacités exposées — outils, intégrations, sources de connaissance, middleware, paramètres d’authentification et patterns de déploiement.

## Les agents IA ne sont pas des chatbots : ce sont des applications

Un chatbot répond. Un agent agit.

Cette différence est fondamentale pour la cybersécurité. Un agent IA peut être connecté à :

- des bases documentaires internes ;
- des outils SaaS ;
- des API métiers ;
- des bases de données ;
- des workflows d’approbation ;
- des systèmes de tickets ;
- des environnements cloud ;
- des connecteurs MCP ;
- des identités non humaines ou comptes de service.

Dans le modèle classique, l’application expose des routes, des APIs, des formulaires, des paramètres, des endpoints et des identités. Dans le modèle agentique, elle expose aussi des **capacités** : rechercher, résumer, envoyer, déclencher, modifier, interroger, créer, supprimer, approuver, appeler un outil.

C’est pourquoi les agents IA doivent être analysés comme des **applications outillées**, et non comme de simples conversations avec un LLM.

Zenity résume très bien ce glissement : si un attaquant peut découvrir un agent, il peut souvent inférer ce que cet agent peut faire, à quoi il a accès, et comment découvrir d’autres agents similaires en s’appuyant sur les patterns de plateforme, les conventions de nommage, les mauvaises pratiques par défaut et l’énumération de ressources cloud.

C’est là que commence l’agentic recon.

## Qu’est-ce que l’agentic recon ?

L’**agentic recon** est une forme de reconnaissance spécialisée dans la découverte et la cartographie des agents IA.

Elle cherche à répondre à des questions très concrètes :

- Quels agents sont exposés ?
- Sur quelle plateforme sont-ils construits ?
- Sont-ils publics, semi-publics ou protégés ?
- Quels outils peuvent-ils invoquer ?
- Quelles sources de connaissance peuvent-ils consulter ?
- Quelles intégrations ou middlewares utilisent-ils ?
- Quels mécanismes d’authentification protègent leurs actions ?
- Quels patterns permettent de trouver d’autres agents similaires ?
- Quels éléments de métadonnées révèlent le tenant, l’environnement ou la technologie sous-jacente ?

Cette discipline est proche du web content discovery, du cloud recon, de l’API recon et de l’attack surface management. Mais elle ajoute une couche nouvelle : la cartographie de la **logique d’action**.

Dans une application web traditionnelle, découvrir un endpoint `/admin` ou une API non documentée est déjà précieux. Dans un système agentique, découvrir qu’un agent peut envoyer des courriels, interroger un CRM ou appeler un outil MCP exposé peut être beaucoup plus significatif.

L’attaquant ne cherche pas seulement un serveur. Il cherche un **acteur logiciel** avec des privilèges.

## Ce que montre le cas Copilot Studio de Zenity

L’article de Zenity utilise **Microsoft Copilot Studio** comme cas d’étude. Le point important n’est pas que Copilot Studio serait unique ou exceptionnellement vulnérable. Le point important est qu’une plateforme agentique moderne crée des artefacts, des URLs, des métadonnées, des conventions et des ressources qui peuvent être observés et corrélés.

Zenity explique avoir découvert des **dizaines de milliers de bots Copilot Studio**, dont certains publiquement accessibles, avec des outils ou sources de connaissance à impact métier.

La méthode décrite repose sur un principe classique en reconnaissance offensive : les plateformes à grande échelle génèrent des patterns. Ces patterns peuvent ensuite être exploités pour découvrir des ressources similaires.

Dans le contexte agentique, ces patterns peuvent concerner :

- la structure des URLs publiques ;
- les identifiants de tenants ou d’environnements ;
- les conventions de nommage ;
- les endpoints de publication ;
- les métadonnées exposées ;
- les paramètres d’intégration ;
- les ressources liées à des agents ;
- les composants cloud adjacents ;
- les connecteurs et middlewares.

Ce qui rend cette approche particulièrement intéressante, c’est qu’elle ne commence pas par une prompt injection. Elle commence par de la **cartographie**.

Avant de manipuler un agent, il faut savoir qu’il existe. Avant d’abuser d’un outil, il faut savoir qu’il est disponible. Avant de cibler une source documentaire, il faut savoir qu’elle est connectée.

L’agentic recon devient donc la première étape logique d’une chaîne d’attaque contre les systèmes IA agentiques.

## De l’OSINT à la cartographie des capacités

La reconnaissance classique permet de découvrir des domaines, des sous-domaines, des ports, des technologies, des buckets, des APIs et des identités. L’agentic recon ajoute une dimension : **l’intention opérationnelle du système**.

Un agent exposé peut révéler ou laisser deviner :

- son rôle métier ;
- le département qui l’utilise ;
- les données qu’il consulte ;
- les outils qu’il peut appeler ;
- les actions qu’il peut déclencher ;
- les workflows auxquels il participe ;
- les contrôles humains ou techniques qui l’encadrent.

C’est une différence majeure. Dans beaucoup de cas, le nom, la description ou la configuration apparente d’un agent suffisent à donner une indication de valeur.

Un agent nommé “HR Onboarding Assistant”, “Finance Approval Bot”, “Customer Refund Agent” ou “Internal Knowledge Copilot” n’a pas le même intérêt offensif qu’un simple chatbot générique. Même sans exploitation immédiate, sa découverte peut aider à prioriser les cibles.

C’est pourquoi l’agentic recon ne doit pas être vu comme une curiosité de chercheur. C’est une extension naturelle de l’external attack surface management.

## Les agents sont découvrables parce qu’ils s’appuient sur des plateformes

L’un des messages les plus importants de Zenity est le suivant : pour découvrir des agents, il faut souvent commencer par comprendre la plateforme qui les héberge.

Cela peut inclure :

- Microsoft Copilot Studio ;
- Azure AI Foundry ;
- AWS Bedrock AgentCore ;
- des frameworks d’agents open source ;
- des passerelles LLM ;
- des proxies compatibles OpenAI, Gemini ou Anthropic ;
- des serveurs MCP ;
- des outils low-code/no-code ;
- des connecteurs SaaS ;
- des middlewares d’orchestration.

Chaque plateforme a ses artefacts. Chaque framework a ses signatures. Chaque middleware a ses endpoints, ses headers, ses schémas, ses erreurs et ses comportements par défaut.

Autrement dit, la surface d’attaque n’est pas seulement “l’agent”. Elle inclut tout ce qui permet à l’agent d’exister, d’être publié, de recevoir des requêtes, d’appeler des outils et de s’intégrer à l’entreprise.

C’est là que les méthodes de reconnaissance avancée deviennent puissantes : l’attaquant peut combiner des signaux faibles pour produire une carte exploitable.

## Les attaques commencent déjà par le scanning des déploiements IA

Zenity a également publié une analyse sur les campagnes de scanning visant les déploiements IA et les middlewares. Cette analyse s’appuie notamment sur des observations de GreyNoise entre octobre 2025 et janvier 2026.

Le point clé : les attaquants ne cherchent pas nécessairement à “pirater OpenAI” ou “attaquer Claude”. Ils sondent plutôt la couche que les entreprises opèrent elles-mêmes :

- gateways IA ;
- proxies LLM ;
- backends d’agents ;
- wrappers compatibles OpenAI, Gemini ou Anthropic ;
- middlewares d’orchestration ;
- runtimes auto-hébergés ;
- endpoints de modèles exposés ;
- services expérimentaux mal protégés.

Ce déplacement est important. Les grandes plateformes de modèles sont généralement mieux protégées que les intégrations internes bricolées rapidement pour accélérer l’adoption de l’IA. Or, ces intégrations sont souvent celles qui disposent des accès les plus intéressants : documents internes, systèmes métiers, outils cloud, bases de données, identités applicatives.

La reconnaissance observée vise donc à identifier où l’entreprise a déployé sa propre couche IA — souvent plus fragile que le fournisseur de modèle sous-jacent.

## MCP : la couche d’outils devient une surface de découverte

Le **Model Context Protocol (MCP)** illustre parfaitement ce nouveau risque.

MCP permet à des agents ou assistants IA de se connecter à des outils et sources de données externes via une interface standardisée. C’est utile, puissant, et probablement structurant pour l’écosystème agentique. Mais dès qu’un serveur MCP est exposé sans authentification forte, il devient une cible évidente.

Knostic a publié une étude sur la cartographie des serveurs MCP exposés sur Internet. Les chercheurs indiquent avoir identifié **1 862 serveurs MCP exposés**, puis vérifié manuellement un échantillon de 119 serveurs. Selon leur analyse, les 119 serveurs vérifiés exposaient leurs listes d’outils internes sans authentification.

Ce résultat est important parce que la liste des outils est l’équivalent agentique de la question : **“Que peux-tu faire ?”**

Même sans appeler un outil dangereux, le simple fait d’obtenir une liste de capacités peut révéler :

- des intégrations internes ;
- des noms de bases de données ;
- des opérations disponibles ;
- des services cloud connectés ;
- des capacités de lecture ou d’écriture ;
- des actions potentiellement destructrices ;
- des secrets mal gérés ou indices de configuration.

Knostic décrit une méthodologie de découverte combinant Shodan, des outils Python personnalisés, et plusieurs signaux de fingerprinting : comportements JSON-RPC, endpoints MCP communs, Server-Sent Events, headers de frameworks comme Uvicorn, et réponses à des handshakes conformes au protocole.

Il ne s’agit pas d’un détail technique marginal. Cela montre que la couche d’outils des agents devient elle-même découvrable, fingerprintable et cartographiable.

## Quand l’exposition MCP devient un risque cloud

Trend Micro va plus loin dans son analyse des serveurs MCP exposés. Selon leurs recherches, le nombre de serveurs MCP exposés observés a presque triplé, passant de **492** à **1 467** dans leurs scans.

Plus préoccupant : le risque ne se limite pas à l’exposition de données. Trend Micro décrit des cas où des serveurs MCP liés à AWS ou Azure peuvent devenir des vecteurs de compromission de l’infrastructure cloud, notamment en présence de :

- secrets stockés en clair ;
- fichiers `.env` exposés ou mal protégés ;
- configurations JSON contenant des informations sensibles ;
- commandes cloud accessibles via des outils MCP ;
- absence d’authentification ;
- absence de chiffrement ;
- injections de commandes dans des implémentations non officielles.

Ce scénario est exactement ce qui rend les agents IA dangereux : l’attaquant ne vise pas seulement une réponse du modèle. Il vise la chaîne agentique complète : agent → outil → identité → cloud → données.

Dans un environnement classique, une mauvaise configuration cloud est déjà critique. Dans un environnement agentique, elle peut être rendue encore plus accessible par une interface en langage naturel ou par une couche d’outils mal contrôlée.

## Comment OWASP permet de catégoriser cette menace

L’OWASP Top 10 for LLM Applications 2025 et l’OWASP Top 10 for Agentic Applications 2026 sont utiles pour structurer ce risque.

Dans le contexte de l’agentic recon, plusieurs catégories OWASP s’enchaînent naturellement.

### LLM01 — Prompt Injection

La prompt injection reste centrale, mais elle intervient souvent après la reconnaissance. Une fois qu’un agent exposé est découvert, l’attaquant peut tenter de manipuler ses instructions via :

- une interaction directe ;
- un document récupéré par RAG ;
- une page web consultée par l’agent ;
- un courriel traité automatiquement ;
- une entrée dans une base de connaissance ;
- un contenu tiers utilisé comme contexte.

L’agentic recon sert alors à sélectionner les cibles où la prompt injection pourrait avoir un impact réel.

### LLM06 — Excessive Agency

L’excès d’autonomie devient beaucoup plus dangereux lorsqu’un agent est exposé ou découvrable. Un agent qui peut seulement répondre à une FAQ a un impact limité. Un agent qui peut appeler des outils, envoyer des messages, modifier des données ou interagir avec un CRM introduit un risque opérationnel.

La question technique devient : **quelles actions l’agent peut-il réaliser sans validation forte ?**

### ASI02 — Tool Misuse & Exploitation

Dans les systèmes agentiques, les outils sont la surface d’exécution. Un outil mal décrit, trop permissif, non authentifié ou exposé via MCP peut être détourné.

L’agentic recon permet justement de cartographier ces outils, leurs noms, leurs descriptions, leurs paramètres et parfois leurs effets possibles.

### ASI03 — Agent Identity & Privilege Abuse

Un agent agit souvent avec une identité : compte de service, jeton OAuth, intégration SaaS, rôle cloud, délégation utilisateur. Si cette identité est trop permissive, l’agent devient un moyen d’abuser indirectement de privilèges.

La reconnaissance cherche donc à comprendre non seulement *ce que l’agent sait*, mais aussi **au nom de qui il agit**.

### ASI06 — Memory & Context Poisoning

Si un agent utilise une mémoire persistante ou des sources de connaissance modifiables, l’attaquant peut chercher à influencer ses décisions futures. La découverte des sources de connaissance exposées devient alors une étape clé.

Un agent qui consulte un contenu manipulable par un attaquant peut être compromis sans que le modèle ou l’application principale ne soient techniquement “exploités”.

### ASI05 — Unexpected Code Execution

Dès qu’un agent ou un serveur MCP permet l’exécution de commandes, la génération de code ou l’interaction avec un runtime, le risque change de catégorie. On ne parle plus seulement de fuite d’information ou de mauvaise réponse. On parle d’exécution.

Les exemples autour de serveurs MCP cloud montrent que cette frontière peut être franchie plus vite que prévu.

## Le nouveau kill chain agentique

On peut résumer la chaîne d’attaque typique ainsi :

1. **Découverte**  
   Identifier des agents, endpoints IA, serveurs MCP, gateways ou middlewares exposés.

2. **Fingerprinting**  
   Comprendre la plateforme, les conventions, les headers, les routes, les schémas, les erreurs et les métadonnées.

3. **Capability mapping**  
   Déduire les outils, sources de connaissance, intégrations, actions et identités associées.

4. **Priorisation**  
   Identifier les agents à fort impact : finance, RH, support client, cloud, données sensibles, workflows internes.

5. **Manipulation**  
   Tenter prompt injection, indirect prompt injection, poisoning de contexte, abus d’outil ou contournement de validation.

6. **Exécution ou exfiltration**  
   Utiliser l’agent ou sa couche d’outils pour accéder à des données, déclencher une action, appeler une API ou pivoter vers l’infrastructure.

Cette chaîne ressemble à une intrusion classique, mais avec une nouvelle particularité : une partie de la logique d’attaque se joue dans le langage, le contexte et les capacités déclarées.

## Ce que les défenseurs doivent surveiller

La réponse défensive ne doit pas se limiter à “bloquer la prompt injection”. Il faut traiter les agents IA comme des actifs exposables.

Les contrôles prioritaires sont techniques.

### 1. Inventorier les agents exposés

Les organisations doivent être capables de répondre à des questions simples :

- Quels agents sont publiés ?
- Lesquels sont accessibles depuis Internet ?
- Lesquels sont accessibles sans authentification ?
- Quels tenants, environnements ou workspaces les hébergent ?
- Quels outils et connecteurs leur sont associés ?
- Quelles sources de connaissance utilisent-ils ?
- Quels agents sont créés par des équipes métier hors cycle SDLC classique ?

Sans inventaire, l’agentic recon sera souvent plus mature côté attaquant que côté défenseur.

### 2. Réduire les métadonnées publiques

Les métadonnées apparemment bénignes peuvent permettre une cartographie à grande échelle.

Il faut limiter l’exposition de :

- noms d’agents ;
- descriptions trop explicites ;
- identifiants d’environnement ;
- informations de tenant ;
- URLs prévisibles ;
- messages d’erreur détaillés ;
- schémas d’outils ;
- listes de capacités ;
- informations sur les sources de connaissance.

Ce n’est pas de la sécurité par obscurité. C’est la réduction de matière première pour la reconnaissance automatisée.

### 3. Protéger la liste des outils comme une donnée sensible

Dans les environnements MCP ou agentiques, une liste d’outils n’est pas anodine. Elle peut révéler la topologie fonctionnelle de l’entreprise.

Une bonne pratique consiste à traiter les manifestes d’outils, les descriptions de capacités et les schémas d’appel comme des informations sensibles.

À minima :

- pas de `tools/list` accessible sans authentification ;
- pas de descriptions contenant des secrets, noms internes ou détails d’architecture ;
- pas de schémas trop permissifs ;
- pas d’outils destructifs exposés directement ;
- pas d’appel d’outil sans autorisation contextuelle ;
- journalisation complète des appels et refus.

### 4. Encadrer MCP comme une vraie surface d’infrastructure

Un serveur MCP ne devrait pas être exposé comme un simple service de développement.

Les contrôles attendus devraient inclure :

- authentification forte ;
- autorisation par outil ;
- segmentation réseau ;
- chiffrement ;
- rotation des secrets ;
- absence de secrets en clair dans les fichiers de configuration ;
- limitation d’egress ;
- validation stricte des paramètres ;
- allowlist des outils ;
- séparation par environnement ;
- supervision des appels ;
- détection des comportements anormaux.

MCP doit être traité comme une passerelle d’accès aux capacités de l’entreprise.

### 5. Surveiller les patterns de reconnaissance IA

Les campagnes décrites par Zenity et GreyNoise montrent que les attaquants sondent déjà les endpoints IA et middlewares.

Les équipes de défense devraient surveiller :

- énumération d’endpoints compatibles OpenAI/Gemini/Anthropic ;
- appels inhabituels vers des routes de modèles ou d’agents ;
- probes SSRF avec domaines de callback ;
- tentatives de découverte de serveurs MCP ;
- pics de requêtes sur endpoints `/mcp`, `/messages`, `/api/mcp` ou équivalents ;
- erreurs répétées indiquant du fingerprinting ;
- requêtes cherchant à lister des modèles, outils ou capacités ;
- accès anonymes à des agents publics ;
- agents nouvellement publiés hors processus approuvé.

L’objectif n’est pas seulement de détecter l’exploitation. Il est de détecter la reconnaissance.

### 6. Faire du red teaming agentique

Les tests de sécurité doivent évoluer.

Un test classique d’application web ne suffit pas à couvrir :

- la découverte d’agents ;
- la cartographie d’outils ;
- les attaques indirectes via documents ;
- les abus de RAG ;
- les fuites de manifestes MCP ;
- l’abus de permissions d’agents ;
- les escalades via connecteurs ;
- les attaques multi-agents ;
- les injections dans la mémoire ou le contexte.

Le red teaming agentique doit inclure une phase de reconnaissance contrôlée : rechercher les agents comme le ferait un attaquant, mais dans un cadre autorisé et défensif.

## Le signal faible : les agents créés hors des cycles de sécurité traditionnels

Un facteur amplifie le risque : beaucoup d’agents sont créés par des équipes métier, avec des plateformes low-code/no-code, sans passer par les processus classiques de développement, de revue de sécurité ou de gestion de changement.

C’est une force pour l’innovation. C’est aussi un risque pour la sécurité.

Les agents peuvent apparaître rapidement, être partagés largement, intégrer des documents sensibles, appeler des connecteurs puissants et rester invisibles pour les équipes de sécurité.

C’est exactement le contexte dans lequel l’agentic recon devient efficace : un grand nombre de petits actifs, créés rapidement, exposés de manière variable, avec des patterns de plateforme réutilisables.

## Conclusion : la découverte des agents IA devient une discipline offensive

Les agents IA introduisent une nouvelle phase dans la sécurité de l’IA. Le problème n’est plus seulement de savoir si un modèle peut être manipulé. Le problème est de savoir si l’organisation connaît réellement les agents qu’elle expose, les outils qu’ils peuvent appeler et les données auxquelles ils ont accès.

L’agentic recon montre que les agents IA peuvent être recherchés, fingerprintés, classifiés et priorisés comme n’importe quel actif exposé — mais avec une différence majeure : leur valeur ne réside pas seulement dans l’infrastructure. Elle réside dans leurs **capacités d’action**.

La surface d’attaque agentique se situe donc à l’intersection de quatre couches :

1. le modèle ;
2. le contexte ;
3. les outils ;
4. les identités.

Les organisations qui veulent déployer des agents IA en sécurité doivent commencer par une question simple, mais inconfortable :

**Si un attaquant cherchait nos agents IA depuis Internet, que découvrirait-il avant nous ?**

C’est à cette question que l’agentic recon apporte une réponse. Et c’est précisément pourquoi les agents IA doivent désormais faire partie intégrante de l’attack surface management, du threat modeling et du red teaming technique.

## Références utilisées

- Zenity Labs — *Agentic Recon: Discovering and Mapping Public AI Agents* : https://labs.zenity.io/p/agentic-recon-discovering-and-mapping-public-ai-agents
- Zenity Labs — *Threat Actors Are Already Scanning For Your AI Deployments and Middleware* : https://labs.zenity.io/p/threat-actors-are-already-scanning-for-your-ai-deployments-and-middleware
- Knostic — *Exposing the Unseen: Mapping MCP Servers Across the Internet* : https://www.knostic.ai/blog/mapping-mcp-servers-study
- Trend Micro — *Update on Exposed MCP Servers: The Threat Widens to the Cloud* : https://www.trendmicro.com/vinfo/us/security/news/vulnerabilities-and-exploits/update-on-exposed-mcp-servers-the-threat-widens-to-the-cloud
- OWASP — *Top 10 for LLM Applications 2025* : https://genai.owasp.org/llm-top-10/
- OWASP — *Top 10 for Agentic Applications 2026* : https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026
- MITRE ATLAS : https://atlas.mitre.org
