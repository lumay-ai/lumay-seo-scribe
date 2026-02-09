import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Key, Plus, Pencil, Trash2, Eye, EyeOff, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { useApiKeys, AIProvider, PROVIDER_INFO, CreateApiKeyData } from '@/hooks/useApiKeys';

export default function ApiKeyManagement() {
  const { apiKeys, isLoading, createApiKey, updateApiKey, deleteApiKey } = useApiKeys();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  
  const [newKeyData, setNewKeyData] = useState<CreateApiKeyData>({
    provider: 'gemini',
    api_key: '',
    label: '',
  });
  const [editKeyValue, setEditKeyValue] = useState('');

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '••••••••';
    return key.slice(0, 4) + '••••••••' + key.slice(-4);
  };

  const handleAddKey = async () => {
    if (!newKeyData.api_key.trim()) return;
    
    await createApiKey.mutateAsync(newKeyData);
    setNewKeyData({ provider: 'gemini', api_key: '', label: '' });
    setIsAddDialogOpen(false);
  };

  const handleUpdateKey = async (id: string) => {
    if (!editKeyValue.trim()) return;
    
    await updateApiKey.mutateAsync({ id, api_key: editKeyValue });
    setEditingKey(null);
    setEditKeyValue('');
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    await updateApiKey.mutateAsync({ id, is_active: !currentState });
  };

  const providers = Object.entries(PROVIDER_INFO).filter(([key]) => key !== 'lovable') as [AIProvider, typeof PROVIDER_INFO['gemini']][];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Key Management</h1>
          <p className="text-muted-foreground">
            Manage your AI provider API keys for content generation
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New API Key</DialogTitle>
              <DialogDescription>
                Add an API key from your preferred AI provider
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select
                  value={newKeyData.provider}
                  onValueChange={(value: AIProvider) => 
                    setNewKeyData(prev => ({ ...prev, provider: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {PROVIDER_INFO[newKeyData.provider]?.description}
                </p>
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  placeholder="sk-... or AIza..."
                  value={newKeyData.api_key}
                  onChange={(e) => setNewKeyData(prev => ({ ...prev, api_key: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Label (optional)</Label>
                <Input
                  placeholder="e.g., Production, Testing"
                  value={newKeyData.label || ''}
                  onChange={(e) => setNewKeyData(prev => ({ ...prev, label: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddKey} 
                disabled={!newKeyData.api_key.trim() || createApiKey.isPending}
              >
                {createApiKey.isPending ? 'Adding...' : 'Add Key'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Built-in Lovable AI Card */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Lovable AI
                  <Badge variant="secondary">Built-in</Badge>
                </CardTitle>
                <CardDescription>
                  Pre-configured AI - no API key needed
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              Always Available
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Supported models:</p>
            <div className="flex flex-wrap gap-2">
              {PROVIDER_INFO.lovable.models.map(model => (
                <Badge key={model} variant="outline" className="font-mono text-xs">
                  {model}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Cards */}
      <div className="grid gap-4">
        {providers.map(([providerKey, info]) => {
          const providerKeys = apiKeys.filter(k => k.provider === providerKey);
          const hasActiveKey = providerKeys.some(k => k.is_active);

          return (
            <Card key={providerKey}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Key className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{info.name}</CardTitle>
                      <CardDescription>{info.description}</CardDescription>
                    </div>
                  </div>
                  {hasActiveKey ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Configured
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      <XCircle className="h-3 w-3 mr-1" />
                      Not Configured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {providerKeys.length > 0 ? (
                  <div className="space-y-3">
                    {providerKeys.map(key => (
                      <div
                        key={key.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={key.is_active}
                            onCheckedChange={() => handleToggleActive(key.id, key.is_active)}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <code className="text-sm font-mono">
                                {visibleKeys.has(key.id) ? key.api_key : maskApiKey(key.api_key)}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleKeyVisibility(key.id)}
                              >
                                {visibleKeys.has(key.id) ? (
                                  <EyeOff className="h-3 w-3" />
                                ) : (
                                  <Eye className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                            {key.label && (
                              <p className="text-xs text-muted-foreground">{key.label}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog
                            open={editingKey === key.id}
                            onOpenChange={(open) => {
                              if (!open) {
                                setEditingKey(null);
                                setEditKeyValue('');
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setEditingKey(key.id);
                                  setEditKeyValue('');
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update API Key</DialogTitle>
                                <DialogDescription>
                                  Enter the new API key value
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <Input
                                  type="password"
                                  placeholder="Enter new API key"
                                  value={editKeyValue}
                                  onChange={(e) => setEditKeyValue(e.target.value)}
                                />
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setEditingKey(null);
                                    setEditKeyValue('');
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => handleUpdateKey(key.id)}
                                  disabled={!editKeyValue.trim() || updateApiKey.isPending}
                                >
                                  {updateApiKey.isPending ? 'Updating...' : 'Update'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete API Key?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. The API key will be permanently deleted.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => deleteApiKey.mutate(key.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No API key configured for this provider</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setNewKeyData(prev => ({ ...prev, provider: providerKey }));
                        setIsAddDialogOpen(true);
                      }}
                    >
                      Add API Key
                    </Button>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Available models:</p>
                  <div className="flex flex-wrap gap-1">
                    {info.models.map(model => (
                      <Badge key={model} variant="outline" className="font-mono text-xs">
                        {model}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
