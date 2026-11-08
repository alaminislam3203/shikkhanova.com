'use client';

import React from 'react';
import { FaCheck, FaUserXmark, FaClock } from 'react-icons/fa6';
import { StudentRollItem, AttendanceStatus } from '@/types';

interface AttendanceTableProps {
  students: StudentRollItem[];
  selectedClass: number;
  onStatusChange: (rollNumber: number, status: AttendanceStatus) => void;
}

export default function AttendanceTable({
  students,
  selectedClass,
  onStatusChange,
}: AttendanceTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-premium overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 text-xs font-bold uppercase border-b border-slate-200">
              <th className="py-4 px-6 text-center w-24">রোল (Roll)</th>
              <th className="py-4 px-6">শিক্ষার্থীর নাম</th>
              <th className="py-4 px-6">শ্রেণি</th>
              <th className="py-4 px-6 text-center">হাজিরা স্ট্যাটাস (Status)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {students.map((item) => (
              <tr key={item.rollNumber} className="hover:bg-slate-50/70 transition">
                <td className="py-3.5 px-6 text-center">
                  <span className="inline-block w-8 h-8 rounded-xl bg-brand-100/70 text-brand-800 font-black text-xs leading-8">
                    {item.rollNumber}
                  </span>
                </td>
                <td className="py-3.5 px-6 font-bold text-slate-800">
                  {item.studentName}
                </td>
                <td className="py-3.5 px-6 font-medium text-slate-500">
                  Class {selectedClass}
                </td>
                <td className="py-3.5 px-6">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onStatusChange(item.rollNumber, 'PRESENT')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        item.status === 'PRESENT'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <FaCheck className="w-3 h-3" />
                      <span>Present</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onStatusChange(item.rollNumber, 'ABSENT')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        item.status === 'ABSENT'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                      }`}
                    >
                      <FaUserXmark className="w-3 h-3" />
                      <span>Absent</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onStatusChange(item.rollNumber, 'LATE')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        item.status === 'LATE'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      <FaClock className="w-3 h-3" />
                      <span>Late</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

