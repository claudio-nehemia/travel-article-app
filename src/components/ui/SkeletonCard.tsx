import React from "react";
import { Card } from "./Card";

export const SkeletonCard: React.FC = () => (
  <Card className="animate-pulse p-6">
    <div className="mb-4 h-48 rounded-2xl bg-slate-200/70" />
    <div className="mb-2 h-6 rounded bg-slate-200/80" />
    <div className="h-4 w-3/4 rounded bg-slate-200/60" />
  </Card>
);
