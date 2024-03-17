"use client";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { ErrorMessage, Text } from "../Atoms/Text";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";
import { concatAddress } from "~/utils/functions";
import { CTAButton } from "../Atoms/Button";
import { useUser } from "@clerk/nextjs";
import { getValidAddress } from "~/app/actions";
import { createProperty } from "~/app/actions/property";
import { SearchIcon } from "../Atoms/Icons";
import { redirect } from "next/navigation";

//type ValidAddress = RouterOutputs["property"]["getValidAddress"];
type ValidAddress = Awaited<ReturnType<typeof getValidAddress>>;

export default function CreateProperty() {
  const [addressSearchTerm, setAddressSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [validAddress, setValidAddress] = useState<ValidAddress | null>(null);

  // const { mutate: getValidAddress, isLoading: isValidatingAddress } =
  //   api.property.getValidAddress.useMutation({
  //     onSuccess: (AddressObj) => {
  //       // Redirect to new Job route

  //       setValidAddress(AddressObj);
  //     },
  //   });

  const onClickSearch = useCallback(() => {
    setSearchLoading(true);
    getValidAddress({ addressSearchString: addressSearchTerm })
      .then((addressObject) => {
        setValidAddress(addressObject);
        setSearchLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setSearchLoading(false);
      });
  }, [addressSearchTerm]);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <AddressSearch
        setAddressSearchTerm={setAddressSearchTerm}
        onClickSearch={onClickSearch}
        searchLoading={searchLoading}
      />
      <AddressResults validAddress={validAddress} />
    </div>
  );
}

type AddressSearchProps = {
  setAddressSearchTerm: Dispatch<SetStateAction<string>>;
  onClickSearch: () => void;
  searchLoading: boolean;
};

const AddressSearch: React.FC<AddressSearchProps> = ({
  setAddressSearchTerm,
  onClickSearch,
  searchLoading,
}) => {
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setAddressSearchTerm(event.currentTarget.value);
  };

  return (
    <div className="w-full md:w-3/4 xl:w-1/2">
      <input
        type="search"
        className="w-full rounded-full border-2 border-solid border-dark p-6 outline-none"
        placeholder="Search by suburb or postcode"
        onChange={handleChange}
      />

      <CTAButton
        loading={searchLoading}
        onClick={onClickSearch}
        rounded
        className="mt-10 w-full"
      >
        <div className="flex justify-center">
          <Text className="pr-4">Search Address</Text>
          <SearchIcon />
        </div>
      </CTAButton>
    </div>
  );
};

type AddressResultsProps = {
  validAddress: IAddress | null;
};

const AddressResults: React.FC<AddressResultsProps> = ({ validAddress }) => {
  const { isLoaded, user } = useUser();
  if (isLoaded) {
    console.log("user f", user?.publicMetadata);
  }
  if (!validAddress) {
    return null;
  }
  const address = concatAddress(validAddress);
  if (address.includes(", ,")) {
    return (
      <Text className="pt-10">
        Not Found, Please add more detail to the address
      </Text>
    );
  }

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <AddressFound
      address={address}
      validAddress={validAddress}
      userId={user?.publicMetadata.appUserId as string}
    />
  );
};

const AddressFound: React.FC<{
  address: string;
  validAddress: IAddress;
  userId: string;
}> = ({ address, validAddress, userId }) => {
  // const { mutate: createProperty, isLoading: isCreatingProperty } =
  //   api.property.create.useMutation({
  //     onSuccess: (property) => {
  //       // Redirect to new property route
  //     },
  //   });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ errorState: false, errorMessage: "" });
  console.log("userId", userId);

  const onClickCreateProperty = useCallback(() => {
    setLoading(true);
    createProperty({
      apartment: validAddress.apartment ?? undefined,
      streetNumber: validAddress.streetNumber,
      streetName: validAddress.street,
      suburb: validAddress.suburb,
      postcode: validAddress.postcode,
      country: validAddress.country,
      state: validAddress.state,
      homeownerId: userId,
    })
      .then((property) => {
        setLoading(false);
        console.log("property", property);
        redirect(`/properties/${property.id}`);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setError({
          errorState: true,
          errorMessage: `Error creating property ${error}`,
        });
      });
  }, [validAddress]);
  return (
    <div className="flex flex-col items-center pt-10">
      <Text className="text-3xl font-bold">{address}</Text>
      <Text className="pb-6 pt-2">
        Is this your address? Create property for this address below
      </Text>
      <CTAButton
        onClick={onClickCreateProperty}
        rounded
        loading={loading}
        className="pb-4"
      >
        Create Property <br />
      </CTAButton>
      <ErrorMessage
        error={error.errorState}
        errorMessage={error.errorMessage}
      />
    </div>
  );
};
