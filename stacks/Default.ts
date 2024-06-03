import { StackContext, NextjsSite, Bucket, Cron } from "sst/constructs";
import { env } from "../packages/core/env.mjs";

export function Default({ stack }: StackContext) {
  const itemUploadsBucket = new Bucket(stack, "ItemUploads");

  new Cron(stack, "Alerts Cron", {
    schedule: "rate(1 day)",
    job: {
      environment: {
        TURSO_CONNECTION_URL: env.TURSO_CONNECTION_URL,
        TURSO_AUTH_TOKEN: env.TURSO_AUTH_TOKEN,
        COGNITO_CLIENT_ID: env.COGNITO_CLIENT_ID,
        COGNITO_CLIENT_SECRET: env.COGNITO_CLIENT_SECRET,
        COGNITO_ISSUER: env.COGNITO_ISSUER,
        AUTH_SECRET: env.AUTH_SECRET,
        AUTH_URL: env.AUTH_URL,
        AUTH_TRUST_HOST: env.AUTH_TRUST_HOST,
        GOOGLE_MAPS_API_KEY: env.GOOGLE_MAPS_API_KEY,
      },
      handler: "alerts",
    },
  });

  const site = new NextjsSite(stack, "site", {
    bind: [itemUploadsBucket],
    path: "packages/homeowner-site",
    environment: {
      TURSO_CONNECTION_URL: env.TURSO_CONNECTION_URL,
      TURSO_AUTH_TOKEN: env.TURSO_AUTH_TOKEN,
      COGNITO_CLIENT_ID: env.COGNITO_CLIENT_ID,
      COGNITO_CLIENT_SECRET: env.COGNITO_CLIENT_SECRET,
      COGNITO_ISSUER: env.COGNITO_ISSUER,
      AUTH_SECRET: env.AUTH_SECRET,
      AUTH_URL: env.AUTH_URL,
      AUTH_TRUST_HOST: env.AUTH_TRUST_HOST,
      NEXT_PUBLIC_COVER_IMAGE_BUCKET: itemUploadsBucket.bucketName,
      GOOGLE_MAPS_API_KEY: env.GOOGLE_MAPS_API_KEY,
    },
  });
  stack.addOutputs({
    SiteUrl: site.url,
  });
  site.attachPermissions([itemUploadsBucket]);
}

export function TradeSite({ stack }: StackContext) {
  const site = new NextjsSite(stack, "site", {
    environment: {},
    // customDomain: {
    //   domainName: "housemate.dev",
    //   isExternalDomain: true,
    //   cdk: {
    //     certificate: Certificate.fromCertificateArn(
    //       stack,
    //       "Certificate",
    //       env.AWS_SSL_CERTIFICATE_ARN,
    //     ),
    //   },
    //   domainAlias: "www.housemate.dev",
    // },
  });
  stack.addOutputs({
    SiteUrl: site.url,
  });
}
