import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageTitle } from "../../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../../ui/Atoms/PageLayout";
import { auth } from "~/auth";
import { Property } from "../../../../../../core/homeowner/property";
import { Text } from "../../../../../../ui/Atoms/Text";
import Link from "next/link";
import { CTAButton } from "../../../../../../ui/Atoms/Button";
import { PlusIcon } from "../../../../../../ui/Atoms/Icons";
import { concatAddress } from "~/utils/functions";

export default async function PropertyPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const session = await auth();
  console.log("PropertyId", params.propertyId);

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
    <>
      <PageTitle>{address}</PageTitle>
      <PropertiesBreadcrumbs propertyId={params.propertyId} address={address} />
      <PageWithSingleColumn>
        <div className="p-10">
          <Link
            href={`/properties/${params.propertyId}/items/add`}
            className="block"
          >
            <CTAButton rounded className="w-full">
              <div className="flex w-full items-center justify-center">
                <PlusIcon width={28} />{" "}
                <Text className="ml-10 text-xl">Add Item</Text>
              </div>
            </CTAButton>
          </Link>
        </div>
      </PageWithSingleColumn>
    </>
  );
}
