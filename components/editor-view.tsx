"use client"

import { useState, useEffect, useRef } from "react"
import { LuckysheetEditor } from "./luckysheet-editor"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

interface EditorViewProps {
    params: { id: string }
    id?: string
}

export function EditorView({ params, id: propId }: EditorViewProps) {
    const { toast } = useToast()
    const [sheetName, setSheetName] = useState("未命名表格")
    const [sheetData, setSheetData] = useState(null)
    const luckysheetRef = useRef(null)
    const id = propId || params?.id || "new" // 优先使用props中的id，然后是params中的id
    const [isLoaded, setIsLoaded] = useState(false)
    const [loadError, setLoadError] = useState<string | null>(null)
    const dataLoadAttemptedRef = useRef(false)

    // 加载表格数据
    useEffect(() => {
        // 避免重复加载
        if (isLoaded || dataLoadAttemptedRef.current) return

        dataLoadAttemptedRef.current = true
        console.log("Loading spreadsheet data for ID:", id)

        // 在实际应用中，这里会根据id从API获取表格数据
        if (id !== "new") {
            // 尝试从localStorage加载数据（仅作为示例）
            try {
                // 先加载标题
                const savedTitle = localStorage.getItem(`spreadsheet_${id}_title`)
                if (savedTitle) {
                    console.log("Found saved title:", savedTitle)
                    setSheetName(savedTitle)
                } else {
                    setSheetName("已加载的表格")
                }

                // 数据会在LuckysheetEditor组件中加载
                setIsLoaded(true)
            } catch (e) {
                console.warn("无法从localStorage加载数据:", e)
                setLoadError("无法从存储中加载数据")

                // 使用默认数据
                setSheetName("示例表格")
                setSheetData(null)
                setIsLoaded(true)
            }
        } else {
            // 新建表格
            setSheetName("未命名表格")
            setSheetData(null)
            setIsLoaded(true)
        }
    }, [id])

    const handleLuckysheetLoaded = (luckysheet) => {
        luckysheetRef.current = luckysheet
        console.log("Luckysheet loaded and available in EditorView")
    }

    // 标题变更时保存
    useEffect(() => {
        if (isLoaded && id !== "new") {
            try {
                localStorage.setItem(`spreadsheet_${id}_title`, sheetName)
                console.log(`Title saved: ${sheetName}`)
            } catch (e) {
                console.warn("无法保存标题到localStorage:", e)
            }
        }
    }, [sheetName, id, isLoaded])

    const handleSave = (data) => {
        // 在实际应用中，这里会调用API保存数据
        console.log("保存数据:", data)

        if (!data || !Array.isArray(data) || data.length === 0) {
            console.error("保存失败: 无效的数据格式")
            toast({
                title: "保存失败",
                description: "无效的数据格式",
                variant: "destructive",
            })
            return false
        }

        // 保存到localStorage（仅作为示例）
        try {
            const dataString = JSON.stringify(data)
            localStorage.setItem(`spreadsheet_${id}`, dataString)
            console.log(`数据已保存到localStorage，键名: spreadsheet_${id}，数据长度: ${dataString.length}`)

            // 保存标题
            localStorage.setItem(`spreadsheet_${id}_title`, sheetName)

            // 保存最后保存时间
            const now = new Date()
            const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
            localStorage.setItem(`spreadsheet_${id}_lastSaved`, timeString)

            console.log("数据成功保存到localStorage")
            return true
        } catch (e) {
            console.error("无法保存到localStorage:", e)
            toast({
                title: "保存失败",
                description: "无法保存数据到存储",
                variant: "destructive",
            })
            return false
        }
    }

    // 处理标题变更
    const handleTitleChange = (newTitle) => {
        setSheetName(newTitle)
    }

    // 显示加载错误
    useEffect(() => {
        if (loadError) {
            toast({
                title: "加载错误",
                description: loadError,
                variant: "destructive",
            })
        }
    }, [loadError, toast])

    return (
        <div className="flex flex-col h-screen">
            {/* Toast通知组件 */}
            <Toaster />

            {/* 电子表格容器 - 全屏模式 */}
            <div className="flex-1 overflow-hidden relative">
                {isLoaded && (
                    <LuckysheetEditor
                        id={id}
                        data={sheetData}
                        title={sheetName}
                        onTitleChange={handleTitleChange}
                        onLuckysheetLoaded={handleLuckysheetLoaded}
                        onSave={handleSave}
                        fullscreen={true}
                        autoSaveInterval={30000} // 30秒自动保存一次
                    />
                )}
            </div>
        </div>
    )
}

