import { PageWithSingleColumn } from "~/app/_components/Atoms/PageLayout";
import { PageTitle } from "~/app/_components/Atoms/Title";
import { CreatePropertyBreadcrumbs } from "~/app/_components/Molecules/Breadcrumbs";
import CreateProperty from "~/app/_components/Organisms/CreateProperty";

export default async function CreatePropertyPage() {
  const greeting = fetch(
    "https://d1uu624dwuoclc.cloudfront.net/api/trpc/post.hello?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22text%22%3A%22World%22%7D%7D%7D",
  ).then((res) => {
    console.log(res);
    return resizeTo;
  });

  console.log(greeting);

  return (
    <>
      <PageTitle>Create New Property</PageTitle>
      <CreatePropertyBreadcrumbs />
      <PageWithSingleColumn>
        <div className="pt-32">
          <h1>{}</h1>
          <CreateProperty />
        </div>
      </PageWithSingleColumn>
    </>
  );
}
