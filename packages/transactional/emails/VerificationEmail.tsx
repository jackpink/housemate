import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import React from "react";

export default function VerificationEmail({
  code = "123456",
}: {
  code: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>preview</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src="static/logo.png"
                width="300"
                height="300"
                alt="Housemate"
                className="mx-auto"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              <strong>Verfiy your email</strong>
            </Heading>
            <Text className="text-center text-[14px] leading-[24px] text-black">
              Enter the following code to finish Housemate sign up.
            </Text>
            <Section className="m-auto">
              <Text className="p-4 text-center text-3xl">{code}</Text>
            </Section>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Link
                className="rounded bg-[#7df2cd] px-5 py-3 text-center text-[12px] font-semibold text-black no-underline"
                href="www.housemate.dev/sign-in"
              >
                Sign In
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
