import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { Badge } from '../../components/ui/badge';
import { Loader2, Mail, Lock, Shield, LogIn } from 'lucide-react';  

const Login = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(identifier, password);
      // Get user from AuthProvider
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user && user.role) {
        switch (user.role) {
          case 'ADMIN':
            router.navigate({ to: '/dashboard' });
            break;
          case 'USER':
            router.navigate({ to: '/dashboard' });
            break;
          case 'TENANT_ADMIN':
            router.navigate({ to: '/dashboard' });
            break;
          case 'DEVELOPER':
            router.navigate({ to: '/dashboard' });
            break;
          default:
            router.navigate({ to: '/dashboard' });
        }
      } else {
        router.navigate({ to: '/dashboard' });
      }
    } catch (err) {
      setError('Invalid email or password. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@ziohelp.com', role: 'ADMIN', color: 'destructive' },
    { email: 'bob@beta.com', role: 'DEVELOPER', color: 'default' },
    { email: 'charlie@gamma.com', role: 'USER', color: 'secondary' },
    { email: 'eve@epsilon.com', role: 'TENANT_ADMIN', color: 'outline' }
  ];

  const handleDemoLogin = (email: string) => {
    setIdentifier(email);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold gradient-text">
                Welcome to ZioHelp
              </CardTitle>
              <CardDescription className="text-base">
                Sign in to access your support dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="animate-in fade-in-50">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </CardContent>
          </form>

          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            
            <div className="w-full space-y-3">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Demo Accounts - Click to auto-fill
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(account.email)}
                    disabled={isLoading}
                    className="h-auto p-3 flex flex-col items-start gap-1 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-1 w-full">
                      <Badge 
                        variant={account.color as any}
                        className="text-xs px-1 py-0"
                      >
                        {account.role}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground truncate w-full text-left">
                      {account.email.split('@')[0]}
                    </span>
                  </Button>
                ))}
              </div>
              
              <div className="text-center mt-4">
                <p className="text-xs text-muted-foreground">
                  Password for all demo accounts: <code className="bg-muted px-1 rounded">password123</code>
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Secure authentication powered by JWT
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
