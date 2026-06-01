import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from "recharts";

const demandData = [
  { name: 'Python', demand: 95 },
  { name: 'React', demand: 85 },
  { name: 'AWS', demand: 80 },
  { name: 'SQL', demand: 75 },
  { name: 'Docker', demand: 70 },
  { name: 'TypeScript', demand: 65 },
];

const trendData = [
  { month: 'Jan', Python: 80, React: 70, AI: 40 },
  { month: 'Feb', Python: 82, React: 72, AI: 55 },
  { month: 'Mar', Python: 85, React: 75, AI: 75 },
  { month: 'Apr', Python: 88, React: 74, AI: 95 },
];

export function Insights() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-12 text-center max-w-3xl">
          <h1 className="text-4xl font-heading font-semibold mb-4">Job Market Intelligence 2026</h1>
          <p className="text-lg text-text-secondary">Explore real-time in-demand skills and hiring trends based on analysis of 10,000+ job postings.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 bg-card p-4 rounded-xl border border-border">
          <select className="h-10 rounded-lg border border-input bg-background px-3 text-sm flex-1 min-w-[200px]">
            <option>All Industries</option>
            <option>Technology</option>
            <option>Finance</option>
          </select>
          <select className="h-10 rounded-lg border border-input bg-background px-3 text-sm flex-1 min-w-[200px]">
            <option>Global</option>
            <option>North America</option>
            <option>Europe</option>
          </select>
          <Button>Apply Filters</Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="text-sm font-medium text-text-secondary mb-1">Total Jobs Analyzed</div>
            <div className="text-2xl font-mono font-semibold">12,450</div>
          </Card>
          <Card className="p-5">
            <div className="text-sm font-medium text-text-secondary mb-1">Most In-Demand</div>
            <div className="text-2xl font-semibold text-primary">Python</div>
          </Card>
          <Card className="p-5">
            <div className="text-sm font-medium text-text-secondary mb-1">Avg Tech Salary</div>
            <div className="text-2xl font-mono font-semibold">$135k</div>
          </Card>
          <Card className="p-5">
            <div className="text-sm font-medium text-text-secondary mb-1">Top Industry</div>
            <div className="text-2xl font-semibold">FinTech</div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-heading font-semibold mb-6">Top In-Demand Skills</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'var(--color-surface-fill)' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="demand" fill="var(--color-secondary)" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-heading font-semibold mb-6">Skill Demand Trends</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} dy={10} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                  <Line type="monotone" dataKey="Python" stroke="var(--color-secondary)" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="React" stroke="var(--color-text-secondary)" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="AI" stroke="var(--color-primary)" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
