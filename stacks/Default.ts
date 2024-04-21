import { StackContext, NextjsSite } from "sst/constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { env } from "../packages/core/env.mjs";

export function Default({ stack }: StackContext) {
  const site = new NextjsSite(stack, "site", {
    path: "packages/web-2",
  });
  stack.addOutputs({
    SiteUrl: site.url,
  });
}

export function TradeSite({ stack }: StackContext) {
  const site = new NextjsSite(stack, "site", {
    environment: {},
    customDomain: {
      domainName: "housemate.dev",
      isExternalDomain: true,
      cdk: {
        certificate: Certificate.fromCertificateArn(
          stack,
          "Certificate",
          env.AWS_SSL_CERTIFICATE_ARN,
        ),
      },
      domainAlias: "www.housemate.dev",
    },
  });
  stack.addOutputs({
    SiteUrl: site.url,
  });
}
