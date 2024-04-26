import { green, red } from "colorette";
import { bookDeskForUser, formatDate } from "./util.js";

export default async function run(deskId, userId, { date = new Date() }) {
  console.log(`Booking desk ${deskId} for user ${userId}`);
  const bookingPayload = await bookDeskForUser(deskId, userId, new Date(date));

  if (bookingPayload.data.bookingsvc_CreateBooking !== null) {
    console.log(green(`Booking for ${formatDate(date)} done ;)`));
  } else {
    console.error(red("Unable to book desk"));
    console.log(JSON.stringify(bookingPayload));
  }
}
