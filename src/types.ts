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
  image?: string;
  description?: string;
}

export interface TeacherService {
  id: string;
  durationMinutes: number;
}

export interface TeacherOption {
  id: string;
  services: TeacherService[];
}

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
  perks: PricingPerks;
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
