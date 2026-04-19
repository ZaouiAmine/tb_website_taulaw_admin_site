import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";

import {
  SidebarMenu,
  SidebarGroup,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarContent,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import type { NavItem as NavItemType } from "@/types/types";
import { getNavigationItems } from "@/constants/constants";
import { Dot } from "lucide-react";

export function NavButton({
  item,
  onClick,
}: {
  item: NavItemType;
  onClick?: (path: string) => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(() => {
    if (item.children && item.children.length > 0) {
      return item.children.some((child) =>
        location.pathname.startsWith(child.path)
      );
    }
    return location.pathname === item.path;
  });

  // Determine active status for parent
  const isActive =
    location.pathname === item.path ||
    (item.children &&
      item.children.some((child) =>
        location.pathname.startsWith(child.path)
      )) ||
    (item.path !== "/" && location.pathname.startsWith(item.path));

  const handleClick = () => {
    if (item.children && item.children.length > 0) {
      setIsOpen(true); // always expand when clicked

      // Check if current route is under any of the children
      const isOnChild = item.children.some((child) =>
        location.pathname.startsWith(child.path)
      );

      if (!isOnChild) {
        const defaultChild = item.children[0];
        if (defaultChild) {
          if (onClick) onClick(defaultChild.path);
          else navigate(defaultChild.path);
        }
      }
    } else {
      if (!item.disabled) {
        if (onClick) onClick(item.path);
        else navigate(item.path);
      }
    }
  };

  useEffect(() => {
    if (item.children && item.children.length > 0) {
      const isOnThisItemOrChild =
        location.pathname === item.path ||
        item.children.some((child) => location.pathname.startsWith(child.path));

      if (!isOnThisItemOrChild) {
        setIsOpen(false);
      }
    }
  }, [location.pathname, item]);

  return (
    <>
      <SidebarMenuItem
        className={cn(
          "w-full flex flex-col transition-colors rounded-lg py-2",
          item.disabled && "opacity-50 pointer-events-none"
        )}
      >
        <SidebarMenuButton
          onClick={handleClick}
          aria-disabled={item.disabled}
          className={cn(
            "flex items-center justify-between rounded-lg text-base px-3 relative transition-colors w-full py-6",
            isActive ? "bg-secondary" : ""
          )}
        >
          <div className="flex items-center gap-2">
            {item.icon ? <item.icon /> : null}
            <span className="truncate">{item.label}</span>
          </div>
        </SidebarMenuButton>

        {isOpen && item.children && (
          <div className="flex flex-col gap-1 mt-2">
            {item.children.map((child) => {
              //   const isChildActive = location.pathname === child.path;
              const isChildActive =
                location.pathname === child.path ||
                (child.children &&
                  child.children.some((child) =>
                    location.pathname.startsWith(child.path)
                  )) ||
                (child.path !== "/" &&
                  location.pathname.startsWith(child.path));

              return (
                <button
                  key={child.path}
                  onClick={() => navigate(child.path)}
                  className={cn(
                    "text-left text-muted-foreground hover:text-primary transition-colors flex items-center",
                    isChildActive && "text-primary font-medium gap-4"
                  )}
                >
                  <span>{isChildActive && <Dot />}</span>
                  <span>{child.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </SidebarMenuItem>
    </>
  );
}

interface SidenavProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidenav({
  isOpen: externalIsOpen,
  onClose,
}: SidenavProps) {
  const isMobile = useIsMobile();
  const [internalIsOpen, setInternalIsOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [navigationItems, setNavigationItems] = useState<NavItemType[]>([]);

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  // Update navigation items when language changes
  useEffect(() => {
    setNavigationItems(getNavigationItems());
  }, [i18n.language]);

  useEffect(() => {
    if (isMobile) {
      setInternalIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      if (onClose) {
        onClose();
      } else {
        setInternalIsOpen(false);
      }
    }
  };

  // Mobile overlay backdrop
  if (isMobile && isOpen) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose || (() => setInternalIsOpen(false))}
        />

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed top-0 left-0 h-full w-80 bg-background border-r shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarProvider>
            <div className="flex flex-col h-full py-6  px-2 flex-1">
              <SidebarContent className="flex-1 overflow-y-auto overflow-x-hidden w-full ">
                {navigationItems.map((item) => (
                  <NavButton
                    key={item.path}
                    item={item}
                    onClick={handleNavClick}
                  />
                ))}
              </SidebarContent>
            </div>
          </SidebarProvider>
        </div>
      </>
    );
  }

  // Desktop sidebar
  if (!isMobile) {
    return (
      <SidebarProvider>
        <div
          className={cn(
            "flex flex-col transition-all duration-300 ease-in-out py-6 ps-4"
          )}
        >
          <SidebarContent className="flex-1 overflow-y-auto overflow-x-hidden w-[300px]">
            <div>
              {navigationItems.map((item) => (
                <NavButton
                  key={item.path}
                  item={item}
                  onClick={handleNavClick}
                />
              ))}
            </div>
          </SidebarContent>
        </div>
      </SidebarProvider>
    );
  }

  // Return null for mobile when closed
  return null;
}

export function NavMain({
  navItems,
  className,
}: {
  navItems: NavItemType[];
  className?: string;
}) {
  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        {navItems.map((item) => (
          <NavButton key={item.path} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
