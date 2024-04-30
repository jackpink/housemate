import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageTitle } from "../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../ui/Atoms/PageLayout";
import { auth } from "~/auth";
import { signOutAction } from "~/app/actions";

export default async function PropertiesPage() {
  const session = await auth();
  console.log("Session", session);
  const onClickSignOut = () => {
    signOutAction();
  };
  if (session?.user) {
    return (
      <form action={signOutAction}>
        <button type="submit">Log out</button>
      </form>
    );
  }
  return (
    <>
      <PageTitle>Properties</PageTitle>
      <PropertiesBreadcrumbs />
      <PageWithSingleColumn>
        Properties {JSON.stringify(session)}
      </PageWithSingleColumn>
    </>
  );
}
