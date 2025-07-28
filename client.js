import {
  getCalendarData,
  getSlots,
  getPlans,
  getTeacherResources,
  getStaff,
} from "backend/calendar.web.js";

let serviceId = null;

let calendarData = null;
const currentDates = {
  start: null,
  end: null,
};

const setSlots = (slots) => {
  console.log("setSlots", slots, "serviceId", serviceId);
  const filteredSlots = slots.filter((s) => {
    console.log(s.slot);
    return s.slot.serviceId === serviceId;
  });
  console.log("filteredSlots", filteredSlots);
  calendar.setAttribute("availability", JSON.stringify(filteredSlots));
};

const setPlans = (plans) => {
  console.log("setPlans", plans);
  calendar.setAttribute("plans", JSON.stringify(plans));
};

const setCalendarData = (data) => {
  console.log("setCalendarData", data);
  calendarData = data;
  calendar.setAttribute("services", JSON.stringify(data.services));
  calendar.setAttribute("teachers", JSON.stringify(data.teachers));
};

const refreshCalendarData = async () => {
  const startTimestamp = new Date().getTime();
  calendarData = await getCalendarData();
  setCalendarData(calendarData);
  const endTimestamp = new Date().getTime();
  console.log(
    "refreshCalendarData time elapsed",
    endTimestamp - startTimestamp,
    "ms"
  );
};

let calendar = $w("#teaching-calendar");

const updateSlots = async ({ startDate, endDate }) => {
  const startTimestamp = new Date().getTime();
  if (
    currentDates.start <= startDate &&
    currentDates.end >= startDate &&
    currentDates.start <= endDate &&
    currentDates.end >= endDate
  ) {
    return;
  }
  currentDates.start = startDate;
  currentDates.end = endDate;
  if (!calendarData) {
    await refreshCalendarData();
  }
  const serviceId = calendarData.services.map((s) => s._id);
  const _slots = await getSlots({
    filter: {
      serviceId,
      bookable: true,
      startDate,
      endDate,
    },
  });

  const endTimestamp = new Date().getTime();
  return _slots;
};

const setSlotsFromDates = async ({ startDate, endDate }) => {
  const slots = await updateSlots({ startDate, endDate });
  if (!slots) {
    return;
  }
  setSlots(slots);
};

const onCalendarDateSet = async (e) => {
  const { start: startDate, end: endDate } = JSON.parse(e.detail);
  setSlotsFromDates({ startDate, endDate });
};

const onGetPlans = async (e) => {
  const planIds = JSON.parse(e.detail);
  const plans = await getPlans(planIds);
  setPlans(plans);
};

const onPackageSelected = (e) => {
  // Add your package selection handling logic here
};

const initialLoadSlots = async () => {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);
  endDate.setDate(endDate.getDate() + 14);
  const startDateString = startDate.toISOString();
  const endDateString = endDate.toISOString();
  setSlotsFromDates({ startDate: startDateString, endDate: endDateString });
};

$w.onReady(async function () {
  setTimeout(() => {
    const serviceIdElement = $w("#serviceid");
    serviceId = serviceIdElement.text; // or .value if it's an input
    console.log("serviceId after delay", serviceId);
  }, 100); // Usually 100ms is enough

  serviceId = $w("#serviceid").text;
  console.log("serviceId", serviceId);

  calendar = $w("#teaching-calendar");

  // Set up event listeners
  calendar.on("dateset", onCalendarDateSet);
  calendar.on("get-plans", onGetPlans);
  calendar.on("view-packages-selected", onGetPlans);
  calendar.on("package-selected", onPackageSelected);

  // Initialize data
  await refreshCalendarData();
  await initialLoadSlots();

  // Load initial staff and resources
  const staff = await getStaff();
  calendar.setAttribute("teachers", JSON.stringify(staff?.items || []));
  calendar.setAttribute("default-type", "COURSE");
});
