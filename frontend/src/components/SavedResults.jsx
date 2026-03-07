import React, { useState, useEffect } from 'react';
import { Trash2, Download, Upload, Clock, Calculator, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  getAllResults,
  deleteResult,
  clearAllResults,
  exportResults,
  importResults,
  getResultCount,
} from '@/lib/savedResultsDB';

/**
 * SavedResults Panel - Shows saved calculation results from IndexedDB
 */
export function SavedResultsPanel({ className = "" }) {
  const [results, setResults] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [resultCount, setResultCount] = useState(0);

  // Load results on mount
  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const savedResults = await getAllResults();
      setResults(savedResults);
      const count = await getResultCount();
      setResultCount(count);
    } catch (error) {
      console.error('Failed to load saved results:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteResult(id);
      await loadResults();
    } catch (error) {
      console.error('Failed to delete result:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllResults();
      await loadResults();
    } catch (error) {
      console.error('Failed to clear results:', error);
    }
  };

  const handleExport = async () => {
    try {
      const json = await exportResults();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pedotg-results-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export results:', error);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const count = await importResults(text);
      await loadResults();
      alert(`Imported ${count} results successfully!`);
    } catch (error) {
      console.error('Failed to import results:', error);
      alert('Failed to import results. Please check the file format.');
    }
    
    // Reset the input
    event.target.value = '';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (resultCount === 0 && !isExpanded) {
    return null;
  }

  return (
    <Card className={`nightingale-card ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 hover:text-[#00d9c5] transition-colors"
          >
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Saved Results
              {resultCount > 0 && (
                <span className="px-2 py-0.5 bg-[#00d9c5]/10 text-[#00d9c5] rounded-full text-xs">
                  {resultCount}
                </span>
              )}
            </CardTitle>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {isExpanded && resultCount > 0 && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="h-7 px-2"
                title="Export results"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  title="Import results"
                  asChild
                >
                  <span>
                    <Upload className="h-3.5 w-3.5" />
                  </span>
                </Button>
              </label>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    title="Clear all results"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Saved Results?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all {resultCount} saved results. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearAll}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          {results.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No saved results yet. Your calculation results will appear here.
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-start justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#00d9c5]">{result.type}</span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(result.timestamp)}
                      </span>
                    </div>
                    <p className="font-medium mt-1">{result.title}</p>
                    {result.output && (
                      <p className="text-muted-foreground mt-0.5">
                        {typeof result.output === 'object' 
                          ? JSON.stringify(result.output)
                          : result.output
                        }
                      </p>
                    )}
                    {result.notes && (
                      <p className="text-muted-foreground italic mt-0.5">{result.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(result.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                    title="Delete this result"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Hook to save a result to IndexedDB
 */
export function useSaveResult() {
  const [saving, setSaving] = useState(false);

  const save = async (result) => {
    setSaving(true);
    try {
      const { saveResult } = await import('@/lib/savedResultsDB');
      await saveResult(result);
      return true;
    } catch (error) {
      console.error('Failed to save result:', error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { save, saving };
}
