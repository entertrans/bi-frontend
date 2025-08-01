import React from "react";

const InvoicePreview = () => {
  const data = {
    clientName: "John Smith",
    companyName: "ABC Corporation",
    address: "123 Elm Street Green Valley",
    phone: "(555) 555-5555",
    email: "john.smith@email.com",
    invoiceNumber: "SI2023-001",
    invoiceDate: "September 26, 2030",
    items: [
      { desc: "Logo Design", qty: "1 project", rate: 500, total: 500 },
      { desc: "Brochure Design", qty: "2 projects", rate: 750, total: 1500 },
      { desc: "Website Redesign", qty: "1 project", rate: 800, total: 800 },
      { desc: "Social Media Graphics", qty: "5 hours", rate: 50, total: 250 },
    ],
  };

  const subtotal = data.items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div
      id="kwitansi-cetak"
      className="max-w-3xl mx-auto p-8 bg-white text-black"
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">INVOICE</h1>
          <p className="mt-2">
            <strong>Client Name:</strong> {data.clientName}
          </p>
          <p>
            <strong>Company Name:</strong> {data.companyName}
          </p>
          <p>
            <strong>Billing Address:</strong> {data.address}
          </p>
          <p>
            <strong>Phone:</strong> {data.phone}
          </p>
          <p>
            <strong>Email:</strong> {data.email}
          </p>
        </div>
        <div className="text-right">
          <img
            src="https://via.placeholder.com/80x80.png?text=Logo"
            alt="Logo"
            className="mb-2"
          />
          <p>
            <strong>Invoice Number:</strong> {data.invoiceNumber}
          </p>
          <p>
            <strong>Invoice Date:</strong> {data.invoiceDate}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Service Details:</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-yellow-300 text-left">
              <th className="p-2 border">No</th>
              <th className="p-2 border">Description of Service</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Rate per Hour ($)</th>
              <th className="p-2 border">Total ($)</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={i} className="bg-gray-100">
                <td className="p-2 border">{i + 1}</td>
                <td className="p-2 border">{item.desc}</td>
                <td className="p-2 border">{item.qty}</td>
                <td className="p-2 border">${item.rate.toFixed(2)}</td>
                <td className="p-2 border">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 flex justify-end">
        <div className="w-1/3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t mt-2 pt-2">
            <span>Total Amount Due</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="mt-8">
        <h3 className="font-semibold">Terms and Conditions:</h3>
        <ul className="list-disc ml-6 mt-2 text-sm">
          <li>Payment is due upon receipt of this invoice.</li>
          <li>Late payments may incur additional charges.</li>
          <li>Please make checks payable to Your Graphic Design Studio.</li>
        </ul>
      </div>
    </div>
  );
};

export default InvoicePreview;
