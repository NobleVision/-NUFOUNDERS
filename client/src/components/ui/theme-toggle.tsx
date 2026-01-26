import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "default" | "minimal" | "pill";
  className?: string;
}

export function ThemeToggle({ variant = "default", className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (variant === "minimal") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={cn(
          "relative h-9 w-9 rounded-full transition-all duration-300",
          "hover:bg-accent/80 hover:scale-105",
          className
        )}
        aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {resolvedTheme === "light" ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Sun className="h-5 w-5 text-amber-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Moon className="h-5 w-5 text-indigo-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    );
  }

  if (variant === "pill") {
    return (
      <div
        className={cn(
          "relative flex items-center gap-1 p-1 rounded-full",
          "bg-muted/50 border border-border/50",
          "backdrop-blur-sm",
          className
        )}
      >
        {[
          { value: "light" as const, icon: Sun, label: "Light" },
          { value: "dark" as const, icon: Moon, label: "Dark" },
          { value: "system" as const, icon: Monitor, label: "System" },
        ].map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              "relative flex items-center justify-center h-8 w-8 rounded-full",
              "transition-all duration-300 ease-out",
              theme === value
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={`Use ${label} theme`}
          >
            {theme === value && (
              <motion.div
                layoutId="theme-pill-indicator"
                className="absolute inset-0 rounded-full bg-primary shadow-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <Icon className="h-4 w-4 relative z-10" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "relative h-9 w-9 rounded-lg border-border/50",
            "bg-background/50 backdrop-blur-sm",
            "hover:bg-accent/80 hover:border-border",
            "transition-all duration-300",
            className
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {resolvedTheme === "light" ? (
              <motion.div
                key="sun"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Sun className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Moon className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            theme === "light" && "bg-accent"
          )}
        >
          <Sun className="h-4 w-4 text-amber-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            theme === "dark" && "bg-accent"
          )}
        >
          <Moon className="h-4 w-4 text-indigo-400" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            theme === "system" && "bg-accent"
          )}
        >
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
