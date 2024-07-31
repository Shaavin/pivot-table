import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import makeData, { SampleDataType } from "./makeSampleData";
import formatCurrency from "./formatCurrency";

export default function PivotTable() {
  const data = useMemo<SampleDataType[]>(makeData, []);

  const columnHelper = createColumnHelper<SampleDataType>();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.date, {
        cell: (info) => info.getValue(),
        header: "Order Date",
        sortingFn: (rowA, rowB, columnId) => {
          const dateA = new Date(rowA.getValue<string>(columnId));
          const dateB = new Date(rowB.getValue<string>(columnId));
          return dateA > dateB ? 1 : dateA < dateB ? -1 : 0;
        },
      }),
      columnHelper.accessor((row) => row.rep, {
        cell: (info) => info.getValue(),
        header: "Employee",
        sortingFn: "text",
      }),
      columnHelper.accessor((row) => row.region, {
        cell: (info) => info.getValue(),
        header: "Region",
        sortingFn: "text",
      }),
      columnHelper.accessor((row) => row.item, {
        cell: (info) => info.getValue(),
        header: "Item",
        sortingFn: "text",
      }),
      columnHelper.accessor((row) => row.units, {
        aggregatedCell: ({ getValue }) => getValue(),
        aggregationFn: "sum",
        cell: (info) => info.getValue(),
        header: "Units",
      }),
      columnHelper.accessor((row) => row.unitCost, {
        aggregatedCell: ({ getValue }) => formatCurrency(getValue()),
        aggregationFn: "mean",
        cell: (info) => formatCurrency(info.getValue()),
        header: "Unit Cost",
      }),
      columnHelper.accessor((row) => row.total, {
        aggregatedCell: ({ getValue }) => formatCurrency(getValue()),
        aggregationFn: "sum",
        cell: (info) => formatCurrency(info.getValue()),
        header: "Total",
      }),
    ],
    [columnHelper, formatCurrency]
  );

  const table = useReactTable<SampleDataType>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th colSpan={header.colSpan} key={header.id}>
                {header.column.getCanGroup() ? (
                  <button
                    {...{
                      onClick: header.column.getToggleGroupingHandler(),
                      style: {
                        cursor: "pointer",
                      },
                    }}
                  >
                    {header.column.getIsGrouped()
                      ? `🛑(${header.column.getGroupedIndex()}) `
                      : `👊 `}
                  </button>
                ) : null}{" "}
                <span
                  onClick={header.column.getToggleSortingHandler()}
                  style={{
                    cursor: header.column.getCanSort() ? "pointer" : "",
                  }}
                  title={
                    header.column.getCanSort()
                      ? header.column.getNextSortingOrder() === "asc"
                        ? "Sort ascending"
                        : header.column.getNextSortingOrder() === "desc"
                        ? "Sort descending"
                        : "Clear sort"
                      : undefined
                  }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td
                {...{
                  key: cell.id,
                  style: {
                    background: cell.getIsGrouped()
                      ? "#0aff0082"
                      : cell.getIsAggregated()
                      ? "#ffa50078"
                      : cell.getIsPlaceholder()
                      ? "#ff000042"
                      : "white",
                  },
                }}
              >
                {cell.getIsGrouped() ? (
                  // If it's a grouped cell, add an expander and row count
                  <>
                    <button
                      {...{
                        onClick: row.getToggleExpandedHandler(),
                        style: {
                          cursor: row.getCanExpand() ? "pointer" : "normal",
                        },
                      }}
                    >
                      {row.getIsExpanded() ? "👇" : "👉"}{" "}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}{" "}
                      ({row.subRows.length})
                    </button>
                  </>
                ) : cell.getIsAggregated() ? (
                  // If the cell is aggregated, use the Aggregated
                  // renderer for cell
                  flexRender(
                    cell.column.columnDef.aggregatedCell ??
                      cell.column.columnDef.cell,
                    cell.getContext()
                  )
                ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                  // Otherwise, just render the regular cell
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
