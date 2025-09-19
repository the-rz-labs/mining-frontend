import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MinimalHeader() {
  return (
    <header className="h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 shadow-lg shadow-neon-purple/10">
      {/* Empty left side since logo is now in sidebar */}
      <div></div>

      {/* Right side with user actions */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/5">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/5">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}