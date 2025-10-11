import { useRouter } from 'next/router';
import AdminLayout from './AdminLayout/AdminLayout';

export default function withAdminLayout(WrappedComponent) {
    return function WithAdminLayout(props) {
        const router = useRouter();

        return (
            <AdminLayout current={router.pathname}>
                <WrappedComponent {...props} />
            </AdminLayout>
        );
    };
}
