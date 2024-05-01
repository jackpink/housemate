import { InferSelectModel } from "drizzle-orm";
import {
  concatAddress,
  getByHomeownerId,
} from "../../../../core/homeowner/property";
import { property } from "../../../../core/db/schema";
import Link from "next/link";
import { CTAButton } from "../../../../ui/Atoms/Button";
import { PlusIcon } from "../../../../ui/Atoms/Icons";
import { Text } from "../../../../ui/Atoms/Text";

type Properties = Awaited<ReturnType<typeof getByHomeownerId>>;
//type Property = Properties[0]["property"];

type Property = InferSelectModel<typeof property>;

export default function Properties({ properties }: { properties: Properties }) {
  return (
    <div className="p-10">
      {properties.map((property) => (
        <div className="my-5" key={property.id}>
          <Property {...property} />
        </div>
      ))}

      <Link href="/properties/create" className="block">
        <CTAButton rounded className="w-full">
          <div className="flex w-full items-center justify-center">
            <PlusIcon width={28} />{" "}
            <Text className="ml-10 text-xl">Add Property</Text>
          </div>
        </CTAButton>
      </Link>
    </div>
  );
}

const Property = (property: Property) => {
  const address = concatAddress(property);

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="rounded-full bg-altSecondary p-7 hover:bg-altSecondary/80">
        <Text className="text-xl font-bold">{address}</Text>
      </div>
    </Link>
  );
};
