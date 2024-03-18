export {};

declare global {
  interface IAddress {
    apartment: string | null;
    streetNumber: string;
    streetName: string;
    suburb: string;
    postcode: string;
    state: string;
    country: string;
  }
}
