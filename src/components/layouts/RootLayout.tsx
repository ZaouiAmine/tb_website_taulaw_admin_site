import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Sidenav from "./Sidenav";
import CustomClipLoader from "@/components/shared/CustomClipLoader";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function RootLayout() {
  const isMobile = useIsMobile();
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  
  useDocumentTitle();

  const toggleSidenav = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };

  const closeSidenav = () => {
    setIsSidenavOpen(false);
  };

  return (
    <div className="max-h-dvh w-dvw flex flex-col">
      {/* Navbar - full width at the top */}
      <Nav isSidenavOpen={isSidenavOpen} onToggleSidenav={toggleSidenav} />

      <div className="flex-1 flex min-h-0">
        {/* Sidebar - hidden on mobile by default, controlled by state */}
        <div className="hidden md:block flex-shrink-0 overflow-y-scroll">
          <Sidenav />
        </div>

        {/* Mobile Sidebar - rendered conditionally */}
        {isMobile && <Sidenav isOpen={isSidenavOpen} onClose={closeSidenav} />}

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <main className="flex-1 overflow-y-auto  p-6 min-w-0">
            <div className="h-full min-w-0">
              <Suspense fallback={<CustomClipLoader className="w-16 h-16" />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
