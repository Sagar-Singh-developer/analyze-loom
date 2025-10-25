import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useToast } from '@/hooks/use-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

interface ChartVisualizerProps {
  columns: string[];
  data: any[];
}

export const ChartVisualizer = ({ columns, data }: ChartVisualizerProps) => {
  const [xAxis, setXAxis] = useState(columns[0]);
  const [yAxis, setYAxis] = useState(columns[1] || columns[0]);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const chartRef = useRef<any>(null);
  const { toast } = useToast();

  const chartData = {
    labels: data.slice(0, 20).map(row => String(row[xAxis] || 'N/A')),
    datasets: [
      {
        label: yAxis,
        data: data.slice(0, 20).map(row => {
          const value = row[yAxis];
          return typeof value === 'number' ? value : parseFloat(value) || 0;
        }),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#f1f5f9',
        },
      },
      title: {
        display: true,
        text: `${yAxis} by ${xAxis}`,
        color: '#f1f5f9',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: chartType !== 'pie' ? {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
      },
    } : undefined,
  };

  const downloadChart = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.download = `chart-${Date.now()}.png`;
      link.href = url;
      link.click();
      toast({
        title: 'Success',
        description: 'Chart downloaded as PNG',
      });
    }
  };

  const renderChart = () => {
    const commonProps = { ref: chartRef, data: chartData, options };
    
    switch (chartType) {
      case 'bar':
        return <Bar {...commonProps} />;
      case 'line':
        return <Line {...commonProps} />;
      case 'pie':
        return <Pie {...commonProps} />;
      default:
        return <Bar {...commonProps} />;
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Data Visualization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">X-Axis</label>
            <Select value={xAxis} onValueChange={setXAxis}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {columns.map(col => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Y-Axis</label>
            <Select value={yAxis} onValueChange={setYAxis}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {columns.map(col => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Chart Type</label>
            <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="h-[400px] w-full">
          {renderChart()}
        </div>

        <Button onClick={downloadChart} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download as PNG
        </Button>
      </CardContent>
    </Card>
  );
};
