import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageTitle } from "../../../../../../../../ui/Atoms/Title";
import { CapitaliseText } from "../../../../../../../../ui/Molecules/InPlaceEditableComponent";
import { PageWithSingleColumn } from "../../../../../../../../ui/Atoms/PageLayout";
import { auth } from "~/auth";
import { Property } from "../../../../../../../../core/homeowner/property";
import { concatAddress } from "~/utils/functions";

export default async function ToDoPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const session = await auth();

  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const address = concatAddress(property);

  if (
    !session ||
    !session.user ||
    !session.user.id ||
    session.user.id !== property.homeownerId
  ) {
    return <div>Not Authenticated</div>;
  }
  return (
    <div>
      <PageTitle>
        <CapitaliseText value={"To Do Items"} />
      </PageTitle>
      <PropertiesBreadcrumbs propertyId={params.propertyId} address={address} />
      <PageWithSingleColumn></PageWithSingleColumn>
    </div>
  );
}
