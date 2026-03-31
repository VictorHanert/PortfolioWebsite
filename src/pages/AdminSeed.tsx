'use client';

import { useState } from 'react';
import { seedDatabase } from '@/services/travelSeeder';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function AdminSeed() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ successCount: number; errorCount: number } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleSeed = async () => {
    setShowConfirm(false);
    setIsRunning(true);
    setLogs([]);
    setResult(null);

    // Capture console logs
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      setLogs(prev => [...prev, args.join(' ')]);
      originalLog(...args);
    };
    
    console.error = (...args) => {
      setLogs(prev => [...prev, `[ERROR] ${args.join(' ')}`]);
      originalError(...args);
    };

    try {
      const res = await seedDatabase();
      setResult(res || { successCount: 0, errorCount: 0 });
    } finally {
      console.log = originalLog;
      console.error = originalError;
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background pt-20 pb-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Travel Database Seeder
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Populate Supabase database with travel destinations and embeddings
          </p>
        </div>

        {/* Main card */}
        <div className="rounded-lg border border-border bg-card shadow-lg">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">Seeding Setup</h2>
          </div>

          <div className="space-y-6 px-6 py-6">
            {/* Info section */}
            <div className="rounded-lg bg-muted/40 p-4">
              <h3 className="font-medium text-foreground mb-2">What will happen:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span>1.</span>
                  <span>Clear all existing travel destinations from the database</span>
                </li>
                <li className="flex gap-2">
                  <span>2.</span>
                  <span>Generate embeddings for 8 sample travel destinations (development: mock embeddings, production: Gemini)</span>
                </li>
                <li className="flex gap-2">
                  <span>3.</span>
                  <span>Insert fresh destinations into your Supabase `travel_destinations` table</span>
                </li>
                <li className="flex gap-2">
                  <span>4.</span>
                  <span>Enable semantic search in your travel agent</span>
                </li>
              </ul>
            </div>

            {/* Development note */}
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <h3 className="font-medium text-amber-900 dark:text-amber-200 mb-2">Development Mode</h3>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                You're running locally. Mock embeddings (hash-based) are used instead of Gemini API. This is perfect for testing. In production, real Gemini embeddings will be generated.
              </p>
            </div>

            {/* Info */}
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
              <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Database reset</h3>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                This will clear all existing travel destinations and repopulate with fresh seed data. Safe to run multiple times.
              </p>
            </div>

            {/* Requirements */}
            <div className="text-sm">
              <h3 className="font-medium text-foreground mb-2">Prerequisites:</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>✓ Supabase configured (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)</li>
                <li>✓ Server configured (SUPABASE_SERVICE_ROLE_KEY)</li>
                <li>✓ `travel_destinations` table created with embedding column</li>
                <li className="text-xs text-muted-foreground/70">(Gemini API only needed in production)</li>
              </ul>
            </div>

            {/* Seed button */}
            <div className="flex gap-4">
              <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <Button
                  onClick={() => setShowConfirm(true)}
                  disabled={isRunning || result !== null}
                  className="h-11"
                >
                  {isRunning ? 'Seeding...' : 'Start Seeding'}
                </Button>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset and seed database</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will clear all existing travel destinations and insert 8 sample destinations with embeddings. Continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex gap-3 justify-end">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSeed}>
                      Yes, seed database
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>

              {result && (
                <Button
                  onClick={() => {
                    setResult(null);
                    setLogs([]);
                  }}
                  variant="outline"
                  className="h-11"
                >
                  Reset
                </Button>
              )}
            </div>

            {/* Logs */}
            {logs.length > 0 && (
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <h3 className="font-medium text-sm text-foreground mb-3">Operation Log:</h3>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {logs.map((log, i) => (
                    <div
                      key={i}
                      className={`text-xs font-mono ${
                        log.includes('[ERROR]')
                          ? 'text-red-600 dark:text-red-400'
                          : log.includes('✅')
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Result */}
            {result && (
              <div
                className={`rounded-lg p-4 ${
                  result.errorCount === 0
                    ? 'border border-green-500/20 bg-green-500/5'
                    : 'border border-yellow-500/20 bg-yellow-500/5'
                }`}
              >
                <h3
                  className={`font-semibold ${
                    result.errorCount === 0
                      ? 'text-green-900 dark:text-green-200'
                      : 'text-yellow-900 dark:text-yellow-200'
                  }`}
                >
                  {result.errorCount === 0 ? 'Seeding complete!' : 'Seeding finished with errors'}
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Successful inserts</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {result.successCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Errors</p>
                    <p
                      className={`text-2xl font-bold ${
                        result.errorCount === 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {result.errorCount}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Database reset complete. Your travel agent is ready to use with semantic search.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          This endpoint is strictly for development and testing.
        </p>
      </div>
    </div>
  );
}
