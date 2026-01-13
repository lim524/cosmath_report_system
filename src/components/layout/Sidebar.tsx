"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, RotateCcw, ChevronLeft, Users } from "lucide-react";
import { STUDENT_DATA } from "../../constants/students";

// 에러 방지를 위해 page.tsx와 인터페이스를 완벽히 일치시킵니다.
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (name: string, grade: string) => void;
  onBatchSelect: (students: { name: string; grade: string }[]) => void;
}

export default function StudentSidebar({ isOpen, onClose, onSelectStudent, onBatchSelect }: SidebarProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const totalStudents = STUDENT_DATA.reduce((acc, curr) => acc + curr.students.length, 0);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupName) ? prev.filter(g => g !== groupName) : [...prev, groupName]
    );
  };

  // 선택된 ID가 바뀔 때마다 page.tsx의 리스트를 업데이트
  useEffect(() => {
    const selectedStudentObjects = STUDENT_DATA.flatMap(group => 
      group.students
        .filter(s => selectedIds.includes(`${group.group}-${s.name}`))
        .map(s => ({ name: s.name, grade: s.grade }))
    );
    onBatchSelect(selectedStudentObjects);
  }, [selectedIds, onBatchSelect]);

  const toggleStudentCheck = (studentName: string, groupName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const id = `${groupName}-${studentName}`;
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleGroupCheck = (groupName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const group = STUDENT_DATA.find(g => g.group === groupName);
    if (!group) return;

    const groupStudentIds = group.students.map(s => `${groupName}-${s.name}`);
    const isAllSelected = groupStudentIds.every(id => selectedIds.includes(id));

    if (!isAllSelected) {
      setSelectedIds(prev => Array.from(new Set([...prev, ...groupStudentIds])));
    } else {
      setSelectedIds(prev => prev.filter(id => !groupStudentIds.includes(id)));
    }
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-[100] w-72 bg-[#1e293b] text-slate-300 flex flex-col transition-all duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} shadow-2xl`}>
      <div className="h-14 min-h-[56px] px-6 flex items-center justify-between border-b border-slate-700/50 bg-[#0f172a]">
        <div>
          <h2 className="text-white font-black text-lg tracking-tight">CosMath</h2>
          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Management</p>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-700 rounded-full text-slate-400">
          <ChevronLeft size={18} />
        </button>
      </div>

      <div className="px-6 py-3 flex justify-between items-center text-[11px] font-bold text-slate-500 border-b border-slate-700/30 bg-[#1e293b]">
        <div className="flex items-center gap-2"><Users size={12} /><span>재원생 <span className="text-slate-300">{totalStudents}</span>명</span></div>
        <button className="flex items-center gap-1 text-sky-500/80 hover:text-sky-400" onClick={() => setSelectedIds([])}><RotateCcw size={10} /><span>초기화</span></button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {STUDENT_DATA.map((group) => {
          const isExpanded = expandedGroups.includes(group.group);
          const groupStudentIds = group.students.map(s => `${group.group}-${s.name}`);
          const isAllSelected = groupStudentIds.every(id => selectedIds.includes(id));
          const isSomeSelected = groupStudentIds.some(id => selectedIds.includes(id)) && !isAllSelected;

          return (
            <div key={group.group} className="rounded-xl overflow-hidden">
              <div className={`flex items-center px-3 py-2.5 cursor-pointer rounded-lg transition-all ${isExpanded ? "bg-slate-800 text-white" : "hover:bg-slate-800/50"}`} onClick={() => toggleGroup(group.group)}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 ${isAllSelected ? "bg-sky-500 border-sky-500" : isSomeSelected ? "bg-slate-600 border-slate-500" : "border-slate-600"}`} onClick={(e) => toggleGroupCheck(group.group, e)}>
                  {isAllSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  {isSomeSelected && <div className="w-2 h-[2px] bg-slate-300" />}
                </div>
                <span className="flex-1 text-[13px] font-semibold">{group.group}</span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`} />
              </div>

              {isExpanded && (
                <div className="mt-1 mb-2 space-y-0.5">
                  {group.students.map((student) => {
                    const isChecked = selectedIds.includes(`${group.group}-${student.name}`);
                    return (
                      <div key={student.name} className="group flex items-center ml-7 mr-1 px-3 py-2 rounded-lg cursor-pointer hover:bg-sky-500/10" onClick={() => onSelectStudent(student.name, student.grade)}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 ${isChecked ? "bg-sky-500 border-sky-500" : "border-slate-700"}`} onClick={(e) => toggleStudentCheck(student.name, group.group, e)}>
                          {isChecked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className={`flex-1 text-[13px] ${isChecked ? "text-sky-400 font-bold" : "text-slate-400 group-hover:text-slate-200"}`}>{student.name}</span>
                        <span className="text-[10px] text-slate-600 font-bold bg-slate-800/50 px-1.5 py-0.5 rounded uppercase">{student.grade}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="p-4 bg-[#0f172a] border-t border-slate-800">
        <div className="flex items-center justify-between bg-slate-800/50 rounded-xl px-4 py-3 border border-slate-700">
          <div className="flex flex-col"><span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Selected</span><span className="text-xs text-slate-300 font-medium">선택된 학생</span></div>
          <span className="text-2xl font-black text-sky-400">{selectedIds.length}</span>
        </div>
      </div>
    </div>
  );
}