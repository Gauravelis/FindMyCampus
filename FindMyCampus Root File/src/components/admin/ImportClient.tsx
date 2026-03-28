'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck2, AlertCircle, Loader2 } from 'lucide-react';
import { sanitizeCollegeData } from '@/ai/flows/college-data-import-sanitization';

type Status = 'idle' | 'uploading' | 'processing' | 'success' | 'error';
type SanitizedResult = { name: string; status: 'sanitized' | 'failed' };

export default function ImportClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [sanitizedData, setSanitizedData] = useState<SanitizedResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus('idle');
      setError(null);
      setSanitizedData([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  const handleImport = async () => {
    if (!file) return;

    setStatus('uploading');
    setProgress(0);
    setError(null);

    // Simulate file upload
    await new Promise(res => setTimeout(res, 500));
    setProgress(50);
    await new Promise(res => setTimeout(res, 500));
    setProgress(100);

    setStatus('processing');
    
    // Mock CSV parsing and AI sanitization
    // In a real app, you would read the CSV and loop through rows
    const mockRows = [
      { name: 'Test College 1', description: 'a gud college' },
      { name: 'Test College 2', description: 'very nice place for study' },
      { name: 'Another Edu Inst', description: 'best faculty' },
    ];

    const results: SanitizedResult[] = [];
    try {
        for (const row of mockRows) {
            // This is where you would call the actual AI flow
            const sanitized = await sanitizeCollegeData({
                ...row,
                address: '123 Main St', city: 'Anytown', state: 'Anystate',
                longDescription: row.description, courses: ['Sample'], fees: 10000,
                awards: [], facilities: [],
            });
            results.push({ name: sanitized.name, status: 'sanitized' });
        }
        setSanitizedData(results);
        setStatus('success');
    } catch(e) {
        setError('An error occurred during data sanitization.');
        setStatus('error');
    }
  };
  
  const resetState = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setSanitizedData([]);
    setError(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">CSV Upload</CardTitle>
        <CardDescription>
          Select a CSV file to import. The data will be sanitized by AI before being saved.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {status === 'idle' && !file && (
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : ''
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-12 h-12 text-muted-foreground" />
            <p className="mt-4 text-center text-muted-foreground">
              {isDragActive
                ? 'Drop the file here...'
                : "Drag 'n' drop a CSV file here, or click to select a file"}
            </p>
          </div>
        )}

        {file && (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <span className="font-medium">{file.name}</span>
            <Button onClick={handleImport} disabled={status !== 'idle'}>
              {status === 'processing' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
              Import Data
            </Button>
          </div>
        )}

        {(status === 'uploading' || status === 'processing') && (
          <div>
            <p className="text-sm font-medium mb-2">
                {status === 'uploading' ? 'Uploading...' : 'Processing with AI...'}
            </p>
            <Progress value={status === 'processing' ? undefined : progress} />
          </div>
        )}
        
        {status === 'success' && (
            <Alert>
                <FileCheck2 className="h-4 w-4" />
                <AlertTitle>Import Successful!</AlertTitle>
                <AlertDescription>
                    {sanitizedData.length} records were sanitized and are ready. In a real app, they would now be saved.
                    <ul className="mt-2 list-disc list-inside">
                        {sanitizedData.map(d => <li key={d.name}>{d.name}</li>)}
                    </ul>
                </AlertDescription>
                 <Button onClick={resetState} className="mt-4">Import Another</Button>
            </Alert>
        )}

        {status === 'error' && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Import Failed</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
                <Button onClick={resetState} variant="secondary" className="mt-4">Try Again</Button>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
