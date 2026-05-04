import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardPlaceholderPageProps = {
  title: string;
  description: string;
};

export function DashboardPlaceholderPage({ title, description }: DashboardPlaceholderPageProps) {
  return (
    <Card className="rounded-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
