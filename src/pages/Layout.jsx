
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import {
  BarChart3,
  TrendingUp,
  Target,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  UtensilsIcon,
  LayoutDashboard,
  UtensilsCrossed
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import LoginPage from "@/components/auth/LoginPage";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
    description: "Vista general"
  },
  {
    title: "Menu",
    url: createPageUrl("Indicadores"),
    icon: UtensilsIcon,
    description: "Gestión de indicadores"
  },
  {
    title: "Pedidos",
    url: createPageUrl("Mediciones"),
    icon: FileText,
    description: "Ingreso de datos"
  },
  // {
  //   title: "Metas",
  //   url: createPageUrl("Metas"),
  //   icon: Target,
  //   description: "Objetivos y metas"
  // },
  // {
  //   title: "Reportes",
  //   url: createPageUrl("Reportes"),
  //   icon: FileText,
  //   description: "Informes y análisis"
  // },
  // {
  //   title: "Usuarios",
  //   url: createPageUrl("Usuarios"),
  //   icon: Users,
  //   description: "Gestión de usuarios"
  // }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(3);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token"); 
  });

  const [isLoading, setIsLoading] = useState(() => {
    return !localStorage.getItem("token"); 
  });

  useEffect(() => {
    checkAuth();
  }, [location.pathname]); 

  const checkAuth = async () => {
    const auth = localStorage.getItem("token");
    if (auth) {
      setIsAuthenticated(true);
      // const userData = await api.get('/auth/me'); setUser(userData);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      await localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner message="Verificando autenticación..." />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage checkAuth={checkAuth} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <Sidebar className="border-r border-slate-200 bg-white/95 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">El Punto Chévere</h2>
                <p className="text-xs text-slate-500">Sistema de registro</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-3">
                Navegación
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`group h-[50px] hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200 rounded-lg px-3 py-3 ${location.pathname === item.url ? 'bg-yellow-50 text-yellow-700 shadow-sm' : 'text-slate-700'
                          }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <div className="flex-1">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-slate-500 group-hover:text-yellow-600">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-3">
                Estado del Sistema
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Indicadores Activos</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      12
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Alertas Pendientes</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {notifications}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Datos Actualizados</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      85%
                    </Badge>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">
                  {user?.user || 'Usuario'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.department || 'SEDRONAR'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden hover:bg-slate-100 p-2 rounded-lg transition-colors" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    {currentPageName || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-slate-500">
                    Sistema de Gestión de Indicadores
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs p-0 flex items-center justify-center">
                      {notifications}
                    </Badge>
                  )}
                </Button>
                <Button variant="ghost" size="icon">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
