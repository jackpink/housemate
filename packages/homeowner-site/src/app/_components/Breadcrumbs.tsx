import { Breadcrumbs } from "../../../../ui/Molecules/Breadcrumbs";

type PropertiesBreadcrumbsProps = {
  address?: string | undefined;
  propertyId?: string | undefined;
  propertyPage?: string;
};
/* 
****************
UGLY NEEDS REFACTOR
****************
*/
export const PropertiesBreadcrumbs: React.FC<PropertiesBreadcrumbsProps> = ({
  address,
  propertyId,
  propertyPage,
}) => {
  const breadcrumbs =
    address && propertyId && propertyPage
      ? [
          { href: "/properties", text: "Properties" },
          {
            href: `/properties/${encodeURIComponent(propertyId)}`,
            text: address.split(",")[0] ?? address,
          },
          {
            href: `/properties/${encodeURIComponent(
              propertyId,
            )}/${propertyPage.toLowerCase()}`,
            text: propertyPage,
          },
        ]
      : propertyId && address
        ? [
            { href: "/properties", text: "Properties" },
            {
            href: `/properties/${encodeURIComponent(propertyId)}`,
              text: address.split(",")[0] ?? address,
            },
          ]
        : [{ href: "/properties", text: "Properties" }];

  return <Breadcrumbs breadcrumbs={breadcrumbs} />;
};

export const CreatePropertyBreadcrumbs: React.FC = () => {
  const breadcrumbs = [
    { href: "/properties", text: "Properties" },
    { href: "/properties/create", text: "Create" },
  ];

  return <Breadcrumbs breadcrumbs={breadcrumbs} />;
};
