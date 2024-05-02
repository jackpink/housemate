import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageTitle } from "../../../../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../../../../ui/Atoms/PageLayout";
import { auth } from "~/auth";
import { Property } from "../../../../../../../../core/homeowner/property";
import { TextInputWithError } from "../../../../../../../../ui/Atoms/TextInput";
import Link from "next/link";
import { CTAButton } from "../../../../../../../../ui/Atoms/Button";
import { PlusIcon } from "../../../../../../../../ui/Atoms/Icons";
import { concatAddress } from "~/utils/functions";

export default async function AddItemPage({
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
    <>
      <PageTitle>Add Item</PageTitle>
      <PropertiesBreadcrumbs propertyId={params.propertyId} address={address} />
      <PageWithSingleColumn>
        <div className="p-10">
          <form className="flex flex-col gap-4">
            <TextInputWithError label="Title" />
            <Status />
            <Category />
            <CTAButton rounded className="mt-8 w-full">
              Add Item
            </CTAButton>
          </form>
        </div>
      </PageWithSingleColumn>
    </>
  );
}

function Status() {
  return (
    <>
      <label htmlFor="status" className="text-lg">
        Status
      </label>
      <select
        id="status"
        name="status"
        size="1"
        className="rounded-full bg-altSecondary/70 p-6"
      >
        <option value="ToDo">To Do</option>
        <option value="Completed">Completed</option>
      </select>
    </>
  );
}

function Category() {
  return (
    <>
      <label htmlFor="category" className="text-lg">
        Category
      </label>
      <select
        id="category"
        name="category"
        size="1"
        className="rounded-full bg-altSecondary/70 p-6"
      >
        <option value="Job">Job</option>
        <option value="Product">Product</option>
        <option value="Issue">Issue</option>
      </select>
    </>
  );
}
