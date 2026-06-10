import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Inquiries database file in /tmp-like directory or local workspace
  const INQUIRIES_FILE = path.join(process.cwd(), "inquiries.json");

  // Helper to load inquiries
  const loadInquiries = () => {
    try {
      if (fs.existsSync(INQUIRIES_FILE)) {
        return JSON.parse(fs.readFileSync(INQUIRIES_FILE, "utf-8"));
      }
    } catch (e) {
      console.error("Error loading inquiries file", e);
    }
    return [];
  };

  // Helper to save inquiries
  const saveInquiries = (inquiries: any) => {
    try {
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing inquiries file", e);
    }
  };

  // API Route - Get Bookings List
  app.get("/api/book", (req, res) => {
    const list = loadInquiries();
    res.json(list);
  });

  // API Route - Delete Booking request
  app.delete("/api/book/:id", (req, res) => {
    const { id } = req.params;
    const list = loadInquiries();
    const updated = list.filter((b: any) => b.id !== id);
    saveInquiries(updated);
    res.json({ success: true });
  });

  // API Route - Create Booking Submission
  app.post("/api/book", async (req, res) => {
    const { name, phone, email, serviceId, serviceName, date, time, message } = req.body;

    if (!name || !phone || !email || !serviceId || !date || !time) {
      return res.status(400).json({ error: "Missing required fields for booking." });
    }

    const newBooking = {
      id: `wvl-${Math.random().toString(36).substring(2, 9)}`,
      name,
      phone,
      email,
      serviceId,
      serviceName: serviceName || "Custom Treatment",
      date,
      time,
      message: message || "No additional instructions.",
      status: "Confirmed",
      createdAt: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    };

    // Save inquiry to inquiries.json
    const list = loadInquiries();
    list.unshift(newBooking);
    saveInquiries(list);

    // Prepare Email details
    const emailOwnerSubject = `New Appointment Request - ${name} | Wavelength Salon`;
    const emailCustomerSubject = `Your Royal Reservation at Wavelength Salon Kankurgachi is Confirmed!`;

    const htmlOwnerTemplate = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #D4AF37; padding: 30px; background-color: #FAF8F5; color: #0F0F0F;">
        <div style="text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px;">
          <h2 style="font-family: Georgia, serif; color: #0F0F0F; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 5px 0;">Wavelength Salon</h2>
          <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #D4AF37; font-weight: bold;">Luxury Booking Desk</span>
        </div>
        <h3 style="font-family: Georgia, serif; font-size: 20px; margin-top: 0; color: #D4AF37; border-left: 3px solid #D4AF37; padding-left: 10px;">New Booking Alert</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #555;">Greetings Admin! A new premium salon guest appointment has been registered online.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 13px;">
          <tr style="border-bottom: 1px solid #E5E2DD;">
            <td style="padding: 12px 0; font-weight: bold; width: 35%; text-transform: uppercase; color: #888; font-size: 11px;">Guest Name</td>
            <td style="padding: 12px 0; color: #0f0f0f; font-weight: bold;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E5E2DD;">
            <td style="padding: 12px 0; font-weight: bold; text-transform: uppercase; color: #888; font-size: 11px;">Contact Phone</td>
            <td style="padding: 12px 0; color: #0f0f0f; font-weight: bold;"><a href="tel:${phone}" style="color: #D4AF37; text-decoration: none;">${phone}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #E5E2DD;">
            <td style="padding: 12px 0; font-weight: bold; text-transform: uppercase; color: #888; font-size: 11px;">Email Address</td>
            <td style="padding: 12px 0; color: #0f0f0f;">${email}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E5E2DD;">
            <td style="padding: 12px 0; font-weight: bold; text-transform: uppercase; color: #888; font-size: 11px;">Luxury Service</td>
            <td style="padding: 12px 0; color: #ffffff; background-color: #0f0f0f; border-radius: 4px; padding-left: 10px; font-weight: bold;">${newBooking.serviceName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E5E2DD;">
            <td style="padding: 12px 0; font-weight: bold; text-transform: uppercase; color: #888; font-size: 11px;">Preferred Date</td>
            <td style="padding: 12px 0; color: #0f0f0f; font-weight: bold;">${date}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E5E2DD;">
            <td style="padding: 12px 0; font-weight: bold; text-transform: uppercase; color: #888; font-size: 11px;">Preferred Time</td>
            <td style="padding: 12px 0; color: #0f0f0f; font-weight: bold;">${time}</td>
          </tr>
          <tr>
            <td style="padding: 15px 0 5px 0; font-weight: bold; text-transform: uppercase; color: #888; font-size: 11px; vertical-align: top;">Guest Instructions</td>
            <td style="padding: 15px 0 5px 0; color: #555; font-style: italic; line-height: 1.5;">${message}</td>
          </tr>
        </table>
        
        <div style="border-top: 1px solid #D4AF37; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 11px; color: #888;">
          Wavelength Salon • Kankurgachi, Kolkata • +91 62901 92038
        </div>
      </div>
    `;

    const htmlCustomerTemplate = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #D4AF37; padding: 35px; background-color: #0F0F0F; color: #FAF8F5;">
        <div style="text-align: center; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 25px; margin-bottom: 30px;">
          <h1 style="font-family: Georgia, serif; color: #D4AF37; font-size: 26px; letter-spacing: 3px; font-weight: 300; margin: 0 0 5px 0; text-transform: uppercase;">WAVELENGTH</h1>
          <span style="font-size: 8px; text-transform: uppercase; letter-spacing: 5px; color: #FAF8F5; opacity: 0.6;">LUXURY BEAUTY SANCTUARY • KOLKATA</span>
        </div>
        
        <h2 style="font-family: Georgia, serif; font-size: 20px; font-style: italic; font-weight: 300; margin-top: 0; color: #D4AF37;">Dear ${name},</h2>
        
        <p style="font-size: 13.5px; line-height: 1.7; color: rgba(255,255,255,0.8); font-weight: 300;">
          Thank you for choosing Wavelength Salon—Kankurgachi's premier luxury beauty destination. We are honored to register your booking of <strong>${newBooking.serviceName}</strong>.
        </p>
        
        <p style="font-size: 13px; line-height: 1.7; color: rgba(255,255,255,0.7); font-weight: 300; margin-bottom: 25px;">
          Our salon manager has scheduled a direct callback callback within the hour to verify your slot selection. Here are your booking details for your files:
        </p>
        
        <div style="background-color: #141414; border: 1px solid rgba(212,175,55,0.15); border-left: 3px solid #D4AF37; padding: 20px 25px; margin: 25px 0;">
          <p style="margin: 0 0 10px 0; font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 400; text-transform: uppercase; letter-spacing: 1px;">Selected Luxury Ritual</p>
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #D4AF37; font-weight: bold; font-family: Georgia, serif;">${newBooking.serviceName}</p>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: rgba(255,255,255,0.855);">
            <tr>
              <td style="padding: 6px 0; width: 40%; font-weight: 300; color: rgba(255,255,255,0.5);">Reservation Date:</td>
              <td style="padding: 6px 0; font-weight: bold;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 300; color: rgba(255,255,255,0.5);">Hour of Grace:</td>
              <td style="padding: 6px 0; font-weight: bold;">${time}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 300; color: rgba(255,255,255,0.5);">Registry ID:</td>
              <td style="padding: 6px 0; font-family: monospace; font-size: 12px; color: #D4AF37;">${newBooking.id}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 13px; line-height: 1.7; color: rgba(255,255,255,0.75); font-weight: 300;">
          Wavelength prides itself on meticulous customer care, premium authentic products (Kerastase, L'Oreal, Dior, Aveda), and absolute sterile protocols. We look forward to giving you a majestic makeover.
        </p>
        
        <p style="font-size: 13px; margin-top: 30px; color: rgba(255,255,255,0.6); font-weight: 300;">
          With couture warm regards,<br />
          <strong style="color: #D4AF37; font-family: Georgia, serif; font-weight: bold;">Wavelength Registry Desk</strong>
        </p>
        
        <div style="border-top: 1px solid rgba(255,255,255,0.05); margin-top: 35px; padding-top: 25px; text-align: center; font-size: 11px; color: rgba(255,255,255,0.4);">
          Above Maa Durga Chemist, opposite ESI Kankurgachi, Scheme VII M, Kolkata<br />
          Phone: +91 62901 92038 • Live Daily 10 AM – 8:30 PM
        </div>
      </div>
    `;

    // Dispatch emails using Nodemailer
    try {
      const mailConfig = {
        host: process.env.SMTP_HOST || "smtp.ethereal.email",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER || "",
          pass: process.env.SMTP_PASS || ""
        }
      };

      let transporter;
      if (!mailConfig.auth.user) {
        // Ethereal auto-generated test account for non-crashing behavior
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
        console.log("No SMTP configured. Generated Ethereal Test Account:", testAccount.user);
      } else {
        transporter = nodemailer.createTransport(mailConfig);
      }

      // Send to owner
      await transporter.sendMail({
        from: `"Wavelength Luxury Website" <${process.env.SMTP_USER || "noreply@wavelengthsalon.com "}>`,
        to: process.env.SALON_OWNER_EMAIL || "wavelengthkankurgachi@gmail.com",
        subject: emailOwnerSubject,
        html: htmlOwnerTemplate
      });

      // Send to customer
      await transporter.sendMail({
        from: `"Wavelength Salon Registry" <${process.env.SMTP_USER || "noreply@wavelengthsalon.com"}>`,
        to: email,
        subject: emailCustomerSubject,
        html: htmlCustomerTemplate
      });

      res.json({ success: true, booking: newBooking, emailSent: true });
    } catch (e: any) {
      console.error("Nodemailer dispatch failed, but booking was saved to database.", e);
      res.json({ success: true, booking: newBooking, emailSent: false, error: e.message });
    }
  });

  // Serve static files / index in production; Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Luxury full-stack server running on port ${PORT}`);
  });
}

startServer();
