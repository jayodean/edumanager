import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function UserCard({ user, index }) {
  const getRoleColor = (role) => {
    return role === 'admin' ? 'bg-amber-100 text-amber-800 border-amber-200' :
           role === 'teacher' ? 'bg-blue-100 text-blue-800 border-blue-200' :
           'bg-green-100 text-green-800 border-green-200';
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group bg-white/95 backdrop-blur-sm border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1">
        <div className="p-6">
          <div className="flex items-start gap-4">
            {user.profile_image_url ? (
              <img
                src={user.profile_image_url}
                alt={user.full_name}
                className="w-16 h-16 rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {getInitials(user.full_name)}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-lg truncate">{user.full_name}</h3>
                <Badge className={getRoleColor(user.role)}>
                  {user.role}
                </Badge>
              </div>
              
              <div className="mt-3 space-y-2">
                {user.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}
                
                {user.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
                
                {user.address && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{user.address}</span>
                  </div>
                )}
                
                {user.subject && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>{user.subject}</span>
                    {user.grade_level && <span className="text-slate-400">• {user.grade_level}</span>}
                  </div>
                )}
                
                {user.date_of_birth && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{format(new Date(user.date_of_birth), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
              
              {user.bio && (
                <p className="mt-3 text-sm text-slate-600 line-clamp-2">{user.bio}</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}