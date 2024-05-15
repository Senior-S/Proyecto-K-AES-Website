import AesForm from "@/app/ui/aes-form";
import DataTable from "@/app/ui/datatable";
import Pagination from "@/app/ui/pagination";
import { fetchIntentsPage } from "@/app/lib/data";

export default async function Page(
  { searchParams }: {
    searchParams?: {
      query?: string;
      page?: string;
    };
  }) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchIntentsPage(query);

  return (
    <main className="flex min-h-screen flex-col items-center p-12 gap-5">
      <AesForm />
      <div className="bg-[#31363F] rounded p-2 text-center">
        <h2>Ultimas keys probadas:</h2>
        <DataTable query={query} currentPage={currentPage} />
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}
