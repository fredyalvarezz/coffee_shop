import AdminLayout from "../../components/Admin/Layout/AdminLayout";
import { AdminProvider } from "../../context/AdminContext";

export default function Admin() {
  return (
    <AdminProvider>
      <AdminLayout />
    </AdminProvider>
  );
}
