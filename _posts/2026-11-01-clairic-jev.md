---
lang: fr
layout: post
permalink: /clairic-jev-structurer-donnees-mieux-decider
title: "Clairic et Jev : structurer les données pour mieux décider"
description: "Clairic extrait les données, Jev évalue les choix : un workflow concret de gestion des vulnérabilités et les conditions d’une automatisation plus prévisible."
author: cedric
date: 2026-10-28 17:11:11 -0400
tags: [ia, cybersecurity, automation, system-one]
image: '/images/covers/clairic-jev-blog.jpeg'
featured:
---

# Automatisation en cybersécurité : combiner Clairic et Jev pour structurer les données et les décisions

Les divulgations de vulnérabilités *zero-day* d’octobre mobilisent l’attention des équipes de cybersécurité, avec des urgences bien réelles. Dans cette actualité, une annonce de Cloudflare mérite aussi qu’on s’y attarde : la mise à disposition de **Clairic**, un modèle « System One » spécialisé dans l’extraction structurée de données. 

Il s’inscrit dans la continuité de **Jev**, présenté par TypeSafe le 15 septembre dernier, qui se concentre sur la prise de décision structurée. Ces modèles répondent à deux besoins complémentaires de nos automatisations : transformer une information non structurée en données exploitables, puis évaluer les actions possibles à partir de ces données. Cette distinction permet de comprendre ce que Clairic apporte par rapport à Jev, et pourquoi il peut être utile de les associer.

---

## Clairic : extraire des valeurs plutôt que générer une réponse

Dans son annonce de Clairic, Cloudflare parle d’un modèle « System One ». Une précision s’impose : il ne s’agit pas d’un nouveau LLM génératif généraliste. Le modèle retourne des valeurs typées sans produire une réponse textuelle *token* par *token*. Vous définissez les champs attendus et leurs contraintes ; il fournit les valeurs correspondantes à partir du contenu transmis.

Voici quelques exemples d'extractions possibles selon le type de document :
* **Sur une facture :** un fournisseur, un montant ou une date d’échéance.
* **Sur un avis de sécurité :** des identifiants CVE, des produits concernés et des versions corrigées.

Pour les champs textuels, Clairic peut également fournir les positions du passage dans le texte source. Les réponses scalaires comportent des indicateurs de confiance et peuvent retourner une valeur nulle lorsque l’information ne peut pas être déterminée.

Un LLM peut déjà produire du JSON et, avec les mécanismes appropriés, respecter un schéma de sortie. Clairic propose une autre approche, spécialisée dans la prédiction de valeurs typées plutôt que dans la génération de texte. Cloudflare vise ainsi une **réduction du coût et de la latence** pour ces tâches répétitives. Les gains réels restent toutefois à mesurer sur vos propres documents.

> **Attention :** Le modèle prend aussi en charge des calculs simples, des estimations et des prévisions. Il faut toutefois distinguer ces usages : extraire un montant présent dans un document et estimer un montant absent ne produisent pas la même qualité de preuve.

---

## Jev : évaluer des choix plutôt qu’extraire des champs

Jev, présenté par TypeSafe, se concentre sur la prise de décision structurée. À partir d’un état fourni au modèle, il retourne des probabilités associées à des options définies à l’avance. Pour un processus de traitement, ces options peuvent correspondre à différentes catégories ou orientations possibles.

La différence concerne donc la sortie attendue :
* **Clairic** fournit des valeurs (ex. : une date ou un numéro de version).
* **Jev** évalue des choix (ex. : orienter un dossier vers une équipe ou demander une revue complémentaire).

Jev peut lui-même recevoir du contenu non structuré : l’utilisation préalable de Clairic n’est pas une obligation technique. Cependant, les deux approches sont complémentaires lorsque votre processus exige à la fois des données réutilisables et des décisions encadrées. Séparer ces fonctions permet de vérifier les champs extraits indépendamment de la logique d’orientation, puis de réutiliser les mêmes données dans plusieurs processus.

---

## Une application possible à la gestion des vulnérabilités

Supposons qu’un éditeur publie un avis concernant une vulnérabilité dans une passerelle VPN. Vous souhaitez identifier les équipements concernés et préparer leur traitement sans demander à un LLM de lire l’avis, de deviner votre exposition et de décider seul de la suite. 

> *Note : Le workflow suivant est une proposition d’architecture à mettre en place, pas une intégration native entre Clairic et Jev.*

### 1. Collecte et extraction (Clairic)
À la réception de l’avis, un collecteur en récupère le texte et conserve son URL ainsi que sa date de collecte. Il transmet le texte à **Clairic** avec des champs définis à l’avance : identifiant CVE, produit, versions affectées, version corrigée et éventuelle mesure de contournement. 

Le résultat alimente une fiche structurée liée à l’avis source. Si la version corrigée n’est pas indiquée, le champ reste vide et le dossier est signalé pour vérification, au lieu de compléter l’information par une supposition.

### 2. Corrélation avec l'inventaire (Script déterministe)
Un script compare ensuite le produit et les plages de versions extraites avec les données de votre inventaire ou de votre outil de gestion des vulnérabilités. La comparaison suit les règles de version du produit, pas une simple ressemblance entre noms. 

Pour chaque équipement potentiellement concerné, le script ajoute l’exposition à Internet, la criticité du service et l’équipe responsable. Une version inconnue ou une correspondance ambiguë déclenche une vérification ; elle ne permet pas de conclure que l’équipement est épargné.

### 3. Évaluation et orientation (Jev)
**Jev** reçoit alors cette fiche enrichie et évalue des options que vous avez définies, par exemple :
* « Revue urgente par l’équipe sécurité »
* « Traitement dans le cycle de maintenance »
* « Analyse complémentaire »

Son rôle est de proposer une orientation avec les probabilités associées, pas de découvrir les équipements vulnérables ni d’autoriser un correctif. Les règles de votre organisation restent prioritaires : une passerelle exposée à Internet et touchée par une exploitation confirmée peut imposer une escalade, quelle que soit la recommandation du modèle. Si les données sont insuffisantes ou si la recommandation ne satisfait pas les critères validés lors des tests, le workflow demande une revue humaine.

### 4. Orchestration et synthèse (LLM génératif & Validation humaine)
Enfin, l’orchestrateur crée ou met à jour un ticket pour l’équipe responsable, avec les équipements concernés, les versions relevées, le lien vers l’avis et l’orientation proposée. Un **LLM génératif** peut en rédiger la synthèse à partir de ces éléments, sans ajouter de faits. 

Le responsable valide l’action et son échéance ; les outils habituels assurent le déploiement, puis un nouveau scan ou une vérification de version confirme la correction avant la fermeture du ticket. **Clairic** intervient ainsi dans la préparation des données, **Jev** dans l’orientation du traitement, et le logiciel conserve les règles d’exécution et les approbations.

---

## Évaluer la fiabilité au-delà du format

La documentation de Cloudflare le précise : une valeur conforme au type demandé peut être incorrecte. Les scores de confiance et les intervalles d’incertitude ne remplacent pas une validation sur vos données. Clairic est disponible en *preview* sur Workers AI. Cloudflare prévoit aussi de rendre les poids du modèle accessibles, mais cette mise à disposition n’est pas encore effective.

L’arrivée de ces modèles spécialisés pourrait contribuer à apporter ce qui manque cruellement aux modèles « frontier » dans les automatisations critiques : **le déterminisme**, c’est-à-dire la capacité d’obtenir le même résultat pour les mêmes entrées, dans des conditions d’exécution identiques. En séparant l’extraction de données avec Clairic de l’évaluation des choix avec Jev, on peut mieux délimiter les comportements attendus et en tester la reproductibilité, plutôt que de confier tout le processus à une génération de texte libre.

Il faut toutefois distinguer cette perspective d’une garantie acquise : des sorties typées et des probabilités explicites ne prouvent ni le déterminisme de l’exécution ni l’exactitude des résultats. Il est recommandé de suivre une approche progressive :
1. Commencer par un processus limité.
2. Mesurer séparément les erreurs d’extraction et de décision.
3. Vérifier la stabilité des sorties à entrées, version du modèle et configuration constantes.

Associés à des règles métier déterministes, Clairic et Jev pourraient ainsi rendre les automatisations plus prévisibles et vérifiables, tout en réservant aux modèles génératifs les tâches qui exigent leur souplesse.