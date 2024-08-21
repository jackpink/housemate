import Link from "next/link";
import Logo, { HorizontalLogo } from "../../../ui/Atoms/Logo";
import { Text } from "../../../ui/Atoms/Text";
import {
  LargeButton,
  LargeButtonContent,
  LargeButtonTitle,
} from "../../../ui/Atoms/Button";
import Image from "next/image";
import computerMarketing from "../../public/laptopmarketingimage.png";

export default function HomePage() {
  return (
    <main className=" min-h-screen ">
      <div className="flex w-full items-center justify-center bg-brand">
        <div className="grid max-w-screen-lg gap-8 md:grid-cols-2 ">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <HorizontalLogo height={50} fillColour="#c470e7" />
            <div className="flex flex-col items-center justify-center gap-4 text-center ">
              <p className="text-2xl font-bold">
                Manage all your home management tasks.
              </p>
              <p className="text-lg font-semibold">
                Your home is your most important asset. It's crucial to stay on
                top of tasks and keep detailed records of all work done.
              </p>
              <Link
                href="/sign-up"
                className="rounded-full bg-brandSecondary p-4 px-10 text-lg font-bold"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="hidden items-center justify-center md:flex">
            <Image
              src={computerMarketing}
              alt="Computer Marketing"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
