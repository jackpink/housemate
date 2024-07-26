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
import Logo from "../../../ui/Atoms/Logo";

export const VerificationEmail = ({ code }: { code: string }) => {
  return (
    <Html>
      <Head />
      <Preview>preview</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Logo width="300px" height="300px" fillColour="#c470e7" />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              <strong>Verfiy your email</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Enter the following code to finish Housemate sign up.
            </Text>
            <Section className="m-auto">
              <Text className="p-4 text-center text-xl">{code}</Text>
            </Section>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={"www.housemate.dev/sign-in"}
              >
                Sign In
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
