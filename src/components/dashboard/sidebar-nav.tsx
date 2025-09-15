'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookText, File, MessageSquare, Microscope, LayoutDashboard, Download, ListOrdered, UploadCloud } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/upload', icon: UploadCloud, label: 'Upload' },
  { href: '/files', icon: File, label: 'My Files' },
  { href: '/summaries', icon: BookText, label: 'Summaries' },
  { href: '/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/analysis', icon: ListOrdered, label: 'Clauses & Analysis' },
  { href: '/reports', icon: Download, label: 'Reports' },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
            tooltip={item.label}
            className="justify-start"
          >
            <Link href={item.href}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
