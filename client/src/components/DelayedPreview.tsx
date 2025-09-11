'use client';

import React, { useState, useEffect } from 'react';
import ReactPreview from './ReactPreview';

interface DelayedPreviewProps {
  code: string;
  language: string;
  delay?: number;
}

export default function DelayedPreview({ code, language, delay = 2000 }: DelayedPreviewProps) {
  const [debouncedCode, setDebouncedCode] = useState(code);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => {
      setDebouncedCode(code);
      setIsUpdating(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [code, delay]);

  return (
    <div className="relative h-full">
      {isUpdating && (
        <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white px-2 py-1 rounded text-xs">
          Updating...
        </div>
      )}
      <ReactPreview code={debouncedCode} language={language} />
    </div>
  );
}
