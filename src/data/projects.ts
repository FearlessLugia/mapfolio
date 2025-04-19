export interface ProjectCardItem {
  title: string
  description: string
  tags: string[]
  detail?: string[]
  link?: string
}

export const projects: ProjectCardItem[] = [
  {
    title: '3D Network Visualization',
    description: 'A Microservices full-stack application rendering complex 3D network visualizations',
    tags: ['MERN Stack', 'TypeScript', 'Three.js', 'GraphQL', 'RabbitMQ'],
    detail: [
      'Architected a Microservices full-stack application using Node.js and TypeScript, rendering complex 3D network visualizations of coordinates and relational edges from GraphML data through React and Three.js.\n',
      'Developed a scalable Graph Service using GraphQL, integrating MongoDB for CRUD operations on networks, nodes and edges.',
      'Shared reusable code between multiple Express servers by creating custom npm packages as a common library to centralize middleware and base event publisher/listener logic to accelerate development.',
      'Utilized RabbitMQ to decouple and manage resource-intensive upload services, ensuring high-performance processing for large-scale tasks.'
    ]
  },
  {
    title: 'Model Diff',
    description: 'A .NET application to efficiently compare different types of 3D models',
    tags: ['C#', '.NET', 'WPF', 'C++', 'CAA', 'Graph Operations', 'XML'],
    detail: [
      'Utilized design patterns and the factory method to develop a unified .NET application to efficiently compare different types of 3D models creating a unified entry point to provide flexibility in adapting to different structure trees and evolving requirements.',
      'Designed a tree-like data structure and built a declarative comparison engine using generics and reflection, automating traversal and matching of model properties while simplifying logic reuse and future maintenance.',
      'Extracted common model attributes via a C++ plugin and exposed them to C#, enabling reuse across software and reducing future effort'
    ]
  },
  {
    title: 'Lesty KV',
    description: 'An LSM‑Tree-based key‑value store engine implemented in C++',
    tags: ['C++', 'Database', 'Key‑Value Store'],
    detail: [
      'Implemented high-throughput APIs with page-level I/O via Memtable and B-Tree-based SSTable for efficient disk reads and range queries.',
      'Built a cache-efficient Buffer Pool with hash-based indexing and LRU eviction to reduce I/O latency and manage in-memory page life cycle.',
      'Designed LSM-Tree with tiered compaction via Min-Heap, integrating cutting-edge design to boost insertion and reduce write amplification.'
    ],
    link: 'https://github.com/FearlessLugia/lesty-kv'
  },
  {
    title: 'Rusty DFS',
    description: 'A distributed file storage system implemented in Rust',
    tags: ['Rust', 'Distributed System', 'File Storage'],
    detail: [
      'Developed a peer-to-peer file storage system in Rust using libp2p for decentralized communication and RESTful APIs for user interaction.',
      'Implemented file chunking, replication, and metadata management to enable fault-tolerant, scalable file distribution across dynamic nodes.'
    ],
    link: 'https://github.com/FearlessLugia/rusty-dfs'
  }
]
