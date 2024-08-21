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

export default function PasswordResetEmail({ code }: { code: string }) {
  return (
    <Html>
      <Head />
      <Preview>You have requested to reset your password.</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mx-auto mt-[32px]">
              <Img
                src="static/logo.png"
                width="300"
                height="300"
                alt="housemate"
                className="mx-auto"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              <strong>Reset your password</strong>
            </Heading>
            <Text className="text-center text-[14px] leading-[24px] text-black">
              Click the following link to set a new password.
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Link
                className="rounded bg-[#7df2cd] px-5 py-3 text-center text-[12px] font-semibold text-black no-underline"
                href={"https://housemate.dev/password-reset/" + code}
              >
                Reset Password Link
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
