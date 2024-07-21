import Link from "next/link";
import Logo from "../../../ui/Atoms/Logo";
import { Text } from "../../../ui/Atoms/Text";
import {
  LargeButton,
  LargeButtonContent,
  LargeButtonTitle,
} from "../../../ui/Atoms/Button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <Logo width="300px" height="300px" fillColour="#c470e7" />
          <div className="flex flex-col items-center justify-center gap-4 text-center ">
            <Text>Welcome to Prop Doc the property maintenance app. </Text>
            <Text>Management all of the work done on your home.</Text>
            <Text>Search photos and documents for past work doe in rooms.</Text>
            <Link href="/properties" className="">
              <LargeButton>
                <LargeButtonTitle>Homepage</LargeButtonTitle>
                <LargeButtonContent>
                  Explore your properties and latest jobs
                </LargeButtonContent>
              </LargeButton>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
