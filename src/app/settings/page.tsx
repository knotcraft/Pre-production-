
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, useFirebase } from '@/firebase';
import { ref, get, update, remove } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, LogOut, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function SettingsPage() {
  const { user, loading: userLoading } = useUser();
  const { database, auth } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    partnerName: '',
    weddingDate: '',
    heroImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isTasksAlertOpen, setIsTasksAlertOpen] = useState(false);
  
  const [newImage, setNewImage] = useState<string | null>(null);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && database) {
      get(ref(database, 'users/' + user.uid)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setFormData({
            name: data.name || '',
            partnerName: data.partnerName || '',
            weddingDate: data.weddingDate || '',
            heroImage: data.heroImage || '',
          });
        }
        setLoading(false);
      });
    } else if (!user && !userLoading) {
      setLoading(false);
    }
  }, [user, database, userLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = async () => {
    if (!user || !database) return;
    setSaving(true);
    try {
      await update(ref(database, `users/${user.uid}`), {
        name: formData.name,
        partnerName: formData.partnerName,
        weddingDate: formData.weddingDate,
      });
      toast({
        variant: 'success',
        title: 'Success!',
        description: 'Your details have been updated.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not save your details.',
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = async () => {
      if (!user || !database || !newImage) return;
      setIsSavingImage(true);
      try {
          await update(ref(database, `users/${user.uid}`), {
              heroImage: newImage,
          });
          setFormData(prev => ({...prev, heroImage: newImage}));
          setNewImage(null);
          toast({
              variant: 'success',
              title: 'Success!',
              description: 'Your dashboard image has been updated.',
          });
      } catch (error: any) {
          toast({
              variant: 'destructive',
              title: 'Uh oh! Something went wrong.',
              description: error.message || 'Could not save your image.',
          });
      } finally {
          setIsSavingImage(false);
      }
  };

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  const handleDeleteAllTasks = async () => {
    if (!user || !database) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to perform this action.'});
      return;
    }
    try {
      await remove(ref(database, `users/${user.uid}/tasks`));
      toast({ variant: 'success', title: 'Success!', description: 'All tasks have been deleted.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Uh oh! Something went wrong.', description: error.message || 'Could not delete tasks.' });
    } finally {
      setIsTasksAlertOpen(false);
    }
  };

  const defaultHeroImage = PlaceHolderImages.find(img => img.id === 'wedding-hero');
  const currentImageSrc = newImage || formData.heroImage || defaultHeroImage?.imageUrl;

  if (loading || userLoading) {
    return (
      <div className="p-4 pt-8 animate-fade-in">
        <header className="flex flex-col items-center justify-center mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-3" />
        </header>
        <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-8 animate-fade-in">
       <header className="flex items-center justify-between mb-8">
          <Link href="/" className="text-foreground flex size-10 shrink-0 items-center justify-center -ml-2 rounded-full hover:bg-secondary">
            <span className="material-symbols-outlined text-2xl font-bold">arrow_back_ios_new</span>
          </Link>
          <h1 className="text-xl font-bold text-center flex-1">Settings</h1>
           <div className="w-10" />
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              Manage your and your partner's names and the wedding date.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partnerName">Partner's Name</Label>
              <Input id="partnerName" value={formData.partnerName} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weddingDate">Wedding Date</Label>
              <Input id="weddingDate" type="date" value={formData.weddingDate} onChange={handleInputChange} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveChanges} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Dashboard Image</CardTitle>
                <CardDescription>
                    Change the hero image on your main dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    {currentImageSrc && (
                        <Image
                            src={currentImageSrc}
                            alt="Dashboard hero image preview"
                            fill
                            className="object-cover"
                        />
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                />
                {newImage ? (
                    <Button onClick={handleSaveImage} disabled={isSavingImage} className="w-full">
                        {isSavingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Image'}
                    </Button>
                ) : (
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                        Choose Image...
                    </Button>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account settings.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </CardContent>
        </Card>

        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription className="text-destructive/80">
              These actions are permanent and cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => setIsTasksAlertOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All Tasks
            </Button>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isTasksAlertOpen} onOpenChange={setIsTasksAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all of your
              task data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAllTasks}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, delete all tasks
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
