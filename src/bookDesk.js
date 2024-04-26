import { green, red } from "colorette";
import { login, getCookie, bookDesk, formatDate } from "./util.js";

export default async function run(deskId) {
  console.log(`Booking desk ${deskId}`);
  const payload = await login();
  const cookie = getCookie(payload);

  const bookingPayload = await bookDesk(cookie, deskId, new Date());
  if (bookingPayload.data.bookingsvc_CreateBooking !== null) {
    console.log(green(`Booking for ${formatDate(date)} done ;)`));
  } else {
    console.error(red("Unable to book desk"));
    console.log(JSON.stringify(bookingPayload));
  }
}
