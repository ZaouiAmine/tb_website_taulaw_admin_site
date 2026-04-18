import { useTranslation } from "react-i18next";
import PageWrapper from "@/components/shared/PageWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import { Calendar, ChevronDown } from "lucide-react";
import useDashboardStatus, { useAllLawyers } from "@/queries/dashboardStatus";

export default function HomePage() {
  const { t } = useTranslation();
  const [selectedLawyer, setSelectedLawyer] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: requestsData } = useAllLawyers();
  const { data: dashboardStatus } = useDashboardStatus({
    dateFrom: startDate ? new Date(startDate).toISOString() : undefined,
    dateTo: endDate ? new Date(endDate).toISOString() : undefined,
    lawyerId: selectedLawyer === "all" ? undefined : selectedLawyer,
  });

  // API returns Nest pagination: { code, response: { data: [...], totalPages, ... } }
  const lawyersListRaw = requestsData?.response;
  const lawyersList = Array.isArray(lawyersListRaw)
    ? lawyersListRaw
    : lawyersListRaw?.data;
  const lawyerNames =
    (Array.isArray(lawyersList) ? lawyersList : []).map(
      (request: { name?: string }) => request.name
    ) || [];
  const uniqueLawyerNames = [...new Set(lawyerNames)].filter(
    Boolean
  ) as string[];

  return (
    <PageWrapper heading={t("home.title")} path={t("navigation.dashboard")}>
      {/* Filters */}
      <div className="bg-muted rounded-xl py-6 m-2 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6">
          <div className="space-y-2">
            <Label
              htmlFor="lawyerName"
              className="text-sm font-medium text-[#1f3247]"
            >
              {t("home.filters.lawyerName")}
            </Label>
            <Select value={selectedLawyer} onValueChange={setSelectedLawyer}>
              <SelectTrigger className="bg-white py-6 h-10 w-full text-muted-foreground">
                <SelectValue placeholder={t("home.filters.selectLawyer")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("home.filters.allLawyers")}
                </SelectItem>
                {uniqueLawyerNames.map((name: string) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="startDate"
              className="text-sm font-medium text-[#1f3247]"
            >
              {t("home.filters.startDate")}
            </Label>
            <div className="relative">
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white h-10 w-full text-muted-foreground pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                placeholder={t("home.filters.datePlaceholder")}
                onClick={() =>
                  (
                    document.getElementById("startDate") as HTMLInputElement
                  )?.showPicker()
                }
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="endDate"
              className="text-sm font-medium text-[#1f3247]"
            >
              {t("home.filters.endDate")}
            </Label>
            <div className="relative">
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white h-10 w-full text-muted-foreground pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                placeholder={t("home.filters.datePlaceholder")}
                onClick={() =>
                  (
                    document.getElementById("endDate") as HTMLInputElement
                  )?.showPicker()
                }
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <style>{`
        @keyframes bounce-arrow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(2px);
          }
        }
        
        @keyframes color-pulse {
          0%, 100% {
            color: #9c9ea2ff;
          }
          25% {
            color: #828185ff;
          }
          50% {
            color: #5e5c5dff;
          }
          75% {
            color: #141313ff;
          }
        }
        
        .animated-arrow {
          animation: bounce-arrow 2s ease-in-out infinite, color-pulse 4s linear infinite;
        }
      `}</style>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lawyer Charts - Left Side */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-[#1f3247]">
              {t("home.sections.lawyer")}
            </h2>
            <ChevronDown className="animated-arrow" size={32} strokeWidth={3} />
          </div>
          <MyChart
            title="home.charts.numberOfAiPetitions"
            value={dashboardStatus?.response?.aiPetitions ?? 0}
          />
          <MyChart
            title="home.charts.formRequestsLawyer"
            value={dashboardStatus?.response?.formRequestsCountForLawyer ?? 0}
          />
          <MyChart
            title="home.charts.numberOfPublishedCases"
            value={dashboardStatus?.response?.publishedCasesCount ?? 0}
          />
          <MyChart
            title="home.charts.numberOfPublishedConsultations"
            value={dashboardStatus?.response?.publishedConsultationsCount ?? 0}
          />
          <MyChart
            title="home.charts.numberOfConsultingTransactions"
            value={dashboardStatus?.response?.consultingTransactionsCount ?? 0}
          />
        </div>

        {/* Judge Employee Charts - Right Side */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-[#1f3247]">
              {t("home.sections.judgeEmployee")}
            </h2>
            <ChevronDown className="animated-arrow" size={32} strokeWidth={3} />
          </div>
          <MyChart
            title="home.charts.numberOfCases"
            value={dashboardStatus?.response?.casesCount ?? 0}
          />
          <MyChart
            title="home.charts.numberOfPublishedCases"
            value={dashboardStatus?.response?.publishedCasesCount ?? 0}
          />
          <MyChart
            title="home.charts.formRequestsOfficer"
            value={dashboardStatus?.response?.formRequestsCountForOfficer ?? 0}
          />
        </div>
      </div>

      {/* Shared Chart - Centered */}
      {/* <div className="mt-6 max-w-2xl mx-auto">
        <MyChart
          title="home.charts.numberOfpublicationsLawyerAndJudgeEmployee"
          value={dashboardStatus?.response?.publicationsCount ?? 0}
        />
      </div> */}
    </PageWrapper>
  );
}

function MyChart({ title, value }: { title: string; value: number }) {
  const { t } = useTranslation();

  // Single-value dataset for Recharts
  const data = [{ name: t(title), value }];

  return (
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 group">
      {/* Subtle hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="bg-slate-100 border-b border-slate-200 p-5">
          <h3 className="text-center text-lg font-bold text-slate-800 tracking-wide">
            {t(title)}
          </h3>
        </div>

        <div className="w-full h-64 text-sm p-6 bg-white">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9}/>
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                stroke="#e2e8f0" 
                strokeWidth={1} 
                vertical={false} 
                strokeDasharray="5 5" 
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(139, 92, 246, 0.5)',
                  borderRadius: '16px',
                  color: '#fff',
                  padding: '16px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(10px)'
                }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 'bold', marginBottom: '8px' }}
                formatter={(value: any) => [value, t('home.charts.value')]} 
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#a855f7"
                strokeWidth={3}
                fill="url(#colorValue)"
                dot={{ 
                  fill: "#8b5cf6", 
                  stroke: "#fff", 
                  strokeWidth: 2, 
                  r: 6
                }}
                activeDot={{ 
                  r: 8, 
                  fill: "#ec4899", 
                  stroke: "#fff", 
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-slate-50 px-6 py-5 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{t('home.charts.totalCount')}</span>
            <span className="text-3xl font-black text-slate-800">
              {value.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
