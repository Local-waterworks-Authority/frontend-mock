"use client";
import React from "react";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceTemplate from "./components/InvoiceTemplate";
import MeterList from "./components/MeterList";
import dayjs from "dayjs";
import EscPosEncoder from "@manhnd/esc-pos-encoder";
import { useQuery } from "@tanstack/react-query";
import meterService from "./services/meter";
import { TMeter } from "./types";

export type TInvoiceForm = {
  meterId: number;
  meterName: string;
  currentUsage: number;
  prevUsage: number;
  isPrivilege: boolean;
  privilegeUnitDiscount: number;
};

export type TInvoicePrint = {
  meterId: number;
  img: HTMLImageElement;
  height: number;
};

export default function Home() {
  const { data } = useQuery({
    queryKey: ["meterList"],
    queryFn: meterService.inquiryMeterGroup,
  });

  // const meterList: TMeterList[] = MeterListData;
  const [invoicePrint, setInvoicePrint] = React.useState<
    TInvoicePrint | undefined
  >(undefined);
  const [selectedMeter, setSelectedMeter] = React.useState<TMeter | undefined>(
    undefined
  );
  const [currentInfo, setCurrentInfo] = React.useState<TInvoiceForm>({
    meterId: 0,
    meterName: "",
    currentUsage: 0,
    prevUsage: 0,
    isPrivilege: false,
    privilegeUnitDiscount: 0,
  });
  const encoder = new EscPosEncoder().setPinterType(80);

  const onResetForm = () => {
    setCurrentInfo({
      meterId: 0,
      meterName: "",
      currentUsage: 0,
      prevUsage: 0,
      isPrivilege: false,
      privilegeUnitDiscount: 0,
    });
    setInvoicePrint(undefined);
  };

  const onPrintInvoice = async () => {
    try {
      console.log("invoicePrint", invoicePrint);

      if (!invoicePrint) {
        return;
      }
      const encoderRes = encoder
        .image(invoicePrint.img, 560, invoicePrint.height, "atkinson")
        .cut();
      const result = encoderRes.encode();

      const usb = await window.navigator.usb.requestDevice({
        filters: [{ vendorId: 1155, productId: 22339 }],
      });

      await usb.open();
      await usb.claimInterface(0);

      usb.transferOut(1, result);
    } catch (err) {
      console.error("Error in handlePrint:", err);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex justify-center gap-8">
        <MeterList
          meterList={data || []}
          selectedMeter={selectedMeter}
          setSelectedMeter={setSelectedMeter}
          resetForm={onResetForm}
        />
        <InvoiceForm
          currentInfo={currentInfo}
          setCurrentInfo={setCurrentInfo}
          meterId={selectedMeter?.id || 0}
          meterName={selectedMeter?.meter_name || ""}
        />
        <div className="space-y-4">
          <InvoiceTemplate
            customerName={currentInfo?.meterName || ""}
            cycleAt={new Date(new Date().setMonth(new Date().getMonth() - 1))}
            createdAt={new Date()}
            invoiceId={
              dayjs().format("YYYYMM") +
              String(currentInfo?.meterId).padStart(4, "0")
            }
            meterId={currentInfo?.meterId || 0}
            currentUsage={currentInfo.currentUsage}
            prevUsage={currentInfo.prevUsage}
            unitPrice={3}
            isPrivilege={currentInfo.isPrivilege}
            privilegeUnitDiscount={currentInfo.privilegeUnitDiscount}
            setInvoicePrint={setInvoicePrint}
          />
          <button
            className="w-full bg-blue-500 text-white rounded-md p-2 disabled:opacity-50"
            disabled={currentInfo.meterId === 0}
            onClick={onPrintInvoice}
          >
            พิมพ์ใบแจ้งค่าน้ำ
          </button>
        </div>
      </div>
    </div>
  );
}
