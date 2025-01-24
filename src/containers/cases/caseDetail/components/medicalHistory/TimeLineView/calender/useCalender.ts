import {
  addDays,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { useEffect, useState } from "react";
import { createStaticRanges } from "react-date-range";

export default function useCalender({
  minYear,
  maxYear,
}: {
  minYear: number;
  maxYear: number;
}) {
  const [activateCustomRange, setActivateCustomRange] = useState(false);
  const [selectionRange, setSelectionRange] = useState<
    {
      startDate: Date;
      endDate: Date;
      key: string;
    }[]
  >();

  function handleChange(item: any) {
    // console.log("handleChange", item);
    if (item) {
      if (!item.selection.startDate || !item.selection.endDate) {
        setActivateCustomRange(true);
        setSelectionRange([
          {
            startDate: new Date(),
            endDate: subDays(new Date(), 7),
            key: "selection",
          },
        ]);
      } else {
        setSelectionRange([item.selection]);
        // onDateRangeChange(value);
        if (activateCustomRange) {
          setActivateCustomRange(false);
        }
      }
    }
  }

  const handleCancel = () => {
    setSelectionRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  };

  const defineds = {
    startOfWeek: startOfWeek(new Date()),
    endOfWeek: endOfWeek(new Date()),
    startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
    endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
    startOfToday: startOfDay(new Date()),
    endOfToday: endOfDay(new Date()),
    startOfYesterday: startOfDay(addDays(new Date(), -1)),
    endOfYesterday: endOfDay(addDays(new Date(), -1)),
    startOfMonth: startOfMonth(new Date()),
    endOfMonth: endOfMonth(new Date()),
    startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
    endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
  };

  const staticRanges = createStaticRanges([
    {
      label: "Custom",
      range: () =>
        ({
          startDate: null,
          endDate: null,
        } as any),
      hasCustomRendering: true,
      isSelected: () => activateCustomRange, // Prevent default selection behavior
    },
    {
      label: "Today",
      range: () => ({
        startDate: defineds.startOfToday,
        endDate: defineds.endOfToday,
      }),
      hasCustomRendering: true,
    },
    {
      label: "This Week",
      range: () => ({
        startDate: defineds.startOfWeek,
        endDate: defineds.endOfWeek,
      }),
      hasCustomRendering: true,
    },
    {
      label: "This Month",
      range: () => ({
        startDate: defineds.startOfMonth,
        endDate: defineds.endOfMonth,
      }),
      hasCustomRendering: true,
    },
    {
      label: "Last Month",
      range: () => ({
        startDate: defineds.startOfLastMonth,
        endDate: defineds.endOfLastMonth,
      }),
      hasCustomRendering: true,
    },
  ]);

  // export const defaultInputRanges = [
  //   {
  //     label: "days up to today",
  //     range(value) {
  //       return {
  //         startDate: addDays(
  //           defineds.startOfToday,
  //           (Math.max(Number(value), 1) - 1) * -1
  //         ),
  //         endDate: defineds.endOfToday,
  //       };
  //     },
  //     getCurrentValue(range) {
  //       if (!isSameDay(range.endDate, defineds.endOfToday)) return "-";
  //       if (!range.startDate) return "∞";
  //       return (
  //         differenceInCalendarDays(defineds.endOfToday, range.startDate) + 1
  //       );
  //     },
  //   },
  //   {
  //     label: "days starting today",
  //     range(value) {
  //       const today = new Date();
  //       return {
  //         startDate: today,
  //         endDate: addDays(today, Math.max(Number(value), 1) - 1),
  //       };
  //     },
  //     getCurrentValue(range) {
  //       if (!isSameDay(range.startDate, defineds.startOfToday)) return "-";
  //       if (!range.endDate) return "∞";
  //       return (
  //         differenceInCalendarDays(range.endDate, defineds.startOfToday) + 1
  //       );
  //     },
  //   },
  // ];

  useEffect(() => {
    // console.log("marks", maxYear, minYear);
    if (!selectionRange && minYear && maxYear) {
      setSelectionRange([
        {
          startDate: new Date(minYear, 0, 1), // January 1st of minYear
          endDate: new Date(maxYear, 11, 31), // December 31st of maxYear
          key: "selection",
        },
      ]);
    }
  }, [minYear, maxYear]);

  return {
    staticRanges,
    activateCustomRange,
    setActivateCustomRange,
    selectionRange,
    setSelectionRange,
    handleChange,
    handleCancel,
  };
}
