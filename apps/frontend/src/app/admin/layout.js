import AdminLayout from '@/components/Layout/AdminLayout/AdminLayout';
import { usePathname } from 'next/navigation';

export default function AdminRootLayout({ children }) {
    const pathname = usePathname();

    return <AdminLayout current={pathname}>{children}</AdminLayout>;
}
