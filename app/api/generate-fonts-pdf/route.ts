import { jsPDF } from "jspdf";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { fonts, originalText } = await req.json();

		if (!(fonts && Array.isArray(fonts)) || fonts.length === 0) {
			return NextResponse.json(
				{ error: "Fonts array is required" },
				{ status: 400 },
			);
		}

		const doc = new jsPDF();
		const pageWidth = doc.internal.pageSize.getWidth();
		const margin = 20;
		let yPosition = margin;

		doc.setFontSize(20);
		doc.text("Font Variations", pageWidth / 2, yPosition, { align: "center" });
		yPosition += 15;

		if (originalText) {
			doc.setFontSize(12);
			doc.text(`Original: ${originalText}`, margin, yPosition);
			yPosition += 10;
		}

		doc.setFontSize(14);
		fonts.forEach((font: string, index: number) => {
			if (yPosition > doc.internal.pageSize.getHeight() - margin) {
				doc.addPage();
				yPosition = margin;
			}

			doc.text(`${index + 1}. ${font}`, margin, yPosition);
			yPosition += 12;
		});

		const pdfBuffer = doc.output("arraybuffer");

		return new NextResponse(pdfBuffer, {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename="fonts-${Date.now()}.pdf"`,
			},
		});
	} catch (error) {
		console.error("Error generating PDF:", error);
		return NextResponse.json(
			{ error: "Failed to generate PDF" },
			{ status: 500 },
		);
	}
}
