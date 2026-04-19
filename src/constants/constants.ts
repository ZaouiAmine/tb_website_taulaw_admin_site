import type { NavItem } from "@/types/types";
import {
  GitBranch,
  Home,
  UserCheck,
  Megaphone,
  CreditCard,
  Package,
  Briefcase,
  History,
} from "lucide-react";
import i18n from "@/i18n";

export const getNavigationItems = (): NavItem[] => [
  {
    label: i18n.t("navigation.dashboard"),
    icon: Home,
    path: "/",
    roles: [],
  },
  {
    label: i18n.t("navigation.lawyerRequests"),
    icon: UserCheck,
    path: "/lawyer-requests",
    roles: [],
  },
  {
    label: i18n.t("navigation.lawyerPackages"),
    icon: Briefcase,
    path: "/lawyer-packages",
    roles: [],
  },
  {
    label: i18n.t("subscriptions.title"),
    icon: History,
    path: "/lawyer-packages/subscriptions/history",
    roles: [],
  },
  {
    label: i18n.t("navigation.pendingLawyers"),
    icon: UserCheck,
    path: "/pending-lawyers",
    roles: [],
  },
  {
    label: i18n.t("navigation.adsManagement"),
    icon: Megaphone,
    path: "/admin/banners",
    roles: [],
  },
  {
    label: i18n.t("navigation.consultationPackages"),
    icon: Package,
    path: "/admin/consultation-packages",
    roles: [],
  },
  {
    label: i18n.t("navigation.reportsManagement"),
    icon: CreditCard,
    path: "/reports-management",
    roles: [],
  },

  {
    label: i18n.t("navigation.dropdownManagement"),
    icon: GitBranch,
    path: "/dropdown-management",
    children: [
      {
        label: i18n.t("navigation.casePhase"),
        path: "/dropdown-management/case-phase",
        roles: [],
      },
      {
        label: i18n.t("navigation.caseCategory"),
        path: "/dropdown-management/case-category",
        roles: [],
      },
      {
        label: i18n.t("navigation.caseChamber"),
        path: "/dropdown-management/case-chamber",
        roles: [],
      },
      {
        label: i18n.t("navigation.specialization"),
        path: "/dropdown-management/specialization",
        roles: [],
      },
      {
        label: i18n.t("navigation.states"),
        path: "/admin/states",
        roles: [],
      },
    ],
    roles: [],
  },
];

// For backwards compatibility
export const navigationItems: NavItem[] = getNavigationItems();
