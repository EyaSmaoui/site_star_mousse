import React from "react";
import AdminSidebar from "./AdminSidebar";
import ManageOrders from "../Employee/EmployeeOrders";

export default function AdminOrders() {
  return <ManageOrders Sidebar={AdminSidebar} sidebarWidth={260} />;
}
