"use client"

import { useState } from "react"
import { Users, Video, TrendingUp, Clock, Activity, BarChart3, DollarSign, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from "../components/stat-card"

interface TopClass {
  id: string
  title: string
  slug: string
  instructor: { name: string } | null
  views: number
  completions: number
}

interface MetricsData {
  totalUsers: number
  totalClasses: number
  totalPrograms: number
  totalInstructors: number
  completedClasses: number
  totalWatchTime: number
  avgWatchTime: number
  activeUsers7d: number
  topClasses: TopClass[]
}

interface MetricsClientProps {
  metrics: MetricsData
}

export function MetricsClient({ metrics }: MetricsClientProps) {
  const [period, setPeriod] = useState("7d")

  // Simulated KPIs (would come from real data in production)
  const kpis = {
    mrr: 4500,
    ltv: 180,
    churnRate: 2.3,
    conversionRate: 8.5,
    contentRetention: 72,
    stickiness: 45,
    revenueAtRisk: 350,
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-medium">Métricas</h1>
          <p className="text-muted-foreground mt-1">Analítica y KPIs de la plataforma</p>
        </div>
      </div>

      <Tabs value={period} onValueChange={setPeriod} className="mb-8">
        <TabsList>
          <TabsTrigger value="7d">7 días</TabsTrigger>
          <TabsTrigger value="30d">30 días</TabsTrigger>
          <TabsTrigger value="90d">90 días</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="mt-6">
          {/* Platform Stats */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Resumen de plataforma</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Usuarios totales" value={metrics.totalUsers} icon={<Users className="w-5 h-5" />} />
              <StatCard
                label="Usuarios activos"
                value={metrics.activeUsers7d}
                icon={<Activity className="w-5 h-5" />}
                change={`${period}`}
              />
              <StatCard
                label="Clases completadas"
                value={metrics.completedClasses}
                icon={<TrendingUp className="w-5 h-5" />}
              />
              <StatCard
                label="Tiempo promedio"
                value={`${metrics.avgWatchTime} min`}
                icon={<Clock className="w-5 h-5" />}
              />
            </div>
          </div>

          {/* Business KPIs */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">KPIs de negocio</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                </div>
                <p className="text-3xl font-medium">${kpis.mrr.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">MRR (Monthly Recurring)</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-medium">${kpis.ltv}</p>
                <p className="text-sm text-muted-foreground mt-1">LTV (Lifetime Value)</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">-0.5%</span>
                </div>
                <p className="text-3xl font-medium">{kpis.churnRate}%</p>
                <p className="text-sm text-muted-foreground mt-1">Churn Rate</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-medium">{kpis.conversionRate}%</p>
                <p className="text-sm text-muted-foreground mt-1">Conversión Trial → Pago</p>
              </div>
            </div>
          </div>

          {/* Engagement KPIs */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Engagement</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Video className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Retención de contenido</span>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-medium">{kpis.contentRetention}%</p>
                  <p className="text-sm text-muted-foreground mb-1">promedio visto</p>
                </div>
                <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${kpis.contentRetention}%` }} />
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Stickiness</span>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-medium">{kpis.stickiness}%</p>
                  <p className="text-sm text-muted-foreground mb-1">usuarios 2-3x/sem</p>
                </div>
                <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${kpis.stickiness}%` }} />
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium">Ingresos en riesgo</span>
                </div>
                <p className="text-3xl font-medium text-amber-600">${kpis.revenueAtRisk}</p>
                <p className="text-sm text-muted-foreground mt-1">pagos fallidos pendientes</p>
              </div>
            </div>
          </div>

          {/* Top Classes */}
          <div>
            <h2 className="text-lg font-medium mb-4">Top clases completadas</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium">#</th>
                    <th className="text-left px-6 py-4 text-sm font-medium">Clase</th>
                    <th className="text-left px-6 py-4 text-sm font-medium">Instructor</th>
                    <th className="text-right px-6 py-4 text-sm font-medium">Vistas</th>
                    <th className="text-right px-6 py-4 text-sm font-medium">Completadas</th>
                    <th className="text-right px-6 py-4 text-sm font-medium">Tasa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {metrics.topClasses.map((c, index) => (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{index + 1}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{c.title}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{c.instructor?.name || "-"}</td>
                      <td className="px-6 py-4 text-sm text-right">{c.views}</td>
                      <td className="px-6 py-4 text-sm text-right">{c.completions}</td>
                      <td className="px-6 py-4 text-sm text-right">
                        {c.views > 0 ? `${Math.round((c.completions / c.views) * 100)}%` : "0%"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
