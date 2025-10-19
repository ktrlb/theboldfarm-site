"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DbTestPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSimpleQuery = async () => {
    setLoading(true);
    setResults([]);
    addLog('Starting simple query test...');
    
    try {
      if (!supabase) {
        addLog('ERROR: Supabase not configured');
        setLoading(false);
        return;
      }

      addLog('Attempting to fetch 1 goat...');
      const { data, error } = await supabase
        .from('goats')
        .select('id, name')
        .limit(1);
      
      if (error) {
        addLog(`ERROR: ${error.message} (code: ${error.code})`);
      } else {
        addLog(`SUCCESS: Fetched ${data?.length || 0} goat(s)`);
        addLog(`Data: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      addLog(`EXCEPTION: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const testCountQuery = async () => {
    setLoading(true);
    setResults([]);
    addLog('Starting count query test...');
    
    try {
      if (!supabase) {
        addLog('ERROR: Supabase not configured');
        setLoading(false);
        return;
      }

      addLog('Attempting to count goats...');
      const { count, error } = await supabase
        .from('goats')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        addLog(`ERROR: ${error.message} (code: ${error.code})`);
      } else {
        addLog(`SUCCESS: Total goats in database: ${count}`);
      }
    } catch (err) {
      addLog(`EXCEPTION: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const testWithRange = async () => {
    setLoading(true);
    setResults([]);
    addLog('Starting range query test...');
    
    try {
      if (!supabase) {
        addLog('ERROR: Supabase not configured');
        setLoading(false);
        return;
      }

      addLog('Attempting to fetch goats 0-4...');
      const { data, error } = await supabase
        .from('goats')
        .select('id, name, type')
        .range(0, 4);
      
      if (error) {
        addLog(`ERROR: ${error.message} (code: ${error.code})`);
      } else {
        addLog(`SUCCESS: Fetched ${data?.length || 0} goat(s)`);
        data?.forEach(goat => {
          addLog(`  - ${goat.name} (${goat.type})`);
        });
      }
    } catch (err) {
      addLog(`EXCEPTION: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setResults([]);
    addLog('Testing Supabase connection...');
    
    try {
      addLog(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
      addLog(`Supabase client exists: ${!!supabase}`);
      
      if (!supabase) {
        addLog('ERROR: Supabase client not initialized');
        return;
      }

      addLog('Attempting health check...');
      const { error } = await supabase.from('goats').select('count');
      
      if (error) {
        addLog(`ERROR: ${error.message}`);
      } else {
        addLog('SUCCESS: Connection is working');
      }
    } catch (err) {
      addLog(`EXCEPTION: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Database Diagnostic Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={testConnection} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Test Connection
              </Button>
              <Button 
                onClick={testSimpleQuery} 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                Simple Query (1 goat)
              </Button>
              <Button 
                onClick={testCountQuery} 
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Count Query
              </Button>
              <Button 
                onClick={testWithRange} 
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Range Query (5 goats)
              </Button>
            </div>

            <div className="mt-6 bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
              {loading && <div className="text-yellow-400">Running test...</div>}
              {results.map((result, i) => (
                <div key={i} className="mb-1">{result}</div>
              ))}
              {results.length === 0 && !loading && (
                <div className="text-gray-500">Click a button above to run a test</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


