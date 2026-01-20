"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, X, BookOpen, ListChecks, PenTool, Check } from "lucide-react";
import { GRADE_REPORT_DATA, GradeContent } from "../../constants/reportContents";

interface RightSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyData: (data: GradeContent) => void;
}

export default function RightSidebar({ isOpen, onClose, onApplyData }: RightSidebarProps) {
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [localGradeData, setLocalGradeData] = useState<Record<string, GradeContent>>(GRADE_REPORT_DATA);

    // ✅ 데이터 로드
    useEffect(() => {
        const savedData = localStorage.getItem("cosmath_grade_presets");
        if (savedData) {
            setLocalGradeData(JSON.parse(savedData));
        }
    }, []);

    // ✅ 데이터 저장
    useEffect(() => {
        if (Object.keys(localGradeData).length > 0) {
            localStorage.setItem("cosmath_grade_presets", JSON.stringify(localGradeData));
        }
    }, [localGradeData]);

    const grades = [
        "초1", "초2", "초3", "초4", "초5", "초6",
        "중1", "중2", "중3"
    ];

    const handleGradeClick = (grade: string) => {
        setSelectedGrade(grade === selectedGrade ? null : grade);
    };

    const updatePresetField = (grade: string, field: keyof GradeContent, value: string) => {
        setLocalGradeData(prev => ({
            ...prev,
            [grade]: {
                ...prev[grade],
                [field]: value
            }
        }));
    };

    const currentContent = selectedGrade ? localGradeData[selectedGrade] : null;

    return (
        <div className={`fixed inset-y-0 right-0 z-[100] w-80 bg-[#1e293b] text-slate-300 flex flex-col transition-all duration-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"} shadow-2xl border-l border-slate-700/50`}>
            {/* Header */}
            <div className="h-14 min-h-[56px] px-6 flex items-center justify-between border-b border-slate-700/50 bg-[#0f172a]">
                <div>
                    <h2 className="text-white font-black text-lg tracking-tight">Report Presets</h2>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Grade Settings</p>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-slate-700 rounded-full text-slate-400">
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Grade Selection */}
            <div className="p-4 bg-[#1e293b] border-b border-slate-700/30">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Grades</h3>
                <div className="grid grid-cols-3 gap-2">
                    {grades.map((grade) => (
                        <button
                            key={grade}
                            onClick={() => handleGradeClick(grade)}
                            className={`py-2 px-1 rounded-lg text-sm font-bold transition-all border ${selectedGrade === grade
                                ? "bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20"
                                : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white"
                                }`}
                        >
                            {grade}
                        </button>
                    ))}
                </div>
            </div>

            {/* Preset Details */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {selectedGrade && currentContent ? (
                    <>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                                    <BookOpen size={14} />
                                    <span>수업 교재</span>
                                </div>
                                <input
                                    className="w-full bg-slate-800/50 rounded-xl p-3 border border-slate-700 text-[13px] leading-relaxed outline-none focus:border-sky-500 transition-colors"
                                    value={currentContent.book}
                                    onChange={(e) => updatePresetField(selectedGrade, "book", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                                    <ListChecks size={14} />
                                    <span>단원명/진도</span>
                                </div>
                                <textarea
                                    className="w-full h-32 bg-slate-800/50 rounded-xl p-3 border border-slate-700 text-[13px] whitespace-pre-line leading-relaxed outline-none focus:border-sky-500 transition-colors resize-none"
                                    value={currentContent.progress}
                                    onChange={(e) => updatePresetField(selectedGrade, "progress", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                                    <PenTool size={14} />
                                    <span>과제 학습</span>
                                </div>
                                <textarea
                                    className="w-full h-32 bg-slate-800/50 rounded-xl p-3 border border-slate-700 text-[13px] whitespace-pre-line leading-relaxed outline-none focus:border-sky-500 transition-colors resize-none"
                                    value={currentContent.notes}
                                    onChange={(e) => updatePresetField(selectedGrade, "notes", e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => onApplyData(currentContent)}
                            className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 group"
                        >
                            <Check size={18} className="group-hover:scale-110 transition-transform" />
                            <span>현재 보고서에 적용</span>
                        </button>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600">
                            <BookOpen size={32} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-400 font-bold">학년을 선택해주세요</p>
                            <p className="text-[11px] text-slate-500 leading-relaxed tabular-nums">선택한 학년의 기본 수업 정보가<br />여기에 표시됩니다.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="p-4 bg-[#0f172a] border-t border-slate-800">
                <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl px-4 py-3 border border-slate-700 opacity-50">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400">
                        <Check size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Select Grade</span>
                        <span className="text-[11px] text-slate-400">학년별 맞춤 데이터</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
