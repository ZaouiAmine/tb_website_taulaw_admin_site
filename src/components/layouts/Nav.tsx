import { Fullscreen, LogOut, Menu, X, Languages } from "lucide-react";
import AppLogo from "@/components/shared/AppLogo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Container from "@/components/shared/Container";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
];

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

interface NavProps {
  isSidenavOpen?: boolean;
  onToggleSidenav?: () => void;
}

export default function Nav({
  isSidenavOpen = false,
  onToggleSidenav,
}: NavProps) {
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    Cookies.set('i18nextLng', languageCode, { 
      expires: 365, 
      sameSite: 'strict',
      path: '/'
    });
  };

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <header className="shadow-lg bg-white">
      <Container>
        <div className="py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile burger menu button */}
            {isMobile && onToggleSidenav && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSidenav}
                className="md:hidden"
              >
                {isSidenavOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
            <AppLogo className="w-24" />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="gap-2">
                  <Languages className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align={i18n.language === 'ar' ? 'start' : 'end'} 
                className="w-48"
              >
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => changeLanguage(language.code)}
                    className={`flex items-center justify-between ${
                      i18n.language === language.code ? 'bg-muted' : ''
                    }`}
                  >
                    <span>{language.name}</span>
                    <span className="text-muted-foreground text-sm">
                      {language.nativeName}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
              <Fullscreen className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 p-0">
                  <Avatar className="h-10 w-10 aspect-square">
                    <AvatarImage src="/image.png" />
                    <AvatarFallback className="font-extrabold">
                      ME
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={i18n.language === 'ar' ? 'start' : 'end'}
                side="bottom"
                className={`w-40 border-muted-foreground/20 rounded-2xl ${
                  i18n.language === 'ar' ? 'translate-x-10' : ''
                }`}
              >
                <DropdownMenuItem className="flex gap-3 py-2 items-center">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xs">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-xs">
                    {user?.name || "User"}
                  </span>
                </DropdownMenuItem>
                <Separator className="h-[1px] w-10/12 mx-auto bg-muted-foreground/20 my-1" />
                <DropdownMenuItem
                  className="text-destructive flex items-center justify-center gap-2 py-2"
                  onClick={() => setIsLogoutDialogOpen(true)}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-xs">{t('auth.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Container>
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md py-8">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center justify-center gap-2">
              <LogOut className="h-17 w-17 text-destructive rounded-full bg-destructive/20 p-4 my-3" />
            </DialogTitle>
            <DialogDescription className="text-center mb-4 text-gray-700 font-bold text-xl">
              {t('auth.logoutConfirm')}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 mx-auto grid grid-cols-2 w-full">
          <Button variant="destructive" onClick={logout} className="w-full border-destructive/80 cursor-pointer">
              {t('auth.logout')}
            </Button>
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)} className="w-full border-destructive/80 cursor-pointer">
              {t('common.cancel')}
            </Button>
           
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
