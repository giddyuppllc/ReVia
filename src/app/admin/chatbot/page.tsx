import ChatbotManager from "@/components/ChatbotManager";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CHATBOT_CONFIG } from "@/lib/chatbotConfig";

export const dynamic = "force-dynamic";

export default async function AdminChatbotPage() {
  let config = await prisma.chatbotConfig.findUnique({ where: { id: "singleton" } });
  if (!config) {
    config = await prisma.chatbotConfig.create({ data: DEFAULT_CHATBOT_CONFIG });
  }

  const serialized = {
    ...config,
    updatedAt: config.updatedAt.toISOString(),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Chatbot</h1>
          <p className="text-sm text-neutral-500 mt-1">Control the research assistant&apos;s responses and guardrails.</p>
        </div>
      </div>

      <ChatbotManager initial={serialized} />
    </div>
  );
}
