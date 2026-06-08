import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, Grid, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { name: "Total Articles", value: "2,543", icon: FileText, change: "+12%" },
    { name: "Total Views", value: "1.2M", icon: Eye, change: "+18%" },
    { name: "Categories", value: "15", icon: Grid, change: "0%" },
    { name: "Avg Engagement", value: "4m 12s", icon: TrendingUp, change: "+5%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={stat.change.startsWith("+") ? "text-emerald-500 font-medium" : ""}>
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity placeholder */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-muted"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Draft Article {i}</p>
                    <p className="text-xs text-muted-foreground">Edited 2 hours ago</p>
                  </div>
                  <div className="font-medium text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                    Draft
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Analytics Traffic</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64 border-dashed border-2 rounded-md m-2">
            <p className="text-muted-foreground">Chart Placeholder</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
