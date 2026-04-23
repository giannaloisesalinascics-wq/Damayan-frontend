export type PortalRole = "admin" | "dispatcher" | "site_manager" | "citizen";

export type AppRoute =
  | "role-selector"
  | "admin-login"
  | "admin-dashboard"
  | "dispatcher-login"
  | "dispatcher-before"
  | "dispatcher-during"
  | "site-manager-login"
  | "site-manager-signup"
  | "site-manager-before"
  | "site-manager-during"
  | "citizen-login"
  | "citizen-signup"
  | "citizen-before"
  | "citizen-before-self"
  | "citizen-before-household"
  | "citizen-before-household-members"
  | "citizen-during";
