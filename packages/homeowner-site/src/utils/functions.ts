export const concatAddress = (addressObject: IAddress) => {
  let address =
    addressObject.streetNumber +
    " " +
    addressObject.streetName +
    ", " +
    addressObject.suburb +
    ", " +
    addressObject.state +
    ", " +
    addressObject.country;
  if (!!addressObject.apartment) {
    // add apartment number in front /

    address = addressObject.apartment + " / " + address;
  }
  return address;
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const freeStorageLimit = 100000000; //100MB in bytes
