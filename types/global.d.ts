// 为window对象添加luckysheet属性的类型定义
interface LuckysheetConfig {
    container: string
    title?: string
    lang?: string
    data: Array<{
        name: string
        color?: string
        status?: number
        order?: number
        data: any[][]
        config?: any
        index?: number
    }>
    [key: string]: any
}

interface Luckysheet {
    create: (options: LuckysheetConfig) => void
    updateConfig: (options: any) => void
    getAllSheets: () => any[]
    exportExcel: (filename: string) => void
    [key: string]: any
}

interface Window {
    luckysheet?: Luckysheet
}

