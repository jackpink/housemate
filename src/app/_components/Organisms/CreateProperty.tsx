"use client";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Text } from "../Atoms/Text";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";

type ValidAddress = RouterOutputs["property"]["getValidAddress"];

export default function CreateProperty() {
  const [addressSearchTerm, setAddressSearchTerm] = useState("");

  const [ValidAddress, setValidAddress] = useState<ValidAddress | null>(null);

  const { mutate: getValidAddress, isLoading: isValidatingAddress } =
    api.property.getValidAddress.useMutation({
      onSuccess: (AddressObj) => {
        // Redirect to new Job route
        console.log("got address string", AddressObj);
        setValidAddress(AddressObj);
      },
    });

  const onClickSearch = useCallback(() => {
    console.log("search adddress");
    void getValidAddress({ addressSearchString: addressSearchTerm });
  }, [addressSearchTerm]);

  return (
    <div className="flex flex-col items-center justify-center border-2 border-black p-6">
      <AddressSearch
        setAddressSearchTerm={setAddressSearchTerm}
        onClickSearch={onClickSearch}
      />
      <Text>Try searching for your address</Text>
    </div>
  );
}

type AddressSearchProps = {
  setAddressSearchTerm: Dispatch<SetStateAction<string>>;
  onClickSearch: () => void;
};

const AddressSearch: React.FC<AddressSearchProps> = ({
  setAddressSearchTerm,
  onClickSearch,
}) => {
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setAddressSearchTerm(event.currentTarget.value);
  };

  return (
    <div className="w-full md:w-3/4 xl:w-1/2">
      <div className="relative mb-4 flex w-full flex-wrap items-stretch">
        <input
          type="search"
          className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-teal-700 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(13,148,136)] focus:outline-none dark:border-teal-600 dark:text-teal-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
          placeholder="Search by suburb or postcode"
          onChange={handleChange}
        />

        <button
          className="relative z-[2] flex items-center rounded-r border border-solid border-teal-700 bg-teal-500 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-teal-700 hover:shadow-lg focus:bg-teal-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-teal-800 active:shadow-lg"
          type="button"
          id="button-addon1"
          data-te-ripple-init
          data-te-ripple-color="light"
          onClick={onClickSearch}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
