"use client";

import constants from "@/lib/constants";
import { Contact, Currency, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Script from "next/script";
import { Button } from "../ui/button";

export default function Payment() {
  const amount = 100;
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  async function handlePayment() {
    setIsProcessing(true);
    try {
      const response = await fetch("api/payment", { method: "POST" });
      const { orderId = null } = await response.json();
      const options = {
        key: process.env.key_id,
        amount: parseFloat("100") * 100,
        currency: "INR",
        name: "name",
        description: "description",
        order_id: orderId,
        notify: {
          sms: true,
          email: true,
        },
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          const res = await result.json();
          if (res.isOk) alert("payment succeed");
          else {
            alert(res.message);
          }
        },
        prefill: {
          name: "name",
          email: "email",
          contact: 9999999999,
        },
        options: {
          checkout: {
            method: {
              netbanking: 1,
              card: 1,
              upi: 0,
              wallet: 0,
            },
          },
        },
        theme: {
          color: "#3399cc",
        },
      };
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        console.error(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.error("Payment failed", error);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="flex flex-col gap-6 w-full sm:w-80">
        <Button onClick={handlePayment}>Pay</Button>
      </div>
    </>
  );
}
