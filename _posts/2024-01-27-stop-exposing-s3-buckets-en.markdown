---
layout: post
title: Stop Exposing Public S3 Buckets (at scale)
description: Data exposure stored in S3 buckets remains a hot topic despite AWS measures. Let's see how to deal with it for good.
date: 2024-01-27 22:27:35 +0300
author: cedric
image: '/images/s3-art-front.jpg'
image_caption: 'Photo by unknown'
tags: [aws, cloud, data, security]
featured:
lang: en
permalink: /stop-exposing-public-s3-buckets
---
# TL;DR
*** 
Despite numerous protection measures added by AWS to secure S3 buckets, many data breach incidents continue to occur due to client misconfiguration. This article aims to detail the implementation of prevention mechanisms to protect against accidental bucket exposure in an AWS organization.

# Introduction
***
Actually, I should rather title this article, putting an end to unwanted public S3 buckets! In a large AWS organization, it is likely that exposing buckets is a necessity: static website, provision of public Web assets, drop zone offered to clients, etc. Although these use cases are often exceptions, this is precisely what is complicated to manage, the exception.

# The simple solution
***
To protect against accidentally exposing an S3 bucket, it couldn’t be simpler: just enable the S3 Block Public Access setting at the account level, and all buckets within that AWS account will automatically be private (i.e., accessible only to users or roles belonging to the organization, the account, or explicitly listed). Of course, to set up this setting, the best approach is to automate it when creating each new AWS account, for example by using the AWS Customizations solution.
Note that the Block Public Access setting can be configured at the account level as well as at the bucket level.

# Protecting the simple solution
***
The problem with the “Block Public Access” setting is that any administrator or user with the appropriate permissions can disable it to quickly make a bucket public (that infamous “emergency” that doesn't last and has no consequences...). To protect against this setting being disabled, the best course of action is to define a Service Control Policy (SCP) at the AWS Organization level, which will prevent any changes to this setting.
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
This SCP will be applied to all organizational units within the organization, with the exception of a dedicated organizational unit for exhibitor accounts for public resources.
![](images/bloc-public-access-organization.png)
Les comptes n’héritant pas de cette SCP pourront alors exposer des buckets publics tandis que les buckets privés dans ces même comptes pourront eux bénéficier du paramètre Block Public Access au niveau du bucket en soi.
# Appoint a sheriff in town
***
In theory, this SCP significantly reduces risk because only accounts authorized to expose public buckets will be allowed to do so. That said, there is still a risk that an error in one of these accounts could expose a bucket containing confidential data. To address this, it’s important to verify that the publicly exposed buckets are indeed those identified as containing data that is itself public. Tags will be useful for this purpose. In an agile DevOps model, security is partly the responsibility of the developers who build their own infrastructure. Consequently, if a developer wants to make a bucket public, we want to ensure beforehand that they are aware of what they are doing by asking them to set a “public” tag on the bucket. By requiring this additional step, we eliminate any risk of misunderstanding on the part of the developer who might expose their bucket without realizing the risk.
![](images/bloc-public-access-automation.png)

Associated with the tag, a Lambda function will check the bucket’s exposure status after every change to an S3 bucket (via EventBridge) and compare it to the tag associated (or not) with that bucket. In our example, we use a tag with the key “protectyourcloud:data-security-classification,” and the value must be set to “public” to allow the bucket to remain public.
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
Implementing preventive and reactive controls is the best way to supplement the detection typically performed by your CSPM or Config rules. The most important thing is to always include edge cases in your protection strategies through specific controls, often linked to tags. In addition, strictly implementing a tag associated with public buckets will make it easy to track the inventory of exposed buckets.