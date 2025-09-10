"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Script from "next/script"
import { FileSpreadsheetIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SpreadsheetMenu } from "./spreadsheet-menu"
import { useToast } from "@/components/ui/use-toast"

interface LuckysheetEditorProps {
    id: string
    data?: any[]
    title?: string
    onSave?: (data: any) => boolean
    onTitleChange?: (title: string) => void
    onLuckysheetLoaded?: (luckysheet: any) => void
    fullscreen?: boolean
    autoSaveInterval?: number
}

export function LuckysheetEditor({
                                     id,
                                     data,
                                     title = "未命名表格",
                                     onSave,
                                     onTitleChange,
                                     onLuckysheetLoaded,
                                     fullscreen = true,
                                     autoSaveInterval = 30000,
                                 }: LuckysheetEditorProps) {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [scriptsLoaded, setScriptsLoaded] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const luckysheetInitialized = useRef(false)
    const [currentTitle, setCurrentTitle] = useState(title)
    const [lastSaved, setLastSaved] = useState<string | null>(null)
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const dataChangeTimerRef = useRef<NodeJS.Timeout | null>(null)
    const initialDataRef = useRef(data)
    const isDataLoadedRef = useRef(false)

    // 保存电子表格数据
    const handleSave = useCallback(
        async (isAutoSave = false): Promise<boolean> => {
            if (!window.luckysheet) {
                console.error("Luckysheet not initialized")
                return false
            }

            try {
                // 使用Luckysheet的API获取当前数据
                // 注意：getluckysheetfile 是 Luckysheet 的正确API
                const currentData = window.luckysheet.getluckysheetfile
                    ? window.luckysheet.getluckysheetfile()
                    : window.luckysheet.getAllSheets
                        ? window.luckysheet.getAllSheets()
                        : null

                if (!currentData || !Array.isArray(currentData) || currentData.length === 0) {
                    console.error("保存失败: 无效的数据格式", currentData)
                    return false
                }

                console.log("保存数据:", currentData)

                // 如果有传入保存回调，则调用
                if (onSave) {
                    const success = onSave(currentData)
                    if (!success) {
                        console.error("保存回调返回失败")
                        return false
                    }
                } else {
                    // 直接保存到localStorage
                    try {
                        const dataString = JSON.stringify(currentData)
                        console.log(`数据长度: ${dataString.length} 字节`)

                        // 如果数据太大，可能需要分块存储
                        if (dataString.length > 5000000) {
                            // 接近5MB
                            console.warn("数据过大，可能超出localStorage限制")
                            toast({
                                title: "警告",
                                description: "表格数据较大，可能无法完全保存",
                                variant: "destructive",
                                duration: 3000,
                            })
                        }

                        localStorage.setItem(`spreadsheet_${id}`, dataString)

                        // 保存当前表格的配置信息
                        const currentOptions = {
                            title: currentTitle,
                            container: "luckysheet",
                            lang: "zh",
                        }
                        localStorage.setItem(`spreadsheet_${id}_options`, JSON.stringify(currentOptions))

                        // 保存当前活动的sheet索引
                        if (window.luckysheet.getActiveSheet && window.luckysheet.getSheetIndex) {
                            const activeSheet = window.luckysheet.getActiveSheet()
                            if (activeSheet && activeSheet.id) {
                                const activeSheetIndex = window.luckysheet.getSheetIndex(activeSheet.id)
                                localStorage.setItem(`spreadsheet_${id}_activeIndex`, String(activeSheetIndex))
                            }
                        }
                    } catch (e) {
                        console.error("无法保存到localStorage:", e)
                        return false
                    }
                }

                // 更新保存状态
                const now = new Date()
                const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
                setLastSaved(isAutoSave ? `自动保存于 ${timeString}` : `保存于 ${timeString}`)
                localStorage.setItem(`spreadsheet_${id}_lastSaved`, timeString)
                setHasUnsavedChanges(false)

                if (!isAutoSave) {
                    toast({
                        title: "保存成功",
                        description: "表格数据已成功保存",
                        duration: 3000,
                    })
                }

                return true
            } catch (error) {
                console.error("保存失败:", error)

                if (!isAutoSave) {
                    toast({
                        title: "保存失败",
                        description: "保存表格数据时出现错误",
                        variant: "destructive",
                        duration: 3000,
                    })
                }

                return false
            }
        },
        [id, onSave, toast, currentTitle],
    )

    // 导出为Excel
    const handleExport = useCallback(async (): Promise<boolean> => {
        if (!window.luckysheet || !window.luckysheet.exportExcel) {
            console.error("Luckysheet not initialized or missing exportExcel method")
            toast({
                title: "导出失败",
                description: "电子表格组件未正确加载",
                variant: "destructive",
                duration: 3000,
            })
            return false
        }

        try {
            console.log("Exporting to Excel...")
            // 确保先保存当前数据
            await handleSave(true)

            // 调用导出方法
            const filename = `${currentTitle || "电子表格"}.xlsx`
            window.luckysheet.exportExcel(filename)

            toast({
                title: "导出成功",
                description: `表格已导出为 ${filename}`,
                duration: 3000,
            })

            return true
        } catch (error) {
            console.error("导出失败:", error)

            toast({
                title: "导出失败",
                description: "导出Excel文件时出现错误",
                variant: "destructive",
                duration: 3000,
            })

            return false
        }
    }, [handleSave, currentTitle, toast])

    // 导入Excel
    const handleImport = useCallback(
        async (file: File): Promise<boolean> => {
            if (!window.luckysheet || !window.luckysheet.importExcel) {
                console.error("Luckysheet not initialized or missing importExcel method")
                toast({
                    title: "导入失败",
                    description: "电子表格组件未正确加载",
                    variant: "destructive",
                    duration: 3000,
                })
                return false
            }

            try {
                const reader = new FileReader()

                // 使用Promise包装FileReader
                const result = await new Promise<ArrayBuffer>((resolve, reject) => {
                    reader.onload = (e) => {
                        if (e.target && e.target.result) {
                            resolve(e.target.result as ArrayBuffer)
                        } else {
                            reject(new Error("Failed to read file"))
                        }
                    }
                    reader.onerror = (e) => reject(e)
                    reader.readAsArrayBuffer(file)
                })

                console.log("Importing Excel file...")

                // 导入Excel
                window.luckysheet.importExcel(result)

                // 导入成功后，标记为未保存
                setHasUnsavedChanges(true)
                setLastSaved(null)

                toast({
                    title: "导入成功",
                    description: `已成功导入文件 ${file.name}`,
                    duration: 3000,
                })

                return true
            } catch (error) {
                console.error("导入失败:", error)

                toast({
                    title: "导入失败",
                    description: "导入Excel文件时出现错误，请检查文件格式",
                    variant: "destructive",
                    duration: 3000,
                })

                return false
            }
        },
        [toast],
    )

    // 自动保存功能
    useEffect(() => {
        // 如果启用了自动保存且Luckysheet已初始化
        if (autoSaveInterval > 0 && luckysheetInitialized.current && window.luckysheet) {
            console.log(`Setting up auto-save every ${autoSaveInterval / 1000} seconds`)

            // 清除之前的定时器
            if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current)
            }

            // 设置新的定时器
            autoSaveTimerRef.current = setInterval(() => {
                // 只有在有未保存的更改时才自动保存
                if (hasUnsavedChanges) {
                    console.log("Auto-saving spreadsheet...")
                    handleSave(true).then((success) => {
                        if (success) {
                            console.log("Auto-save successful")
                        } else {
                            console.error("Auto-save failed")
                        }
                    })
                }
            }, autoSaveInterval)
        }

        // 组件卸载时清除定时器
        return () => {
            if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current)
                autoSaveTimerRef.current = null
            }
        }
    }, [autoSaveInterval, handleSave, hasUnsavedChanges])

    // 监听数据变化
    const setupChangeListeners = useCallback(() => {
        if (!window.luckysheet) return

        console.log("Setting up change listeners")

        // 使用Luckysheet的钩子函数监听变化
        if (window.luckysheet.setCellValue) {
            const originalSetCellValue = window.luckysheet.setCellValue
            window.luckysheet.setCellValue = function (...args) {
                // 调用原始方法
                const result = originalSetCellValue.apply(this, args)

                // 标记为未保存
                console.log("Cell value changed")
                setHasUnsavedChanges(true)
                setLastSaved(null)

                return result
            }
        }

        // 监听工作表操作
        document.addEventListener("luckysheet.deleteSheet", () => {
            console.log("Sheet deleted")
            setHasUnsavedChanges(true)
            setLastSaved(null)
        })

        document.addEventListener("luckysheet.addSheet", () => {
            console.log("Sheet added")
            setHasUnsavedChanges(true)
            setLastSaved(null)
        })

        document.addEventListener("luckysheet.activeSheet", () => {
            console.log("Sheet activated")
            // 工作表切换不一定意味着数据变化，所以这里不设置未保存标记
        })

        // 监听单元格选择
        document.addEventListener("luckysheet.select", () => {
            // 单元格选择不意味着数据变化，所以这里不设置未保存标记
        })

        // 监听公式计算
        document.addEventListener("luckysheet.execFunction", () => {
            console.log("Formula executed")
            setHasUnsavedChanges(true)
            setLastSaved(null)
        })

        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver((mutations) => {
            // 防抖处理，避免频繁触发
            if (dataChangeTimerRef.current) {
                clearTimeout(dataChangeTimerRef.current)
            }

            dataChangeTimerRef.current = setTimeout(() => {
                // 检查是否是真正的数据变化
                const gridElement = document.querySelector(".luckysheet-grid-window")
                if (
                    gridElement &&
                    mutations.some((m) => {
                        return m.target && typeof m.target.contains === "function" && m.target.contains(gridElement)
                    })
                ) {
                    console.log("Grid content changed")
                    setHasUnsavedChanges(true)
                    setLastSaved(null)
                }
            }, 1000)
        })

        // 监听整个luckysheet容器
        const luckysheetElement = document.getElementById("luckysheet")
        if (luckysheetElement) {
            observer.observe(luckysheetElement, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: false,
            })
        }

        return () => {
            // 断开观察器
            observer.disconnect()

            // 清理定时器
            if (dataChangeTimerRef.current) {
                clearTimeout(dataChangeTimerRef.current)
            }
        }
    }, [])

    // 初始化Luckysheet
    const initLuckysheet = useCallback(() => {
        if (!window.luckysheet || luckysheetInitialized.current) return

        try {
            console.log("Initializing Luckysheet...")

            // 尝试从localStorage加载数据
            let initialData
            let activeSheetIndex = 0

            if (id !== "new") {
                try {
                    const savedData = localStorage.getItem(`spreadsheet_${id}`)
                    if (savedData) {
                        console.log("Found saved data in localStorage")
                        initialData = JSON.parse(savedData)
                        console.log("Parsed data:", initialData)

                        // 加载活动sheet索引
                        const savedActiveIndex = localStorage.getItem(`spreadsheet_${id}_activeIndex`)
                        if (savedActiveIndex) {
                            activeSheetIndex = Number.parseInt(savedActiveIndex, 10)
                        }

                        isDataLoadedRef.current = true
                    }
                } catch (e) {
                    console.error("Error loading data from localStorage:", e)
                }
            }

            // 如果没有保存的数据，使用传入的数据或默认数据
            if (!initialData) {
                initialData = initialDataRef.current || [
                    {
                        name: "Sheet1",
                        color: "",
                        status: 1,
                        order: 0,
                        data: Array(50)
                            .fill(0)
                            .map(() => Array(26).fill("")),
                        config: {},
                        index: 0,
                    },
                ]
            }

            // 确保DOM元素存在
            if (!document.getElementById("luckysheet")) {
                console.error("Luckysheet container element not found")
                setIsError(true)
                setIsLoading(false)
                return
            }

            // 初始化Luckysheet
            window.luckysheet.create({
                container: "luckysheet",
                title: currentTitle,
                data: initialData,
                // 设置活动sheet
                index: activeSheetIndex,
                // 设置语言为中文
                lang: "zh",
                // 隐藏信息栏
                showinfobar: false,
                // 显示工作表栏
                showsheetbar: true,
                // 显示统计栏
                showstatisticBar: true,
                // 允许添加行
                enableAddRow: true,
                // 允许添加列
                enableAddCol: true,
                // 统计栏配置
                showstatisticBarConfig: {
                    count: true,
                    view: true,
                    zoom: true,
                },
                // 允许编辑
                allowEdit: true,
                // 允许复制
                allowCopy: true,
                // 显示工具栏
                showtoolbar: true,
                // 显示公式栏
                showformulabar: true,
                // 显示网格线
                showgridlines: true,
                // 显示行标题和列标题
                showrowhead: true,
                showcolhead: true,
                // 自定义样式
                cellRightClickConfig: {
                    customs: [],
                },
                // 隐藏底部红框
                showConfigWindowResize: false,
                // 隐藏底部红色边框
                showsheetbarConfig: {
                    add: true,
                    menu: true,
                    sheet: true,
                },
                // 行高列宽调整
                rowlen: 25,
                columnlen: 80,
                // 调整工作表配置
                sheetFormulaBar: true,
                defaultFontSize: 11,
                // 添加钩子函数，监听数据变化
                hook: {
                    cellUpdated: (cell, r, c, oldValue, newValue) => {
                        // 当单元格数据更新时，标记为未保存
                        console.log("Cell updated:", r, c, oldValue, "->", newValue)
                        setHasUnsavedChanges(true)
                        setLastSaved(null)
                    },
                    sheetActivate: (sheetIndex) => {
                        // 工作表切换时
                        console.log("Sheet activated:", sheetIndex)
                    },
                    workbookCreateAfter: () => {
                        // 工作簿创建后
                        console.log("Workbook created")
                        // 设置变化监听器
                        setTimeout(setupChangeListeners, 1000)
                    },
                    updated: () => {
                        // 任何更新
                        setHasUnsavedChanges(true)
                        setLastSaved(null)
                    },
                    // 监听标题变更
                    onchangetitle: (newTitle) => {
                        console.log("Title changed to:", newTitle)
                        setCurrentTitle(newTitle)
                        if (onTitleChange) {
                            onTitleChange(newTitle)
                        }
                    },
                },
            })

            luckysheetInitialized.current = true
            setIsLoading(false)

            // 通知父组件Luckysheet已加载
            if (onLuckysheetLoaded && window.luckysheet) {
                onLuckysheetLoaded(window.luckysheet)
            }

            // 初始化后标记为未保存
            setHasUnsavedChanges(false)

            // 尝试从localStorage加载最后保存时间
            try {
                const lastSavedTime = localStorage.getItem(`spreadsheet_${id}_lastSaved`)
                if (lastSavedTime) {
                    setLastSaved(`上次保存于 ${lastSavedTime}`)
                }
            } catch (e) {
                console.warn("无法从localStorage加载最后保存时间:", e)
            }
        } catch (error) {
            console.error("Luckysheet初始化失败:", error)
            setIsError(true)
            setIsLoading(false)
        }
    }, [id, currentTitle, onLuckysheetLoaded, setupChangeListeners, onTitleChange])

    // 当脚本加载完成后初始化Luckysheet
    useEffect(() => {
        if (scriptsLoaded && containerRef.current && !luckysheetInitialized.current) {
            // 给DOM一点时间来渲染
            const timer = setTimeout(() => {
                initLuckysheet()
            }, 500)

            return () => clearTimeout(timer)
        }
    }, [scriptsLoaded, initLuckysheet])

    // 清理函数
    useEffect(() => {
        return () => {
            if (window.luckysheet && luckysheetInitialized.current) {
                // 在实际应用中，这里可能需要清理Luckysheet实例
                luckysheetInitialized.current = false
            }

            // 清除所有定时器
            if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current)
                autoSaveTimerRef.current = null
            }

            if (dataChangeTimerRef.current) {
                clearTimeout(dataChangeTimerRef.current)
                dataChangeTimerRef.current = null
            }
        }
    }, [])

    // 处理脚本加载完成
    const handleScriptsLoaded = () => {
        console.log("All scripts loaded")
        setScriptsLoaded(true)
    }

    // 重试初始化
    const handleRetry = () => {
        setIsError(false)
        setIsLoading(true)
        initLuckysheet()
    }

    // 更新标题
    useEffect(() => {
        if (title !== currentTitle) {
            setCurrentTitle(title)

            if (luckysheetInitialized.current && window.luckysheet && window.luckysheet.updateConfig) {
                try {
                    window.luckysheet.updateConfig({
                        title: title,
                    })
                } catch (error) {
                    console.error("更新标题失败:", error)
                }
            }
        }
    }, [title])

    return (
        <div className="flex flex-col h-full relative">
            {/* 加载Luckysheet所需的CSS */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/luckysheet/dist/plugins/css/pluginsCss.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/luckysheet/dist/plugins/plugins.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/luckysheet/dist/css/luckysheet.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/luckysheet/dist/assets/iconfont/iconfont.css" />

            {/* 加载Luckysheet所需的JS */}
            <Script
                src="https://cdn.jsdelivr.net/npm/luckysheet/dist/plugins/js/plugin.js"
                strategy="afterInteractive"
                onLoad={() => console.log("Plugin.js loaded")}
            />
            <Script
                src="https://cdn.jsdelivr.net/npm/luckysheet/dist/luckysheet.umd.js"
                strategy="afterInteractive"
                onLoad={handleScriptsLoaded}
            />

            {/* 右下角菜单按钮和弹窗 */}
            {!isLoading && !isError && (
                <SpreadsheetMenu
                    title={currentTitle}
                    onSave={handleSave}
                    onImport={handleImport}
                    onExport={handleExport}
                    lastSaved={lastSaved}
                    hasUnsavedChanges={hasUnsavedChanges}
                />
            )}

            {/* 未保存指示器 */}
            {hasUnsavedChanges && (
                <div className="fixed top-2 right-2 z-50 bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs shadow-sm flex items-center">
                    <span className="animate-pulse mr-1">●</span>
                    未保存的更改
                </div>
            )}

            {/* Luckysheet容器 */}
            <div
                id="luckysheet"
                ref={containerRef}
                className="w-full h-full"
                style={{
                    margin: 0,
                    padding: 0,
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    left: 0,
                    top: 0,
                    zIndex: 10,
                }}
            >
                {/* 加载状态 */}
                {isLoading && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 absolute top-0 left-0 z-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">正在加载电子表格编辑器...</p>
                        </div>
                    </div>
                )}

                {/* 错误状态 */}
                {isError && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 absolute top-0 left-0 z-20">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
                            <FileSpreadsheetIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">加载失败</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                电子表格编辑器加载失败。请检查您的网络连接或稍后再试。
                            </p>
                            <Button onClick={handleRetry} className="bg-emerald-600 hover:bg-emerald-700">
                                重试
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// 为TypeScript添加全局Luckysheet类型
declare global {
    interface Window {
        luckysheet?: {
            create: (options: any) => void
            updateConfig?: (options: any) => void
            getluckysheetfile?: () => any[]
            getAllSheets?: () => any[]
            getSheet?: (index: number) => any
            getSheetIndex?: (id: string) => number
            getActiveSheet?: () => any
            exportExcel?: (filename: string) => void
            importExcel?: (data: any) => void
            setCellValue?: (...args: any[]) => any
            locale?: string
            config?: any
            locales?: any
            [key: string]: any
        }
    }
}

