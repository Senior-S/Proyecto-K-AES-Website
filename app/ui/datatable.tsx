import { fetchEcbData } from "../lib/data";

export default async function DataTable({
    query,
    currentPage,
}: {
    query: string,
    currentPage: number
}) {

    const ecbData = await fetchEcbData(query, currentPage);

    return (
        <table className="rounded-lg text-center font-normal">
            <thead className="text-center">
                <tr>
                    <th scope="col" className="py-5">
                        Key
                    </th>
                    <th scope="col" className="py-5">
                        Base64
                    </th>
                    <th scope="col" className="py-5">
                        Resultado
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    ecbData?.map((row) => (
                        <tr key={row.id} className="w-full text-xs border-b last-of-type:border-none md:text-base">
                            <td className="break-all md:px-3">
                                <p>{row.key}</p>
                            </td>
                            <td className="break-all md:px-3">
                                <p>{row.base64}</p>
                            </td>
                            <td className="break-all md:px-3">
                                <p>{row.result}</p>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
}