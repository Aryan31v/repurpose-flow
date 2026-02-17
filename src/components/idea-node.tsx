import { Handle, Position } from "@xyflow/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function IdeaNode({ data }: { data: { title: string; type: string } }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-card border-2 border-primary/20 hover:border-primary transition-colors min-w-[200px]">
      <div className="flex flex-col">
        <Badge variant="outline" className="w-fit mb-1 text-[10px] uppercase tracking-wider">
          {data.type}
        </Badge>
        <div className="font-bold text-sm">{data.title}</div>
      </div>
      
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-primary" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-primary" />
    </div>
  );
}

export function RootNode({ data }: { data: { title: string } }) {
  return (
    <div className="px-6 py-4 shadow-xl rounded-lg bg-primary text-primary-foreground border-2 border-primary min-w-[250px]">
      <div className="text-xs uppercase opacity-80 mb-1 font-semibold tracking-widest">Original Source</div>
      <div className="font-bold text-lg leading-tight">{data.title}</div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-background !border-primary" />
    </div>
  );
}
