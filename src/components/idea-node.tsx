import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { useUserSettings } from "@/context/user-settings-context";

export function IdeaNode({ data }: { data: { title: string; type: string } }) {
  const { settings } = useUserSettings();
  
  return (
    <div 
      className="px-4 py-2 shadow-md rounded-md bg-card border-2 transition-colors min-w-[200px]"
      style={{ borderColor: `${settings.brandColor}33` }}
    >
      <div className="flex flex-col">
        <Badge 
          variant="outline" 
          className="w-fit mb-1 text-[10px] uppercase tracking-wider"
          style={{ color: settings.brandColor, borderColor: `${settings.brandColor}55` }}
        >
          {data.type}
        </Badge>
        <div className="font-bold text-sm">{data.title}</div>
      </div>
      
      <Handle type="target" position={Position.Left} className="w-2 h-2" style={{ background: settings.brandColor }} />
      <Handle type="source" position={Position.Right} className="w-2 h-2" style={{ background: settings.brandColor }} />
    </div>
  );
}

export function RootNode({ data }: { data: { title: string } }) {
  const { settings } = useUserSettings();

  return (
    <div 
      className="px-6 py-4 shadow-xl rounded-lg text-primary-foreground border-2 min-w-[250px]"
      style={{ background: settings.brandColor, borderColor: settings.brandColor }}
    >
      <div className="text-xs uppercase opacity-80 mb-1 font-semibold tracking-widest">Original Source</div>
      <div className="font-bold text-lg leading-tight">{settings.brandName || data.title}</div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-background" style={{ borderColor: settings.brandColor }} />
    </div>
  );
}
