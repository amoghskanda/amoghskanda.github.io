import type { Stage } from './projects';

export type InternshipKey = 'scene' | 'data';
export const internshipPeriod = 'June 2023 to June 2024';

export interface InternshipTopic {
  category: string;
  title: string;
  summary: string;
  contribution: string;
  tags: string[];
  note: string;
  stages: readonly Stage[];
}

export const internshipTopics: Record<InternshipKey, InternshipTopic> = {
  scene: {
    category: 'Autonomous-driving ML',
    title: 'Neural rendering & synthetic scenes',
    summary: 'I reconstructed scenes with NeRFs, edited camera poses and actor trajectories, and explored LiDAR simulation using depth and intensity.',
    contribution: 'Pose and trajectory edits in reconstructed scenes, PyTorch-based geometry, and experiment review in TensorBoard and Weights & Biases.',
    tags: ['Python', 'PyTorch', 'NeRFs', '3D geometry'],
    note: 'Related sensor experiments used depth and intensity to generate LiDAR-like point clouds.',
    stages: [
      ['Scene inputs', 'Images + poses', 'Images, camera poses, and available scene geometry provide the starting point for reconstruction.'],
      ['Reconstruct', 'Neural scene', 'Fit a neural scene representation from recorded views. Reconstruction precedes pose editing and rendering.'],
      ['Edit poses', 'Camera + actors', 'Change the camera viewpoint or an actor trajectory using 3D transformations in the reconstructed scene. This was a focus of my internship work.'],
      ['Render views', 'Synthetic views', 'Render alternative camera views for synthetic-data experiments. Separate sensor-output experiments used depth and intensity for LiDAR-like points.'],
      ['Inspect', 'Geometry + artifacts', 'Review the rendered geometry and visual artifacts, and compare experiment outputs with TensorBoard and Weights & Biases.']
    ]
  },
  data: {
    category: 'ML data & operations',
    title: 'Dataset tooling & ML operations',
    summary: 'I built Python workflows to ingest and transform annotated datasets, then inspect samples and labels in FiftyOne by Voxel51.',
    contribution: 'Data ingestion, transformation, and visualization for annotated driving datasets. I also connected Azure ML pipeline events to Microsoft Teams through webhooks.',
    tags: ['Python', 'ETL', 'FiftyOne', 'Azure ML'],
    note: 'Pipeline-run notifications were a separate operations integration alongside the dataset workflow.',
    stages: [
      ['Ingest', 'Dataset records', 'Bring images, annotations, and associated records into a Python data workflow for inspection.'],
      ['Transform', 'Python ETL', 'Transform the records into a consistent representation so samples and their annotations can be viewed together.'],
      ['Visualize', 'FiftyOne', 'Use FiftyOne to explore dataset samples and inspect the associated visual labels.'],
      ['Review', 'Samples + labels', 'Inspect individual examples to understand the data and annotation geometry. The public tool demo illustrates FiftyOne rather than exposing workplace data.']
    ]
  }
};
