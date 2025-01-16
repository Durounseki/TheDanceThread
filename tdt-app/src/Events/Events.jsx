import { useEffect, useState } from "react";
import SearchEvent from "./components/Search.jsx";
import EventSchedule from "./components/EventSchedule.jsx";
import EventDetails from "./components/EventDetails.jsx";
import EventNotFound from "./components/EventNotFound.jsx";

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/events`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.log("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  return { events, loading };
};

const Events = () => {
  const { events, loading } = useEvents();
  // const events = [
  //   {
  //     id: "cm5rzxlwd0000yv0ons61x9xo",
  //     name: "BMJ",
  //     date: new Date("2025-07-11T00:00:00.000Z"),
  //     country: "Japan",
  //     city: "Tokyo",
  //     description: "Bachata Media Japan: Sensual Festival 25",
  //     venues: [
  //       {
  //         name: "Seavans",
  //         url: "https://www.google.co.jp/maps/place/%E3%82%B7%E3%83%BC%E3%83%90%E3%83%B3%E3%82%B9%E3%83%9B%E3%83%BC%E3%83%AB/@35.6494197,139.7566583,17z/data=!3m1!4b1!4m5!3m4!1s0x60188bcbe1bd4693:0xf0a00e64a954d95f!8m2!3d35.6494197!4d139.7566583",
  //       },
  //       {
  //         name: "Monzen-Nakacho Coffice",
  //         url: "https://www.google.com/maps/place/cafe%26dining+COFFICE/@35.6734221,139.7952796,17z/data=!3m1!4b1!4m6!3m5!1s0x601889e516284a43:0x70ec3baf0833ac0d!8m2!3d35.6734221!4d139.7952796!16s%2Fg%2F11ghtn78lg?entry=ttu&g_ep=EgoyMDI1MDEwOC4wIKXMDSoASAFQAw%3D%3D",
  //       },
  //     ],
  //     sns: [
  //       {
  //         id: "cm5rzxlwd0004yv0oa1t04wei",
  //         name: "website",
  //         url: "https://www.bachatamediajapan.com/bmjsensualfestival,",
  //         faClass: "fa-solid fa-globe",
  //       },
  //       {
  //         id: "cm5rzxlwd0005yv0oh3slw2ji",
  //         name: "facebook",
  //         url: "https://www.facebook.com/people/Bachata-Media-Japan-Sensual-Festival/100069003582964/",
  //         faClass: "fa-brands fa-square-facebook",
  //       },
  //     ],
  //     flyer: {
  //       alt: "BMJ",
  //       src: "https://tdt-bucket.026609ceb40004808666564e2c5224d7.r2.cloudflarestorage.com/1736604412972-bmj.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=33caf2aa22a7446b29708ed552504acb%2F20250111%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250111T151442Z&X-Amz-Expires=3600&X-Amz-Signature=d1d63190ff1d7aebbf6f1c04d239269a5a193a31c492a5ef30158a9ea2f5de8a&X-Amz-SignedHeaders=host&x-id=GetObject",
  //     },
  //   },
  // ];
  return (
    <>
      <main className="event-dashboard">
        <aside className="event-schedule">
          <SearchEvent />
          <h2>Dance Events</h2>
          <EventSchedule events={events} />
        </aside>
        <article className="event-container">
          <section className="event-details-container">
            {events[0] ? <EventDetails event={events[0]} /> : <EventNotFound />}
          </section>
        </article>
      </main>
    </>
  );
};

export default Events;
