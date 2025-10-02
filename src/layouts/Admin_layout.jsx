import React from 'react'
import { Outlet } from 'react-router-dom'
import { AdminHeader } from '../components/Header/Admin_header'
import { AdminSidebar } from '../components/SideBar/Admin_sidebar'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen ocean-bg text-slate-100">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
