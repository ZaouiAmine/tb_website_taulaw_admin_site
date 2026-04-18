import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, useEffect } from "react";
import i18n from "@/i18n";

import { ProtectRoutesWrapper } from "./components/wrappers/ProtectRoutes.wrapper";
import RootLayout from "./components/layouts/RootLayout";
import AuthProvider from "./contexts/AuthContext";
import PendingLawyers from "./pages/PendingLawyers.page";
import ReportsManagement from "./pages/reportsManagement/ReportsManagement";

const LoginPage = lazy(() => import("./pages/Login.page"));
const LawyerRequestsPage = lazy(() => import("./pages/LawyerRequests.page"));
const PlatformFeesPage = lazy(() => import("./pages/PlatformFees.page"));
const TransactionsPage = lazy(() => import("./pages/Transactions.page"));
const CasePhasePage = lazy(() => import("./pages/CasePhase.page"));
const AddCasePhasePage = lazy(() => import("./pages/AddCasePhase.page"));
const EditCasePhasePage = lazy(() => import("./pages/EditCasePhase.page"));
const CaseCategoryPage = lazy(() => import("./pages/CaseCategory.page"));
const AddCaseCategoryPage = lazy(() => import("./pages/AddCaseCategory.page"));
const EditCaseCategoryPage = lazy(
  () => import("./pages/EditCaseCategory.page")
);
const CaseChamberPage = lazy(() => import("./pages/CaseChamber.page"));
const AddCaseChamberPage = lazy(() => import("./pages/AddCaseChamber.page"));
const EditCaseChamberPage = lazy(() => import("./pages/EditCaseChamber.page"));
const SpecializationPage = lazy(() => import("./pages/Specialization.page"));
const AddSpecializationPage = lazy(
  () => import("./pages/AddSpecialization.page")
);
const EditSpecializationPage = lazy(
  () => import("./pages/EditSpecialization.page")
);
const StatesPage = lazy(() => import("./pages/States.page"));
const AddStatePage = lazy(() => import("./pages/AddState.page"));
const EditStatePage = lazy(() => import("./pages/EditState.page"));
const BannersPage = lazy(() => import("./pages/Banners.page"));
const AddBannerPage = lazy(() => import("./pages/AddBanner.page"));
const EditBannerPage = lazy(() => import("./pages/EditBanner.page"));
const ConsultationPackagesPage = lazy(() => import("./pages/ConsultationPackages.page"));
const AddConsultationPackagePage = lazy(() => import("./pages/AddConsultationPackage.page"));
const EditConsultationPackagePage = lazy(() => import("./pages/EditConsultationPackage.page"));
const AddEditLawyerPackagePage = lazy(
  () => import("./pages/AddEditLawyerPackage.page")
);
const SubscriptionHistoryPage = lazy(() => import("./pages/SubscriptionHistory.page"));
const HomePage = lazy(() => import("./pages/Home.page"));
const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    if (!i18n.language || i18n.language === "en") {
      i18n.changeLanguage("ar");
    }

    const currentLang = i18n.language;
    const dir = currentLang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectRoutesWrapper requireAuth={true}>
                  <RootLayout />
                </ProtectRoutesWrapper>
              }
            >
              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <HomePage />
                  </ProtectRoutesWrapper>
                }
                index
              />
              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <LawyerRequestsPage />
                  </ProtectRoutesWrapper>
                }
                path="/lawyer-requests"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <PendingLawyers />
                  </ProtectRoutesWrapper>
                }
                path="/pending-lawyers"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <ReportsManagement />
                  </ProtectRoutesWrapper>
                }
                path="/reports-management"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <PlatformFeesPage />
                  </ProtectRoutesWrapper>
                }
                path="/lawyer-packages"
              />
              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <AddEditLawyerPackagePage />
                  </ProtectRoutesWrapper>
                }
                path="/lawyer-packages/add"
              />
              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <AddEditLawyerPackagePage />
                  </ProtectRoutesWrapper>
                }
                path="/lawyer-packages/edit/:id"
              />
              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <TransactionsPage />
                  </ProtectRoutesWrapper>
                }
                path="/transactions"
              />
              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <SubscriptionHistoryPage />
                  </ProtectRoutesWrapper>
                }
                path="/lawyer-packages/subscriptions/history"
              />
              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <LawyerRequestsPage />
                  </ProtectRoutesWrapper>
                }
                path="/dropdown-management"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <CasePhasePage />
                  </ProtectRoutesWrapper>
                }
                path="/dropdown-management/case-phase"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <AddCasePhasePage />
                  </ProtectRoutesWrapper>
                }
                path="/dropdown-management/case-phase/add-case-phase"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <EditCasePhasePage />
                  </ProtectRoutesWrapper>
                }
                path="/dropdown-management/case-phase/edit-case-phase/:id"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <CaseCategoryPage />
                  </ProtectRoutesWrapper>
                }
                path="/dropdown-management/case-category"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <AddCaseCategoryPage />
                  </ProtectRoutesWrapper>
                }
                path="/dropdown-management/case-category/add-case-category"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <EditCaseCategoryPage />
                  </ProtectRoutesWrapper>
                }
                path="/dropdown-management/case-category/edit-case-category/:id"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <CaseChamberPage />
                  </ProtectRoutesWrapper>
                }
                path="/dropdown-management/case-chamber"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <AddCaseChamberPage />
                  </ProtectRoutesWrapper>
                }
                path="/dropdown-management/case-chamber/add-case-chamber"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <EditCaseChamberPage />
                  </ProtectRoutesWrapper>
                }
                path="/dropdown-management/case-chamber/edit-case-chamber/:id"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <SpecializationPage />
                  </ProtectRoutesWrapper>
                }
                path="/dropdown-management/specialization"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <AddSpecializationPage />
                  </ProtectRoutesWrapper>
                }
                path="/dropdown-management/specialization/add-specialization"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <EditSpecializationPage />
                  </ProtectRoutesWrapper>
                }
                path="/dropdown-management/specialization/edit-specialization/:id"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <StatesPage />
                  </ProtectRoutesWrapper>
                }
                path="/admin/states"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <AddStatePage />
                  </ProtectRoutesWrapper>
                }
                path="/admin/states/add-state"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <EditStatePage />
                  </ProtectRoutesWrapper>
                }
                path="/admin/states/edit-state/:id"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <BannersPage />
                  </ProtectRoutesWrapper>
                }
                path="/admin/banners"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <AddBannerPage />
                  </ProtectRoutesWrapper>
                }
                path="/admin/banners/add"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <EditBannerPage />
                  </ProtectRoutesWrapper>
                }
                path="/admin/banners/edit/:id"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <ConsultationPackagesPage />
                  </ProtectRoutesWrapper>
                }
                path="/admin/consultation-packages"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <AddConsultationPackagePage />
                  </ProtectRoutesWrapper>
                }
                path="/admin/consultation-packages/add"
              />

              <Route
                element={
                  <ProtectRoutesWrapper requireAuth={true}>
                    <EditConsultationPackagePage />
                  </ProtectRoutesWrapper>
                }
                path="/admin/consultation-packages/edit/:id"
              />
            </Route>
            <Route
              element={
                <ProtectRoutesWrapper requireAuth={false}>
                  <LoginPage />
                </ProtectRoutesWrapper>
              }
              path="/login"
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
