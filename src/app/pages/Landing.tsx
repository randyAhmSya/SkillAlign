import { Button } from "../components/ui/button";
import { Link } from "react-router";
import { ArrowRight, Upload, Sparkles, Map, Target, TrendingUp, Briefcase } from "lucide-react";
import { Card } from "../components/ui/card";

export function Landing() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            <Sparkles size={16} />
            AI-Powered Career Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight text-foreground leading-[1.1]">
            Navigate Your Career with <span className="text-primary">AI Precision</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Upload your CV. See your skill gaps. Get your personalized learning path to land the job you want.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/upload">
              <Button size="lg" className="w-full sm:w-auto group cursor-pointer">
                Try Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/insights">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto cursor-pointer">
                See Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-surface-fill px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-semibold mb-4">How It Works</h2>
            <p className="text-text-secondary max-w-xl mx-auto">Three simple steps to bridge the gap between where you are and where you want to be.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-border z-0" />
            
            {[
              { num: "1", title: "Upload CV", desc: "Drag & drop your resume. We extract your current skills.", icon: <Upload className="w-6 h-6 text-secondary" /> },
              { num: "2", title: "AI Matches Jobs", desc: "Our engine analyzes industry demand and finds your fit.", icon: <Target className="w-6 h-6 text-secondary" /> },
              { num: "3", title: "Get Learning Path", desc: "Receive a tailored curriculum to close your skill gaps.", icon: <Map className="w-6 h-6 text-secondary" /> }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-card shadow-sm border border-border flex flex-col items-center justify-center mb-6 relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                    {step.num}
                  </div>
                  {step.icon}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">{step.title}</h3>
                <p className="text-text-secondary">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-l-[3px] border-l-secondary relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <Briefcase className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-2xl font-heading font-semibold mb-3">CV Matching</h3>
              <p className="text-text-secondary">Instantly compare your resume against thousands of active job listings to find your highest probability matches.</p>
            </Card>
            <Card className="border-l-[3px] border-l-primary relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <Target className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-2xl font-heading font-semibold mb-3">Skill Gap Radar</h3>
              <p className="text-text-secondary">Visualize exactly where you stand compared to industry expectations with our interactive radar charts.</p>
            </Card>
            <Card className="border-l-[3px] border-l-primary relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <Map className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-2xl font-heading font-semibold mb-3">Learning Path</h3>
              <p className="text-text-secondary">Stop guessing what to learn next. Get a prioritized roadmap of courses and projects to close your gaps.</p>
            </Card>
            <Card className="border-l-[3px] border-l-secondary relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <TrendingUp className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-2xl font-heading font-semibold mb-3">Career Dashboard</h3>
              <p className="text-text-secondary">Track your progress over time as you acquire new skills and increase your match rates across the board.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 border-t border-border bg-card text-center">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-lg font-medium text-text-secondary">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-heading text-foreground font-semibold">10,000+</span>
              <span>CVs analyzed</span>
            </div>
            <div className="hidden md:block w-px h-12 bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-heading text-foreground font-semibold">150k+</span>
              <span>Skills mapped</span>
            </div>
            <div className="hidden md:block w-px h-12 bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-heading text-foreground font-semibold">5,000+</span>
              <span>Careers accelerated</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
