"use client"

import type React from "react"

import { useState } from "react"
import { UploadIcon, DownloadIcon, SaveIcon, HomeIcon, MenuIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface SpreadsheetMenuProps {
    title: string
    onSave: () => Promise<boolean>
    onImport: (file: File) => Promise<boolean>
    onExport: () => Promise<boolean>
    lastSaved?: string | null
    hasUnsavedChanges?: boolean
}

export function SpreadsheetMenu({
                                    title,
                                    onSave,
                                    onImport,
                                    onExport,
                                    lastSaved,
                                    hasUnsavedChanges = false,
                                }: SpreadsheetMenuProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [isImporting, setIsImporting] = useState(false)

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setIsImporting(true)
            try {
                const success = await onImport(file)
                if (!success) {
                    toast({
                        title: "导入失败",
                        description: "导入Excel文件时出现错误，请检查文件格式",
                        variant: "destructive",
                        duration: 3000,
                    })
                }
            } catch (error) {
                console.error("导入错误:", error)
                toast({
                    title: "导入失败",
                    description: "导入Excel文件时出现错误",
                    variant: "destructive",
                    duration: 3000,
                })
            } finally {
                setIsImporting(false)
                setIsOpen(false)
            }
        }
    }

    const handleExport = async () => {
        setIsExporting(true)
        try {
            const success = await onExport()
            if (!success) {
                toast({
                    title: "导出失败",
                    description: "导出Excel文件时出现错误",
                    variant: "destructive",
                    duration: 3000,
                })
            }
        } catch (error) {
            console.error("导出错误:", error)
            toast({
                title: "导出失败",
                description: "导出Excel文件时出现错误",
                variant: "destructive",
                duration: 3000,
            })
        } finally {
            setIsExporting(false)
            setIsOpen(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            console.log("Saving spreadsheet from menu...")
            const success = await onSave()
            if (!success) {
                console.error("Save returned false")
                toast({
                    title: "保存失败",
                    description: "保存表格数据时出现错误",
                    variant: "destructive",
                    duration: 3000,
                })
            } else {
                console.log("Save successful")
                toast({
                    title: "保存成功",
                    description: "表格数据已成功保存",
                    duration: 3000,
                })
            }
        } catch (error) {
            console.error("保存错误:", error)
            toast({
                title: "保存失败",
                description: "保存表格数据时出现错误",
                variant: "destructive",
                duration: 3000,
            })
        } finally {
            setIsSaving(false)
            setIsOpen(false)
        }
    }

    const goHome = () => {
        // 如果有未保存的更改，提示用户
        if (hasUnsavedChanges) {
            if (confirm("您有未保存的更改，确定要离开吗？")) {
                router.push("/")
            }
        } else {
            router.push("/")
        }
    }

    return (
        <>
            {/* 右下角的圆形菜单按钮 */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                {lastSaved && (
                    <div className="bg-white/90 dark:bg-gray-800/90 text-xs text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full shadow-sm flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-1 text-emerald-500" />
                        {lastSaved}
                    </div>
                )}
                {hasUnsavedChanges && (
                    <div className="bg-amber-50/90 dark:bg-amber-900/90 text-xs text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full shadow-sm flex items-center">
                        <AlertCircleIcon className="h-3 w-3 mr-1 text-amber-500" />
                        有未保存的更改
                    </div>
                )}
                <button
                    onClick={() => setIsOpen(true)}
                    className={`w-14 h-14 rounded-full ${hasUnsavedChanges ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"} text-white shadow-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${hasUnsavedChanges ? "focus:ring-amber-500" : "focus:ring-emerald-500"}`}
                    aria-label="打开菜单"
                >
                    <MenuIcon className="h-6 w-6" />
                </button>
            </div>

            {/* 功能菜单弹窗 */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{title || "电子表格"}</DialogTitle>
                        <DialogDescription>选择您需要的操作</DialogDescription>
                        {hasUnsavedChanges && (
                            <div className="mt-2 text-amber-600 flex items-center">
                                <AlertCircleIcon className="h-4 w-4 mr-1" />
                                您有未保存的更改
                            </div>
                        )}
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                onClick={goHome}
                                variant="outline"
                                className="flex items-center justify-center gap-2 h-20 text-base"
                            >
                                <HomeIcon className="h-5 w-5" />
                                <span>返回首页</span>
                            </Button>

                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                variant={hasUnsavedChanges ? "default" : "outline"}
                                className={`flex items-center justify-center gap-2 h-20 text-base ${hasUnsavedChanges ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}`}
                            >
                                <SaveIcon className="h-5 w-5" />
                                <span>{isSaving ? "保存中..." : "保存表格"}</span>
                            </Button>

                            <label
                                className={`flex items-center justify-center gap-2 h-20 text-base cursor-pointer border rounded-md bg-background hover:bg-accent hover:text-accent-foreground ${isImporting ? "opacity-70 pointer-events-none" : ""}`}
                            >
                                <UploadIcon className="h-5 w-5" />
                                <span>{isImporting ? "导入中..." : "导入Excel"}</span>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    className="hidden"
                                    onChange={handleImport}
                                    disabled={isImporting}
                                />
                            </label>

                            <Button
                                onClick={handleExport}
                                disabled={isExporting}
                                variant="outline"
                                className="flex items-center justify-center gap-2 h-20 text-base"
                            >
                                <DownloadIcon className="h-5 w-5" />
                                <span>{isExporting ? "导出中..." : "导出Excel"}</span>
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

