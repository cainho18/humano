import { AnswersProvider } from "@/lib/state/AnswersContext";
import { FlowController } from "@/components/flow/FlowController";

export default function Home() {
  return (
    <AnswersProvider>
      <main className="min-h-dvh w-full">
        <FlowController />
      </main>
    </AnswersProvider>
  );
}
