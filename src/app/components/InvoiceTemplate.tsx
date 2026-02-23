"use client";
import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { toJpeg } from "html-to-image";
import { TInvoicePrint } from "../page";

type TInvoiceTemplateProps = {
  customerName: string;
  cycleAt: Date;
  createdAt: Date;
  invoiceId: string;
  meterId: number;
  currentUsage: number;
  prevUsage: number;
  unitPrice: number;
  isPrivilege: boolean;
  privilegeUnitDiscount: number;
  setInvoicePrint: React.Dispatch<
    React.SetStateAction<TInvoicePrint | undefined>
  >;
};

export default function InvoiceTemplate({
  customerName,
  cycleAt,
  createdAt,
  invoiceId,
  meterId,
  currentUsage,
  prevUsage,
  unitPrice,
  isPrivilege,
  privilegeUnitDiscount,
  setInvoicePrint,
}: TInvoiceTemplateProps) {
  const [elementReady, setElementReady] = React.useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const mapMonthToString: { [key: number]: string } = {
    0: "มกราคม",
    1: "กุมภาพันธ์",
    2: "มีนาคม",
    3: "เมษายน",
    4: "พฤษภาคม",
    5: "มิถุนายน",
    6: "กรกฎาคม",
    7: "สิงหาคม",
    8: "กันยายน",
    9: "ตุลาคม",
    10: "พฤศจิกายน",
    11: "ธันวาคม",
  };

  const formattedDate = (date: Date) => {
    const formatted = dayjs(date).locale("th").format("DD MMMM");
    return formatted + " " + (dayjs(date).get("year") + 543);
  };
  const formattedMeterId = String(meterId).padStart(4, "0");
  const formmatedUsage = (usage: number) => {
    return String(usage).padStart(7, "0");
  };

  const totalUsage = currentUsage - prevUsage;
  const totalAmount = totalUsage * unitPrice;

  const totalDiscount = isPrivilege
    ? Math.min(privilegeUnitDiscount * unitPrice, totalAmount)
    : 0;

  const netPay = totalAmount - totalDiscount;

  useEffect(() => {
    if (elementRef.current) {
      setElementReady(true);
    }
  }, []); // Runs once when the component mounts

  useEffect(() => {
    const generateInvoiceImage = async () => {
      if (elementReady && elementRef.current) {
        const Invoice = elementRef.current;
        const invoiceHeight = Invoice.clientHeight;
        const adjustedHeight = Math.ceil((invoiceHeight * 1.75) / 8) * 8;
        const dataUrl = await toJpeg(elementRef.current, {
          cacheBust: false,
        });
        const img = document.createElement("img");
        img.src = dataUrl;
        setInvoicePrint({
          meterId: meterId,
          img: img,
          height: adjustedHeight,
        });
      }
    };

    generateInvoiceImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    elementReady,
    customerName,
    cycleAt,
    createdAt,
    invoiceId,
    meterId,
    currentUsage,
    prevUsage,
    unitPrice,
    isPrivilege,
    privilegeUnitDiscount,
  ]);

  return (
    <div>
      <h2 className="text-center text-lg font-bold">ใบแจ้งค่าน้ำ</h2>
      <div className="items-center mt-2 flex border font-sarabun">
        <div className="w-[80mm] h-auto bg-white px-4" ref={elementRef}>
          {/* Header */}
          <div className="flex-col items-center justify-center">
            <div className="mx-auto mb-2">
              <img src="/logo.jpeg" alt="LWA Logo" width={40} height={40} />
            </div>
            <p className="text-l font-semibold">ใบแจ้งค่าน้ำประปา</p>
            <p className="text-sm">บ้านร้องวัวแดงหมู่ที่ 7</p>
          </div>

          <div className="flex mt-4 mb-1">ชื่อผู้ใช้น้ำ</div>
          <div className="flex justify-center w-[70mm] mx-auto font-semibold border border-black">
            {customerName}
          </div>
          {/* row 1 */}
          <div className="flex columns-2 justify-center items-center my-1">
            <div className="w-3/5 flex ">ค่าน้ำเดือน</div>
            <div className="w-full flex ml-6">
              {mapMonthToString[cycleAt.getMonth()] +
                " " +
                (cycleAt.getFullYear() + 543)}
            </div>
          </div>
          {/* row 2 */}
          <div className="flex columns-2 justify-center items-center my-1">
            <div className="w-3/5 flex ">วันแจ้งค่าน้ำ</div>
            <div className="w-full flex ml-6">{formattedDate(createdAt)}</div>
          </div>
          <div className="flex justify-center items-center mt-4">
            <table>
              <thead>
                <tr className="border border-black font-medium">
                  <th className="w-[40mm]">เลขที่ใบแจ้งค่าน้ำ</th>
                  <th className="w-[30mm]">เลขที่มาตร</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td>{invoiceId} </td>
                  <td>{formattedMeterId}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Info */}
          <div className="flex justify-center my-4">
            <table className="w-full">
              <tbody>
                <tr>
                  <td>เลขมาตรปัจจุบัน</td>
                  <td>{formmatedUsage(currentUsage)}</td>
                  <td>หน่วย</td>
                </tr>
                <tr>
                  <td>เลขมาตรครั้งก่อน</td>
                  <td>{formmatedUsage(prevUsage)}</td>
                  <td>หน่วย</td>
                </tr>
                <tr>
                  <td>จำนวนหน่วยที่ใช้</td>
                  <td>{totalUsage}</td>
                  <td>หน่วย</td>
                </tr>
                <tr>
                  <td>ค่าน้ำต่อหน่วย</td>
                  <td>{unitPrice}</td>
                  <td>บาท</td>
                </tr>
                <tr>
                  <td>ค่าน้ำสุทธิ</td>
                  <td>{totalAmount}</td>
                  <td>บาท</td>
                </tr>
                {isPrivilege && (
                  <tr>
                    <td>สิทธิพิเศษลดค่าน้ำ*</td>
                    <td>{totalDiscount}</td>
                    <td>บาท</td>
                  </tr>
                )}

                <tr className="font-semibold">
                  <td>รวมเงินที่ต้องชำระ</td>
                  <td>{netPay}</td>
                  <td>บาท</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center my-4"></div>
          {isPrivilege && (
            <p className="text-center">* ส่วนลดสำหรับคณะกรรมการประปา</p>
          )}
        </div>
      </div>
    </div>
  );
}
