import React from "react";
import { Card } from "./Card";

export const SkeletonCard: React.FC = () => (
  <Card className="p-6 animate-pulse">
    <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
    <div className="bg-gray-200 h-6 rounded mb-2"></div>
    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
  </Card>
);
