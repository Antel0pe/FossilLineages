import lineage from "@/data/lineage.json";
import sourceRegistry from "@/data/human-lineage-sources.json";
import EvolutionExplorer, {
  type LineageDataset,
  type Source,
} from "./evolution-explorer";

export default function Home() {
  return (
    <EvolutionExplorer
      data={lineage as LineageDataset}
      sources={sourceRegistry.sources as Source[]}
    />
  );
}
