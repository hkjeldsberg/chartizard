import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_CHARTS, getChartById } from "@/content/charts";
import { ChartFrame } from "@/components/chart/ChartFrame";
import { LiveChartView } from "@/components/chart/LiveChartView";
import { isLiveChart } from "@/content/chart-schema";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return ALL_CHARTS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const chart = getChartById(id);
  if (!chart) {
    return { title: "Chart not found — Chartizard" };
  }
  const desc =
    chart.synopsis ??
    `${chart.name} — a ${chart.family.replace(/-/g, " ")} chart catalogued in Chartizard.`;
  return {
    title: `${chart.name} — Chartizard`,
    description: desc,
  };
}

export default async function ChartPage({ params }: PageProps) {
  const { id } = await params;
  const chart = getChartById(id);
  if (!chart) notFound();

  const chartView = isLiveChart(chart) ? <LiveChartView id={chart.id} /> : undefined;

  return <ChartFrame chart={chart} chartView={chartView} />;
}
