export type SubscriptionPlan = "free" | "monthly" | "annual";
export type SubscriptionStatus =
  | "none"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete";

export type SubscriptionSnapshot = {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  isPaid: boolean;
  dailyLimit: number;
  usageToday: number;
  remainingToday: number;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

export type CheckoutResponse = { url: string };
export type PortalResponse = { url: string };

export const FREE_LIMIT_EXCEEDED_CODE = "FREE_LIMIT_EXCEEDED";

export type FreeLimitErrorPayload = {
  statusCode: 402;
  code: typeof FREE_LIMIT_EXCEEDED_CODE;
  message: string;
  limit: number;
  used: number;
};
