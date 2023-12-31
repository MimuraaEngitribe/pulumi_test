import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

// Create a GCP resource (Storage Bucket)
const bucket = new gcp.storage.Bucket("my-bucket", {
    location: "ASIA",
    website: {
        mainPageSuffix: "index.html",
      },
      uniformBucketLevelAccess: true,
});

const bucketIAMBinding = new gcp.storage.BucketIAMBinding(
    "cm-ootaka-get-started-with-pulumi-IAMBinding",
    {
      bucket: bucket.name,
      role: "roles/storage.objectViewer",
      members: ["allUsers"],
    }
  );

const bucketObject = new gcp.storage.BucketObject("index.html", {
    bucket: bucket.name,
    contentType: "text/html",
    source: new pulumi.asset.FileAsset("index.html")
});

// Export the DNS name of the bucket
export const bucketName = bucket.url;

export const bucketEndpoint = pulumi.concat(
    "http://storage.googleapis.com/",
    bucket.name,
    "/",
    bucketObject.name
  );