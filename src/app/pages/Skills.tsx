import { Card } from "../components/ui/card";
import { RadarChart } from "../components/RadarChart";
import { SkillPill } from "../components/SkillPill";

const fullRadarData = [
  { subject: 'Frontend', user: 85, industry: 90 },
  { subject: 'Backend', user: 45, industry: 70 },
  { subject: 'DevOps', user: 30, industry: 60 },
  { subject: 'Design', user: 75, industry: 60 },
  { subject: 'Architecture', user: 50, industry: 75 },
  { subject: 'Testing', user: 60, industry: 80 },
  { subject: 'Security', user: 40, industry: 65 },
  { subject: 'Soft Skills', user: 90, industry: 85 },
];

const skillBreakdown = [
  { name: "React", category: "Technical", user: 85, req: 90, gap: -5 },
  { name: "Node.js", category: "Technical", user: 40, req: 70, gap: -30 },
  { name: "System Design", category: "Domain", user: 50, req: 80, gap: -30 },
  { name: "Communication", category: "Soft Skills", user: 95, req: 80, gap: 15 },
  { name: "TypeScript", category: "Technical", user: 70, req: 85, gap: -15 },
  { name: "AWS", category: "Domain", user: 20, req: 60, gap: -40 },
];

export function Skills() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold">Skill Gap Analysis</h2>
        <p className="text-text-secondary">Detailed breakdown of your competencies against market requirements.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="flex flex-col items-center justify-center p-8">
          <div className="h-[480px] w-full">
             <RadarChart data={fullRadarData} userKey="user" industryKey="industry" />
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-4 mb-6 border-b border-border pb-4">
            <button className="text-sm font-medium text-primary px-3 py-1 bg-primary/10 rounded-full">All Skills</button>
            <button className="text-sm font-medium text-text-secondary hover:text-foreground">Technical</button>
            <button className="text-sm font-medium text-text-secondary hover:text-foreground">Soft Skills</button>
          </div>

          <div className="flex-1 overflow-auto pr-2 space-y-6">
            {skillBreakdown.map((skill, i) => (
              <div key={i} className="grid grid-cols-[2fr_3fr] gap-4 items-center">
                <div>
                  <div className="font-medium text-sm">{skill.name}</div>
                  <div className="text-xs text-text-secondary">{skill.category}</div>
                </div>
                <div className="space-y-2 relative">
                  <div className="h-2 w-full bg-surface-fill rounded-full overflow-hidden relative">
                     {/* Required bar (background dotted) */}
                     <div className="absolute top-0 left-0 h-full border-b-2 border-dashed border-primary" style={{ width: `${skill.req}%` }} />
                     {/* User bar */}
                     <div className={`absolute top-0 left-0 h-full rounded-full ${skill.gap >= 0 ? "bg-secondary" : "bg-primary/60"}`} style={{ width: `${skill.user}%` }} />
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-text-secondary">You: {skill.user}%</span>
                    <span className={skill.gap >= 0 ? "text-secondary" : "text-primary"}>
                      Req: {skill.req}% {skill.gap < 0 && `(Gap: ${Math.abs(skill.gap)}%)`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
