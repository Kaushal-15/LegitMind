'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookText, File, MessageSquare, Upload } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/upload', icon: Upload, label: 'Upload Documents' },
  { href: '/files', icon: File, label: 'My Files' },
  { href: '/summaries', icon: BookText, label: 'Summaries' },
  { href: '/chat', icon: MessageSquare, label: 'Chat' },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} legacyBehavior passHref>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.label}
              className="justify-start"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
