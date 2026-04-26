import QRCode from "qrcode"

export function buildUpiUri({
  vpa,
  name,
  amount,
  note,
  orderId,
}: {
  vpa: string
  name: string
  amount: number
  note: string
  orderId: string
}) {
  const params = new URLSearchParams({
    pa: vpa,
    pn: name,
    am: amount.toFixed(2),
    cu: "INR",
    tn: note.slice(0, 35),
    tr: orderId,
  })
  return `upi://pay?${params.toString()}`
}

export async function toQrSvg(uri: string): Promise<string> {
  return await QRCode.toString(uri, { type: "svg", margin: 1, width: 256 })
}
