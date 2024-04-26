/**
 * Payload from Login
 * @typedef {{data: {usersvc_Login: {cookie: string}}}} LoginPayload
 */

/**
 * Login
 * @returns {Promise<LoginPayload>}
 */
export async function login() {
  const email = process.env.FUCKITT_EMAIL;
  const password = process.env.FUCKITT_PASSWORD;

  if (!email) {
    throw new Error(
      "FUCKITT_EMAIL is not defined. Please add FUCKITT_EMAIL to your environment variable"
    );
  }
  if (!password) {
    throw new Error(
      "FUCKITT_PASSWORD is not defined. Please add FUCKITT_PASSWORD to your environment variable"
    );
  }

  const payload = {
    query:
      "query Login($email: String!, $password: String!) {\n  usersvc_Login(email: $email, password: $password) {\n    cookie\n  }\n}",
    variables: {
      email,
      password,
    },
  };
  const response = await fetch("https://go.kittoffices.com/go-graphql?t=", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return response.json();
}

/**
 * @param {LoginPayload} payload
 * @returns {string}
 */
export function getCookie(payload) {
  return payload.data.usersvc_Login.cookie;
}

/**
 * @param {Number} number
 */
function padStart(number) {
  return `${number}`.padStart(2, "0");
}

/**
 * A date range
 * @typedef {{start: Date, end: Date}} Range
 */

/**
 * @param {Date} startDate
 * @return {Range}
 */
export function getDateRange(startDate) {
  const startYear = startDate.getFullYear();
  const startMonth = padStart(startDate.getMonth() + 1);
  const startDay = padStart(startDate.getDate());

  const start = new Date(`${startYear}-${startMonth}-${startDay} 00:00:00`);
  const end = new Date(`${startYear}-${startMonth}-${startDay} 23:59:59`);
  return { start, end };
}

/**
 * Payload from CreateDeskBooking
 * @typedef {{data: {bookingsvc_CreateBooking: {booking: {id: string}}}}} CreateDeskBooking
 */

/**
 * Book a Desk
 * @param {string} cookie
 * @param {string} deskId
 * @param {Date} date
 * @returns {Promise<CreateDeskBooking>}
 */
export async function bookDesk(cookie, deskId, date) {
  const range = getDateRange(date);
  const payload = {
    query:
      "mutation CreateDeskBooking($deskId: String!, $start: DateTimeInput!, $end: DateTimeInput!) {\n  bookingsvc_CreateBooking(\n    entityId: $deskId\n    start: $start\n    end: $end\n    entityType: DeskEntity\n    attendeeEmailAddresses: []\n  ) {\n    booking {\n      id\n      bookedForUser {\n        ...MinimalUser\n      }\n    }\n  }\n}\n\nfragment MinimalUser on User {\n  Id\n  profile {\n    name\n    photo {\n      id\n      src\n      fileExtension\n      name\n    }\n    birthday {\n      year\n      month\n      day\n    }\n    jobTitle\n    team {\n      teamName\n    }\n  }\n}",
    variables: {
      deskId,
      start: {
        ISOString: range.start.toISOString(),
      },
      end: {
        ISOString: range.end.toISOString(),
      },
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

/**
 * Book a Desk
 * @param {string} cookie
 * @param {string} deskId
 * @param {string} userId
 * @param {Date} date
 * @returns {Promise<CreateDeskBooking>}
 */
export async function bookDeskForUser(cookie, deskId, userId, date) {
  const range = getDateRange(date);
  const payload = {
    query:
      "mutation CreateDeskBooking($deskId: String!, $userId: String!, $start: DateTimeInput!, $end: DateTimeInput!) {\n  bookingsvc_CreateBooking(\n    entityId: $deskId\n    start: $start\n    end: $end\n    entityType: DeskEntity\n    userId: $userId\n    attendeeEmailAddresses: []\n  ) {\n    booking {\n      id\n      bookedForUser {\n        ...MinimalUser\n      }\n    }\n  }\n}\n\nfragment MinimalUser on User {\n  Id\n  profile {\n    name\n    photo {\n      id\n      src\n      fileExtension\n      name\n    }\n    birthday {\n      year\n      month\n      day\n    }\n    jobTitle\n    team {\n      teamName\n    }\n  }\n}",
    variables: {
      userId,
      deskId,
      start: {
        ISOString: range.start.toISOString(),
      },
      end: {
        ISOString: range.end.toISOString(),
      },
    },
  };
  const response = await fetch(
    `https://go.kittoffices.com/go-graphql?t=${cookie}`,
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        // "x-auth-token": cookie,
      },
      body: JSON.stringify(payload),
    }
  );
  return response.json();
}
/**
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return date.toLocaleString("fr-FR", { dateStyle: "medium" });
}
