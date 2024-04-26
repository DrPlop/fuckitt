import parser from "cron-parser";
import { green, red } from "colorette";
import { login, getCookie, bookDesk, formatDate } from "./util.js";

export default async function run(cron, deskId, { limit }) {
  console.log(`Booking desk ${deskId}`);
  const payload = await login();
  const cookie = getCookie(payload);
  const interval = parser.parseExpression(cron);

  for (let i = 0; i < limit; i++) {
    const date = interval.next();
    const bookingPayload = await bookDesk(cookie, deskId, date);
    if (bookingPayload.data.bookingsvc_CreateBooking !== null) {
      console.log(green(`Booking for ${formatDate(date)} done ;)`));
    } else {
      console.error(red(`Unable to book a desk for ${formatDate(date)}`));
      console.log(JSON.stringify(bookingPayload));
    }
  }
}
