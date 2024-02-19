import Link from "next/link";
import { Text } from "../Atoms/Text";
import { RightArrow } from "../Atoms/Icons";

interface IBreadcrumb {
  href: string;
  text: string;
}

type BreadcrumbsProps = {
  breadcrumbs: IBreadcrumb[];
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <div className="bg-altSecondary flex flex-wrap gap-2 px-8 py-6">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={index} className="flex flex-nowrap items-center">
          <span className="px-4">
            <RightArrow />
          </span>
          <Breadcrumb breadcrumb={breadcrumb} />
        </div>
      ))}
    </div>
  );
};

type BreadcrumbProps = {
  breadcrumb: IBreadcrumb;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumb }) => {
  return (
    <Link href={breadcrumb.href}>
      <Text colour="text-altPrimary hover:text-black/50 ">
        {breadcrumb.text}
      </Text>
    </Link>
  );
};

type PropertiesBreadcrumbsProps = {
  address?: string | undefined;
  propertyId?: string | undefined;
  propertyPage?: string;
};

export const PropertiesBreadcrumbs: React.FC<PropertiesBreadcrumbsProps> = ({
  address,
  propertyId,
  propertyPage,
}) => {
  console.log(address, propertyId, propertyPage);
  const breadcrumbs =
    address && propertyId && propertyPage
      ? [
          { href: "/properties", text: "Properties" },
          {
            href: `/property/${encodeURIComponent(propertyId)}`,
            text: address.split(",")[0] || address,
          },
          {
            href: `/property/${encodeURIComponent(
              propertyId,
            )}/${propertyPage.toLowerCase()}`,
            text: propertyPage,
          },
        ]
      : propertyId && address
        ? [
            { href: "/properties", text: "Properties" },
            {
              href: `/property/${encodeURIComponent(propertyId)}`,
              text: address.split(",")[0] || address,
            },
          ]
        : [{ href: "/properties", text: "Properties" }];

  return <Breadcrumbs breadcrumbs={breadcrumbs} />;
};
