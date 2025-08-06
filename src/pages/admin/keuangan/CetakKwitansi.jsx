import html2pdf from "html2pdf.js";
import {
  terbilang,
  formatRupiah,
  formatTanggalLengkap,
} from "../../../utils/format";

const CetakKwitansi = (data, pembayaran) => {
  const nominal = pembayaran?.nominal || 0;
  const tanggal = pembayaran?.Tanggal || "-";
  const tglPembayaran = formatTanggalLengkap(tanggal);
  const nominalStr = formatRupiah(nominal);
  const terbilangStr =
    terbilang(nominal).charAt(0).toUpperCase() +
    terbilang(nominal).slice(1) +
    " Rupiah";

  const htmlContent = `<div style="font-family: 'Arial', sans-serif; width: 700px; color: #000;">

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div style="width:50%;">
        <strong style="font-size: 16px;">ANAK PANAH CYBERSCHOOL</strong>
        <p style="font-size: 12px; margin: 0;">Alamat: Jl. Raya Danau Poso Blok AA1. No. 27 - 29, Cluster Catalina, Gading Serpong. Medang, Pagedangan, Tangerang, Banten 15331.</p>
      </div>
      <div style="text-align: right;">
        <h2 style="color: #1976d2; margin: 0;font-size: 16px;">Kuitansi</h2>
        <div style="margin-top:10px;font-size: 12px;">No. Invoice<br><strong>${
          data?.id_invoice || "-"
        }</strong></div>
      </div>
    </div>

    <div style="display: flex; margin-bottom: 20px; border-bottom: 1px dashed #aaa;"></div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px; padding-bottom: 40px; margin-bottom: 20px;">
      <tr>
        <td style="width: 30%;">Telah Terima Dari</td>
        <td style="width: 5%;">:</td>
        <td style="font-weight: bold;padding-bottom: 15px;">${
          data?.nama || "-"
        }</td>
      </tr>
      <tr>
        <td style="padding-bottom: 15px;">Jumlah</td>
        <td style="padding-bottom: 15px;">:</td>
        <td style="background-color: #e8f4fb; font-weight: bold;padding-bottom: 15px;padding-left: 5px;">${nominalStr}</td>
      </tr>
    </table>

    <div style="display: flex; margin-bottom: 20px; border-bottom: 1px dashed #aaa;"></div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px;  margin-bottom: 20px;">
      <tr>
        <td style="padding-bottom: 15px;">Terbilang</td>
        <td style="padding-bottom: 15px;"> :</td>
        <td style="background-color: #e8f4fb; font-weight: bold;padding-bottom: 15px;padding-left: 5px;">${terbilangStr}</td>
      </tr>
      <tr>
        <td>Untuk Pembayaran</td>
        <td>:</td>
        <td>${pembayaran?.keterangan || "-"}</td>
      </tr>
    </table>

    <div style="display: flex; margin-bottom: 20px; border-bottom: 1px dashed #aaa;"></div>

    <!-- Kontak kiri + TTD kanan -->
    <div style="display: flex; justify-content: space-between; margin-top: 40px; font-size: 10px; color: #555;">
      <div style="text-align: left;">
        <div>Phone: 021-5959-9252</div>
        <div>Whatsapp: 0818777673</div>
        <div>Email: finance@anakpanah.sch.id</div>
      </div>
      <div style="text-align: center; font-size: 14px; color: #000;">
        <div>${tglPembayaran}</div><br><br><br>
        <strong>Anak Panah Cyberschool</strong>
      </div>
    </div>

  </div>`;

  html2pdf()
    .from(htmlContent)
    .set({
      margin: 10,
      filename: `kwitansi-${data?.nama || "siswa"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .save();
};

export default CetakKwitansi;
