"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FontsPage() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState("");
  const [generatedFonts, setGeneratedFonts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to generate fonts.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-fonts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, style }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate fonts");
      }

      const data = await response.json();
      setGeneratedFonts(data.fonts || []);
      
      toast({
        title: "Success",
        description: "Font variations generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate fonts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (fontText: string) => {
    navigator.clipboard.writeText(fontText);
    toast({
      title: "Copied",
      description: "Font text copied to clipboard!",
    });
  };

  const handleDownloadPDF = async () => {
    if (generatedFonts.length === 0) {
      toast({
        title: "No Content",
        description: "Generate fonts first before downloading.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/generate-fonts-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fonts: generatedFonts, originalText: text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fonts-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "PDF downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-[calc(100svh-var(--header-height))] flex-1 flex-col overflow-hidden md:h-[calc(100svh-var(--header-height)-1rem)]">
      <div className="h-full overflow-y-auto">
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <h1 className="pt-4 sm:pt-[30px] mb-8 sm:mb-12 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center font-[family-name:var(--font-rock-salt)]">
              FONT FORGE
            </h1>

            {/* Input Section */}
            <div className="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Font Variations</CardTitle>
                  <CardDescription>
                    Enter your text and optional style preferences to generate creative font variations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text">Text</Label>
                    <Textarea
                      id="text"
                      placeholder="Enter the text you want to stylize..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="style">Style (optional)</Label>
                    <Input
                      id="style"
                      placeholder="e.g., bold, elegant, gothic, modern..."
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Generate Fonts
                    </Button>
                    {generatedFonts.length > 0 && (
                      <Button
                        onClick={handleDownloadPDF}
                        variant="outline"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            {generatedFonts.length > 0 && (
              <div className="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto space-y-4">
                <h2 className="text-2xl font-bold text-center mb-6">Generated Variations</h2>
                {generatedFonts.map((font, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-lg flex-1 break-words">{font}</p>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleCopy(font)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && generatedFonts.length === 0 && (
              <div className="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto text-center text-muted-foreground py-12">
                <p>Enter text above and click "Generate Fonts" to see creative font variations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
