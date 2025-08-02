import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 group">
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
              <p className="text-3xl font-bold text-slate-900">{value}</p>
            </div>
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${gradient} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}