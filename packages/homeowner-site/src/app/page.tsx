import Link from "next/link";
import Logo, { HorizontalLogo } from "../../../ui/Atoms/Logo";
import Image from "next/image";
import computerMarketing from "../../public/laptopmarketingimage.png";
import remindersMarketing from "../../public/remindersmarketingimage.png";
import { EmailSentIcon, ScheduleIcon, ToDoIcon } from "../../../ui/Atoms/Icons";
import scheduleGif from "../../public/schedule-show.gif";
import todoGif from "../../public/todo-complete.gif";

export default function HomePage() {
  return (
    <main className=" min-h-screen ">
      <div className="flex w-full items-center justify-center ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <Logo height="300" width="300" fillColour="#7df2cd" />
          <div className="flex flex-col items-center justify-center gap-4 text-center ">
            <p className="text-3xl font-bold">
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
      </div>
      <div className="flex w-full flex-col items-center justify-center pb-8">
        <div className="flex w-full items-center justify-center rounded-t-full bg-brand py-4">
          <ScheduleIcon width={30} height={30} />
          <h2 className="pl-2 text-2xl font-bold">Schedule</h2>
        </div>
        <div className="grid max-w-screen-lg gap-8 md:grid-cols-2">
          <div className="hidden items-center justify-center p-2 md:flex">
            <Image
              src={scheduleGif}
              alt="Schedule Marketing"
              className="shadow-lg shadow-black"
              width={600}
              height={600}
              unoptimized={true}
            />
          </div>
          <div className="container flex flex-col items-center gap-4  px-4 py-16 ">
            <div className=" items-center justify-center p-2 md:hidden">
              <Image
                src={scheduleGif}
                alt="Schedule Marketing"
                className="shadow-lg shadow-black"
                width={500}
                height={500}
                unoptimized={true}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-4 text-center ">
              <p className="text-2xl font-bold">Never Miss a Beat!</p>
              <p className="text-md font-semibold">
                Imagine a life where your home tasks are organized and
                manageable. With yh, you can schedule to view all your upcoming
                tasks at a glance! No more frantic searches for sticky notes or
                that one elusive to-do list buried under a pile of laundry.
                We've got your back, ensuring that every chore is just a tap
                away. It's like having a personal assistant, only without the
                fancy coffee runs!
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center pb-8">
        <div className="flex w-full items-center justify-center rounded-t-full bg-brand py-4">
          <ToDoIcon width={40} height={40} />
          <h2 className="pl-2 text-2xl font-bold">To Dos</h2>
        </div>
        <div className="grid max-w-screen-lg gap-8 md:grid-cols-2 ">
          <div className="container flex flex-col items-center gap-4  px-4 py-16 ">
            <div className="items-center justify-center p-2 md:hidden">
              <Image
                src={todoGif}
                alt="To Do Marketing"
                className="shadow-lg shadow-black"
                width={600}
                height={600}
                unoptimized={true}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-4 text-center ">
              <p className="text-2xl font-bold">
                Check It Off, Feel the Relief!
              </p>
              <p className="text-md font-semibold">
                You know that feeling when you cross an item off your to-do
                list? It's like winning a mini lottery! With our intuitive
                check-off feature, you can easily mark tasks as completed and
                watch your list shrink. Say goodbye to that overwhelming feeling
                of never-ending chores. Each check is a victory, and each
                victory brings you one step closer to a perfectly managed home.
                Who knew home management could be so satisfying?.
              </p>
            </div>
          </div>
          <div className="hidden items-center justify-center p-2 md:flex">
            <Image
              src={todoGif}
              alt="To Do Marketing"
              className="shadow-lg shadow-black"
              width={500}
              height={500}
              unoptimized={true}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center pb-8">
        <div className="flex w-full items-center justify-center rounded-t-full bg-brand py-4">
          <EmailSentIcon width={40} height={40} />
          <h2 className="pl-2 text-2xl font-bold">Reminders</h2>
        </div>
        <div className="grid max-w-screen-lg gap-8 md:grid-cols-2 ">
          <div className="hidden items-center justify-center md:flex">
            <Image
              src={remindersMarketing}
              alt="Reminders Marketing"
              width={500}
              height={500}
            />
          </div>
          <div className="container flex flex-col items-center gap-4  px-4 py-16 ">
            <div className=" items-center justify-center md:hidden">
              <Image
                src={remindersMarketing}
                alt="Reminders Marketing"
                width={300}
                height={300}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-4 text-center ">
              <p className="text-2xl font-bold">
                Stay on Track with Reminders!
              </p>
              <p className="text-md font-semibold">
                Life gets busy, and sometimes we need a gentle nudge to stay on
                track. That's why yh sends you email reminders that are as
                friendly as your favorite neighbor. Whether it's time to water
                the plants or remember that important appointment, we've got
                your schedule covered. Think of us as your home management
                cheerleaders, minus the pom-poms
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
