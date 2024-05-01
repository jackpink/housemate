import { StackContext, NextjsSite } from "sst/constructs";
import { env } from "../packages/core/env.mjs";

export function Default({ stack }: StackContext) {
  const site = new NextjsSite(stack, "site", {
    path: "packages/homeowner-site",
    environment: {
      TURSO_CONNECTION_URL: env.TURSO_CONNECTION_URL,
      TURSO_AUTH_TOKEN: env.TURSO_AUTH_TOKEN,
      COGNITO_CLIENT_ID: env.COGNITO_CLIENT_ID,
      COGNITO_CLIENT_SECRET: env.COGNITO_CLIENT_SECRET,
      COGNITO_ISSUER: env.COGNITO_ISSUER,
      NEXTAUTH_SECRET: env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: env.NEXTAUTH_URL,
    },
  });
  stack.addOutputs({
    SiteUrl: site.url,
  });
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
