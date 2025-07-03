
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Email change state
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) {
        toast({
          title: "Fehler beim Ändern der E-Mail",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "E-Mail-Änderung angefordert",
          description: "Bitte überprüfen Sie Ihre neue E-Mail-Adresse für die Bestätigung."
        });
        setNewEmail('');
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      });
    }

    setEmailLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die neuen Passwörter stimmen nicht überein.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Fehler",
        description: "Das neue Passwort muss mindestens 6 Zeichen lang sein.",
        variant: "destructive"
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          title: "Fehler beim Ändern des Passworts",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Passwort erfolgreich geändert",
          description: "Ihr Passwort wurde erfolgreich aktualisiert."
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      });
    }

    setPasswordLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kontoeinstellungen</h1>
          <p className="text-gray-600 mt-2">Verwalten Sie Ihre Konto- und Sicherheitseinstellungen</p>
        </div>

        <div className="space-y-6">
          {/* Current Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Aktuelle Kontoinformationen</CardTitle>
              <CardDescription>
                Ihre derzeitigen Kontodaten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">E-Mail-Adresse</Label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Benutzer-ID</Label>
                  <p className="text-gray-500 text-sm font-mono">{user?.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Change */}
          <Card>
            <CardHeader>
              <CardTitle>E-Mail-Adresse ändern</CardTitle>
              <CardDescription>
                Ändern Sie Ihre E-Mail-Adresse. Sie erhalten eine Bestätigungs-E-Mail an die neue Adresse.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailChange} className="space-y-4">
                <div>
                  <Label htmlFor="newEmail">Neue E-Mail-Adresse</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="neue@email.de"
                    required
                  />
                </div>
                <Button type="submit" disabled={emailLoading || !newEmail}>
                  {emailLoading ? "Wird geändert..." : "E-Mail ändern"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Separator />

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle>Passwort ändern</CardTitle>
              <CardDescription>
                Ändern Sie Ihr Passwort. Das neue Passwort muss mindestens 6 Zeichen lang sein.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="newPassword">Neues Passwort</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Neues Passwort eingeben"
                    minLength={6}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Neues Passwort bestätigen</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Neues Passwort bestätigen"
                    minLength={6}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={passwordLoading || !newPassword || !confirmPassword}
                >
                  {passwordLoading ? "Wird geändert..." : "Passwort ändern"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
