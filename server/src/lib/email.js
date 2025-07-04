"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplate = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = async (to, subject, template) => {
    const transporter = nodemailer_1.default.createTransport(process.env.EMAIL_SERVER);
    const htmlTemplate = (0, exports.EmailTemplate)(template);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: htmlTemplate,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('🚀 Email sent successfully!');
    }
    catch (error) {
        console.error(error);
    }
};
exports.sendMail = sendMail;
const EmailTemplate = (children) => `
  <body class="reset-styles w-full text-center font-sans bg-gray-100">
    <table class="mx-auto max-w-lg bg-white rounded-lg shadow-md border border-gray-200">
      <tr>
        <td class="p-6 text-center bg-blue-500 text-white">
          <h1 class="text-xl font-bold">Tribelike</h1>
        </td>
      </tr>
      <tr>
        <td class="p-6">
          <!-- Dynamic Content -->
          ${children}
        </td>
      </tr>
      <tr>
        <td class="p-4 bg-gray-100 text-center">
          <p class="text-sm text-gray-600">
            The Toplocs Organisation
          </p>
        </td>
      </tr>
    </table>
    <table class="max-w-lg mt-4 mx-auto">
      <tr>
        <td class="px-8 pb-2 text-center text-xs text-gray-500">
          <p>
            You’re receiving this email because you signed up for our service. If you didn’t, please ignore this email.
          </p>
        </td>
      </tr>
    </table>
  </body>

  <style>
    body {
      width: 100%;
      height: 100%;
    }
    .reset-styles * {
      all: unset;
      display: revert;
    }
    .font-sans {
      font-family: Arial, sans-serif;
    }
    .bg-gray-100 {
      background-color: #f9f9f9;
    }
    .bg-white {
      background-color: #ffffff;
    }
    .bg-blue-500 {
      background-color: #3b82f6;
    }
    .hover\\:bg-blue-700:hover {
      background-color: #1d4ed8;
    }
    .text-white {
      color: #ffffff;
    }
    .text-gray-700 {
      color: #333333;
    }
    .text-gray-600 {
      color: #555555;
    }
    .text-gray-500 {
      color: #999999;
    }
    .rounded {
      border-radius: 0.25rem;
    }
    .rounded-lg {
      border-radius: 0.5rem;
    }
    .shadow-md {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .border {
      border-width: 1px;
    }
    .border-gray-200 {
      border-color: #e5e5e5;
    }
    .mx-auto {
      margin: 0 auto;
    }
    .p-4 {
      padding: 1rem;
    }
    .p-6 {
      padding: 1.5rem;
    }
    .pb-2 {
      padding-bottom: 0.5rem;
    }
    .py-2 {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .px-8 {
      padding-left: 2rem;
      padding-right: 2rem;
    }
    .px-16 {
      padding-left: 4rem;
      padding-right: 4rem;
    }
    .text-center {
      text-align: center;
    }
    .text-base {
      font-size: 1rem;
    }
    .text-sm {
      font-size: 0.875rem;
    }
    .text-xs {
      font-size: 0.75rem;
    }
    .leading-relaxed {
      line-height: 1.625;
    }
    .font-bold {
      font-weight: bold;
    }
    .text-xl {
      font-size: 1.25rem;
    }
    .mt-4 {
      margin-top: 1rem;
    }
    .inline-block {
      display: inline-block;
    }
    .w-full {
      width: 100%;
    }
    .max-w-lg {
      max-width: 32rem;
    }
  </style>
`;
exports.EmailTemplate = EmailTemplate;
