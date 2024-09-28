"use client"
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
export const NavItem = ({ icon, label, active = false, href }: any) => {
    const router = useRouter();
    const pathname = usePathname();
    const selected = pathname === href
    return (
        <div
            onClick={() => { router.push(href) }}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${active
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
        >
            {React.cloneElement(icon, { className: 'mr-3 h-6 w-6' })}
            {label}
        </div>
    )
}