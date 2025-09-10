import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
    return (
        <Html lang="zh-CN">
            <Head>{/* 这里可以添加全局的meta标签、字体等 */}</Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    )
}

