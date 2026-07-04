import AdminGuard from "@/components/AdminGuard";
import AdminPanelPage from "@/components/pages/AdminPanelPage";

export default function Page() {
  return (
    <AdminGuard>
      <AdminPanelPage />
    </AdminGuard>
  );
}
