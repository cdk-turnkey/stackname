import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";

export class It01StackA extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const bucket = new s3.Bucket(this, "JustABucket");
    const justABucketOutput = new cdk.CfnOutput(this, "JustABucketName", {
      value: bucket.bucketName,
    });
  }
}
