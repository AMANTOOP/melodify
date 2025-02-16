"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Copy, CheckCircle } from "lucide-react";

export default function About() {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const email = "aman.code.clips@gmail.com";
  const upiLink =
    "upi://pay?pa=aman8486@ybl&pn=Aman%20Kumar%20Prasad&am=10.00&cu=INR&tn=Donation";
  const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    upiLink
  )}`;
  console.log(qrCodeURL);

  useEffect(() => {
    setVisible(true);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <Image
            src="/dp.jpg"
            alt="Your Name"
            width={200}
            height={200}
            className="mx-auto rounded-full mb-8"
          />
          <h1
            className={`text-4xl font-bold mb-4 transition-opacity duration-1000 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            About Me
          </h1>
          <p
            className={`text-xl mb-8 transition-opacity duration-1000 delay-500 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            Welcome to my music app! I'm passionate about creating amazing
            web applications for everyone.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Feedback and Suggestions
          </h2>
          <p className="mb-4">
            I'd love to hear your thoughts! Please send your feedback and
            suggestions to:
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg font-medium">{email}</span>
            <button
              onClick={copyEmail}
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        <div className="text-center my-16 justify-center flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Support My Work</h2>
          <p className="mb-4">
            If you enjoy using this app, consider making a small donation to
            support its development.
          </p>
          <p className="inline-block  text-black px-6 py-3 my-5 rounded-md">
            Donate ₹10<br></br>Scan qr code
          </p>
          <Image src="/qr.png" alt="qr code" width={100} height={100} className=""/>
        </div>
      </div>
    </div>
  );
}
