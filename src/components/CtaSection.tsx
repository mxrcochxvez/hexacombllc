import AgencyContact from "@/components/AgencyContact";

export default function CtaSection({ initialMessage }: { initialMessage?: string }) {
  return <AgencyContact initialMessage={initialMessage} />;
}
