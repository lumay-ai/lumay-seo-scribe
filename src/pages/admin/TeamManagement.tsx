import { useState } from "react";
import { useUserRoles, useAssignRole, useRemoveRole, useProfiles, AppRole } from "@/hooks/useRoles";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Trash2, UserPlus, Shield, Loader2 } from "lucide-react";

const TeamManagement = () => {
  const { isAdmin } = useAuth();
  const { data: roles, isLoading } = useUserRoles();
  const { data: profiles } = useProfiles();
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("author");

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="font-heading text-xl font-semibold">Admin Access Required</h2>
        <p className="text-muted-foreground mt-2">Only admins can manage team roles.</p>
      </div>
    );
  }

  const handleAssignRole = async () => {
    if (!selectedUserId) return;
    try {
      await assignRole.mutateAsync({ userId: selectedUserId, role: selectedRole });
      toast({ title: "Role assigned", description: `User has been assigned the ${selectedRole} role.` });
      setSelectedUserId("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      await removeRole.mutateAsync(roleId);
      toast({ title: "Role removed" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-heading">Team Management</h1>
        <p className="text-muted-foreground mt-1">Assign roles to team members</p>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>Add Team Member</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-64"><SelectValue placeholder="Select user" /></SelectTrigger>
              <SelectContent>
                {profiles?.map((p) => (
                  <SelectItem key={p.user_id} value={p.user_id}>{p.display_name || "User"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRole} onValueChange={(v: AppRole) => setSelectedRole(v)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="author">Author</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAssignRole} disabled={!selectedUserId || assignRole.isPending}>
              <UserPlus className="h-4 w-4 mr-2" /> Assign Role
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Current Team</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : roles?.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No team members yet.</p>
          ) : (
            <div className="space-y-3">
              {roles?.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{r.profile?.display_name || "User"}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${r.role === 'admin' ? 'bg-red-100 text-red-700' : r.role === 'editor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {r.role}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveRole(r.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
