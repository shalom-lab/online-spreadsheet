"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeftIcon,
  UploadIcon,
  DownloadIcon,
  SaveIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  TypeIcon,
  PaletteIcon,
  FullscreenIcon as BorderAllIcon,
  FunctionSquareIcon,
  BarChartIcon,
} from "lucide-react"

export default function EditorView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [sheetName, setSheetName] = useState("未命名表格")
  const [showImportModal, setShowImportModal] = useState(false)
  const luckysheetRef = useRef(null)

  useEffect(() => {
    // 在实际应用中，这里会根据id从API获取表格数据
    if (id !== "new") {
      // 模拟加载已有表格数据
      setSheetName("已加载的表格")
    }

    // 初始化Luckysheet
    // 注意：在实际应用中，需要确保已经加载了Luckysheet的JS和CSS
    if (window.luckysheet) {
      luckysheetRef.current = window.luckysheet
      window.luckysheet.create({
        container: "luckysheet",
        title: sheetName,
        data: [
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
        ],
        showinfobar: false,
        showsheetbar: true,
        showstatisticBar: true,
        enableAddRow: true,
        enableAddCol: true,
        showstatisticBarConfig: {
          count: true,
          view: true,
          zoom: true,
        },
      })
    } else {
      console.error("Luckysheet not loaded")

      // 模拟Luckysheet，仅用于演示
      const luckysheetContainer = document.getElementById("luckysheet")
      if (luckysheetContainer) {
        luckysheetContainer.innerHTML = `
          <div style="display: flex; justify-content: center; align-items: center; height: 100%; background-color: #f9f9f9;">
            <div style="text-align: center;">
              <h2 style="margin-bottom: 16px; color: #333;">Luckysheet 电子表格</h2>
              <p style="color: #666;">这是一个模拟的电子表格界面，实际应用中会加载 Luckysheet 组件</p>
            </div>
          </div>
        `
      }
    }

    return () => {
      // 清理Luckysheet实例
      if (luckysheetRef.current) {
        // 在实际应用中，这里会有清理代码
      }
    }
  }, [id])

  const goBack = () => {
    navigate("/")
  }

  const updateSheetName = () => {
    // 更新表格名称
    if (luckysheetRef.current) {
      luckysheetRef.current.updateConfig({
        title: sheetName,
      })
    }
  }

  const saveSheet = () => {
    // 保存表格数据
    if (luckysheetRef.current) {
      const data = luckysheetRef.current.getAllSheets()
      console.log("保存表格数据:", data)
      // 在实际应用中，这里会调用API保存数据
      alert("表格已保存")
    } else {
      // 模拟保存
      alert("表格已保存（模拟）")
    }
  }

  const exportToExcel = () => {
    // 导出为Excel
    if (luckysheetRef.current) {
      luckysheetRef.current.exportExcel(sheetName + ".xlsx")
    } else {
      // 模拟导出
      alert("表格已导出为Excel（模拟）")
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // 在实际应用中，这里会处理文件上传和导入
      console.log("导入文件:", file)

      // 模拟导入过程
      setTimeout(() => {
        alert(`文件 ${file.name} 已成功导入`)
        setShowImportModal(false)
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 编辑器顶部工具栏 */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <button onClick={goBack} className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div className="ml-4 flex items-center">
              <input
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                onBlur={updateSheetName}
                className="text-lg font-medium text-gray-900 border-0 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <UploadIcon className="h-4 w-4 mr-1" />
              导入
            </button>
            <button
              onClick={exportToExcel}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <DownloadIcon className="h-4 w-4 mr-1" />
              导出
            </button>
            <button
              onClick={saveSheet}
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <SaveIcon className="h-4 w-4 mr-1" />
              保存
            </button>
          </div>
        </div>

        {/* 功能工具栏 */}
        <div className="border-t border-gray-200 px-4 py-2 flex items-center space-x-4 overflow-x-auto">
          <div className="flex items-center space-x-1">
            <button className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <BoldIcon className="h-4 w-4" />
            </button>
            <button className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <ItalicIcon className="h-4 w-4" />
            </button>
            <button className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <UnderlineIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="h-4 border-l border-gray-300"></div>
          <div className="flex items-center space-x-1">
            <button className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <AlignLeftIcon className="h-4 w-4" />
            </button>
            <button className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <AlignCenterIcon className="h-4 w-4" />
            </button>
            <button className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <AlignRightIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="h-4 border-l border-gray-300"></div>
          <div className="flex items-center space-x-1">
            <button className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <TypeIcon className="h-4 w-4" />
            </button>
            <select className="text-sm border-gray-300 rounded-md focus:border-emerald-500 focus:ring-emerald-500">
              <option>Arial</option>
              <option>Times New Roman</option>
              <option>Courier New</option>
            </select>
            <select className="text-sm border-gray-300 rounded-md focus:border-emerald-500 focus:ring-emerald-500">
              <option>10</option>
              <option>12</option>
              <option>14</option>
              <option>16</option>
            </select>
          </div>
          <div className="h-4 border-l border-gray-300"></div>
          <div className="flex items-center space-x-1">
            <button className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <PaletteIcon className="h-4 w-4" />
            </button>
            <button className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <BorderAllIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="h-4 border-l border-gray-300"></div>
          <div className="flex items-center space-x-1">
            <button className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <FunctionSquareIcon className="h-4 w-4" />
            </button>
            <button className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <BarChartIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 电子表格容器 */}
      <div className="flex-1 overflow-hidden">
        <div id="luckysheet" className="w-full h-full"></div>
      </div>

      {/* 导入模态框 */}
      {showImportModal && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowImportModal(false)}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 sm:mx-0 sm:h-10 sm:w-10">
                    <UploadIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      导入Excel文件
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">选择一个Excel文件(.xlsx)导入到当前表格中。</p>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">选择文件</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                              >
                                <span>上传文件</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  accept=".xlsx,.xls"
                                  onChange={handleFileUpload}
                                />
                              </label>
                              <p className="pl-1">或拖放文件到此处</p>
                            </div>
                            <p className="text-xs text-gray-500">支持 .xlsx 和 .xls 格式</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  导入
                </button>
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

