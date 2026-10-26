export interface ProfessionalWork {
  id: string;
  category: string;
  title: string;
  summary: string;
  tags: string[];
  detailTitle: string;
  detail: string;
  note?: string;
}

export const professionalWork: ProfessionalWork[] = [
  {
    "id": "case-perception",
    "category": "Autonomous driving · Bosch · Full-time experience",
    "title": "Static object detection & ML pipelines",
    "summary": "I worked on heatmap-based object detection, keypoint extraction, and polyline reconstruction. My contributions included extending multi-scale feature aggregation and preparing prediction outputs for quantized inference.",
    "tags": [
      "Computer vision",
      "Geometric reconstruction",
      "Inference preparation"
    ],
    "detailTitle": "A separate 3D workstream",
    "detail": "I also worked on transformer-based 3D detection in bird's-eye-view space, including prediction matching and visualization for model inspection.",
    "note": "The 2D reconstruction and 3D detection examples are separate workstreams."
  },
  {
    "id": "case-labeling",
    "category": "Bosch · Full-time experience",
    "title": "RAG & LLM/VLM pipelines",
    "summary": "I connected retrieval, VLM inference, and structured outputs in a multimodal AI pipeline. At Bosch, I applied it to auto-labeling, using relevant examples and task instructions to generate label proposals from images.",
    "tags": [
      "Multimodal AI",
      "RAG",
      "VLMs",
      "LoRA"
    ],
    "detailTitle": "Adaptation and inference",
    "detail": "LoRA adapts the model during preparation. The adapted model generates structured proposals at request time; adaptation happens separately from inference."
  },
  {
    "id": "case-pipelines",
    "category": "Bosch · Full-time experience",
    "title": "Model-ready data pipelines",
    "summary": "I worked on annotation pipelines that turn raw labels into consistent training records through schema harmonization, geometric alignment, incremental processing, and separate data splits.",
    "tags": [
      "SQL",
      "PySpark",
      "Databricks",
      "Delta Lake"
    ],
    "detailTitle": "Data meets model geometry",
    "detail": "Image views and object annotations must agree before they become training targets. SQL and PySpark workflows connect those transformations with training and evaluation."
  },
  {
    "id": "case-agentic",
    "category": "Bosch · Full-time experience",
    "title": "Agentic document comparison",
    "summary": "I developed a LangGraph-based agentic pipeline with FastAPI, using multimodal LLMs to detect and log text and visual differences in technical PDFs.",
    "tags": [
      "Agentic pipelines",
      "LangGraph",
      "FastAPI",
      "Multimodal LLMs"
    ],
    "detailTitle": "LLM orchestration and review",
    "detail": "LangGraph coordinates the workflow, GPT-4o and Gemini 2.5 Pro compare text and visual content, and the resulting change log supports document review."
  }
];

export const trackerProject = {
  "title": [
    "The Summer 2027",
    "internship tracker"
  ],
  "summary": "A local-first system for collecting listings, organizing applications, and finding relevant roles against resume evidence.",
  "implementation": "A Python collector normalizes and deduplicates listings. A local ranker scores them against resume evidence, with Excel/JSON synchronization and a React dashboard.",
  "status": "Currently developed locally. Next milestone: public release.",
  "tags": [
    "Python",
    "React",
    "Local ranking"
  ],
  "stages": [
    [
      "Public feeds",
      "Listing sources"
    ],
    [
      "Collect + normalize",
      "Deduplication and structured records"
    ],
    [
      "Rank against evidence",
      "Local scoring, not LLM inference"
    ],
    [
      "Sync + explore",
      "Excel / JSON + React dashboard"
    ]
  ]
};

export const publicWork = [
  {
    "category": "Team-built project",
    "title": "Kafka-inspired messaging system",
    "summary": "A Python prototype with producers, consumers, partitions, local message storage, and a custom coordinator.",
    "note": "Shared team credit. The coordinator is a custom implementation.",
    "url": "https://github.com/amoghskanda/Kafka-using-python-and-redis",
    "linkLabel": "Read the source"
  },
  {
    "category": "IEEE ICICT 2024 · Co-author",
    "title": "Efficient Storage Solution for Video Surveillance Archives",
    "summary": "A published paper on storage for video surveillance archives, co-authored with the project team.",
    "note": "IEEE International Conference on Inventive Computation Technologies, 2024.",
    "url": "https://ieeexplore.ieee.org/document/10544428",
    "linkLabel": "View publication"
  }
];

export const background = {
  "summary": "I'm pursuing an M.S. in Computer Science at the University of Southern California after working in machine learning at Bosch.",
  "availability": "I'm seeking Summer 2027 internships in ML, applied AI, software engineering, and data science. Available from May 2027.",
  "timeline": [
    {
      "dates": "2026 to 2028",
      "institution": "University of Southern California",
      "description": "M.S. Computer Science · Expected May 2028"
    },
    {
      "dates": "Aug 2024 to Jul 2026",
      "institution": "Bosch",
      "description": "Machine Learning Engineer"
    },
    {
      "dates": "Jan to Jun 2024 / Jun to Jul 2023",
      "institution": "Bosch",
      "description": "Machine Learning Engineer Intern"
    },
    {
      "dates": "Graduated 2024",
      "institution": "PES University",
      "description": "B.Tech. Computer Science and Engineering"
    }
  ]
};
