"use client";
import { useGlobalContext } from "@/context/GlobalContext";
import { useFinanceContext } from "@/context/store/FinanceContext";
import { useDeleteIncomeHandler } from "@/hooks/FinanceHandlers";
import { currencyFormatter } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

type propTypes = {};

const IncomeHistory = (props: propTypes) => {
  const { income, setIncome, addIncomeItem, removeIncomeItem } =
    useFinanceContext();
  const { isDeleting, showNav } = useGlobalContext();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const deleteIncomeHandler = useDeleteIncomeHandler();

  const filteredIncome = income.filter((item) => {
    return item.description?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex h-full flex-col max-w-2xl px-6 py-6 mx-auto min-w-[500px] lg:flex">
      <Link
        className="btn btn-primary-no-outline hover:text-green-300"
        href="/"
      >
        Back to Overview
      </Link>
      <h1 className="text-4xl font-bold text-center my-8">Income History</h1>

      <div className="my-4 flex justify-between">
        <input
          className="w-1/3 p-2 border-2 border-gray-300 rounded-md"
          type="text"
          placeholder="Search by description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="w-1/3 p-2 border-2 border-gray-300 rounded-md text-black"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {/* Add more options for categories */}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="w-full border-collapse bg-white text-sm text-gray-500 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900">
                Description
              </th>
              <th className="px-6 py-4 font-medium text-gray-900">Amount</th>
              <th className="px-6 py-4 font-medium text-gray-900">
                Date Created
              </th>
              {/* <th className="px-4 py-2">Category</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {filteredIncome.map((income) => (
              <tr className="text-center hover:bg-gray-50" key={income.id}>
                <td className="border px-4 py-2">{income.description}</td>
                <td className="border px-4 py-2">
                  {currencyFormatter(income.amount)}
                </td>
                <td className="border px-4 py-2">
                  {income.createdAt.toString()}
                </td>
                <td className="border px-4 py-2 text-black">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => {
                      deleteIncomeHandler(income);
                    }}
                  >
                    <FaRegTrashAlt></FaRegTrashAlt>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomeHistory;
