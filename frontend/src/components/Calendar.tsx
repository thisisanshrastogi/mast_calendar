// components/BillCalendar.tsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import tippy from "tippy.js";
import axi from "../utils/axios_cofig";
import Loader from "./Loader";
import "tippy.js/dist/tippy.css";
// import "@fullcalendar/common/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";

export default function Calendar() {
  const [loading, setLoading] = useState(false);
  const fetchRecurringTransactions = async () => {
    try {
      const response = await axi.get("/plaid/recurring_transactions");
      console.log(response);
      // Expecting data to be in format: { inflowStreams: [], outflowStreams: [] }
      return {
        inflowStreams: response.data.inflowStreams || [],
        outflowStreams: response.data.outflowStreams || [],
      };
    } catch (error) {
      console.error("Failed to fetch recurring transactions:", error);
      return {
        inflowStreams: [],
        outflowStreams: [],
      };
    }
  };

  const [events, setEvents] = useState([
    { title: "Netflix Subscription", date: "2025-06-02" },
    { title: "Electricity Bill", date: "2025-06-05" },
  ]);

  const handleDateClick = (info: any) => {
    const title = prompt("Enter bill name:");
    if (title) {
      setEvents([...events, { title, date: info.dateStr }]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { inflowStreams, outflowStreams } =
        await fetchRecurringTransactions();
      const newEvents = [
        ...inflowStreams.map((stream: any) => ({
          title: stream.description,
          date: stream.predicted_next_date,
          amount: stream.average_amount.amount.toFixed(2),
        })),
        ...outflowStreams.map((stream: any) => ({
          title: stream.description,
          date: stream.predicted_next_date,
          amount: stream.average_amount.amount.toFixed(2),
        })),
      ];
      setEvents(newEvents);
      setLoading(false);
    };

    loadData();
  }, []);
  if (loading) return <Loader />;
  return (
    <div className="p-4 h-full bg-white">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventColor="teal"
        eventDidMount={(info) => {
          // Show amount and description/title on hover
          const amount = info.event.extendedProps.amount;
          const description =
            info.event.extendedProps.description || info.event.title;
          const tooltipContent = amount ? `Amount: $ ${amount}` : description;
          tippy(info.el, {
            content: tooltipContent,
            allowHTML: true,
          });
        }}
        height="auto"
      />
    </div>
  );
}
