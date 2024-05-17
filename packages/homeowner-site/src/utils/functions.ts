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
