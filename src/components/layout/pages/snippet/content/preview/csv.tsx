import Papa from 'papaparse';

import { GistFileType } from '@/types/gist.ts';

export const Csv = ({ file }: { file: GistFileType }) => {
  const { data } = Papa.parse<string[]>(file.content, { header: false });

  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const [headers, ...rows] = data;

  return (
    <div className="grid grid-cols-1 overflow-x-auto w-auto p-4">
      <table className="w-full text-left border-collapse border ">
        <thead className="">
          <tr>
            {headers.map((header: string) => (
              <th key={header} className="border bg-primary/10 whitespace-nowrap p-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: string[], rowIndex: number) => (
            <tr key={rowIndex} className="even:bg-primary/10">
              {row.map((r: string) => (
                <td key={r} className="border whitespace-nowrap p-2">
                  {r || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
