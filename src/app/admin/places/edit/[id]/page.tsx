import { AdminShell } from "@/components/admin/AdminShell";
import { EditPlaceClient } from "@/components/admin/EditPlaceClient";

type EditPlacePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPlacePage({ params }: EditPlacePageProps) {
  const { id } = await params;

  return (
    <AdminShell title="Edit Place" subtitle="Update map content and coordinates.">
      <EditPlaceClient id={id} />
    </AdminShell>
  );
}
