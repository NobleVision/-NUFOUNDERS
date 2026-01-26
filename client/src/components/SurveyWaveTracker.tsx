import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Play,
  Pause,
  BarChart3,
  Filter,
  Mail,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SurveyWave {
  id: number;
  waveName: string;
  waveNumber: number;
  targetResponses: number;
  currentResponses: number;
  status: "planned" | "active" | "completed" | "paused";
  startDate?: string;
  endDate?: string;
  cohortFilters?: {
    ageRange?: { min?: number; max?: number };
    states?: string[];
    displacementReasons?: string[];
    genderFocus?: string;
  };
  keyInsights?: string[];
}

interface SurveyWaveTrackerProps {
  waves?: SurveyWave[];
  totalTarget?: number;
  depositsCollected?: number;
  className?: string;
}

const defaultWaves: SurveyWave[] = [
  {
    id: 1,
    waveName: "Pilot Wave",
    waveNumber: 1,
    targetResponses: 10,
    currentResponses: 10,
    status: "completed",
    startDate: "2026-01-15",
    endDate: "2026-01-20",
    cohortFilters: { genderFocus: "Black Women", states: ["GA", "TX", "CA"] },
    keyInsights: ["85% interested in e-commerce", "60% have <$5K capital available"]
  },
  {
    id: 2,
    waveName: "Initial Validation",
    waveNumber: 2,
    targetResponses: 40,
    currentResponses: 28,
    status: "active",
    startDate: "2026-01-22",
    cohortFilters: { genderFocus: "Black Women", displacementReasons: ["layoff", "automation"] }
  },
  {
    id: 3,
    waveName: "Growth Wave",
    waveNumber: 3,
    targetResponses: 200,
    currentResponses: 0,
    status: "planned",
    cohortFilters: { genderFocus: "Black Women" }
  },
  {
    id: 4,
    waveName: "Scale Wave",
    waveNumber: 4,
    targetResponses: 2000,
    currentResponses: 0,
    status: "planned"
  }
];

const statusConfig = {
  planned: { color: "bg-muted text-muted-foreground", icon: Clock, label: "Planned" },
  active: { color: "bg-green-500/10 text-green-600 dark:text-green-400", icon: Play, label: "Active" },
  completed: { color: "bg-primary/10 text-primary", icon: CheckCircle2, label: "Completed" },
  paused: { color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", icon: Pause, label: "Paused" },
};

export function SurveyWaveTracker({ 
  waves = defaultWaves,
  totalTarget = 2000,
  depositsCollected = 12,
  className 
}: SurveyWaveTrackerProps) {
  const totalResponses = waves.reduce((sum, w) => sum + w.currentResponses, 0);
  const completedWaves = waves.filter(w => w.status === "completed").length;
  const activeWave = waves.find(w => w.status === "active");

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          icon={Users}
          label="Total Responses"
          value={totalResponses}
          subValue={`/ ${totalTarget} target`}
          progress={(totalResponses / totalTarget) * 100}
        />
        <StatsCard
          icon={Target}
          label="Waves Completed"
          value={completedWaves}
          subValue={`/ ${waves.length} total`}
          progress={(completedWaves / waves.length) * 100}
        />
        <StatsCard
          icon={TrendingUp}
          label="Deposits Collected"
          value={`$${depositsCollected * 49}`}
          subValue={`${depositsCollected} members`}
          highlight
        />
        <StatsCard
          icon={BarChart3}
          label="Response Rate"
          value="34%"
          subValue="Industry avg: 12%"
        />
      </div>

      {/* Wave Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Survey Wave Progress
              </CardTitle>
              <CardDescription>
                Tracking market validation from pilot to 2,000 responses
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Campaign
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline connector */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            
            <div className="space-y-6">
              {waves.map((wave, idx) => {
                const config = statusConfig[wave.status];
                const StatusIcon = config.icon;
                const progress = (wave.currentResponses / wave.targetResponses) * 100;
                
                return (
                  <motion.div
                    key={wave.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative pl-16"
                  >
                    {/* Timeline node */}
                    <div className={cn(
                      "absolute left-4 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center",
                      wave.status === "active" ? "bg-green-500" : 
                      wave.status === "completed" ? "bg-primary" : "bg-muted"
                    )}>
                      {wave.status === "active" && (
                        <span className="absolute w-full h-full rounded-full bg-green-500 animate-ping opacity-50" />
                      )}
                    </div>

                    <Card className={cn(
                      "transition-all",
                      wave.status === "active" && "ring-2 ring-green-500/50"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold">{wave.waveName}</h4>
                              <Badge className={cn("text-xs", config.color)}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {config.label}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {wave.currentResponses} / {wave.targetResponses}
                              </span>
                              {wave.startDate && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {wave.startDate}
                                </span>
                              )}
                            </div>

                            <Progress value={progress} className="h-2" />

                            {wave.cohortFilters && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {wave.cohortFilters.genderFocus && (
                                  <Badge variant="secondary" className="text-xs">
                                    {wave.cohortFilters.genderFocus}
                                  </Badge>
                                )}
                                {wave.cohortFilters.states?.map(state => (
                                  <Badge key={state} variant="outline" className="text-xs">
                                    {state}
                                  </Badge>
                                ))}
                                {wave.cohortFilters.displacementReasons?.map(reason => (
                                  <Badge key={reason} variant="outline" className="text-xs capitalize">
                                    {reason.replace('_', ' ')}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {wave.keyInsights && wave.keyInsights.length > 0 && (
                              <div className="pt-2 border-t">
                                <p className="text-xs font-medium text-muted-foreground mb-1">Key Insights:</p>
                                <ul className="text-sm space-y-1">
                                  {wave.keyInsights.map((insight, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      {insight}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {Math.round(progress)}%
                            </div>
                            {wave.status === "active" && (
                              <Button size="sm" className="mt-2">
                                <Phone className="h-4 w-4 mr-1" />
                                Boost
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ 
  icon: Icon, 
  label, 
  value, 
  subValue, 
  progress,
  highlight 
}: { 
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue: string;
  progress?: number;
  highlight?: boolean;
}) {
  return (
    <Card className={cn(highlight && "border-primary/50 bg-primary/5")}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center",
            highlight ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            <p className="text-xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{subValue}</p>
          </div>
        </div>
        {progress !== undefined && (
          <Progress value={progress} className="h-1 mt-3" />
        )}
      </CardContent>
    </Card>
  );
}
