"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 rounded-3xl border border-red-500/10 bg-red-500/5 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <p className="font-bold text-foreground">Something went wrong</p>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Something went wrong while rendering the result. Please try again.
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
