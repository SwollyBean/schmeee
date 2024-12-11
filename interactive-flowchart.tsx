import React, { useState } from 'react';

const InteractiveFlowchart = () => {
  const initialNodes = [
    { 
      id: 'start', 
      text: 'Strategic Decision Analysis',
      details: 'Comprehensive analysis of cannabis business strategy',
      level: 0,
      column: 1
    },
    { 
      id: 'fa', 
      text: 'Financial Assessment',
      details: 'Analysis of financial impacts and considerations',
      level: 1,
      column: 0
    },
    { 
      id: 'sp', 
      text: 'Strategic Positioning',
      details: 'Evaluation of business position and opportunities',
      level: 1,
      column: 1
    },
    { 
      id: 'rc', 
      text: 'Risks & Considerations',
      details: 'Key risks and timing considerations',
      level: 1,
      column: 2
    },
    { 
      id: 'fa_pros', 
      text: 'Financial Pros',
      details: '• Reduction in Operating Costs\n• Improved Banking Position\n• Cash Flow Improvement\n• No Further Cash Outlay\n• Opportunity Cost Benefits\n• Limited Exit Risk Mitigation',
      level: 2,
      column: 0
    },
    { 
      id: 'fa_cons', 
      text: 'Financial Cons',
      details: '• Unrealized Sunk Costs\n• Debt Write-Off\n• A/R Collection Risk\n• Winding Down Costs\n• Missed Regulatory Upside',
      level: 2,
      column: 1
    },
    { 
      id: 'sp_pros', 
      text: 'Strategic Pros',
      details: '• Resource Reallocation\n• Reduced Stress & Complexity\n• Pivot to Stronger Ventures',
      level: 2,
      column: 2
    },
    { 
      id: 'sp_cons', 
      text: 'Strategic Cons',
      details: '• Loss of Talented Team\n• Loss of Industry Presence\n• Market Knowledge Loss',
      level: 2,
      column: 3
    },
    { 
      id: 'r1', 
      text: 'Regulatory Uncertainty',
      details: 'Changes from new administration or descheduling could shift market dynamics',
      level: 2,
      column: 4
    },
    { 
      id: 'r2', 
      text: 'Timing Risk',
      details: 'Potential missed opportunities if market conditions improve post-exit',
      level: 2,
      column: 5
    },
    { 
      id: 'r3', 
      text: 'Capital Access Impact',
      details: 'Regulatory reform could open institutional capital access and boost valuations',
      level: 2,
      column: 6
    },
  ];

  const [nodes, setNodes] = useState(initialNodes.map(node => ({
    ...node,
    x: Math.random() * 800,
    y: Math.random() * 600
  })));

  const connections = [
    { from: 'start', to: 'fa' },
    { from: 'start', to: 'sp' },
    { from: 'start', to: 'rc' },
    { from: 'fa', to: 'fa_pros' },
    { from: 'fa', to: 'fa_cons' },
    { from: 'sp', to: 'sp_pros' },
    { from: 'sp', to: 'sp_cons' },
    { from: 'rc', to: 'r1' },
    { from: 'rc', to: 'r2' },
    { from: 'rc', to: 'r3' },
  ];

  const autoOrganize = () => {
    const levelHeight = 200;  // Vertical spacing between levels
    const columnWidth = 250;  // Horizontal spacing between columns
    const baseY = 100;       // Starting Y position
    const baseX = 200;       // Starting X position

    const organized = nodes.map(node => ({
      ...node,
      x: baseX + (node.column * columnWidth),
      y: baseY + (node.level * levelHeight)
    }));

    setNodes(organized);
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('nodeId', id);
  };

  const handleDrag = (e, id) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    const nodeId = e.dataTransfer.getData('nodeId');
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setNodes(nodes.map(node => 
      node.id === nodeId 
        ? { ...node, x, y }
        : node
    ));
  };

  const Line = ({ from, to }) => {
    const fromNode = nodes.find(n => n.id === from);
    const toNode = nodes.find(n => n.id === to);
    
    if (!fromNode || !toNode) return null;

    return (
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <line
          x1={fromNode.x}
          y1={fromNode.y}
          x2={toNode.x}
          y2={toNode.y}
          stroke="#9CA3AF"
          strokeWidth="2"
        />
      </svg>
    );
  };

  return (
    <div className="relative">
      <button 
        onClick={autoOrganize}
        className="fixed top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-20"
      >
        Auto-Organize
      </button>
      <div 
        className="relative w-full h-screen border border-gray-200 rounded-lg bg-white overflow-auto p-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {connections.map((connection, index) => (
          <Line key={index} from={connection.from} to={connection.to} />
        ))}
        
        {nodes.map(node => (
          <div
            key={node.id}
            draggable
            onDragStart={(e) => handleDragStart(e, node.id)}
            onDrag={(e) => handleDrag(e, node.id)}
            className={`absolute cursor-move p-4 rounded-lg shadow-md text-sm z-10 max-w-xs
              ${node.id === 'start' ? 'bg-purple-200' : 
              node.id.includes('pros') ? 'bg-green-200' :
              node.id.includes('cons') ? 'bg-red-200' :
              node.id.startsWith('r') ? 'bg-orange-200' : 'bg-blue-200'}`}
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <h3 className="font-bold mb-2">{node.text}</h3>
            <p className="text-xs whitespace-pre-line">{node.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveFlowchart;