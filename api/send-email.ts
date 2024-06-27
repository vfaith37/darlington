// src/pages/api/send-email.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, message } = req.body;

    // Implement email sending logic here using your preferred method/library
    // e.g., nodemailer, sendgrid, etc.

    res.status(200).json({ message: "Email sent successfully" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
