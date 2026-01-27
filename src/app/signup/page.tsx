'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  mobile: z.string().optional(),
});

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
);


export default function SignupPage() {
    const { auth } = useFirebase();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            mobile: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!auth) return;
        setIsLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, values.email, values.password);
            router.push('/personalize');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Sign Up Failed',
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleGoogleSignIn() {
        if (!auth) return;
        setIsGoogleLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push('/personalize');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Google Sign-In Failed',
                description: error.message,
            });
        } finally {
            setIsGoogleLoading(false);
        }
    }
    
    return (
        <div className="flex min-h-screen w-full flex-col items-center bg-white text-text-dark font-sans antialiased">
            <div className="w-full pt-8 px-6">
                <div className="flex justify-center items-center max-w-[400px] mx-auto h-10">
                    <div className="flex items-center justify-center gap-2 text-primary font-extrabold text-2xl tracking-tight">
                        <span className="material-symbols-outlined text-3xl">favorite</span>
                        <span>Forever Bloom</span>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[400px] px-6 flex flex-col pb-8">
                <div className="my-8">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3">Create Account</h1>
                    <p className="text-text-muted text-lg font-medium">Start planning your big day!</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-text-dark">Email Address</FormLabel>
                                    <FormControl>
                                        <Input className="border-border-light bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none w-full h-14 px-5 rounded-lg text-base font-medium border" placeholder="e.g. name@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-text-dark">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input className="border-border-light bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none w-full h-14 px-5 rounded-lg text-base font-medium border" placeholder="••••••••" type="password" {...field}/>
                                            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" type="button">
                                                <span className="material-symbols-outlined">visibility</span>
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-text-dark">Mobile Number</FormLabel>
                                    <FormControl>
                                        <Input className="border-border-light bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none w-full h-14 px-5 rounded-lg text-base font-medium border" placeholder="+1 (555) 555-5555" type="tel" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="pt-2">
                             <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary-hover text-white font-extrabold text-lg rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </Form>

                <div className="mt-8">
                    <div className="relative mb-8 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <span className="relative bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Or sign up with</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <Button onClick={handleGoogleSignIn} className="flex items-center justify-center gap-3 h-14 rounded-lg border border-border-light bg-white hover:bg-accent transition-colors font-bold text-text-dark" disabled={isGoogleLoading}>
                            {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                            Google
                        </Button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-text-muted font-medium">
                        Already have an account?
                        <Link href="/login" className="font-extrabold text-primary ml-1">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
