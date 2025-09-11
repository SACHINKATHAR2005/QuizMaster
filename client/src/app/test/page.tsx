'use client';

import { useState } from 'react';
import { authAPI } from '@/lib/api';

export default function TestPage() {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setTestResult('Testing API connection...');
    
    try {
      // Test a simple request to see if the server is reachable
      const response = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          email: 'test@test.com',
          password: 'testpass123'
        })
      });
      
      const data = await response.json();
      setTestResult(`API Test Result: ${response.status} - ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setTestResult(`API Test Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAxios = async () => {
    setLoading(true);
    setTestResult('Testing Axios API...');
    
    try {
      const response = await authAPI.register({
        username: 'testuser2',
        email: 'test2@test.com',
        password: 'testpass123'
      });
      
      setTestResult(`Axios Test Result: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setTestResult(`Axios Test Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={testAPI}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Test Fetch API (Port 4000)
          </button>
          
          <button
            onClick={testAxios}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 ml-4"
          >
            Test Axios API (Port 4000)
          </button>
        </div>
        
        <div className="bg-white p-4 rounded border">
          <h2 className="font-semibold mb-2">Test Results:</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {testResult || 'No test results yet. Click a button above to test.'}
          </pre>
        </div>
        
        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h3 className="font-semibold text-yellow-800">Current Configuration:</h3>
          <ul className="text-yellow-700 text-sm mt-2 space-y-1">
            <li>• Frontend: http://localhost:3000</li>
            <li>• Backend: http://localhost:4000</li>
            <li>• API Base URL: http://localhost:4000</li>
          </ul>
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded">
          <h3 className="font-semibold text-blue-800">Troubleshooting:</h3>
          <ul className="text-blue-700 text-sm mt-2 space-y-1">
            <li>• Make sure your backend server is running on port 4000</li>
            <li>• Check if CORS is properly configured on the server</li>
            <li>• Look at the browser console for detailed error messages</li>
            <li>• Check the Network tab in DevTools to see the actual requests</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
