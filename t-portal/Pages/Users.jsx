import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import UserFilters from "../components/users/UserFilters";
import UserCard from "../components/users/UserCard";
import InviteUserDialog from "../components/users/InviteUserDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const [allUsers, me] = await Promise.all([
        User.list('-created_date'),
        User.me().catch(() => null)
      ]);
      setUsers(allUsers);
      setCurrentUser(me);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInviteSent = () => {
    // Optionally refresh users list or show a success message
    loadUsers();
  };

  if (!currentUser && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-slate-200/50 p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Access Required</h1>
            <p className="text-slate-600 mb-8">Please sign in to view the user directory</p>
            <button
              onClick={() => User.login()}
              className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg"
            >
              Sign In with Google
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">User Directory</h1>
              <p className="text-slate-600 text-lg">
                Manage all teachers and students • {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <Button
              onClick={() => setShowInviteDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg"
              size="lg"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          </div>
        </motion.div>

        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white/95 rounded-2xl p-6 border border-slate-200/60">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-16 h-16 rounded-2xl" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredUsers.length > 0 ? (
              <motion.div
                key="users-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredUsers.map((user, index) => (
                  <UserCard key={user.id} user={user} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl text-slate-400">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No users found</h3>
                <p className="text-slate-600 mb-6">
                  {searchTerm || roleFilter !== "all" 
                    ? "Try adjusting your search or filter criteria"
                    : "No users have been added to the system yet"
                  }
                </p>
                {(!searchTerm && roleFilter === "all") && (
                  <Button
                    onClick={() => setShowInviteDialog(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Your First User
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <InviteUserDialog
          isOpen={showInviteDialog}
          onClose={() => setShowInviteDialog(false)}
          onInviteSent={handleInviteSent}
        />
      </div>
    </div>
  );
}