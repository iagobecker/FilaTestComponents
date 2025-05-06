import { FaCamera, FaLaugh, FaMicrophone, FaPaperclip } from "react-icons/fa";

interface WhatsAppPreviewProps {
  previews: string[];
  renderWithVariables: (html: string, map: Record<string, string>) => string;
  variablesMap: Record<string, string>;
}

export function WhatsAppPreview({ previews, renderWithVariables, variablesMap }: WhatsAppPreviewProps) {
  return (
    <div className="w-[300px] h-[600px] rounded-[30px] overflow-hidden shadow-xl bg-[#ece5dd] flex flex-col border-[6px] border-black relative">
      <div className="h-[50px] bg-[#075e54] text-white flex items-center px-3">
        <div className="size-6 bg-gray-300 rounded-full mr-2"></div>
        <div className="flex flex-col text-sm">
          <span className="font-semibold">João Silva</span>
        </div>
        <div className="ml-auto flex space-x-2 text-white text-lg">
          <span>⋮</span>
        </div>
      </div>

      <div className="p-3 flex-1 overflow-y-auto space-y-4 text-sm">
        {previews.map((html, idx) => (
          <div key={idx}>
            <div className="relative max-w-[250px]">
              <div
                className="relative bg-[#dcf8c6] px-4 py-3 shadow text-sm leading-snug chat-bubble-right rounded-lg"
                dangerouslySetInnerHTML={{ __html: renderWithVariables(html, variablesMap) }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#e5ddd5] px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center px-3 py-2 bg-white rounded-full shadow w-[210px]">
            <FaLaugh className="text-gray-500 text-lg mr-3 flex-shrink-0" />
            <input
              placeholder="Mensagem"
              className="flex-1 text-sm outline-none placeholder-gray-500 bg-transparent min-w-0"
              disabled
            />
            <FaPaperclip className="text-gray-500 text-lg mx-2 flex-shrink-0" />
            <FaCamera className="text-gray-500 text-lg flex-shrink-0" />
          </div>
          <button className="w-10 h-10 bg-[#075e54] rounded-full flex items-center justify-center text-white text-base shadow">
            <FaMicrophone className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}