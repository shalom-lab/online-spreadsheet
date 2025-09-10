"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  FileSpreadsheetIcon,
  MoreVerticalIcon,
  XIcon,
  EditIcon,
  CopyIcon,
  DownloadIcon,
  TypeIcon,
  TrashIcon,
} from "lucide-react"

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

export default function HomeView() {
  const navigate = useNavigate()
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
    navigate("/editor/new")
  }

  const openSheet = (id) => {
    setSelectedSheet(null)
    navigate(`/editor/${id}`)
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
          <h1 className="text-2xl font-semibold text-gray-900">我的表格</h1>
          <button
            onClick={createNewSheet}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            新建表格
          </button>
        </div>

        <div className="mt-6">
          <div className="flex space-x-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="搜索表格..."
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <FilterIcon className="h-5 w-5 mr-2 text-gray-400" />
                筛选
              </button>
              {isFilterOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      最近修改
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      最近创建
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      按名称排序
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {filteredSheets.length === 0 ? (
            <div className="text-center py-12">
              <FileSpreadsheetIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">没有表格</h3>
              <p className="mt-1 text-sm text-gray-500">开始创建您的第一个表格吧！</p>
              <div className="mt-6">
                <button
                  onClick={createNewSheet}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  新建表格
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSheets.map((sheet) => (
                <div key={sheet.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FileSpreadsheetIcon className="h-10 w-10 text-emerald-600" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{sheet.name}</h3>
                        <p className="text-sm text-gray-500">最后编辑于 {formatDate(sheet.lastModified)}</p>
                      </div>
                      <div className="ml-4">
                        <button onClick={() => showSheetOptions(sheet)} className="text-gray-400 hover:text-gray-500">
                          <MoreVerticalIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="flex justify-between">
                      <button
                        onClick={() => openSheet(sheet.id)}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                      >
                        打开
                      </button>
                      <span className="text-sm text-gray-500">{sheet.sheets.length} 个工作表</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 表格选项菜单 */}
      {selectedSheet && (
        <div className="fixed inset-0 overflow-hidden z-20" onClick={() => setSelectedSheet(null)}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">{selectedSheet.name}</h2>
                      <button
                        onClick={() => setSelectedSheet(null)}
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <XIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="py-6 px-4 sm:px-6">
                      <div className="space-y-4">
                        <button
                          onClick={() => openSheet(selectedSheet.id)}
                          className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          <EditIcon className="h-5 w-5 mr-3 text-gray-400" />
                          编辑表格
                        </button>
                        <button
                          onClick={() => duplicateSheet(selectedSheet.id)}
                          className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          <CopyIcon className="h-5 w-5 mr-3 text-gray-400" />
                          复制表格
                        </button>
                        <button
                          onClick={() => downloadSheet(selectedSheet.id)}
                          className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          <DownloadIcon className="h-5 w-5 mr-3 text-gray-400" />
                          导出为Excel
                        </button>
                        <button
                          onClick={() => renameSheet(selectedSheet.id)}
                          className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          <TypeIcon className="h-5 w-5 mr-3 text-gray-400" />
                          重命名
                        </button>
                        <button
                          onClick={() => deleteSheet(selectedSheet.id)}
                          className="w-full flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <TrashIcon className="h-5 w-5 mr-3" />
                          删除表格
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

