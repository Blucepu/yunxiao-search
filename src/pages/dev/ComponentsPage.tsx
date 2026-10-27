import { useState } from "react"
import { Link } from "react-router-dom"
import {
  BoldIcon,
  ChevronDownIcon,
  CircleCheckIcon,
  CircleAlertIcon,
  CopyIcon,
  HomeIcon,
  InfoIcon,
  ItalicIcon,
  MailIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  TrashIcon,
  TriangleAlertIcon,
  UnderlineIcon,
  UserIcon,
  BellIcon,
  EditIcon,
  GlobeIcon,
  ImagePlusIcon,
  InboxIcon,
  LinkIcon,
  LogOutIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  Share2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckboxGroup } from "@/components/ui/checkbox-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider, SliderValue } from "@/components/ui/slider"
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field"
import { OTPField, OTPFieldInput, OTPFieldSeparator } from "@/components/ui/otp-field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldItem,
} from "@/components/ui/field"
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset"
import { Form } from "@/components/ui/form"
import {
  Autocomplete,
  AutocompleteInput,
  AutocompletePopup,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteEmpty,
  AutocompleteCollection,
} from "@/components/ui/autocomplete"
import {
  Combobox,
  ComboboxInput,
  ComboboxPopup,
  ComboboxItem,
  ComboboxList,
  ComboboxEmpty,
  ComboboxCollection,
} from "@/components/ui/combobox"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogPanel,
  DialogClose,
} from "@/components/ui/dialog"
import { toastManager, ToastProvider } from "@/components/ui/toast"
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress"
import { Meter, MeterLabel, MeterTrack, MeterIndicator, MeterValue } from "@/components/ui/meter"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import {
  Menu,
  MenuTrigger,
  MenuPopup,
  MenuItem,
  MenuGroup,
  MenuGroupLabel,
  MenuSeparator,
  MenuShortcut,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubTrigger,
  MenuSubPopup,
} from "@/components/ui/menu"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuPopup,
  ContextMenuItem,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuShortcut,
} from "@/components/ui/context-menu"
import {
  CommandDialog,
  CommandDialogPopup,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandCollection,
} from "@/components/ui/command"
import { Popover, PopoverTrigger, PopoverPopup } from "@/components/ui/popover"
import { Tooltip, TooltipTrigger, TooltipPopup, TooltipProvider } from "@/components/ui/tooltip"
import { PreviewCard, PreviewCardTrigger, PreviewCardPopup } from "@/components/ui/preview-card"
import {
  Sheet,
  SheetTrigger,
  SheetPopup,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetPanel,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Drawer,
  DrawerTrigger,
  DrawerPopup,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerPanel,
  DrawerClose,
} from "@/components/ui/drawer"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardPanel,
  CardFooter,
  CardAction,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"
import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Frame, FramePanel, FrameHeader, FrameTitle, FrameDescription, FrameFooter } from "@/components/ui/frame"
import { Group, GroupText, GroupSeparator } from "@/components/ui/group"
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from "@/components/ui/toolbar"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import { Toggle } from "@/components/ui/toggle"

function SwitchDemo() {
  const [checked, setChecked] = useState(false)
  return (
    <div className="flex items-center gap-4">
      <Switch checked={checked} onCheckedChange={setChecked} />
      <Label>{checked ? "开" : "关"}</Label>
    </div>
  )
}

function CheckboxDemo() {
  const [checked, setChecked] = useState(false)
  return (
    <div className="flex items-center gap-4">
      <Checkbox checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
      <Label>{checked ? "已选" : "未选"}</Label>
    </div>
  )
}

function CheckboxGroupDemo() {
  const [value, setValue] = useState<string[]>(["a"])
  return (
    <CheckboxGroup value={value} onValueChange={setValue}>
      <label className="flex items-center gap-2">
        <Checkbox value="a" />
        <span>选项 A</span>
      </label>
      <label className="flex items-center gap-2">
        <Checkbox value="b" />
        <span>选项 B</span>
      </label>
      <label className="flex items-center gap-2">
        <Checkbox value="c" />
        <span>选项 C</span>
      </label>
    </CheckboxGroup>
  )
}

function RadioGroupDemo() {
  const [value, setValue] = useState("1")
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <label className="flex items-center gap-2">
        <RadioGroupItem value="1" />
        <span>选项一</span>
      </label>
      <label className="flex items-center gap-2">
        <RadioGroupItem value="2" />
        <span>选项二</span>
      </label>
      <label className="flex items-center gap-2">
        <RadioGroupItem value="3" />
        <span>选项三</span>
      </label>
    </RadioGroup>
  )
}

function SliderDemo() {
  const [value, setValue] = useState<number | readonly number[]>([30])
  return (
    <div className="w-full space-y-2">
      <Slider value={value as number[]} onValueChange={(v) => setValue(v as number[])}>
        <SliderValue />
      </Slider>
    </div>
  )
}

function ProgressDemo() {
  const [val, setVal] = useState(33)
  return (
    <div className="w-full space-y-2">
      <Progress value={val}>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <div className="flex gap-2">
        <Button size="xs" variant="outline" onClick={() => setVal(Math.max(0, val - 10))}>-10</Button>
        <Button size="xs" variant="outline" onClick={() => setVal(Math.min(100, val + 10))}>+10</Button>
      </div>
    </div>
  )
}

function NumberFieldDemo() {
  const [value, setValue] = useState(5)
  return (
    <NumberField value={value} onValueChange={(v) => v !== null && setValue(v)}>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  )
}

function OTPFieldDemo() {
  return (
    <OTPField length={6}>
      <OTPFieldInput />
      <OTPFieldInput />
      <OTPFieldInput />
      <OTPFieldSeparator />
      <OTPFieldInput />
      <OTPFieldInput />
      <OTPFieldInput />
    </OTPField>
  )
}

function InputDemo() {
  const [value, setValue] = useState("")
  return (
    <div className="w-full max-w-xs space-y-3">
      <Input placeholder="默认尺寸" value={value} onValueChange={setValue} />
      <Input placeholder="小尺寸" size="sm" />
      <Input placeholder="大尺寸" size="lg" />
    </div>
  )
}

function TextareaDemo() {
  const [value, setValue] = useState("")
  return (
    <Textarea placeholder="请输入内容..." value={value} onChange={(e) => setValue(e.target.value)} className="max-w-xs" />
  )
}

function SelectDemo() {
  const [value, setValue] = useState("")
  return (
    <Select value={value} onValueChange={(v) => setValue(v ?? "")}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="选择水果" />
      </SelectTrigger>
      <SelectPopup>
        <SelectItem value="apple">苹果</SelectItem>
        <SelectItem value="banana">香蕉</SelectItem>
        <SelectItem value="cherry">樱桃</SelectItem>
        <SelectSeparator />
        <SelectItem value="grape">葡萄</SelectItem>
      </SelectPopup>
    </Select>
  )
}

function AutocompleteDemo() {
  return (
    <Autocomplete>
      <AutocompleteInput placeholder="搜索水果..." />
      <AutocompletePopup>
        <AutocompleteList>
          <AutocompleteCollection>
            {(item: string) => (
              <AutocompleteItem key={item} value={item}>
                {item}
              </AutocompleteItem>
            )}
          </AutocompleteCollection>
          <AutocompleteEmpty>无匹配结果</AutocompleteEmpty>
        </AutocompleteList>
      </AutocompletePopup>
    </Autocomplete>
  )
}

function ComboboxDemo() {
  return (
    <Combobox>
      <ComboboxInput placeholder="选择框架..." />
      <ComboboxPopup>
        <ComboboxList>
          <ComboboxCollection>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxCollection>
          <ComboboxEmpty>无匹配结果</ComboboxEmpty>
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  )
}

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">打开对话框</Button>} />
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>编辑资料</DialogTitle>
          <DialogDescription>修改你的个人信息。</DialogDescription>
        </DialogHeader>
        <DialogPanel>
          <div className="space-y-3">
            <Field>
              <FieldLabel>姓名</FieldLabel>
              <FieldItem>
                <Input placeholder="你的名字" />
              </FieldItem>
            </Field>
            <Field>
              <FieldLabel>邮箱</FieldLabel>
              <FieldItem>
                <Input placeholder="you@example.com" />
              </FieldItem>
            </Field>
          </div>
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">取消</Button>} />
          <DialogClose render={<Button>保存</Button>} />
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}

function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive-outline">删除操作</Button>} />
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>确定删除吗？</AlertDialogTitle>
          <AlertDialogDescription>此操作不可撤销，删除后数据将永久丢失。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline">取消</Button>} />
          <AlertDialogClose render={<Button variant="destructive">确认删除</Button>} />
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  )
}

function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">打开侧边栏</Button>} />
      <SheetPopup side="right">
        <SheetHeader>
          <SheetTitle>设置面板</SheetTitle>
          <SheetDescription>在此调整你的偏好设置。</SheetDescription>
        </SheetHeader>
        <SheetPanel>
          <div className="space-y-4">
            <Field>
              <FieldLabel>通知</FieldLabel>
              <FieldItem>
                <SwitchDemo />
              </FieldItem>
            </Field>
            <Separator />
            <Field>
              <FieldLabel>语言</FieldLabel>
              <FieldItem>
                <SelectDemo />
              </FieldItem>
            </Field>
          </div>
        </SheetPanel>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">关闭</Button>} />
          <SheetClose render={<Button>保存</Button>} />
        </SheetFooter>
      </SheetPopup>
    </Sheet>
  )
}

function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">打开抽屉</Button>} />
      <DrawerPopup position="bottom" showBar>
        <DrawerHeader>
          <DrawerTitle>分享</DrawerTitle>
          <DrawerDescription>选择你想要分享的方式。</DrawerDescription>
        </DrawerHeader>
        <DrawerPanel>
          <div className="grid grid-cols-4 gap-4">
            {[MailIcon, LinkIcon, MessageSquareIcon, CopyIcon].map((Icon, i) => (
              <button key={i} type="button" className="flex flex-col items-center gap-2 rounded-lg p-3 hover:bg-accent">
                <Icon className="size-6" aria-hidden="true" />
                <span className="text-xs">{["邮件", "链接", "消息", "复制"][i]}</span>
              </button>
            ))}
          </div>
        </DrawerPanel>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline">取消</Button>} />
        </DrawerFooter>
      </DrawerPopup>
    </Drawer>
  )
}

function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => toastManager.add({ title: "操作成功", description: "数据已保存", type: "success" })}
      >
        成功
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => toastManager.add({ title: "注意", description: "请检查输入内容", type: "warning" })}
      >
        警告
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => toastManager.add({ title: "出错了", description: "请稍后重试", type: "error" })}
      >
        错误
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => toastManager.add({ title: "提示", description: "有新版本可用", type: "info" })}
      >
        信息
      </Button>
    </div>
  )
}

function MenuDemo() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline" size="icon"><MenuIcon className="size-4" aria-hidden="true" /></Button>} />
      <MenuPopup>
        <MenuGroup>
          <MenuGroupLabel>我的账户</MenuGroupLabel>
          <MenuItem>
            <UserIcon className="size-4" aria-hidden="true" />
            个人资料
            <MenuShortcut>⌘P</MenuShortcut>
          </MenuItem>
          <MenuItem>
            <SettingsIcon className="size-4" aria-hidden="true" />
            设置
            <MenuShortcut>⌘S</MenuShortcut>
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>
            <Share2Icon className="size-4" aria-hidden="true" />
            分享
          </MenuSubTrigger>
          <MenuSubPopup>
            <MenuItem>邮件</MenuItem>
            <MenuItem>链接</MenuItem>
          </MenuSubPopup>
        </MenuSub>
        <MenuSeparator />
        <MenuCheckboxItem checked>
          显示状态栏
        </MenuCheckboxItem>
        <MenuSeparator />
        <MenuRadioGroup value="billing">
          <MenuRadioItem value="billing">按月计费</MenuRadioItem>
          <MenuRadioItem value="yearly">按年计费</MenuRadioItem>
        </MenuRadioGroup>
        <MenuSeparator />
        <MenuItem variant="destructive">
          <LogOutIcon className="size-4" aria-hidden="true" />
          退出登录
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}

function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed text-sm text-muted-foreground">
          右键点击此区域
        </div>
      </ContextMenuTrigger>
      <ContextMenuPopup>
        <ContextMenuGroup>
          <ContextMenuGroupLabel>操作</ContextMenuGroupLabel>
          <ContextMenuItem>
            <CopyIcon className="size-4" aria-hidden="true" />
            复制
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <EditIcon className="size-4" aria-hidden="true" />
            编辑
            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem variant="destructive">
            <TrashIcon className="size-4" aria-hidden="true" />
            删除
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuPopup>
    </ContextMenu>
  )
}

function CommandDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <SearchIcon className="size-4" aria-hidden="true" />
        命令面板...
        <Kbd>⌘K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandDialogPopup>
          <Command>
            <CommandInput placeholder="搜索命令..." />
            <CommandList>
              <CommandEmpty>未找到结果</CommandEmpty>
              <CommandGroup>
                <CommandCollection>
                  {(item: any) => (
                    <CommandItem key={item} value={item}>
                      {item}
                    </CommandItem>
                  )}
                </CommandCollection>
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialogPopup>
      </CommandDialog>
    </>
  )
}

function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">弹出框</Button>} />
      <PopoverPopup>
        <div className="space-y-2">
          <Label>标签</Label>
          <Input placeholder="输入标签名称..." />
          <div className="flex gap-2">
            <Badge variant="secondary">设计</Badge>
            <Badge variant="secondary">开发</Badge>
            <Badge variant="secondary">产品</Badge>
          </div>
        </div>
      </PopoverPopup>
    </Popover>
  )
}

function TooltipDemo() {
  return (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="icon"><HomeIcon className="size-4" aria-hidden="true" /></Button>} />
          <TooltipPopup>首页</TooltipPopup>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="icon"><SettingsIcon className="size-4" aria-hidden="true" /></Button>} />
          <TooltipPopup>设置</TooltipPopup>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="icon"><UserIcon className="size-4" aria-hidden="true" /></Button>} />
          <TooltipPopup>个人资料</TooltipPopup>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

function PreviewCardDemo() {
  return (
    <PreviewCard>
      <PreviewCardTrigger render={<Button variant="link">悬停预览</Button>} />
      <PreviewCardPopup>
        <div className="space-y-2">
          <p className="font-semibold">预览卡片</p>
          <p className="text-muted-foreground text-xs">悬停触发时显示的预览内容，适合链接预览。</p>
        </div>
      </PreviewCardPopup>
    </PreviewCard>
  )
}

function CollapsibleDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">@peduarte 点赞了 3 个仓库</span>
          <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm"><ChevronDownIcon className="size-4" aria-hidden="true" /></Button>} />
        </div>
        <div className="rounded-md border px-4 py-3 text-sm">@radix-ui/primitives</div>
        <CollapsiblePanel>
          <div className="space-y-2">
            <div className="rounded-md border px-4 py-3 text-sm">@radix-ui/colors</div>
            <div className="rounded-md border px-4 py-3 text-sm">@stitches/react</div>
          </div>
        </CollapsiblePanel>
      </div>
    </Collapsible>
  )
}

function MeterDemo() {
  return (
    <div className="w-full max-w-xs space-y-2">
      <Meter value={75}>
        <div className="flex justify-between">
          <MeterLabel>磁盘使用</MeterLabel>
          <MeterValue />
        </div>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  )
}

function SectionTitle({ zh, en, description }: { zh: string; en: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-semibold text-2xl tracking-tight">
        {zh}
        <span className="ml-2 text-muted-foreground text-base font-normal">{en}</span>
      </h2>
      <p className="mt-1 text-muted-foreground text-sm">{description}</p>
    </div>
  )
}

function DemoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
      <div className="rounded-xl border bg-card p-4">
        {children}
      </div>
    </div>
  )
}

export default function ComponentsPage() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur">
          <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <HomeIcon className="size-4" aria-hidden="true" />
                主页
              </Button>
            </Link>
            <h1 className="font-semibold text-lg">组件预览</h1>
          </div>
          <Badge variant="outline" className="border-orange-300 text-orange-600">
            仅开发环境 · 构建时不打包
          </Badge>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8 space-y-12">
          <section>
            <SectionTitle zh="基础组件" en="Basic" description="按钮、徽章、标签、键盘快捷键、分割线、骨架屏、加载动画" />
            <div className="space-y-6">
              <DemoBlock title="Button 按钮 — 变体">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="default">默认</Button>
                  <Button variant="secondary">次要</Button>
                  <Button variant="outline">轮廓</Button>
                  <Button variant="ghost">幽灵</Button>
                  <Button variant="link">链接</Button>
                  <Button variant="destructive">危险</Button>
                  <Button variant="destructive-outline">危险轮廓</Button>
                  <Button disabled>禁用</Button>
                  <Button loading>加载中</Button>
                </div>
              </DemoBlock>
              <DemoBlock title="Button 按钮 — 尺寸">
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="xs">超小</Button>
                  <Button size="sm">小</Button>
                  <Button size="default">默认</Button>
                  <Button size="lg">大</Button>
                  <Button size="xl">超大</Button>
                  <Button size="icon" variant="outline"><StarIcon className="size-4" aria-hidden="true" /></Button>
                  <Button size="icon-sm" variant="outline"><StarIcon className="size-4" aria-hidden="true" /></Button>
                  <Button size="icon-lg" variant="outline"><StarIcon className="size-4" aria-hidden="true" /></Button>
                  <Button size="icon-xl" variant="outline"><StarIcon className="size-4" aria-hidden="true" /></Button>
                </div>
              </DemoBlock>
              <DemoBlock title="Badge 徽章">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="default">默认</Badge>
                  <Badge variant="secondary">次要</Badge>
                  <Badge variant="outline">轮廓</Badge>
                  <Badge variant="destructive">危险</Badge>
                  <Badge variant="success">成功</Badge>
                  <Badge variant="warning">警告</Badge>
                  <Badge variant="error">错误</Badge>
                  <Badge variant="info">信息</Badge>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Badge size="sm">小</Badge>
                  <Badge size="default">默认</Badge>
                  <Badge size="lg">大</Badge>
                </div>
              </DemoBlock>
              <DemoBlock title="Label 标签">
                <Label htmlFor="demo-label">用户名</Label>
              </DemoBlock>
              <DemoBlock title="Kbd 键盘快捷键">
                <div className="flex flex-wrap items-center gap-3">
                  <Kbd>⌘K</Kbd>
                  <Kbd>⇧⌘S</Kbd>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>Shift</Kbd>
                    <Kbd>P</Kbd>
                  </KbdGroup>
                </div>
              </DemoBlock>
              <DemoBlock title="Separator 分割线">
                <div className="space-y-3">
                  <p className="text-sm">水平分割线</p>
                  <Separator />
                  <div className="flex h-8 items-center gap-3">
                    <span className="text-sm">左</span>
                    <Separator orientation="vertical" />
                    <span className="text-sm">右</span>
                  </div>
                </div>
              </DemoBlock>
              <DemoBlock title="Skeleton 骨架屏">
                <div className="flex items-center gap-4">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </DemoBlock>
              <DemoBlock title="Spinner 加载动画">
                <div className="flex items-center gap-4">
                  <Spinner className="size-4" />
                  <Spinner className="size-6" />
                  <Spinner className="size-8" />
                </div>
              </DemoBlock>
            </div>
          </section>

          <Separator />

          <section>
            <SectionTitle zh="表单组件" en="Form" description="输入框、文本域、选择器、复选框、单选框、开关、滑块、数字输入、OTP、输入组、字段、表单" />
            <div className="space-y-6">
              <DemoBlock title="Input 输入框">
                <InputDemo />
              </DemoBlock>
              <DemoBlock title="Textarea 文本域">
                <TextareaDemo />
              </DemoBlock>
              <DemoBlock title="Select 选择器">
                <SelectDemo />
              </DemoBlock>
              <DemoBlock title="Checkbox 复选框">
                <CheckboxDemo />
              </DemoBlock>
              <DemoBlock title="CheckboxGroup 复选框组">
                <CheckboxGroupDemo />
              </DemoBlock>
              <DemoBlock title="RadioGroup 单选框组">
                <RadioGroupDemo />
              </DemoBlock>
              <DemoBlock title="Switch 开关">
                <SwitchDemo />
              </DemoBlock>
              <DemoBlock title="Slider 滑块">
                <SliderDemo />
              </DemoBlock>
              <DemoBlock title="NumberField 数字输入">
                <NumberFieldDemo />
              </DemoBlock>
              <DemoBlock title="OTPField 验证码输入">
                <OTPFieldDemo />
              </DemoBlock>
              <DemoBlock title="InputGroup 输入组">
                <div className="max-w-xs space-y-3">
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>
                        <MailIcon className="size-4" aria-hidden="true" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput placeholder="you@example.com" />
                  </InputGroup>
                  <InputGroup>
                    <InputGroupInput placeholder="搜索..." />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>
                        <SearchIcon className="size-4" aria-hidden="true" />
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              </DemoBlock>
              <DemoBlock title="Field 字段">
                <Field>
                  <FieldLabel>邮箱</FieldLabel>
                  <FieldDescription>我们不会分享你的邮箱。</FieldDescription>
                  <FieldItem>
                    <Input placeholder="you@example.com" />
                  </FieldItem>
                </Field>
              </DemoBlock>
              <DemoBlock title="Fieldset 字段集">
                <Fieldset className="space-y-4">
                  <FieldsetLegend>个人信息</FieldsetLegend>
                  <Field>
                    <FieldLabel>姓名</FieldLabel>
                    <FieldItem>
                      <Input placeholder="你的名字" />
                    </FieldItem>
                  </Field>
                  <Field>
                    <FieldLabel>邮箱</FieldLabel>
                    <FieldItem>
                      <Input placeholder="you@example.com" />
                    </FieldItem>
                  </Field>
                </Fieldset>
              </DemoBlock>
              <DemoBlock title="Form 表单">
                <Form className="max-w-sm space-y-4">
                  <Field>
                    <FieldLabel>用户名</FieldLabel>
                    <FieldItem>
                      <Input placeholder="username" />
                    </FieldItem>
                  </Field>
                  <Field>
                    <FieldLabel>密码</FieldLabel>
                    <FieldItem>
                      <Input type="password" placeholder="••••••••" />
                    </FieldItem>
                  </Field>
                  <Button type="submit">登录</Button>
                </Form>
              </DemoBlock>
              <DemoBlock title="Autocomplete 自动完成">
                <AutocompleteDemo />
              </DemoBlock>
              <DemoBlock title="Combobox 组合框">
                <ComboboxDemo />
              </DemoBlock>
              <DemoBlock title="ToggleGroup 切换组">
                <ToggleGroup>
                  <ToggleGroupItem value="bold" aria-label="粗体">
                    <BoldIcon className="size-4" aria-hidden="true" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" aria-label="斜体">
                    <ItalicIcon className="size-4" aria-hidden="true" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="underline" aria-label="下划线">
                    <UnderlineIcon className="size-4" aria-hidden="true" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </DemoBlock>
            </div>
          </section>

          <Separator />

          <section>
            <SectionTitle zh="反馈组件" en="Feedback" description="提示框、确认对话框、对话框、消息提示、进度条、计量器、空状态" />
            <div className="space-y-6">
              <DemoBlock title="Alert 提示框">
                <div className="space-y-3">
                  <Alert>
                    <InfoIcon className="size-4" aria-hidden="true" />
                    <AlertTitle>提示</AlertTitle>
                    <AlertDescription>这是一个默认的提示信息。</AlertDescription>
                  </Alert>
                  <Alert variant="success">
                    <CircleCheckIcon className="size-4" aria-hidden="true" />
                    <AlertTitle>成功</AlertTitle>
                    <AlertDescription>操作已成功完成。</AlertDescription>
                  </Alert>
                  <Alert variant="warning">
                    <TriangleAlertIcon className="size-4" aria-hidden="true" />
                    <AlertTitle>警告</AlertTitle>
                    <AlertDescription>请注意检查相关内容。</AlertDescription>
                  </Alert>
                  <Alert variant="error">
                    <CircleAlertIcon className="size-4" aria-hidden="true" />
                    <AlertTitle>错误</AlertTitle>
                    <AlertDescription>发生了错误，请重试。</AlertDescription>
                  </Alert>
                  <Alert variant="info">
                    <InfoIcon className="size-4" aria-hidden="true" />
                    <AlertTitle>信息</AlertTitle>
                    <AlertDescription>这是一条信息提示。</AlertDescription>
                    <AlertAction>
                      <Button size="xs" variant="outline">查看详情</Button>
                    </AlertAction>
                  </Alert>
                </div>
              </DemoBlock>
              <DemoBlock title="AlertDialog 确认对话框">
                <AlertDialogDemo />
              </DemoBlock>
              <DemoBlock title="Dialog 对话框">
                <DialogDemo />
              </DemoBlock>
              <DemoBlock title="Toast 消息提示">
                <ToastDemo />
              </DemoBlock>
              <DemoBlock title="Progress 进度条">
                <ProgressDemo />
              </DemoBlock>
              <DemoBlock title="Meter 计量器">
                <MeterDemo />
              </DemoBlock>
              <DemoBlock title="Empty 空状态">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <InboxIcon className="size-6" aria-hidden="true" />
                    </EmptyMedia>
                    <EmptyTitle>暂无数据</EmptyTitle>
                    <EmptyDescription>当前没有任何内容，请添加新数据。</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button size="sm">
                      <PlusIcon className="size-4" aria-hidden="true" />
                      新建
                    </Button>
                  </EmptyContent>
                </Empty>
              </DemoBlock>
            </div>
          </section>

          <Separator />

          <section>
            <SectionTitle zh="导航组件" en="Navigation" description="选项卡、面包屑、分页、菜单、右键菜单、命令面板、侧边栏" />
            <div className="space-y-6">
              <DemoBlock title="Tabs 选项卡">
                <Tabs defaultValue="tab1">
                  <TabsList>
                    <TabsTab value="tab1">概览</TabsTab>
                    <TabsTab value="tab2">分析</TabsTab>
                    <TabsTab value="tab3">设置</TabsTab>
                  </TabsList>
                  <TabsPanel value="tab1">
                    <p className="py-4 text-sm text-muted-foreground">这是概览选项卡的内容。</p>
                  </TabsPanel>
                  <TabsPanel value="tab2">
                    <p className="py-4 text-sm text-muted-foreground">这是分析选项卡的内容。</p>
                  </TabsPanel>
                  <TabsPanel value="tab3">
                    <p className="py-4 text-sm text-muted-foreground">这是设置选项卡的内容。</p>
                  </TabsPanel>
                </Tabs>
              </DemoBlock>
              <DemoBlock title="Tabs 选项卡 — 下划线变体">
                <Tabs defaultValue="tab1">
                  <TabsList variant="underline">
                    <TabsTab value="tab1">账户</TabsTab>
                    <TabsTab value="tab2">密码</TabsTab>
                    <TabsTab value="tab3">通知</TabsTab>
                  </TabsList>
                  <TabsPanel value="tab1">
                    <p className="py-4 text-sm text-muted-foreground">账户设置内容。</p>
                  </TabsPanel>
                  <TabsPanel value="tab2">
                    <p className="py-4 text-sm text-muted-foreground">密码设置内容。</p>
                  </TabsPanel>
                  <TabsPanel value="tab3">
                    <p className="py-4 text-sm text-muted-foreground">通知设置内容。</p>
                  </TabsPanel>
                </Tabs>
              </DemoBlock>
              <DemoBlock title="Breadcrumb 面包屑">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">
                        <HomeIcon className="size-4" aria-hidden="true" />
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">文档</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbEllipsis />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>组件</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </DemoBlock>
              <DemoBlock title="Pagination 分页">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </DemoBlock>
              <DemoBlock title="Menu 下拉菜单">
                <MenuDemo />
              </DemoBlock>
              <DemoBlock title="ContextMenu 右键菜单">
                <ContextMenuDemo />
              </DemoBlock>
              <DemoBlock title="Command 命令面板">
                <CommandDemo />
              </DemoBlock>
              <DemoBlock title="Sidebar 侧边栏">
                <p className="text-sm text-muted-foreground">侧边栏为全局布局组件，需在 SidebarProvider 中使用。此页面未内嵌演示，请参考项目主布局。</p>
              </DemoBlock>
            </div>
          </section>

          <Separator />

          <section>
            <SectionTitle zh="浮层组件" en="Overlay" description="弹出框、提示气泡、预览卡片、侧滑面板、抽屉" />
            <div className="space-y-6">
              <DemoBlock title="Popover 弹出框">
                <PopoverDemo />
              </DemoBlock>
              <DemoBlock title="Tooltip 提示气泡">
                <TooltipDemo />
              </DemoBlock>
              <DemoBlock title="PreviewCard 预览卡片">
                <PreviewCardDemo />
              </DemoBlock>
              <DemoBlock title="Sheet 侧滑面板">
                <SheetDemo />
              </DemoBlock>
              <DemoBlock title="Drawer 抽屉">
                <DrawerDemo />
              </DemoBlock>
            </div>
          </section>

          <Separator />

          <section>
            <SectionTitle zh="布局组件" en="Layout" description="卡片、手风琴、折叠面板、滚动区域、框架、分组、工具栏" />
            <div className="space-y-6">
              <DemoBlock title="Card 卡片">
                <Card className="max-w-sm">
                  <CardHeader>
                    <CardTitle>项目统计</CardTitle>
                    <CardDescription>本月数据概览</CardDescription>
                    <CardAction>
                      <Button variant="ghost" size="icon-sm"><MoreHorizontalIcon className="size-4" aria-hidden="true" /></Button>
                    </CardAction>
                  </CardHeader>
                  <CardPanel>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="font-bold text-2xl">1,234</p>
                        <p className="text-muted-foreground text-xs">总访问</p>
                      </div>
                      <div>
                        <p className="font-bold text-2xl">56</p>
                        <p className="text-muted-foreground text-xs">新用户</p>
                      </div>
                    </div>
                  </CardPanel>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">查看详情</Button>
                  </CardFooter>
                </Card>
              </DemoBlock>
              <DemoBlock title="Accordion 手风琴">
                <Accordion>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>什么是 coss？</AccordionTrigger>
                    <AccordionPanel>coss 是一个基于 Base UI 的 React 组件库。</AccordionPanel>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>如何使用？</AccordionTrigger>
                    <AccordionPanel>通过 CLI 安装组件到项目中。</AccordionPanel>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>支持定制吗？</AccordionTrigger>
                    <AccordionPanel>完全支持通过 Tailwind CSS 进行样式定制。</AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </DemoBlock>
              <DemoBlock title="Collapsible 折叠面板">
                <CollapsibleDemo />
              </DemoBlock>
              <DemoBlock title="ScrollArea 滚动区域">
                <ScrollArea className="h-40 w-full rounded-md border p-4">
                  <div className="space-y-3">
                    {Array.from({ length: 20 }, (_, i) => (
                      <p key={i} className="text-sm text-muted-foreground">滚动项目 {i + 1}：这是一行示例文本。</p>
                    ))}
                  </div>
                </ScrollArea>
              </DemoBlock>
              <DemoBlock title="Frame 框架">
                <Frame className="max-w-md">
                  <FramePanel>
                    <FrameHeader>
                      <FrameTitle>框架面板标题</FrameTitle>
                      <FrameDescription>框架组件用于嵌套面板布局。</FrameDescription>
                    </FrameHeader>
                    <p className="px-5 text-sm text-muted-foreground">框架面板内容区域。</p>
                    <FrameFooter>
                      <Button size="sm">操作</Button>
                    </FrameFooter>
                  </FramePanel>
                </Frame>
              </DemoBlock>
              <DemoBlock title="Group 分组">
                <div className="space-y-3">
                  <Group>
                    <Button variant="outline">复制</Button>
                    <Button variant="outline">剪切</Button>
                    <Button variant="outline">粘贴</Button>
                  </Group>
                  <Group>
                    <GroupText>
                      <GlobeIcon className="size-4" aria-hidden="true" />
                      https://
                    </GroupText>
                    <GroupSeparator />
                    <Input unstyled placeholder="example.com" className="h-9 px-3" />
                  </Group>
                </div>
              </DemoBlock>
              <DemoBlock title="Toolbar 工具栏">
                <Toolbar>
                  <ToolbarGroup>
                    <ToolbarButton render={<Button variant="ghost" size="icon-sm"><BoldIcon className="size-4" aria-hidden="true" /></Button>} />
                    <ToolbarButton render={<Button variant="ghost" size="icon-sm"><ItalicIcon className="size-4" aria-hidden="true" /></Button>} />
                    <ToolbarButton render={<Button variant="ghost" size="icon-sm"><UnderlineIcon className="size-4" aria-hidden="true" /></Button>} />
                  </ToolbarGroup>
                  <ToolbarSeparator />
                  <ToolbarGroup>
                    <ToolbarButton render={<Button variant="ghost" size="icon-sm"><LinkIcon className="size-4" aria-hidden="true" /></Button>} />
                    <ToolbarButton render={<Button variant="ghost" size="icon-sm"><ImagePlusIcon className="size-4" aria-hidden="true" /></Button>} />
                  </ToolbarGroup>
                </Toolbar>
              </DemoBlock>
            </div>
          </section>

          <Separator />

          <section>
            <SectionTitle zh="展示组件" en="Display" description="头像、日历、表格、切换按钮" />
            <div className="space-y-6">
              <DemoBlock title="Avatar 头像">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-10">
                    <AvatarFallback>CD</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-12">
                    <AvatarFallback>EF</AvatarFallback>
                  </Avatar>
                </div>
              </DemoBlock>
              <DemoBlock title="Calendar 日历">
                <Calendar mode="single" />
              </DemoBlock>
              <DemoBlock title="Table 表格">
                <Table>
                  <TableCaption>用户列表</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>姓名</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>角色</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">张三</TableCell>
                      <TableCell>zhang@example.com</TableCell>
                      <TableCell><Badge variant="secondary">管理员</Badge></TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="icon-sm"><EditIcon className="size-4" aria-hidden="true" /></Button></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">李四</TableCell>
                      <TableCell>li@example.com</TableCell>
                      <TableCell><Badge variant="outline">编辑</Badge></TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="icon-sm"><EditIcon className="size-4" aria-hidden="true" /></Button></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">王五</TableCell>
                      <TableCell>wang@example.com</TableCell>
                      <TableCell><Badge variant="outline">查看者</Badge></TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="icon-sm"><EditIcon className="size-4" aria-hidden="true" /></Button></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </DemoBlock>
              <DemoBlock title="Table 表格 — 卡片变体">
                <Table variant="card">
                  <TableHeader>
                    <TableRow>
                      <TableHead>项目</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>优先级</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">设计系统</TableCell>
                      <TableCell><Badge variant="success">进行中</Badge></TableCell>
                      <TableCell><Badge variant="warning">高</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">API 文档</TableCell>
                      <TableCell><Badge variant="info">待审核</Badge></TableCell>
                      <TableCell><Badge variant="outline">中</Badge></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </DemoBlock>
              <DemoBlock title="Toggle 切换按钮">
                <div className="flex flex-wrap items-center gap-3">
                  <Toggle aria-label="粗体">
                    <BoldIcon className="size-4" aria-hidden="true" />
                  </Toggle>
                  <Toggle variant="outline" aria-label="斜体">
                    <ItalicIcon className="size-4" aria-hidden="true" />
                  </Toggle>
                  <Toggle size="sm" aria-label="收藏">
                    <StarIcon className="size-4" aria-hidden="true" />
                  </Toggle>
                  <Toggle size="lg" aria-label="通知">
                    <BellIcon className="size-4" aria-hidden="true" />
                  </Toggle>
                </div>
              </DemoBlock>
            </div>
          </section>
        </main>
      </div>
    </ToastProvider>
  )
}
