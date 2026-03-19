import { useState } from 'react';
import { FileDown, Loader } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { slugify, formatDate, getStatusIcon, getImpactoLabel } from '../utils/helpers';

export default function PdfReport({ diagnostico, placeData, gaugeRef }) {
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageW = 210;
      let y = 15;

      // Header
      doc.setFontSize(20);
      doc.setTextColor(26, 115, 232);
      doc.text('RADAR PRESENCA', 14, y);
      doc.setFontSize(9);
      doc.setTextColor(95, 99, 104);
      doc.text(`KeepCoding / GRZ — Google Risco Zero`, 14, y + 6);
      doc.text(`Gerado em: ${formatDate()}`, pageW - 14, y + 6, { align: 'right' });
      y += 16;

      doc.setDrawColor(218, 220, 224);
      doc.line(14, y, pageW - 14, y);
      y += 8;

      // Business info
      const name = placeData.displayName?.text || 'Negocio';
      doc.setFontSize(16);
      doc.setTextColor(32, 33, 36);
      doc.text(name, 14, y);
      y += 7;
      doc.setFontSize(10);
      doc.setTextColor(95, 99, 104);
      if (placeData.formattedAddress) {
        doc.text(placeData.formattedAddress, 14, y);
        y += 5;
      }
      const cat = placeData.primaryTypeDisplayName?.text || '';
      const rating = placeData.rating ? `Nota: ${placeData.rating} (${placeData.userRatingCount || 0} avaliacoes)` : '';
      if (cat || rating) {
        doc.text([cat, rating].filter(Boolean).join('  |  '), 14, y);
        y += 5;
      }
      y += 4;

      // Score
      const { score, nivel, pontosObtidos, pesoTotal } = diagnostico;
      doc.setFontSize(14);
      doc.setTextColor(32, 33, 36);
      doc.text('SCORE:', 14, y);
      const nivelColor = hexToRgb(nivel.cor);
      doc.setTextColor(nivelColor.r, nivelColor.g, nivelColor.b);
      doc.setFontSize(28);
      doc.text(`${score}`, 42, y);
      doc.setFontSize(12);
      doc.text(`/ 100  (${nivel.label})`, 60, y);
      y += 5;
      doc.setFontSize(10);
      doc.setTextColor(95, 99, 104);
      doc.text(`${pontosObtidos} de ${pesoTotal} pontos obtidos`, 14, y);
      y += 10;

      // Gauge screenshot
      if (gaugeRef?.current) {
        try {
          const canvas = await html2canvas(gaugeRef.current, { scale: 2, backgroundColor: '#ffffff' });
          const imgData = canvas.toDataURL('image/png');
          const imgW = 50;
          const imgH = (canvas.height / canvas.width) * imgW;
          doc.addImage(imgData, 'PNG', pageW - 14 - imgW, y - 45, imgW, imgH);
        } catch {}
      }

      doc.setDrawColor(218, 220, 224);
      doc.line(14, y, pageW - 14, y);
      y += 8;

      // Criteria table
      doc.setFontSize(13);
      doc.setTextColor(32, 33, 36);
      doc.text('DIAGNOSTICO POR CRITERIO', 14, y);
      y += 7;

      for (const c of diagnostico.criterios) {
        if (y > 270) {
          doc.addPage();
          y = 15;
        }
        const { emoji } = getStatusIcon(c.status);
        doc.setFontSize(9);
        doc.setTextColor(95, 99, 104);
        doc.text(`${c.id}`, 14, y);
        doc.setTextColor(32, 33, 36);
        doc.text(`${c.nome}`, 26, y);
        doc.text(`${c.pontos}/${c.peso}`, pageW - 30, y);
        const statusText = c.status === 'verde' ? 'OK' : c.status === 'amarelo' ? 'ATENCAO' : 'FALHA';
        const stColor = c.status === 'verde' ? { r: 52, g: 168, b: 83 } :
          c.status === 'amarelo' ? { r: 251, g: 188, b: 4 } : { r: 234, g: 67, b: 53 };
        doc.setTextColor(stColor.r, stColor.g, stColor.b);
        doc.text(statusText, pageW - 14, y, { align: 'right' });
        y += 5;
      }
      y += 5;

      // Action plan
      if (diagnostico.acoesPriorizadas.length > 0) {
        if (y > 240) {
          doc.addPage();
          y = 15;
        }
        doc.setDrawColor(218, 220, 224);
        doc.line(14, y, pageW - 14, y);
        y += 8;
        doc.setFontSize(13);
        doc.setTextColor(32, 33, 36);
        doc.text('PLANO DE ACAO', 14, y);
        y += 7;

        diagnostico.acoesPriorizadas.forEach((a, i) => {
          if (y > 270) {
            doc.addPage();
            y = 15;
          }
          doc.setFontSize(9);
          doc.setTextColor(32, 33, 36);
          doc.text(`${i + 1}. ${a.nome} (Impacto: ${getImpactoLabel(a.impacto)})`, 14, y);
          y += 4;
          doc.setTextColor(95, 99, 104);
          const lines = doc.splitTextToSize(a.acao, pageW - 34);
          doc.text(lines, 20, y);
          y += lines.length * 4 + 3;
        });
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(95, 99, 104);
      doc.text('Diagnostico gerado por GRZ — Google Risco Zero | keepcoding.net.br', pageW / 2, 290, { align: 'center' });

      const filename = `diagnostico-${slugify(placeData.displayName?.text || 'negocio')}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    }
    setGenerating(false);
  }

  return (
    <button onClick={handleGenerate} disabled={generating}
      className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-60 cursor-pointer shadow-sm">
      {generating ? <Loader size={18} className="animate-spin" /> : <FileDown size={18} />}
      {generating ? 'Gerando PDF...' : 'Gerar Relatorio PDF'}
    </button>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
}
