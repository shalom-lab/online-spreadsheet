"use client"

import { useNavigate } from "react-router-dom"
import { BarChart4Icon, CalendarIcon, ClipboardListIcon, CoinsIcon, UsersIcon, TruckIcon } from "lucide-react"

const templates = [
  {
    id: "financial",
    name: "财务报表",
    description: "包含收入、支出和利润分析的财务报表模板",
    icon: BarChart4Icon,
  },
  {
    id: "calendar",
    name: "日程安排",
    description: "用于跟踪日程和事件的日历模板",
    icon: CalendarIcon,
  },
  {
    id: "todo",
    name: "任务清单",
    description: "用于管理项目任务和进度的清单模板",
    icon: ClipboardListIcon,
  },
  {
    id: "budget",
    name: "预算规划",
    description: "用于个人或企业预算规划的模板",
    icon: CoinsIcon,
  },
  {
    id: "team",
    name: "团队管理",
    description: "用于团队成员和职责管理的模板",
    icon: UsersIcon,
  },
  {
    id: "inventory",
    name: "库存管理",
    description: "用于跟踪产品库存和供应链的模板",
    icon: TruckIcon,
  },
]

export default function TemplatesView() {
  const navigate = useNavigate()

  const useTemplate = (templateId: string) => {
    navigate(`/editor/new?template=${templateId}`)
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">模板库</h1>
        <p className="mt-2 text-sm text-gray-500">选择一个模板快速开始您的工作</p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const Icon = template.icon
            return (
              <div key={template.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className="h-10 w-10 text-emerald-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.description}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <button
                    onClick={() => useTemplate(template.id)}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                  >
                    使用此模板
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

