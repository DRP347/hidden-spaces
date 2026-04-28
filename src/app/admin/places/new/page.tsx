import { AdminShell } from "@/components/admin/AdminShell";
import { PlaceForm } from "@/components/admin/PlaceForm";

export default function NewPlacePage() {
  return (
    <AdminShell title="New Place" subtitle="Add a hidden space to the map.">
      <PlaceForm mode="create" />
    </AdminShell>
  );
}
