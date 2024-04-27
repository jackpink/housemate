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

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <div className="flex flex-wrap gap-2 bg-altSecondary px-8 py-6">
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
