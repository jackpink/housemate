import { StackContext, NextjsSite } from "sst/constructs";

export function Default({ stack }: StackContext) {
  const site = new NextjsSite(stack, "site", {
    path: "packages/homeowner-site",
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
