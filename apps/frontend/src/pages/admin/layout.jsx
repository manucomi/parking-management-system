import AdminLayout from '@/components/Layout/AdminLayout/AdminLayout';

export default function AdminRootLayout({ children }) {
    // Obtener la ruta actual del pathname
    const currentPath =
        typeof window !== 'undefined' ? window.location.pathname : '';

    return <AdminLayout current={currentPath}>{children}</AdminLayout>;
}
