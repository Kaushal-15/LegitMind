'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookText, File, MessageSquare, Microscope, LayoutDashboard, Download, ListOrdered, UploadCloud, User, Settings, CreditCard } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Separator } from '../ui/separator';

const mainNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/upload', icon: UploadCloud, label: 'Upload' },
  { href: '/files', icon: File, label: 'My Files' },
];

const analysisNavItems = [
    { href: '/summaries', icon: BookText, label: 'Summaries' },
    { href: '/chat', icon: MessageSquare, label: 'Chat' },
    { href: '/analysis', icon: ListOrdered, label: 'Clauses & Analysis' },
    { href: '/reports', icon: Download, label: 'Reports' },
]

const userNavItems = [
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/billing', icon: CreditCard, label: 'Billing' },
    { href: '/settings', icon: Settings, label: 'Settings' },
]


export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {mainNavItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === item.href : true)}
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
      <Separator className="my-2" />
       {analysisNavItems.map((item) => (
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
        <Separator className="my-2" />
       {userNavItems.map((item) => (
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
