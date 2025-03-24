import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CardMonitorProps {
    primaryColor: string;
    overlayColor: string;
    fontColor: string;
}

export default function CardMonitor({ primaryColor, overlayColor, fontColor }: CardMonitorProps) {
    return (
        <div className="flex flex-col pr-30 gap-6 items-center max-w-[800px] w-full mx-auto">
            {/* Card - Monitor */}
            <Card className="border-2 border-gray-300 p-4 w-full max-w-[600px] min-h-[250px] flex flex-col items-center shadow-lg rounded-lg" style={{ backgroundColor: primaryColor }}>
                <CardHeader className="text-white font-bold text-xl text-center">
                    Aparência do Monitor
                </CardHeader>
                <CardContent className="bg-white p-6 rounded-md shadow-md w-[90%] text-center" style={{ background: overlayColor }}>
                    <p className="text-4xl font-bold" style={{ color: fontColor }}>B89</p>
                    <p className="text-xl text-gray-600">ALESSANDRA MELO</p>
                </CardContent>
            </Card>

            {/* Card - Web */}
            <Card className="border-2 border-gray-300 p-4 w-full max-w-[600px] min-h-[250px] flex flex-col items-center shadow-lg rounded-lg" style={{ backgroundColor: primaryColor }}>
                <CardHeader className="text-white font-bold text-xl text-center">
                    Aparência do WEB
                </CardHeader>
                <CardContent className="bg-white p-6 rounded-md shadow-md w-[90%] text-center" style={{ background: overlayColor }}>
                    <p className="text-4xl font-bold" style={{ color: fontColor }}>B89</p>
                    <p className="text-xl text-gray-600">ALESSANDRA MELO</p>
                </CardContent>
            </Card>
        </div>
    );
}
