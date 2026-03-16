import { Loader2, FilePlus, FileEdit, Eye, FileX, FileOutput } from "lucide-react";

interface ToolInvocationDisplayProps {
  toolName: string;
  state: string;
  args: Record<string, unknown>;
}

function getFileName(path: unknown): string {
  if (typeof path !== "string") return "";
  return path.split("/").pop() || path;
}

function getDisplayInfo(
  toolName: string,
  args: Record<string, unknown>
): { label: string; icon: React.ComponentType<{ className?: string }> } {
  const path = args.path;
  const fileName = getFileName(path);
  const suffix = fileName ? ` ${fileName}` : "";

  if (toolName === "str_replace_editor") {
    const command = args.command as string | undefined;

    switch (command) {
      case "create":
        return { label: `Creating${suffix}`, icon: FilePlus };
      case "str_replace":
        return { label: `Editing${suffix}`, icon: FileEdit };
      case "insert":
        return { label: `Editing${suffix}`, icon: FileEdit };
      case "view":
        return { label: `Viewing${suffix}`, icon: Eye };
      default:
        return { label: `Editing${suffix}`, icon: FileEdit };
    }
  }

  if (toolName === "file_manager") {
    const command = args.command as string | undefined;

    switch (command) {
      case "rename":
        return {
          label: `Renaming${suffix}`,
          icon: FileOutput,
        };
      case "delete":
        return { label: `Deleting${suffix}`, icon: FileX };
      default:
        return { label: `Managing${suffix}`, icon: FileEdit };
    }
  }

  return { label: toolName, icon: FileEdit };
}

function getCompletedLabel(label: string): string {
  return label
    .replace("Creating", "Created")
    .replace("Editing", "Edited")
    .replace("Viewing", "Viewed")
    .replace("Renaming", "Renamed")
    .replace("Deleting", "Deleted")
    .replace("Managing", "Managed");
}

export function ToolInvocationDisplay({
  toolName,
  state,
  args,
}: ToolInvocationDisplayProps) {
  const isComplete = state === "result";
  const { label, icon: Icon } = getDisplayInfo(toolName, args);
  const displayLabel = isComplete ? getCompletedLabel(label) : label;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <Icon className="w-3 h-3 text-neutral-500" />
          <span className="text-neutral-700">{displayLabel}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <Icon className="w-3 h-3 text-neutral-500" />
          <span className="text-neutral-700">{displayLabel}</span>
        </>
      )}
    </div>
  );
}
