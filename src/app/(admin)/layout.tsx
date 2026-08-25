import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/login?callbackUrl=/admin");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold text-agro-800">Acceso restringido</h1>
        <p className="mt-2 text-stone-500">
          Esta sección es solo para administradores. Si crees que es un error,
          contacta al equipo.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl">
      <AdminSidebar />
      <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}