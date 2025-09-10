"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  FileSpreadsheetIcon,
  MoreVerticalIcon,
  EditIcon,
  CopyIcon,
  DownloadIcon,
  TypeIcon,
  TrashIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// 模拟数据
const initialSheets = [
  {
    id: "1",
    name: "2023年度财务报表",
    lastModified: new Date("2023-12-15T14:30:00"),
    sheets: [{ name: "收入" }, { name: "支出" }, { name: "汇总" }],
  },
  {
    id: "2",
    name: "项目进度跟踪",
    lastModified: new Date("2023-12-10T09:15:00"),
    sheets: [{ name: "任务列表" }, { name: "时间线" }],
  },
  {
    id: "3",
    name: "员工考勤表",
    lastModified: new Date("2023-12-05T16:45:00"),
    sheets: [{ name: "1月" }, { name: "2月" }, { name: "3月" }],
  },
  {
    id: "4",
    name: "产品库存管理",
    lastModified: new Date("2023-11-28T11:20:00"),
    sheets: [{ name: "入库" }, { name: "出库" }, { name: "库存" }],
  },
]

export function HomeView() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedSheet, setSelectedSheet] = useState(null)
  const [sheets, setSheets] = useState(initialSheets)

  const filteredSheets = searchQuery
    ? sheets.filter((sheet) => sheet.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : sheets

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const createNewSheet = () => {
    router.push("/editor/new")
  }

  const openSheet = (id) => {
    setSelectedSheet(null)
    router.push(`/editor/${id}`)
  }

  const showSheetOptions = (sheet) => {
    setSelectedSheet(sheet)
  }

  const duplicateSheet = (id) => {
    const original = sheets.find((s) => s.id === id)
    if (original) {
      const newSheet = {
        id: Date.now().toString(),
        name: `${original.name} (副本)`,
        lastModified: new Date(),
        sheets: [...original.sheets],
      }
      setSheets([...sheets, newSheet])
      setSelectedSheet(null)
    }
  }

  const downloadSheet = (id) => {
    // 在实际应用中，这里会调用导出为Excel的功能
    alert(`导出表格 ${id} 为Excel文件`)
    setSelectedSheet(null)
  }

  const renameSheet = (id) => {
    const sheet = sheets.find((s) => s.id === id)
    if (sheet) {
      const newName = prompt("请输入新名称", sheet.name)
      if (newName && newName.trim()) {
        setSheets(sheets.map((s) => (s.id === id ? { ...s, name: newName.trim() } : s)))
      }
      setSelectedSheet(null)
    }
  }

  const deleteSheet = (id) => {
    if (confirm("确定要删除这个表格吗？此操作不可撤销。")) {
      setSheets(sheets.filter((s) => s.id !== id))
      setSelectedSheet(null)
    }
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">我的表格</h1>
          <Button onClick={createNewSheet} className="bg-emerald-600 hover:bg-emerald-700">
            <PlusIcon className="h-5 w-5 mr-2" />
            新建表格
          </Button>
        </div>

        <div className="mt-6">
          <div className="flex space-x-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                placeholder="搜索表格..."
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <FilterIcon className="h-5 w-5 mr-2 text-gray-400" />
                  筛选
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>最近修改</DropdownMenuItem>
                <DropdownMenuItem>最近创建</DropdownMenuItem>
                <DropdownMenuItem>按名称排序</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {filteredSheets.length === 0 ? (
            <div className="text-center py-12">
              <FileSpreadsheetIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">没有表格</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">开始创建您的第一个表格吧！</p>
              <div className="mt-6">
                <Button onClick={createNewSheet} className="bg-emerald-600 hover:bg-emerald-700">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  新建表格
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSheets.map((sheet) => (
                <Card key={sheet.id} className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FileSpreadsheetIcon className="h-10 w-10 text-emerald-600" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{sheet.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          最后编辑于 {formatDate(sheet.lastModified)}
                        </p>
                      </div>
                      <div className="ml-4">
                        <Button variant="ghost" size="icon" onClick={() => showSheetOptions(sheet)}>
                          <MoreVerticalIcon className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 dark:bg-gray-900 px-5 py-3">
                    <div className="flex justify-between w-full">
                      <Button
                        variant="link"
                        onClick={() => openSheet(sheet.id)}
                        className="text-emerald-600 hover:text-emerald-500 p-0"
                      >
                        打开
                      </Button>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{sheet.sheets.length} 个工作表</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 表格选项菜单 */}
      <Sheet open={selectedSheet !== null} onOpenChange={() => setSelectedSheet(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedSheet?.name}</SheetTitle>
            <SheetClose />
          </SheetHeader>
          <div className="py-6">
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start" onClick={() => openSheet(selectedSheet?.id)}>
                <EditIcon className="h-5 w-5 mr-3 text-gray-400" />
                编辑表格
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => duplicateSheet(selectedSheet?.id)}
              >
                <CopyIcon className="h-5 w-5 mr-3 text-gray-400" />
                复制表格
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => downloadSheet(selectedSheet?.id)}
              >
                <DownloadIcon className="h-5 w-5 mr-3 text-gray-400" />
                导出为Excel
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => renameSheet(selectedSheet?.id)}>
                <TypeIcon className="h-5 w-5 mr-3 text-gray-400" />
                重命名
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => deleteSheet(selectedSheet?.id)}
              >
                <TrashIcon className="h-5 w-5 mr-3" />
                删除表格
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

