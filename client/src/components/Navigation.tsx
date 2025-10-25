import { Link, useLocation } from "wouter";
import { LayoutDashboard, Star, MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/reviews", label: "Reviews", icon: Star },
    { path: "/chat", label: "Chat", icon: MessageSquare },
  ];

  return (
    <nav className="bg-card border-b border-card-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="text-xl font-semibold" data-testid="text-logo">
              Sentinel Local
            </div>
            
            <div className="flex gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant="ghost"
                      className={`gap-2 ${isActive ? 'bg-accent' : ''}`}
                      data-testid={`link-${item.label.toLowerCase()}`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <Button variant="ghost" size="icon" data-testid="button-logout">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
