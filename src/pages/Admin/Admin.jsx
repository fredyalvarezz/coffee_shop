import AdminLayout from "../../components/Admin/Layout/AdminLayout";
import { AdminProvider } from "../../context/AdminContext";
import { InventoryProvider } from "../../context/InventoryContext";

export default function Admin() {
  return (
    <InventoryProvider>
      <AdminProvider>
        <AdminLayout />
      </AdminProvider>
    </InventoryProvider>
  );
}
