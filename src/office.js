import { login, getCookie, getDateRange } from "./util.js";

async function fetchOffice(cookie, range) {
  const payload = {
    query:
      "query GetFloorplans($bookingStart: DateTimeInput!, $bookingEnd: DateTimeInput!) {\n  bookingsvc_GetFloorplansForTenancy {\n    floorplans {\n      ...DeskBookingFloorplan\n    }\n  }\n}\n\nfragment MinimalUser on User {\n  Id\n  profile {\n    name\n    photo {\n      id\n      src\n      fileExtension\n      name\n    }\n    birthday {\n      year\n      month\n      day\n    }\n    jobTitle\n    team {\n      teamName\n    }\n  }\n}\n\nfragment Geometry on Geometry {\n  id\n  entityType\n  entity {\n    __typename\n    ... on Desk {\n      id\n      teamIds\n      teams {\n        id\n        teamName\n      }\n      amenities {\n        id\n        name\n      }\n      name\n      bookings(start: $bookingStart, end: $bookingEnd) {\n        id\n        start {\n          ISOString\n        }\n        bookedForUser {\n          ...MinimalUser\n        }\n      }\n    }\n    ... on MeetingRoom {\n      id\n      name\n    }\n    ... on FloorplanZone {\n      id\n      name\n    }\n  }\n  vertices {\n    x\n    y\n  }\n  innerRectangle {\n    angle\n    center {\n      x\n      y\n    }\n    northWest {\n      x\n      y\n    }\n    height\n    width\n  }\n}\n\nfragment DeskBookingFloorplan on Floorplan {\n  id\n  name\n  geometries {\n    ...Geometry\n  }\n}",
    variables: {
      bookingStart: {
        ISOString: range.start.toISOString(),
      },
      bookingEnd: {
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
export default async function run(team, { date = new Date() }) {
  const payload = await login();
  const cookie = getCookie(payload);
  const range = getDateRange(new Date(date));

  const officePayload = await fetchOffice(cookie, range);

  const filteredDesks =
    officePayload.data.bookingsvc_GetFloorplansForTenancy.floorplans[0].geometries
      .filter((node) => {
        return node.entity?.amenities?.some((amenity) => amenity.name === team);
      })
      .sort((a, b) => {
        const aid = Number(a.entity.name);
        const bid = Number(b.entity.name);

        return aid - bid;
      })
      .map((node) => {
        return {
          desk: node.entity.name,
          id: node.entity.id,
          bookings: node.entity.bookings.map((booking) => {
            return {
              name: booking.bookedForUser?.profile.name,
              userId: booking.bookedForUser?.Id, // Why Id not id ?
              id: booking.id,
            };
          }),
        };
      });

  console.log(JSON.stringify(filteredDesks, "", "\t"));
}
