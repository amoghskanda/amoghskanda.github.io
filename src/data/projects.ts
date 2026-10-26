export type Stage = readonly [title: string, subtitle: string, detail: string];
export type FlowKey = 'image' | 'spatial';
export type ProjectKey = 'perception' | 'labeling' | 'pipelines' | 'documents' | 'agents';
export interface Workflow {
  title: string;
  overview: string;
  decisions: string;
  evidence: string;
  stages: readonly Stage[];
  contextNote: string;
}
export interface Project extends Workflow {
  number: string;
  kind: string;
  anchor: string;
  flows?: Record<FlowKey, Workflow>;
}

const imageFlow: Workflow = {
  title: 'Static object detection & ML pipelines',
  overview: 'A computer vision and ML pipeline for detecting static objects in camera images, reconstructing their shapes, and preparing model outputs for inference.',
  decisions: 'I extended multi-scale feature aggregation to retain spatial detail and restructured prediction outputs for quantized inference. Training supervision and inference reconstruction have separate responsibilities.',
  evidence: 'Professional work at Bosch, described at a high level. Employer code, data, and implementation details remain private.',
  stages: [
    ['Images', 'Camera views', 'Camera images provide the visual input. Training annotations are prepared separately and aligned with the image view; they are targets for supervision, not extra inputs to the detection head.'],
    ['Features', 'Multi-scale', 'Visual features capture information at different spatial scales. I extended the feature aggregation to retain additional spatial detail for detection.'],
    ['Heatmaps', 'Dense outputs', 'The detector predicts dense confidence and geometric information across the image. Offsets, width, and semantic predictions support the later reconstruction of object shapes.'],
    ['Geometry', 'Link keypoints', 'During inference and evaluation, candidate keypoints are extracted from the prediction maps and linked into object polylines. This converts dense predictions into geometry that can be inspected.'],
    ['Evaluate', 'Shapes + errors', 'Predicted objects are compared with labeled geometry to inspect missed detections, incorrect matches, and classification errors. My inference-preparation work also addressed how prediction outputs were structured for quantization.']
  ],
  contextNote: 'Training supervision is a separate branch: prepared labels are compared with dense predictions to update the model. Keypoint extraction and polyline reconstruction are used during inference and evaluation.'
};

const spatialFlow: Workflow = {
  title: '3D detection & geometry',
  overview: 'A separate transformer-based workflow for object prediction in bird\'s-eye-view space.',
  decisions: 'My 3D work included the detection head, prediction matching, and visualization. A spatial representation supports object prediction; matching and visual inspection help assess the resulting geometry.',
  evidence: 'A high-level description of separate 3D perception work at Bosch. Employer code, data, and implementation details remain private.',
  stages: [
    ['Cameras', 'Visual input', 'Camera views supply image information for spatial perception. This is a separate workflow from the 2D heatmap detector.'],
    ['BEV space', 'Spatial view', 'Camera-derived features are represented in bird\'s-eye-view space so that the detection task can reason about scene geometry.'],
    ['3D objects', 'Set prediction', 'A transformer-based detection head predicts objects with geometric and semantic information. The output describes candidate objects in the scene.'],
    ['Geometry', 'Object shape', 'The predicted geometry describes the spatial extent of an object. Its representation supports comparison with labeled objects rather than being treated as an ordinary image bounding box.'],
    ['Evaluate', 'Match + inspect', 'Predictions are assigned to labeled objects for supervision and evaluation. Visualization helps inspect geometric correspondence and identify model errors.']
  ],
  contextNote: 'During training, predicted objects are matched with labeled objects for supervision. Visualization supports inspection of the resulting geometry. This is a separate example from the 2D heatmap workflow.'
};

export const projects: Record<ProjectKey, Project> = {
  perception: {
    ...imageFlow,
    number: '01',
    title: 'Static object detection & ML pipelines',
    kind: 'Professional case study',
    anchor: 'case-perception',
    flows: {
      image: imageFlow,
      spatial: spatialFlow
    }
  },
  labeling: {
    number: '02',
    title: 'RAG & LLM/VLM pipelines',
    kind: 'Professional case study',
    anchor: 'case-labeling',
    overview: 'A retrieval-augmented multimodal AI pipeline that connects context retrieval, VLM inference, and structured outputs. At Bosch, I applied this workflow to image auto-labeling.',
    decisions: 'RAG retrieves relevant examples as context for the VLM. LoRA adaptation happens offline, separately from each request. At request time, the adapted model generates proposals that are decoded into a structured form.',
    evidence: 'Professional multimodal AI work at Bosch, described at a high level. The application was image auto-labeling. Employer models, datasets, and implementation remain private.',
    stages: [
      ['Images', 'Task + views', 'Images and a task instruction define the request. The inputs must match the task and the adapted model\'s expected visual representation.'],
      ['RAG', 'Retrieve context', 'Embedding-based retrieval selects relevant labeled examples as context for the current request. This is the retrieval step in the RAG pipeline; selecting examples is distinct from updating the VLM\'s parameters.'],
      ['VLM', 'Adapted model', 'The vision-language model uses the visual input, instruction, and retrieved context to generate a task-specific response. Its task adaptation was performed beforehand.'],
      ['Outputs', 'Structured data', 'Model responses are decoded into structured proposals. In the auto-labeling application, these proposals describe image attributes for review.']
    ],
    contextNote: 'RAG supplies context at request time. LoRA adapts the VLM offline. Structured model outputs are prepared for review.'
  },
  pipelines: {
    number: '03',
    title: 'ML data pipelines',
    kind: 'Professional case study',
    anchor: 'case-pipelines',
    overview: 'SQL and PySpark workflows in Azure Databricks that turn raw annotations into consistent records for model training and evaluation.',
    decisions: 'Schema consistency, image-view alignment, and separate data splits matter as much as moving records. The workflow connects annotation geometry to the representation a model actually learns from.',
    evidence: 'Professional data-engineering work at Bosch, described at a high level. Employer records, storage layouts, and pipeline implementation remain private.',
    stages: [
      ['Raw labels', 'Source records', 'Raw annotation records enter the preparation workflow with their source context. Incremental processing supports incorporating changed records.'],
      ['Harmonize', 'SQL + PySpark', 'SQL and PySpark transformations in Azure Databricks standardize schemas and annotation values so downstream processing receives consistent records.'],
      ['Align', 'Views + geometry', 'Annotation coordinates are aligned with the image view used for learning. Region annotations are transformed into geometric representations suitable for the model task.'],
      ['Train data', 'Records + splits', 'Prepared records support model training and evaluation. Training, validation, and test selections are kept separate to avoid overlap.']
    ],
    contextNote: 'Images and annotations must follow consistent view and geometry conventions. Separate training, validation, and test records support model development and evaluation.'
  },
  documents: {
    number: '04',
    title: 'Agentic document comparison',
    kind: 'Professional case study',
    anchor: 'case-agentic',
    overview: 'A LangGraph-based agentic LLM pipeline with FastAPI that detects and logs text and visual differences between technical PDFs.',
    decisions: 'LangGraph coordinates the document-review workflow, while FastAPI provides the API interface. Multimodal LLMs compare text and visual content, and the workflow records the differences for review.',
    evidence: 'Professional work at Bosch using LangGraph, FastAPI, GPT-4o, and Gemini 2.5 Pro. This is a conceptual overview; employer documents, prompts, code, and implementation details remain private.',
    stages: [
      ['PDFs', 'Document pair', 'Technical documents provide the input for identifying text and visual changes between versions.'],
      ['Workflow', 'LangGraph + API', 'A LangGraph-based agentic pipeline coordinates document review. FastAPI provides an API interface for the workflow.'],
      ['Compare', 'LLM + vision', 'Multimodal LLMs, including GPT-4o and Gemini 2.5 Pro, compare text and visual content to identify differences.'],
      ['Change log', 'Human review', 'The workflow records detected text and visual differences so they can be inspected during document review.']
    ],
    contextNote: 'Conceptual document-review workflow: LangGraph orchestration, a FastAPI interface, multimodal LLM comparison, and a record of changes for review.'
  },
  agents: {
    number: '05',
    title: 'Agentic systems & evaluation',
    kind: 'Research & design',
    anchor: 'lab',
    overview: 'Agentic pipeline research into how a tool-using AI agent should recover when a write succeeds but its acknowledgement is lost, an observation is stale, or a tool times out.',
    decisions: 'The illustration compares a naive policy with checked recovery. A response alone does not establish the resulting state: the controller inspects recorded effects or refreshes its observation before deciding whether to retry.',
    evidence: 'The interactive prototype replays synthetic fixtures and exports their traces. A harness connected to real models is planned; this illustration is not evidence of model performance.',
    stages: [
      ['Task', 'Known fixture', 'A synthetic task defines the intended effect and the state checks used to judge completion. The environment starts from a known state.'],
      ['Fault', 'Inject failure', 'A fixture introduces a lost acknowledgement, a stale observation, or a timeout. The event trace makes the injected condition explicit.'],
      ['State check', 'Inspect effects', 'The checked policy examines whether the operation committed and whether its observation is current. It then reuses a result, refreshes state, or permits a bounded retry.'],
      ['Report', 'Trace + checks', 'The replay compares completion, recorded effects, and observation freshness. Its synthetic trace can be exported for inspection without claiming a real-model evaluation.']
    ],
    contextNote: 'Concept illustration only: all events are synthetic fixtures. No model inference, external tool writes, or deployed agent runs occur here. Real-model evaluation and any later VLA adapter are planned work.'
  }
};

export const workflowChoices: { key: ProjectKey; category: string; title: string[] }[] = [
  { key: 'perception', category: 'Autonomous driving', title: ['Static object detection', '& ML pipelines'] },
  { key: 'labeling', category: 'Multimodal AI', title: ['RAG & LLM/VLM', 'pipelines'] },
  { key: 'pipelines', category: 'ML infrastructure', title: ['ML data pipelines'] },
  { key: 'documents', category: 'LLM & agentic AI', title: ['Agentic document', 'comparison'] },
  { key: 'agents', category: 'Agentic systems', title: ['Agent evaluation', '& recovery'] },
];

export const initialProject: ProjectKey = 'labeling';

export function getWorkflow(key: ProjectKey, flow: FlowKey = 'image'): Project {
  const project = projects[key];
  return project.flows ? { ...project, ...project.flows[flow] } : project;
}
