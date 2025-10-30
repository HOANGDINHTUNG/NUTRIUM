import { useState } from "react";
import { useAppSelector } from "../../../hook/UseCustomeRedux";
import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/home/Sidebar";
import Navbar from "../../../components/home/Navbar";
import Footer from "../../../components/home/Footer";

export default function Homepage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const { mode } = useAppSelector((state) => state.darkMode);

  return (
    <div
      className={`min-h-screen  transition-colors duration-300  ${
        mode ? "bg-[#0B0B0C]" : "bg-gray-50"
      }`}
    >
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onHoverStateChange={setIsSidebarExpanded}
        />

        {/* Main column: Navbar cố định + vùng nội dung cuộn riêng */}
        <main
          className={`flex-1 min-w-0 h-screen flex flex-col  transition-colors duration-300  ${
            mode ? "bg-[#111216]" : "bg-white/95"
          }`}
        >
          {/* Navbar cố định (sticky) */}
          <div className="sticky top-0 z-40">
            {mode ? (
              <></>
            ) : (
              <Navbar
                isSidebarOpen={isSidebarOpen}
                isSidebarExpanded={isSidebarExpanded}
                onToggle={() => setIsSidebarOpen((v) => !v)}
              />
            )}
          </div>

          {/* Chỉ phần Recipes cuộn */}
          <div
            className={`flex-1 overflow-y-auto ${
              mode ? "bg-[#111216]" : "bg-gray-200"
            }`}
          >
            <div className="flex min-h-full flex-col">
              {mode ? (
              <Navbar
                isSidebarOpen={isSidebarOpen}
                isSidebarExpanded={isSidebarExpanded}
                onToggle={() => setIsSidebarOpen((v) => !v)}
              />
              ) : null}
              <div className="flex-1">
                <Outlet />
              </div>
              {mode ? <Footer isCompact={isSidebarOpen} /> : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
