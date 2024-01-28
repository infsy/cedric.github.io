---
layout: post
title: En finir avec les buckets S3 publics (at scale)
description: L'exposition des données stockées dans les buckets S3 reste un sujet d'actualité malgré les mesures d'AWS. Voyons comment s'en occuper pour de bon.
date: 2024-01-27 22:27:35 +0300
author: cedric
image: '/images/s3-art-front.jpg'
image_caption: 'Photo by unknown'
tags: [aws, cloud, data, security]
featured:
---
# TL;DR
*** 
Malgré de nombreuses mesures de protection ajoutées par AWS pour sécuriser les buckets S3, de nombreux incidents de brèches de données continuent à se produire par erreur de configuration du client. Cet article vise à vous détailler la mise en place de mécanismes de prévention qui permettent de se protéger contre une exposition accidentelle de bucket dans une organisation AWS.
# Introduction
***
En réalité je devrais plutôt titrer cet article, en finir avec les buckets S3 publics non désirés! Dans une organisation AWS d’importance, il est probable que l’exposition de buckets soit une nécessité: site web statique, mise à disposition d’actifs Web publics, zone de dépôt proposée aux clients, etc… Bien que ces cas d’usages soient souvent des exceptions, c’est justement ce qui est compliqué à gérer, l’exception.

# La solution simple
***
Pour se protéger contre l’exposition par erreur d’un bucket S3, rien de plus simple, il suffit de mettre en place le paramètre S3 Block Public Access au niveau du compte, et tous les buckets qui seront présents dans ce compte AWS seront de facto privés (c’est à dire exposés seulement à des utilisateurs ou rôles appartenant à l’organisation, au compte ou explicitement cités). Bien sûr, pour la mise en place de ce paramètre, l’idéal est de l’automatiser à la création de chaque nouveau compte AWS avec par exemple l’utilisation de la solution AWS Customizations.

À noter que ce paramètre de Block Public Access peut être défini au niveau du compte mais également au niveau des buckets.

# Protéger la solution simple
* * *
Le problème du Block Public Access, c’est que n’importe quel administrateur ou utilisateur avec la permission appropriée peut désactiver ce paramètre pour publier en urgence un bucket public (la fameuse urgence qui ne dure pas et est sans conséquence…). Pour se protéger contre une désactivation du paramètre, la meilleure façon d’agir et de définir une Service Control Policy (SCP) au niveau de AWS Organization qui va permettre d’empêcher tout changement de ce paramètre.
```
{
      "Version": "2012-10-17",
      "Statement": [
          {
              "Sid": "DenyChangeS3PublicAccess",
              "Action": [
                  "s3:PutAccountPublicAccessBlock"
              ],
              "Resource": "*",
              "Effect": "Deny"
          }
      ]
  }
```
Cette SCP sera appliquée sur l’ensemble des OU de l’organisation à l’exception d’une OU dédiée pour les comptes exposants des ressources publiques.
![](images/bloc-public-access-organization.png)
Les comptes n’héritant pas de cette SCP pourront alors exposer des buckets publics tandis que les buckets privés dans ces même comptes pourront eux bénéficier du paramètre Block Public Access au niveau du bucket en soi.

# Mettre en place un Shérif en ville
* * *
En théorie, avec cette SCP vous venez réduire considérablement le risque car seul les comptes devant exposer des buckets publics seront autorisés à le faire. Ceci dit, le risque que dans ces quelques comptes une erreur expose un bucket contenant des données confidentielles existe encore. Pour cela, il est intéressant de venir contrôler que les buckets exposés publics sont bien ceux qui ont été identifiés comme contenant des données qui sont elles même publiques. Pour cela, les tags vont être utiles. En effet, dans un modèle DevOps agile, la sécurité vient en partie être assumée par les développeurs qui créent leurs infrastructures. Par conséquent, si un développeur veut exposer un bucket public, on veut auparavant s’assurer qu’il est conscient de ce qu’il fait en lui demandant de définir un tag “public” sur le bucket. En lui demandant cette étape supplémentaire, on vient supprimer tout risque de mauvaise compréhension de la part du développeur exposant son bucket sans se rendre compte du risque.
![](images/bloc-public-access-automation.png)

Associé au tag, c’est une Lambda qui va vérifier suite à chaque changement sur un bucket S3 (via EventBridge) le statut d’exposition du bucket et le comparer au tag associé (ou non) à ce bucket. Dans notre exemple, nous utilisons un tag dont la clé est “protectyourcloud:classification-securite-donnees” et la valeur doit être à “public” pour permettre au bucket de rester public.
```
#
# Description: Check that S3 bucket is not exposed without adequate tag.
#
# Trigger Type: Event Trigger
# Scope of Changes: S3:PublicAccessBlockConfiguration
# Accepted Parameters: None
# Output : finding in Security Hub

from datetime import datetime
import boto3
import sys
import json
from botocore.exceptions import ClientError

def create_incident(s3name, account_id):
    now = datetime.now()
    nowstr = now.strftime("%Y-%m-%dT%X+00:00")
    security = boto3.client('securityhub', region_name='ca-central-1')
    response = security.batch_import_findings(
        Findings=[
            {
                "AwsAccountId": account_id,
                "Confidence": 100,
                "CreatedAt": nowstr,
                "Criticality": 10,
                "CompanyName": "ProtectyourCloud",
                "ProductName": "Security Fondation",
                "Description": "A bucket has been automatically restricted",
                "FirstObservedAt": nowstr,
                "GeneratorId": "protectyourCloud-compliance-s3-002",
                "Id": "ca-central-1/" + account_id + "/s3public/" + s3name,
                "LastObservedAt": nowstr,
                "Note": {
                    "Text": "Finding generated by custom Lambda, due to an S3 which was public without the appropriate tag. The risk has been automatically remediated, no further action needed.",
                    "UpdatedAt": nowstr,
                    "UpdatedBy": "ProtectyourCloud automation"
                },
                "ProductArn": "arn:aws:securityhub:ca-central-1:" + account_id + ":product/" + account_id + "/default",
                "Remediation": {
                    "Recommendation": {
                        "Text": "Tag the S3 bucket with the appriate tag protectyourcloud:classification-securite-donnees if public exposure needed",
                        "Url": "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket"
                    }
                },
                "Resources": [
                    {
                        "Details": {
                            "Other": {
                                "string": s3name
                            }
                        },
                        "Id": "arn:aws:s3:::" + s3name,
                        "Partition": "aws",
                        "Region": "ca-central-1",
                        "Type": "AwsS3Bucket"
                    }
                ],
                "SchemaVersion": "2018-10-08",
                "Severity": {
                    "Label": "LOW"
                },
                "Title": "S3 bucket exposed without tag",
                "Types": [
                    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"],
                "UpdatedAt": nowstr,
                "VerificationState": "TRUE_POSITIVE",
            }
        ]
    )

def restrict_status(s3name):
    client = boto3.client("ssm")
    response = client.start_automation_execution(
        DocumentName='AWS-DisableS3BucketPublicReadWrite',
        DocumentVersion='$DEFAULT',
        Parameters={
            'S3BucketName': [
                s3name,
            ]
        }
    )
    print("Restriction done on bucket "+s3name)

def is_public_access_blocked(s3name):
    s3 = boto3.client("s3")
    publicblocks = s3.get_public_access_block(Bucket=s3name)
    if publicblocks['PublicAccessBlockConfiguration']['BlockPublicAcls'] and publicblocs['PublicAccessBlockConfiguration']['BlockPublicPolicy']:
        return True
    else:
        return False

def is_bucket_policy_public(s3name):
    s3 = boto3.client("s3")
    try:
        bucket_policy = s3.get_bucket_policy_status(Bucket=s3name)
    except:
        print("Bucket %s doesn't have Policy attached" % (s3name))
        return False

    if bucket_policy['PolicyStatus']['IsPublic']:
        return True
    else:
        return False

def is_bucket_acl_public(s3name):
    permissions_to_check = ['READ', 'WRITE', 'FULL_CONTROL']
    public_acl_indicator = ['http://acs.amazonaws.com/groups/global/AllUsers','http://acs.amazonaws.com/groups/global/AuthenticatedUsers']

    s3 = boto3.client("s3")
    try:
        bucket_acl = s3.get_bucket_acl(Bucket=s3name)
    except:
        print("Problem retrieving ACL for Bucket " + s3name)
        return False

    for grant in bucket_acl['Grants']:
        for (k, v) in grant.items():
            if k == 'Permission' and any(permission in v for permission in permissions_to_check):
                for (grantee_attrib_k, grantee_attrib_v) in grant['Grantee'].items():
                    if 'URI' in grantee_attrib_k and grant['Grantee']['URI'] in public_acl_indicator:
                        print("ACL public is in place on the bucket "+s3name)
                        return True
    print("ACL public is NOT in place on the bucket "+s3name)
    return False

def is_tagged_public(s3name):
    s3 = boto3.client("s3")
    try:
        tags = s3.get_bucket_tagging(Bucket=s3name)
        for tag in tags['TagSet']:
            if tag['Key'] == "protectyourcloud:classification-securite-donnees" and tag['Value'].upper() == "PUBLIC":
                return True
    except ClientError as e:
        print('Bucket: %s, doesn t have tags associated' % (s3name))
        return False
    return False

def lambda_handler(event, context):
    #
    # prepare variables for the Security Hub finding
    #
    client = boto3.client("sts")
    account_id = client.get_caller_identity()["Account"]
    s3arn = str(event['resources'][0])
    spl_word = ":::"
    s3bucketname = s3arn.partition(spl_word)[2]

    if is_public_access_blocked(s3bucketname):
        print ("Bucket %s is protected and so not public" % (s3bucketname))
        sys.exit(1)
    else:
        if is_bucket_policy_public(s3bucketname) or is_bucket_acl_public(s3bucketname):
            if is_tagged_public(s3bucketname):
                print('Bucket: %s, is public and tagged as is' % (s3bucketname))
            else:
                print('Bucket: %s, is public but without tags associated' % (s3bucketname))
                restrict_status(s3bucketname)
                create_incident(s3bucketname, account_id)
```
# Conclusion
* * *
La mise en place d’un contrôle préventif et d’un contrôle de réaction est la meilleure façon de compléter la détection effectuée généralement par le biais de votre CSPM ou de vos règles Config. Le plus important est de toujours inclure dans vos stratégies de protection les cas d’exception via des contrôles spécifiques, souvent liés aux tags. De plus, la mise en place stricte d’un tag associé aux buckets publics va permettre de suivre facilement l’inventaire des buckets exposés.
