import { useInfographic } from "@/hooks/useInfographic"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { HomeIcon, ExternalLinkIcon } from "lucide-react"
import { Link } from "react-router-dom"

function Example({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-base font-semibold mt-4">{title}</h3>
      <p className="text-sm text-muted-foreground mb-2">{desc}</p>
      {children}
    </div>
  )
}

function Chart({ template, syntax, height = "300px" }: { template: string; syntax: string; height?: string }) {
  const ref = useInfographic({ syntax, height })
  return (
    <div>
      <div ref={ref} className="w-full rounded-xl border p-2" />
      <p className="mt-1 text-xs text-muted-foreground">模板: {template}</p>
    </div>
  )
}

export default function ChartsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <HomeIcon className="size-4" aria-hidden="true" />
                主页
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">图表示例</h1>
          </div>
          <Badge variant="outline" className="text-orange-600 border-orange-300">
            仅开发环境 · 构建时不打包
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-12">

        {/* ─── 1. Chart 数据图 ─── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">Chart 数据图</h2>
            <p className="text-sm text-muted-foreground">用于展示数值型数据的统计与对比</p>
          </div>

          <Example title="column — 数据对比" desc="柱状图展示季度营收对比">
            <Chart template="chart-column-simple" syntax={`infographic chart-column-simple
data
  title 季度营收（万元）
  values
    - label Q1
      value 4500
    - label Q2
      value 5200
    - label Q3
      value 4800
    - label Q4
      value 6100`} />
          </Example>
        </section>

        <Separator />

        {/* ─── 2. Sequence 序列 ─── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">Sequence 序列</h2>
            <p className="text-sm text-muted-foreground">用于展示有序流程、步骤与阶段</p>
          </div>

          <Example title="steps — 步骤流程" desc="展示有序操作流程">
            <Chart template="sequence-steps-simple" syntax={`infographic sequence-steps-simple
data
  sequences
    - label 填写手机号
      icon phone
    - label 验证码验证
      icon shield check
    - label 设置密码
      icon lock
    - label 完善信息
      icon user
    - label 注册完成
      icon circle check`} />
          </Example>

          <Example title="timeline — 时间线" desc="按时间节点展示里程碑">
            <Chart template="sequence-timeline-simple" syntax={`infographic sequence-timeline-simple
data
  title 公司发展历程
  sequences
    - label 2020年
      desc 公司成立，获得天使轮融资
      icon rocket
    - label 2021年
      desc 产品上线，用户突破10万
      icon star
    - label 2022年
      desc 完成A轮融资，团队扩至200人
      icon chart line
    - label 2023年
      desc 进军海外市场，营收破亿
      icon globe`} />
          </Example>
        </section>

        <Separator />

        {/* ─── 3. Comparison 对比 ─── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">Comparison 对比</h2>
            <p className="text-sm text-muted-foreground">用于展示事物之间的对比与差异</p>
          </div>

          <Example title="swot — SWOT分析" desc="经典四象限SWOT分析">
            <Chart template="compare-swot" syntax={`infographic compare-swot
data
  title 公司SWOT分析
  compares
    - label 优势
      children
        - label 核心技术自主可控
        - label 团队经验丰富
    - label 劣势
      children
        - label 品牌知名度不足
        - label 资金储备有限
    - label 机会
      children
        - label 政策支持数字经济
        - label 市场需求增长
    - label 威胁
      children
        - label 巨头入局竞争
        - label 技术迭代加速`} />
          </Example>

          </section>

        <Separator />

        {/* ─── 4. Hierarchy 层级 ─── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">Hierarchy 层级</h2>
            <p className="text-sm text-muted-foreground">用于展示上下级与包含关系</p>
          </div>

          <Example title="structure — 组织架构" desc="展示公司组织层级">
            <Chart template="hierarchy-structure" syntax={`infographic hierarchy-structure
data
  title 公司组织架构
  root
    label CEO
    icon crown
    children
      - label CTO
        icon code
        children
          - label 前端组
          - label 后端组
      - label COO
        icon briefcase
        children
          - label 运营部
          - label 市场部`} />
          </Example>

          </section>

        <Separator />

        {/* ─── 5. List 列表 ─── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">List 列表</h2>
            <p className="text-sm text-muted-foreground">用于展示无序的条目集合</p>
          </div>

          <Example title="grid — 功能清单" desc="网格排列的卡片式清单">
            <Chart template="list-grid-compact-card" syntax={`infographic list-grid-compact-card
data
  title 产品功能模块
  lists
    - label 用户管理
      icon users
    - label 权限控制
      icon lock
    - label 数据分析
      icon chart bar
    - label 消息通知
      icon bell
    - label 文件管理
      icon folder
    - label 审计日志
      icon file text`} />
          </Example>

          <Example title="row — 横向列表" desc="横向排列的合作伙伴展示">
            <Chart template="list-row-horizontal-icon-arrow" syntax={`infographic list-row-horizontal-icon-arrow
data
  title 合作伙伴
  lists
    - label 阿里云
      desc 云计算基础设施
      icon cloud
      value 40
    - label 华为
      desc 通信与硬件合作
      icon cpu
      value 30
    - label 腾讯
      desc 社交生态对接
      icon message circle
      value 20
    - label 字节跳动
      desc 内容与流量合作
      icon video
      value 10`} />
          </Example>
        </section>

        <Separator />

        {/* ─── 6. Relation 关系 ─── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">Relation 关系</h2>
            <p className="text-sm text-muted-foreground">用于展示节点之间的连接与流向</p>
          </div>

          <Example title="dagre — 流程图" desc="带方向的关系图，适合业务流程和架构图">
            <Chart template="relation-dagre-flow-tb-simple-circle-node" syntax={`infographic relation-dagre-flow-tb-simple-circle-node
data
  title 订单处理流程
  nodes
    - id a
      label 客户下单
      group input
    - id b
      label 订单审核
      group process
    - id c
      label 库存检查
      group process
    - id d
      label 物流配送
      group output
    - id e
      label 客户签收
      group output
  relations
    a -> b
    b -> c
    c -> d
    d -> e`} />
          </Example>
        </section>

        <Separator />

        {/* ─── 7. Quadrant 象限 ─── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">Quadrant 象限</h2>
            <p className="text-sm text-muted-foreground">用于展示四象限分类与定位</p>
          </div>

          <Example title="quarter — 四象限分析" desc="标准四象限分类展示">
            <Chart template="quadrant-quarter-simple-card" syntax={`infographic quadrant-quarter-simple-card
data
  title 时间管理矩阵
  compares
    - label 重要且紧急
      icon alert triangle
    - label 重要不紧急
      icon calendar
    - label 紧急不重要
      icon bell
    - label 不重要不紧急
      icon trash`} />
          </Example>
        </section>

        {/* ─── 查看更多 ─── */}
        <div className="flex justify-center pt-8">
          <a
            href="https://infographic.antv.vision/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLinkIcon className="size-4" />
            查看更多模板（官方画廊 200+ 模板）
          </a>
        </div>

      </div>
    </main>
  )
}