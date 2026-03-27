import { Globe, Plane, RouteOff, BarChart3 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const NAV_ITEMS: ReadonlyArray<{ to: string; label: string; end?: boolean }> = [
  { to: "/", label: "Home", end: true },
  { to: "/globe", label: "Globe" },
  { to: "/stats", label: "Stats" },
  { to: "/travel-agent", label: "Travel Agent" },
];

const PAGE_META = {
  "/globe": { title: "My Travel Map", Icon: Globe },
  "/stats": { title: "Travel Stats", Icon: BarChart3 },
  "/travel-agent": { title: "Travel Agent", Icon: Plane },
  default: { title: "Page Not Found", Icon: RouteOff },
} as const;

export default function CommonNavbar() {
  const { pathname } = useLocation();

  const page = PAGE_META[pathname as keyof typeof PAGE_META] ?? PAGE_META.default;
  const TitleIcon = page.Icon;

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-[60] border-b border-gray-200 bg-white/95 p-4 backdrop-blur-sm">
        <div className="mx-auto flex items-center justify-start">
          <TitleIcon className="mr-2 h-5 w-5 text-gray-900" />
          <h1 className="text-2xl font-bold text-gray-900">{page.title}</h1>
        </div>
      </div>

      <nav className="fixed right-3 top-3 z-[70]">
        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/95 p-1 shadow-lg backdrop-blur">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
        </div>
      </nav>
    </>
  );
}
