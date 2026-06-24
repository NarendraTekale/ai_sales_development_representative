"use client";
import { LogOut, User, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { logout, user } = useAuth();

  return (
    <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Zap className="h-6 w-6 text-blue-600" />
        <span className="text-lg font-bold text-gray-900">AI SDR</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{user?.email}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
