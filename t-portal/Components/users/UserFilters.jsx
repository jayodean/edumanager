import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export default function UserFilters({ searchTerm, setSearchTerm, roleFilter, setRoleFilter }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/90 backdrop-blur-sm border-slate-200/60 focus:border-slate-400 transition-colors"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-500" />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40 bg-white/90 backdrop-blur-sm border-slate-200/60">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}