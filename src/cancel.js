import { green, red } from "colorette";
import { login, getCookie } from "./util.js";

/**
 * Payload from Cancel
 * @typedef {{data: {bookingsvc_DeleteBooking: {booking: {}}}}} CancelPayload
 */

/**
 * Cancel a booking
 * @param {string} cookie
 * @param {string} bookingId
 * @returns {Promise<CancelPayload>}
 */
async function cancelBooking(cookie, bookingId) {
  const payload = {
    query:
      "mutation DeleteDeskBooking($id: String!) {\n  bookingsvc_DeleteBooking(id: $id) {\n    booking {\n      ...DeskBooking\n    }\n  }\n}\n\nfragment DeskBooking on RoomOrDeskBooking {\n  id\n  start {\n    ISOString\n  }\n  desk {\n    id\n    name\n    amenities {\n      id\n      name\n    }\n    floorplanId\n  }\n  deletedAt {\n    ISOString\n  }\n}",
    variables: {
      id: bookingId,
    },
  };
  const response = await fetch(
    `https://go.kittoffices.com/go-graphql?t=${cookie}`,
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": cookie,
      },
      body: JSON.stringify(payload),
    }
  );
  return response.json();
}
export default async function run(bookingId) {
  console.log(`Cancelling booking ${bookingId}`);
  const payload = await login();
  const cookie = getCookie(payload);

  const cancelPayload = await cancelBooking(cookie, bookingId);

  if (cancelPayload.data.bookingsvc_DeleteBooking !== null) {
    console.log(green("Deleting booking done ;)"));
  } else {
    console.error(red("Unable to delete booking"));
    console.log(JSON.stringify(cancelPayload));
  }
}
