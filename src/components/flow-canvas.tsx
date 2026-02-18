"use client"

import { useMemo, useState, useCallback } from "react"
import { 
  ReactFlow, 
  Background, 
  BackgroundVariant,
  Controls, 
  Panel,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from "@xyflow/react"

import { RepurposeResponse, RepurposingIdea } from "@/types"
import { IdeaNode, RootNode } from "./idea-node"
import { IdeaDetailsModal } from "./idea-details-modal"

const nodeTypes = {
  ideaNode: IdeaNode,
  rootNode: RootNode,
}

interface FlowCanvasProps {
  data: RepurposeResponse
  originalContent: string
}

export function FlowCanvas({ data, originalContent }: FlowCanvasProps) {
  const { settings } = useUserSettings()
  const [selectedIdea, setSelectedIdea] = useState<RepurposingIdea | null>(null)
  
  const initialNodes: Node[] = useMemo(() => {
    // Calculate vertical center based on number of ideas
    const totalHeight = data.repurposing_ideas.length * 130;
    const startY = Math.max(0, 300 - totalHeight / 2);

    const nodes: Node[] = [
      {
        id: "root",
        type: "rootNode",
        position: { x: 100, y: 300 },
        data: { title: data.original_title },
      },
    ]

    data.repurposing_ideas.forEach((idea, index) => {
      nodes.push({
        id: idea.id,
        type: "ideaNode",
        position: { x: 500, y: startY + index * 130 },
        data: { 
          title: idea.title, 
          type: idea.type,
          idea: idea
        },
      })
    })

    return nodes
  }, [data])

  const initialEdges: Edge[] = useMemo(() => {
    return data.repurposing_ideas.map((idea) => ({
      id: `e-root-${idea.id}`,
      source: "root",
      target: idea.id,
      animated: true,
      style: { stroke: settings.brandColor, strokeWidth: 2 },
    }))
  }, [data, settings.brandColor])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Check if node data contains the idea object (set in initialNodes)
    if (node.id === "root") return
    
    const idea = data.repurposing_ideas.find(i => i.id === node.id)
    if (idea) {
      setSelectedIdea(idea)
    }
  }, [data.repurposing_ideas])

  return (
    <div className="absolute inset-0 w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        onInit={(instance) => {
          setTimeout(() => instance.fitView({ padding: 0.2 }), 50);
        }}
        minZoom={0.2}
        maxZoom={4}
      >
        <Background color="#888" gap={20} variant={BackgroundVariant.Dots} />
        <Controls />
        <Panel position="bottom-right" className="bg-background/80 p-3 rounded-xl border-2 shadow-lg backdrop-blur mb-4 mr-4 max-w-[200px]">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Navigation</div>
          <div className="text-sm font-medium">Click a node to view/edit content. Drag to move nodes.</div>
        </Panel>
      </ReactFlow>

      {selectedIdea && (
        <IdeaDetailsModal 
          idea={selectedIdea} 
          originalContent={originalContent}
          isOpen={!!selectedIdea} 
          onClose={() => setSelectedIdea(null)} 
        />
      )}
    </div>
  )
}
