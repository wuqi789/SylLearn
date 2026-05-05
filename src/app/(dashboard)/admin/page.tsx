"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MessageSquare,
  BookOpen,
  Activity,
  Server,
  Database,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MoreHorizontal,
  Search,
  Loader2,
  TrendingUp,
  Cpu,
  HardDrive,
  Wifi,
  Settings,
  Key,
  Globe,
  Save,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  Zap,
  CheckCircle,
  RefreshCw,
  GraduationCap,
  Swords,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  sessions: number;
  lastActive: string;
  status: "active" | "inactive" | "suspended";
}

const systemStats = [
  { label: "总用户数", value: "1,247", change: "+38 本周", icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { label: "总会话数", value: "8,542", change: "+412 本周", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/30" },
  { label: "知识点总数", value: "3,891", change: "+156 本周", icon: BookOpen, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
  { label: "活跃用户", value: "342", change: "今日", icon: Activity, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
];

const mockUsers: AdminUser[] = [
  { id: "u1", name: "张三", email: "zhangsan@example.com", role: "admin", sessions: 156, lastActive: "2026-05-05T09:15:00Z", status: "active" },
  { id: "u2", name: "李四", email: "lisi@example.com", role: "user", sessions: 89, lastActive: "2026-05-05T08:30:00Z", status: "active" },
  { id: "u3", name: "王五", email: "wangwu@example.com", role: "user", sessions: 234, lastActive: "2026-05-04T16:20:00Z", status: "active" },
  { id: "u4", name: "赵六", email: "zhaoliu@example.com", role: "user", sessions: 12, lastActive: "2026-04-28T10:00:00Z", status: "inactive" },
  { id: "u5", name: "孙七", email: "sunqi@example.com", role: "user", sessions: 67, lastActive: "2026-05-05T07:45:00Z", status: "active" },
  { id: "u6", name: "周八", email: "zhouba@example.com", role: "moderator", sessions: 301, lastActive: "2026-05-04T22:10:00Z", status: "active" },
  { id: "u7", name: "吴九", email: "wujiu@example.com", role: "user", sessions: 5, lastActive: "2026-05-01T14:00:00Z", status: "suspended" },
  { id: "u8", name: "郑十", email: "zhengshi@example.com", role: "user", sessions: 45, lastActive: "2026-05-05T06:20:00Z", status: "active" },
];

const healthIndicators = [
  { label: "API 响应时间", value: "45ms", status: "healthy" as const, icon: Wifi },
  { label: "数据库连接", value: "正常", status: "healthy" as const, icon: Database },
  { label: "CPU 使用率", value: "23%", status: "healthy" as const, icon: Cpu },
  { label: "内存使用率", value: "68%", status: "warning" as const, icon: HardDrive },
  { label: "磁盘空间", value: "42% 已用", status: "healthy" as const, icon: Server },
  { label: "Agent 服务", value: "运行中", status: "healthy" as const, icon: Shield },
];

const activityLog = [
  { time: "09:15", event: "用户 张三 登录系统", type: "info" as const },
  { time: "09:12", event: "新用户注册: huang@example.com", type: "success" as const },
  { time: "09:05", event: "Agent 服务重启完成", type: "success" as const },
  { time: "08:58", event: "内存使用率超过 65% 阈值", type: "warning" as const },
  { time: "08:45", event: "系统自动备份完成", type: "info" as const },
  { time: "08:30", event: "API 请求量达到 1000/min", type: "info" as const },
  { time: "08:22", event: "用户 吴九 账号被暂停", type: "warning" as const },
  { time: "08:10", event: "数据库索引优化完成", type: "success" as const },
  { time: "07:55", event: "SSL 证书将于 30 天后过期", type: "warning" as const },
  { time: "07:30", event: "定时任务: 清理过期会话", type: "info" as const },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "活跃", variant: "default" },
  inactive: { label: "不活跃", variant: "secondary" },
  suspended: { label: "已暂停", variant: "destructive" },
};

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  moderator: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  user: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
};

const roleLabels: Record<string, string> = {
  admin: "管理员",
  moderator: "版主",
  user: "用户",
};

const healthStatusConfig: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  healthy: { color: "text-green-600", icon: CheckCircle2 },
  warning: { color: "text-amber-600", icon: AlertTriangle },
  critical: { color: "text-red-600", icon: XCircle },
};

const eventTypeConfig: Record<string, { color: string }> = {
  info: { color: "bg-blue-500" },
  success: { color: "bg-green-500" },
  warning: { color: "bg-amber-500" },
  error: { color: "bg-red-500" },
};

interface ApiConfigItem {
  id: string;
  provider: string;
  apiKey: string;
  modelId: string;
  endpoint: string;
  maxTokens: number;
  temperature: number;
  extraParams: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PromptTemplateItem {
  id: string;
  action: string;
  scene: string;
  systemPrompt: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PresetModel {
  provider: string;
  name: string;
  description: string;
  defaultEndpoint: string;
  defaultModelId: string;
  icon: typeof Globe;
  color: string;
  bg: string;
}

const presetModels: PresetModel[] = [
  {
    provider: "openai",
    name: "OpenAI",
    description: "GPT-4o, GPT-4, GPT-3.5 系列模型",
    defaultEndpoint: "https://api.openai.com",
    defaultModelId: "gpt-4o",
    icon: Zap,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
  {
    provider: "deepseek",
    name: "DeepSeek",
    description: "DeepSeek-V3, DeepSeek-R1 系列模型",
    defaultEndpoint: "https://api.deepseek.com",
    defaultModelId: "deepseek-chat",
    icon: Globe,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    provider: "xiaomi-mimo",
    name: "Xiaomi mimo",
    description: "小米 MiMo 系列 AI 模型",
    defaultEndpoint: "https://api.mimo.xiaomi.com",
    defaultModelId: "mimo-7b",
    icon: Settings,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/30",
  },
];

const providerLabels: Record<string, string> = {
  openai: "OpenAI",
  deepseek: "DeepSeek",
  "xiaomi-mimo": "Xiaomi mimo",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function formatLastActive(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 60) return `${diffMinutes} 分钟前`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} 小时前`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} 天前`;
}

function ApiConfigForm({
  config,
  onSave,
  onCancel,
}: {
  config?: ApiConfigItem | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [provider, setProvider] = useState(config?.provider || "");
  const [apiKey, setApiKey] = useState(config?.apiKey || "");
  const [modelId, setModelId] = useState(config?.modelId || "");
  const [endpoint, setEndpoint] = useState(config?.endpoint || "");
  const [maxTokens, setMaxTokens] = useState(String(config?.maxTokens ?? 4096));
  const [temperature, setTemperature] = useState(String(config?.temperature ?? 0.7));
  const [isActive, setIsActive] = useState(config?.isActive ?? false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handlePresetSelect = (preset: PresetModel) => {
    setProvider(preset.provider);
    setEndpoint(preset.defaultEndpoint);
    setModelId(preset.defaultModelId);
  };

  const validate = (): string | null => {
    if (!apiKey.trim()) return "API 密钥不能为空";
    if (!endpoint.trim()) return "请求地址不能为空";
    try { new URL(endpoint); } catch { return "请求地址必须为合法 URL"; }
    const temp = Number(temperature);
    if (isNaN(temp) || temp < 0 || temp > 2) return "Temperature 必须在 0-2 范围内";
    const tokens = Number(maxTokens);
    if (isNaN(tokens) || tokens <= 0 || !Number.isInteger(tokens)) return "Max Tokens 必须为正整数";
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError("");
    setSaving(true);
    try {
      const body = {
        ...(config?.id && { id: config.id }),
        provider,
        apiKey,
        modelId,
        endpoint,
        maxTokens: Number(maxTokens),
        temperature: Number(temperature),
        isActive,
      };
      const method = config?.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/api-config", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "保存失败"); return; }
      onSave();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="size-4 text-primary" />
          {config ? "编辑配置" : "新增配置"}
        </CardTitle>
        <CardDescription>
          {config ? "修改 AI 模型服务配置" : "选择预设模型或手动配置 AI 服务"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!config && (
          <div className="space-y-3">
            <Label>选择预设模型</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {presetModels.map((preset) => {
                const isSelected = provider === preset.provider;
                const PresetIcon = preset.icon;
                return (
                  <button
                    key={preset.provider}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all hover:border-primary/50",
                      isSelected ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn("flex size-8 items-center justify-center rounded-lg", preset.bg)}>
                        <PresetIcon className={cn("size-4", preset.color)} />
                      </div>
                      <span className="font-medium">{preset.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{preset.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API 密钥</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-8"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showApiKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="modelId">模型 ID</Label>
            <Input
              id="modelId"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              placeholder="gpt-4o"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endpoint">请求地址</Label>
          <Input
            id="endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="https://api.openai.com"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maxTokens">Max Tokens</Label>
            <Input
              id="maxTokens"
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
              min={1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature: {temperature}</Label>
            <input
              id="temperature"
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 (精确)</span>
              <span>2 (随机)</span>
            </div>
          </div>
        </div>

        {config && (
          <div className="flex items-center gap-2">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="size-4 rounded border-input accent-primary"
            />
            <Label htmlFor="isActive" className="cursor-pointer">设为当前使用的配置</Label>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertTriangle className="size-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={saving} className="gap-1.5">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            保存配置
          </Button>
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ApiConfigList({
  configs,
  onEdit,
  onDelete,
  onTest,
  onRefresh,
}: {
  configs: ApiConfigItem[];
  onEdit: (config: ApiConfigItem) => void;
  onDelete: (id: string) => void;
  onTest: (id: string) => void;
  onRefresh: () => void;
}) {
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string; loading: boolean }>>({});

  const handleTest = async (id: string) => {
    setTestResults((prev) => ({ ...prev, [id]: { success: false, message: "", loading: true } }));
    try {
      const res = await fetch("/api/admin/api-config/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      setTestResults((prev) => ({ ...prev, [id]: { success: data.success, message: data.message, loading: false } }));
    } catch {
      setTestResults((prev) => ({ ...prev, [id]: { success: false, message: "请求失败", loading: false } }));
    }
  };

  if (configs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Settings className="size-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">暂无 API 配置</p>
          <p className="mt-1 text-xs text-muted-foreground">选择上方的预设模型开始配置</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>已保存的配置</Label>
        <Button variant="ghost" size="sm" onClick={onRefresh} className="gap-1.5">
          <RefreshCw className="size-3.5" />
          刷新
        </Button>
      </div>
      {configs.map((config) => {
        const preset = presetModels.find((p) => p.provider === config.provider);
        const PresetIcon = preset?.icon || Settings;
        const testResult = testResults[config.id];
        return (
          <Card key={config.id}>
            <CardContent className="flex items-center gap-4">
              <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", preset?.bg || "bg-muted")}>
                <PresetIcon className={cn("size-5", preset?.color || "text-muted-foreground")} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{providerLabels[config.provider] || config.provider}</span>
                  {config.isActive ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="size-3" />
                      启用中
                    </Badge>
                  ) : (
                    <Badge variant="secondary">未启用</Badge>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  模型: {config.modelId} · 端点: {config.endpoint}
                </p>
                {testResult && !testResult.loading && (
                  <p className={cn("mt-1 text-xs", testResult.success ? "text-green-600" : "text-destructive")}>
                    {testResult.success ? "✓ " : "✗ "}{testResult.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTest(config.id)}
                  disabled={testResult?.loading}
                  className="gap-1"
                >
                  {testResult?.loading ? <Loader2 className="size-3.5 animate-spin" /> : <Zap className="size-3.5" />}
                  测试
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => onEdit(config)}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="destructive" size="icon-sm" onClick={() => onDelete(config.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function AdminPage() {
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [configs, setConfigs] = useState<ApiConfigItem[]>([]);
  const [editingConfig, setEditingConfig] = useState<ApiConfigItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  const [prompts, setPrompts] = useState<PromptTemplateItem[]>([]);
  const [promptLoading, setPromptLoading] = useState(true);
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptTemplateItem | null>(null);
  const [promptForm, setPromptForm] = useState({ action: "", scene: "tutor", systemPrompt: "", description: "" });
  const [promptSaving, setPromptSaving] = useState(false);
  const [promptError, setPromptError] = useState("");

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.includes(searchQuery) ||
      u.email.includes(searchQuery) ||
      u.role.includes(searchQuery)
  );

  const fetchConfigs = useCallback(async () => {
    setConfigLoading(true);
    try {
      const res = await fetch("/api/admin/api-config");
      const data = await res.json();
      setConfigs(data.configs || []);
    } catch {
      console.error("Failed to fetch configs");
    } finally {
      setConfigLoading(false);
    }
  }, []);

  useEffect(() => { fetchConfigs(); }, [fetchConfigs]);

  const handleSave = () => {
    setShowForm(false);
    setEditingConfig(null);
    fetchConfigs();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingConfig(null);
  };

  const handleEdit = (config: ApiConfigItem) => {
    setEditingConfig(config);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/api-config?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchConfigs();
    } catch {
      console.error("Failed to delete config");
    }
  };

  const fetchPrompts = useCallback(async () => {
    setPromptLoading(true);
    try {
      const res = await fetch("/api/admin/prompts");
      const data = await res.json();
      setPrompts(data.templates || []);
    } catch {
      console.error("Failed to fetch prompts");
    } finally {
      setPromptLoading(false);
    }
  }, []);

  useEffect(() => { fetchPrompts(); }, [fetchPrompts]);

  const handleSavePrompt = async () => {
    if (!promptForm.action.trim()) { setPromptError("动作类型不能为空"); return; }
    if (!promptForm.systemPrompt.trim()) { setPromptError("系统提示词不能为空"); return; }
    setPromptError("");
    setPromptSaving(true);
    try {
      const method = editingPrompt ? "PUT" : "POST";
      const body = editingPrompt
        ? { id: editingPrompt.id, ...promptForm }
        : promptForm;
      const res = await fetch("/api/admin/prompts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setPromptError(data.error || "保存失败"); return; }
      setShowPromptForm(false);
      setEditingPrompt(null);
      fetchPrompts();
    } catch {
      setPromptError("网络错误，请重试");
    } finally {
      setPromptSaving(false);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/prompts?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchPrompts();
    } catch {
      console.error("Failed to delete prompt");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">管理后台</h1>
          <p className="mt-1 text-muted-foreground">系统管理和用户监控</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <div className="size-1.5 rounded-full bg-green-500" />
            系统正常运行
          </Badge>
          <Badge variant="secondary">v0.1.0</Badge>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">系统概览</TabsTrigger>
            <TabsTrigger value="api-config">API 配置</TabsTrigger>
            <TabsTrigger value="prompts">提示词管理</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-8">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {systemStats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="flex items-center gap-4">
                    <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", stat.bg)}>
                      <stat.icon className={cn("size-5", stat.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="mt-0.5 text-xs text-green-600">{stat.change}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="size-4 text-primary" />
                          用户管理
                        </CardTitle>
                        <CardDescription>共 {mockUsers.length} 个用户</CardDescription>
                      </div>
                      <div className="relative max-w-xs">
                        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="搜索用户..."
                          className="h-8 pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-xs text-muted-foreground">
                            <th className="pb-3 pr-4 font-medium">用户</th>
                            <th className="pb-3 pr-4 font-medium">角色</th>
                            <th className="pb-3 pr-4 font-medium">会话数</th>
                            <th className="pb-3 pr-4 font-medium">最后活跃</th>
                            <th className="pb-3 pr-4 font-medium">状态</th>
                            <th className="pb-3 font-medium"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b last:border-0 transition-colors hover:bg-muted/50">
                              <td className="py-3 pr-4">
                                <div className="flex items-center gap-3">
                                  <Avatar size="sm">
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 pr-4">
                                <Badge variant="outline" className={cn("text-xs", roleColors[user.role])}>
                                  {roleLabels[user.role]}
                                </Badge>
                              </td>
                              <td className="py-3 pr-4 tabular-nums">{user.sessions}</td>
                              <td className="py-3 pr-4 text-muted-foreground">
                                {formatLastActive(user.lastActive)}
                              </td>
                              <td className="py-3 pr-4">
                                <Badge variant={statusConfig[user.status].variant}>
                                  {statusConfig[user.status].label}
                                </Badge>
                              </td>
                              <td className="py-3">
                                <Button variant="ghost" size="icon-xs">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {filteredUsers.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Search className="size-8 text-muted-foreground/50" />
                          <p className="mt-2 text-sm text-muted-foreground">未找到匹配的用户</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="size-4 text-primary" />
                      系统健康
                    </CardTitle>
                    <CardDescription>各项系统指标状态</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {healthIndicators.map((indicator) => {
                        const config = healthStatusConfig[indicator.status];
                        const StatusIcon = config.icon;
                        return (
                          <div key={indicator.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <indicator.icon className="size-4 text-muted-foreground" />
                              <span className="text-sm">{indicator.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm tabular-nums text-muted-foreground">
                                {indicator.value}
                              </span>
                              <StatusIcon className={cn("size-4", config.color)} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>系统运行时间</span>
                        <span className="font-medium text-foreground">14 天 6 小时</span>
                      </div>
                      <div className="flex justify-between">
                        <span>最后部署</span>
                        <span className="font-medium text-foreground">2026-05-04 22:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>数据库大小</span>
                        <span className="font-medium text-foreground">2.4 GB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="size-4 text-primary" />
                      活动日志
                    </CardTitle>
                    <CardDescription>最近的系统活动记录</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <TrendingUp className="size-3.5" />
                    查看全部
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {activityLog.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 border-b py-3 last:border-0"
                    >
                      <div className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        eventTypeConfig[entry.type].color
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{entry.event}</p>
                      </div>
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                        {entry.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api-config" className="mt-6 space-y-6">
            {!showForm && (
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">AI 模型配置</h2>
                  <p className="text-sm text-muted-foreground">管理 AI 服务提供商的 API 配置，配置保存后立即生效</p>
                </div>
                <Button onClick={() => { setEditingConfig(null); setShowForm(true); }} className="gap-1.5">
                  <Key className="size-4" />
                  新增配置
                </Button>
              </div>
            )}

            {showForm && (
              <ApiConfigForm
                config={editingConfig}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )}

            {configLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ApiConfigList
                configs={configs}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTest={() => {}}
                onRefresh={fetchConfigs}
              />
            )}
          </TabsContent>

          <TabsContent value="prompts" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">提示词模板管理</h2>
                <p className="text-sm text-muted-foreground">管理导师教学和辩论学习场景的 AI 提示词，保存后立即生效</p>
              </div>
              <Button onClick={() => { setEditingPrompt(null); setShowPromptForm(true); }} className="gap-1.5">
                <BookOpen className="size-4" />
                新增模板
              </Button>
            </div>

            {showPromptForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="size-4 text-primary" />
                    {editingPrompt ? "编辑提示词模板" : "新增提示词模板"}
                  </CardTitle>
                  <CardDescription>
                    配置 AI 模型在不同教学场景下使用的系统提示词
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="promptAction">动作类型</Label>
                      <Input
                        id="promptAction"
                        value={promptForm.action}
                        onChange={(e) => setPromptForm({ ...promptForm, action: e.target.value })}
                        placeholder="teach, explain, quiz, debate..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="promptScene">场景</Label>
                      <select
                        id="promptScene"
                        value={promptForm.scene}
                        onChange={(e) => setPromptForm({ ...promptForm, scene: e.target.value })}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                      >
                        <option value="tutor">导师教学</option>
                        <option value="debate">辩论学习</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promptDesc">描述</Label>
                    <Input
                      id="promptDesc"
                      value={promptForm.description}
                      onChange={(e) => setPromptForm({ ...promptForm, description: e.target.value })}
                      placeholder="简要描述此提示词的用途"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promptContent">系统提示词</Label>
                    <textarea
                      id="promptContent"
                      value={promptForm.systemPrompt}
                      onChange={(e) => setPromptForm({ ...promptForm, systemPrompt: e.target.value })}
                      placeholder="输入 AI 模型的系统提示词..."
                      rows={8}
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-vertical"
                    />
                  </div>
                  {promptError && (
                    <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      <AlertTriangle className="size-4 shrink-0" />
                      {promptError}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Button onClick={handleSavePrompt} disabled={promptSaving} className="gap-1.5">
                      {promptSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                      保存，立即生效
                    </Button>
                    <Button variant="outline" onClick={() => { setShowPromptForm(false); setEditingPrompt(null); }}>
                      取消
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {promptLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-6">
                {["tutor", "debate"].map((scene) => {
                  const scenePrompts = prompts.filter((p) => p.scene === scene);
                  return (
                    <div key={scene} className="space-y-3">
                      <div className="flex items-center gap-2">
                        {scene === "tutor" ? (
                          <GraduationCap className="size-4 text-primary" />
                        ) : (
                          <Swords className="size-4 text-orange-500" />
                        )}
                        <h3 className="font-medium">{scene === "tutor" ? "导师教学" : "辩论学习"}</h3>
                        <Badge variant="secondary">{scenePrompts.length} 个模板</Badge>
                      </div>
                      {scenePrompts.length === 0 ? (
                        <p className="text-sm text-muted-foreground pl-6">暂无模板</p>
                      ) : (
                        scenePrompts.map((prompt) => (
                          <Card key={prompt.id}>
                            <CardContent className="flex items-start gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{prompt.action}</Badge>
                                  <span className="text-sm font-medium">{prompt.description || "未命名"}</span>
                                  {prompt.isActive ? (
                                    <Badge variant="default" className="text-xs">启用</Badge>
                                  ) : (
                                    <Badge variant="secondary" className="text-xs">禁用</Badge>
                                  )}
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground line-clamp-2 font-mono">
                                  {prompt.systemPrompt}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => {
                                    setEditingPrompt(prompt);
                                    setPromptForm({
                                      action: prompt.action,
                                      scene: prompt.scene,
                                      systemPrompt: prompt.systemPrompt,
                                      description: prompt.description,
                                    });
                                    setShowPromptForm(true);
                                  }}
                                >
                                  <Pencil className="size-3.5" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon-sm"
                                  onClick={() => handleDeletePrompt(prompt.id)}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
