import { useState, useMemo } from "react";

interface Bill {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  frequency: string;
  category: string;
  isPaid: boolean;
}

interface CalendarProps {
  bills: Bill[];
  onPayBill: (id: number) => void;
}

export default function CustomCalendar({ bills, onPayBill }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const billsByDate = useMemo(() => {
    const billsMap: { [key: string]: Bill[] } = {};

    bills.forEach((bill) => {
      const billDate = new Date(bill.last_date || bill.first_date);
      const dateKey = `${billDate.getFullYear()}-${billDate.getMonth()}-${billDate.getDate()}`;

      if (!billsMap[dateKey]) {
        billsMap[dateKey] = [];
      }
      billsMap[dateKey].push(bill);
    });

    return billsMap;
  }, [bills]);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDate(null);
  };

  const getDayBills = (day: number) => {
    const dateKey = `${currentYear}-${currentMonth}-${day}`;
    return billsByDate[dateKey] || [];
  };

  const selectedDateBills = selectedDate
    ? getDayBills(selectedDate.getDate())
    : [];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6">
      {/* Calendar */}
      <div className="lg:col-span-3 bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-gray-500 border-b"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 1)}</span>
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="p-2 sm:p-3 h-12 sm:h-20" />
            ))}

            {/* Calendar Days */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayBills = getDayBills(day);
              const isSelected = selectedDate?.getDate() === day;
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === currentMonth &&
                new Date().getFullYear() === currentYear;
              const hasBills = dayBills.length > 0;

              return (
                <div
                  key={day}
                  onClick={() =>
                    setSelectedDate(new Date(currentYear, currentMonth, day))
                  }
                  className={`p-2 sm:p-3 h-12 sm:h-20 border cursor-pointer transition-all hover:bg-gray-50 ${
                    isSelected
                      ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200"
                      : isToday
                      ? "bg-yellow-50 border-yellow-300"
                      : hasBills
                      ? "border-orange-200 bg-orange-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-medium text-gray-900 mb-1">
                    {day}
                  </div>
                  {hasBills && (
                    <div className="flex items-center justify-center">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full"></div>
                      <span className="ml-1 text-xs text-gray-600">
                        {dayBills.length}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedDate ? selectedDate.toLocaleDateString() : "Select a date"}
          </h3>
        </div>

        <div className="p-4 sm:p-6 h-full overflow-y-auto">
          {selectedDate && selectedDateBills.length > 0 ? (
            <div className="space-y-4">
              {selectedDateBills.map((bill) => {
                // Parse JSON fields
                let amount = 0;
                try {
                  amount = JSON.parse(
                    bill.last_amount || bill.average_amount || '{"amount":0}'
                  ).amount;
                } catch {
                  amount = 0;
                }
                let category = "";
                try {
                  const cat = JSON.parse(
                    bill.personal_finance_category || "{}"
                  );
                  category = cat.detailed || cat.primary || "";
                } catch {
                  category = "";
                }

                return (
                  <div
                    key={bill.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                        {bill.description}
                      </h4>
                      {/* <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  bill.status === "PAID"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
                  >
                {bill.status === "PAID" ? "Paid" : "Unpaid"}
                  </span> */}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <p>
                        <span className="font-medium">Amount:</span> $
                        {Number(amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="w-full overflow-hidden text-wrap text-ellipsis">
                        <span className="font-medium ">Category:</span>{" "}
                        <span className="">{category}</span>
                      </p>
                      <p>
                        <span className="font-medium">Frequency:</span>{" "}
                        {bill.frequency}
                      </p>
                    </div>
                    {bill.status !== "PAID" && (
                      <button
                        onClick={() => onPayBill(bill.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : selectedDate ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <div className="text-center">
                <svg
                  className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm">No bills due on this date</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <div className="text-center">
                <svg
                  className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6"
                  />
                </svg>
                <p className="text-sm">Click on a date to see bills</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
