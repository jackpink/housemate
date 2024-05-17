import { headers } from "next/headers";

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

export async function getDeviceType() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const mobile = userAgent!.match(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,
  );
  if (mobile) {
    console.log("mobile");
    return "mobile";
  } else {
    console.log("desktop");
    return "desktop";
  }
}
