"use client"

import { useState, useEffect } from "react"
import { LuckysheetEditor } from "./luckysheet-editor"
import { Button } from "@/components/ui/button"
import { FileSpreadsheetIcon, PlusIcon } from "lucide-react"

export function SpreadsheetDemo() {
    const [sheetName, setSheetName] = useState("示例电子表格")
    const [luckysheet, setLuckysheet] = useState(null)
    const [demoData, setDemoData] = useState(null)

    useEffect(() => {
        // 创建示例数据
        const data = [
            {
                name: "销售数据",
                color: "",
                status: 1,
                order: 0,
                data: Array(100)
                    .fill(0)
                    .map(() => Array(26).fill("")),
                config: {},
                index: 0,
            },
            {
                name: "财务报表",
                color: "",
                status: 0,
                order: 1,
                data: Array(80)
                    .fill(0)
                    .map(() => Array(20).fill("")),
                config: {},
                index: 1,
            },
            {
                name: "库存管理",
                color: "",
                status: 0,
                order: 2,
                data: Array(60)
                    .fill(0)
                    .map(() => Array(15).fill("")),
                config: {},
                index: 2,
            },
        ]

        // 添加一些示例数据到第一个工作表
        data[0].data[0][0] = "产品名称"
        data[0].data[0][1] = "单价"
        data[0].data[0][2] = "数量"
        data[0].data[0][3] = "金额"
        data[0].data[0][4] = "日期"
        data[0].data[0][5] = "销售员"

        data[0].data[1][0] = "笔记本电脑"
        data[0].data[1][1] = "5999"
        data[0].data[1][2] = "10"
        data[0].data[1][3] = "=B2*C2"
        data[0].data[1][4] = "2023-01-15"
        data[0].data[1][5] = "张三"

        data[0].data[2][0] = "智能手机"
        data[0].data[2][1] = "3999"
        data[0].data[2][2] = "20"
        data[0].data[2][3] = "=B3*C3"
        data[0].data[2][4] = "2023-01-16"
        data[0].data[2][5] = "李四"

        data[0].data[3][0] = "平板电脑"
        data[0].data[3][1] = "2999"
        data[0].data[3][2] = "15"
        data[0].data[3][3] = "=B4*C4"
        data[0].data[3][4] = "2023-01-17"
        data[0].data[3][5] = "王五"

        data[0].data[4][0] = "智能手表"
        data[0].data[4][1] = "1999"
        data[0].data[4][2] = "25"
        data[0].data[4][3] = "=B5*C5"
        data[0].data[4][4] = "2023-01-18"
        data[0].data[4][5] = "赵六"

        data[0].data[5][0] = "总计"
        data[0].data[5][3] = "=SUM(D2:D5)"

        // 添加一些示例数据到第二个工作表
        data[1].data[0][0] = "月份"
        data[1].data[0][1] = "收入"
        data[1].data[0][2] = "支出"
        data[1].data[0][3] = "利润"

        data[1].data[1][0] = "1月"
        data[1].data[1][1] = "150000"
        data[1].data[1][2] = "90000"
        data[1].data[1][3] = "=B2-C2"

        data[1].data[2][0] = "2月"
        data[1].data[2][1] = "180000"
        data[1].data[2][2] = "95000"
        data[1].data[2][3] = "=B3-C3"

        data[1].data[3][0] = "3月"
        data[1].data[3][1] = "210000"
        data[1].data[3][2] = "100000"
        data[1].data[3][3] = "=B4-C4"

        // 添加一些示例数据到第三个工作表
        data[2].data[0][0] = "产品编号"
        data[2].data[0][1] = "产品名称"
        data[2].data[0][2] = "库存数量"
        data[2].data[0][3] = "库存价值"
        data[2].data[0][4] = "仓库位置"

        data[2].data[1][0] = "P001"
        data[2].data[1][1] = "笔记本电脑"
        data[2].data[1][2] = "120"
        data[2].data[1][3] = "=C2*5999"
        data[2].data[1][4] = "A区-01"

        data[2].data[2][0] = "P002"
        data[2].data[2][1] = "智能手机"
        data[2].data[2][2] = "200"
        data[2].data[2][3] = "=C3*3999"
        data[2].data[2][4] = "A区-02"

        data[2].data[3][0] = "P003"
        data[2].data[3][1] = "平板电脑"
        data[2].data[3][2] = "150"
        data[2].data[3][3] = "=C4*2999"
        data[2].data[3][4] = "B区-01"

        setDemoData(data)
    }, [])

    const handleLuckysheetLoaded = (instance) => {
        setLuckysheet(instance)
        console.log("Luckysheet loaded in demo")
    }

    const handleSave = (data) => {
        console.log("保存数据:", data)
        alert("表格数据已保存！")
    }

    const handleCreateNewSheet = () => {
        if (luckysheet) {
            luckysheet.insertSheet({
                name: "新工作表" + (luckysheet.getAllSheets().length + 1),
                color: "",
                status: 0,
                order: luckysheet.getAllSheets().length,
                data: Array(50)
                    .fill(0)
                    .map(() => Array(26).fill("")),
                config: {},
                index: luckysheet.getAllSheets().length,
            })
        }
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="bg-white border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800 relative z-20 py-3 px-4 flex items-center justify-between h-14">
                <div className="flex items-center">
                    <FileSpreadsheetIcon className="h-6 w-6 text-emerald-600 mr-2" />
                    <h1 className="text-lg font-medium">在线电子表格演示</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleCreateNewSheet} variant="outline" className="flex items-center">
                        <PlusIcon className="h-4 w-4 mr-1" />
                        新建工作表
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 bottom-0">
                    <LuckysheetEditor
                        id="demo"
                        data={demoData}
                        title={sheetName}
                        onLuckysheetLoaded={handleLuckysheetLoaded}
                        onSave={handleSave}
                    />
                </div>
            </div>
        </div>
    )
}

