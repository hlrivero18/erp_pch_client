import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Plus, 
  Search, 
  AlertTriangle 
} from "lucide-react";

import UserList from "../components/users/UserList";
import UserForm from "../components/users/UserForm";
import InviteUserDialog from "../components/users/InviteUserDialog";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  useEffect(() => {
    //loadUsers();
        setLoading(false)

  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      await User.me(); // Auth check
      const usersData = await User.list();
      setUsers(usersData);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("No se pudieron cargar los usuarios.");
    }
    setLoading(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormSubmit = async (userData) => {
    try {
      await User.update(editingUser.id, userData);
      setShowForm(false);
      setEditingUser(null);
      await loadUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Error al actualizar el usuario.");
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <LoadingSpinner message="Cargando usuarios..." />;
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="max-w-md mx-auto mt-20">
          <Card className="text-center">
            <CardContent className="p-8">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Error</h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button onClick={loadUsers} className="bg-blue-600 hover:bg-blue-700">Reintentar</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestión de Usuarios</h1>
            <p className="text-slate-600 mt-1">Administre los usuarios y sus permisos en el sistema.</p>
          </div>
          <Button onClick={() => setShowInviteDialog(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Invitar Usuario
          </Button>
        </div>

        {/* Search and List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Listado de Usuarios
              </CardTitle>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar por nombre, email o área..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <UserList users={filteredUsers} onEdit={handleEdit} />
          </CardContent>
        </Card>

        {/* Edit Form Modal */}
        {showForm && editingUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              <UserForm
                user={editingUser}
                onSubmit={handleFormSubmit}
                onCancel={() => { setShowForm(false); setEditingUser(null); }}
              />
            </div>
          </div>
        )}

        {/* Invite Dialog */}
        {showInviteDialog && (
          <InviteUserDialog onOpenChange={setShowInviteDialog} />
        )}
      </div>
    </div>
  );
}