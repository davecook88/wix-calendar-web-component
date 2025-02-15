// Service Types
export type ServiceType = "CLASS" | "APPOINTMENT" | "COURSE";

export interface Price {
  currency: string;
  value: number;
}

export interface ServicePayment {
  rateType: "FIXED" | "VARIABLE";
  fixed: {
    price: Price;
  };
  pricingPlanIds: string[];
}

export interface ServiceMedia {
  mainMedia?: {
    image?: string;
  };
}

export interface Service {
  _id: string;
  name: string;
  tagLine?: string;
  type: ServiceType;
  hidden: boolean;
  description?: string;
  media?: ServiceMedia;
  payment: ServicePayment;
}

// Staff/Teacher Types
export interface Staff {
  _id: string;
  name: string;
  image: string | "null";
}

export interface StaffQuery {
  invalidArguments: any[];
  filterTree: Record<string, any>;
  encoder: Record<string, any>;
  validateCollectionName: boolean;
  provider: {
    cloudDataUrl: string;
    gridAppId: string;
    environment: string;
  };
  collectionName: string;
  skipNumber: number;
  included: any[];
  projectedFields: any[];
}

export interface StaffResponse {
  currentPage: number;
  items: Staff[];
  length: number;
  partialIncludes: boolean;
  query: StaffQuery;
  totalCount: number;
  totalPages: number;
}

// Event Schedule Availability
interface ScheduleAvailability {
  start: string;
  linkedSchedules: any[]; // You might want to type this more specifically
  locations?: any[]; // You might want to type this more specifically
  useDefaultLocation?: boolean;
}

// Event Schedule
interface EventSchedule {
  _id: string;
  scheduleOwnerId: string;
  scheduleOwnerName: string;
  firstSessionStart?: string;
  lastSessionEnd?: string;
  timeZone: string;
  intervals: any[]; // You might want to type this more specifically
  tags: string[];
  availability: ScheduleAvailability;
  totalNumberOfParticipants: number;
  participants: any[]; // You might want to type this more specifically
  status: string;
  created: string;
  updated: string;
  version: number;
  inheritedFields: any[]; // You might want to type this more specifically
}

// Resource
interface StaffResource {
  _id: string;
  name: string;
  email?: string;
  description?: string;
  tags: string[];
  scheduleIds: string[];
  status: string;
  wixUserId?: string;
  eventsSchedule: EventSchedule;
}

// Schedule
interface StaffSchedule {
  availability: {
    linkedSchedules: any[]; // You might want to type this more specifically
    start: string;
  };
  _id: string;
  scheduleOwnerId: string;
}

// Slug
interface StaffSlug {
  _createdDate: string;
  name: string;
}

// Updated Staff interface
export interface Staff {
  resource: StaffResource;
  schedules: StaffSchedule[];
  slugs: StaffSlug[];
}

export interface TeacherService {
  id: string;
  durationMinutes: number;
  service?: Service;
}

export interface TeacherOption {
  id: string;
  services: TeacherService[];
  name: string;
  hexColor: string;
  imageUrl?: string;
}

export type Schedule = {
  _id: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
};

export type TeacherResourceResource = {
  _id: string;
  name: string;
  hexColor: string;
};

export type TeacherResource = {
  resource: TeacherResourceResource;
  schedules: Schedule[];
  slugs: string[];
};

// Availability Types
export interface Resource {
  _id: string;
  name: string;
}

export interface Slot {
  startDate: string;
  endDate: string;
  serviceId: string;
  resource: Resource;
  nestedSlots: Slot[];
  sessionId?: string;
}

export interface AvailabilitySlot {
  slot: Slot;
  bookable: boolean;
  openSpots: number;
  totalSpots: number;
}

// Calendar Types
export interface CalendarEventExtendedProps {
  isAggregated: boolean;
  serviceType?: ServiceType;
  teacherName?: string;
  bookable: boolean;
  openSpots?: number;
  totalSpots?: number;
  teacherOptions: TeacherOption[];
  service?: Service;
  sessionId?: string;
}

export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  classNames: string[];
  extendedProps: CalendarEventExtendedProps;
}

// Pricing Types
export interface Duration {
  count: number;
  unit: string;
}

export interface PricingDetails {
  price: Price;
  singlePaymentForDuration?: Duration;
  subscription?: {
    cycleDuration: Duration;
  };
}

export interface PricingPerks {
  values: string[];
}

export interface PricingPlan {
  _id: string;
  name: string;
  description: string;
  pricing: PricingDetails;
  perks: string[];
}

// Utility Types
export interface AggregatedSlot {
  start: Date;
  end: Date;
  teacherOptions: TeacherOption[];
}

export interface DateRange {
  startDate: string;
  endDate: string;
}
