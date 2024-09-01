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

export default function TaskUpcomingNotification({
  address = "1234 Main St, San Francisco, CA 94111",
  taskTitle = "Task Title",
  date = "2022-01-01",
  propertyId = "123",
  taskId = "123",
}: {
  address: string;
  taskTitle: string;
  date: string;
  propertyId: string;
  taskId: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>{`Task Reminder - ${taskTitle}`}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src="https://housemate.dev/logo.png"
                width="300"
                height="300"
                alt="housemate"
                className="mx-auto dark:hidden"
              />
              <Img
                src="https://housemate.dev/dark-logo.png"
                width="300"
                height="300"
                alt="housemate"
                className="mx-auto hidden dark:block"
              />
            </Section>
            <Heading className="mx-0 mt-[30px] p-0 text-center text-[24px] font-normal text-black">
              <strong>Task Reminder</strong>
            </Heading>
            <Text className="text-center">{address}</Text>
            <Text className="text-center text-[20px] leading-[24px] text-black">
              {`${taskTitle} is due on ${date}.`}
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Link
                className="rounded bg-[#7df2cd] px-5 py-3 text-center text-[12px] font-semibold text-black no-underline"
                href={`housemate.dev/properties/${propertyId}/schedule/${taskId}`}
              >
                Go to Task
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
