import humanLineage from "@/data/human-lineage.json";
import sourceRegistry from "@/data/human-lineage-sources.json";
import EvolutionExplorer, {
  type HumanLineageDataset,
  type Source,
} from "./evolution-explorer";

export default function Home() {
  return (
    <EvolutionExplorer
      data={humanLineage as HumanLineageDataset}
      sources={sourceRegistry.sources as Source[]}
    />
  );
}
