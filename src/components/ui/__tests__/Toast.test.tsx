import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, act, renderHook } from "@testing-library/react";
import { ToastProvider, useToast } from "@/components/ui/Toast";

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock("lucide-react", () => ({
  CheckCircle: (props: any) => <svg data-testid="check-circle" {...props} />,
  AlertTriangle: (props: any) => <svg data-testid="alert-triangle" {...props} />,
  Info: (props: any) => <svg data-testid="info-icon" {...props} />,
  XCircle: (props: any) => <svg data-testid="x-circle" {...props} />,
  X: (props: any) => <svg data-testid="x-icon" {...props} />,
}));

describe("ToastProvider", () => {
  it("renders children", () => {
    render(
      <ToastProvider>
        <p>App content</p>
      </ToastProvider>
    );
    expect(screen.getByText("App content")).toBeInTheDocument();
  });
});

describe("useToast", () => {
  it("throws when used outside provider", () => {
    expect(() => {
      renderHook(() => useToast());
    }).toThrow("useToast must be used within a ToastProvider");
  });

  it("does not throw when used inside provider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    const { result } = renderHook(() => useToast(), { wrapper });
    expect(result.current.toast).toBeTypeOf("function");
  });
});

describe("toast function", () => {
  it("creates and displays a toast message", () => {
    function TestComponent() {
      const { toast } = useToast();
      return (
        <button onClick={() => toast("Hello toast!")}>Show toast</button>
      );
    }

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByText("Show toast").click();
    });

    expect(screen.getByText("Hello toast!")).toBeInTheDocument();
  });

  it("creates a toast with specified type", () => {
    function TestComponent() {
      const { toast } = useToast();
      return (
        <button onClick={() => toast("Success!", "success")}>Show</button>
      );
    }

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByText("Show").click();
    });

    expect(screen.getByText("Success!")).toBeInTheDocument();
  });
});
