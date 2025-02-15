"use client";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { TInvoiceForm } from "../page";

type TInvoiceFormProps = {
  currentInfo: TInvoiceForm;
  setCurrentInfo: React.Dispatch<React.SetStateAction<TInvoiceForm>>;
  meterId: number;
  meterName: string;
};

function InvoiceForm({
  currentInfo,
  setCurrentInfo,
  meterId,
  meterName,
}: TInvoiceFormProps) {
  const {
    watch,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TInvoiceForm>({
    mode: "onChange",
    defaultValues: {
      meterId: meterId,
      meterName: meterName,
      currentUsage: currentInfo.currentUsage,
      prevUsage: currentInfo.prevUsage,
      isPrivilege: currentInfo.isPrivilege,
      privilegeUnitDiscount: currentInfo.privilegeUnitDiscount,
    },
  });

  useEffect(() => {
    reset({
      currentUsage: currentInfo.currentUsage,
      prevUsage: currentInfo.prevUsage,
      isPrivilege: currentInfo.isPrivilege,
      privilegeUnitDiscount: currentInfo.privilegeUnitDiscount,
    });
  }, [currentInfo, reset]);

  const onSubmit = (data: TInvoiceForm) => {
    setCurrentInfo({
      ...data,
      meterId: meterId,
      meterName: meterName,
    });
  };
  return (
    <div className="w-[300px]">
      <h2 className="text-center text-lg font-bold">ฟอร์มใบแจ้งค่าน้ำ</h2>
      <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block" htmlFor="customerName">
            ชื่อลูกค้า
          </label>
          <input
            id="customerName"
            type="text"
            value={meterName}
            readOnly
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          {" "}
          <label className="block" htmlFor="currentUsage">
            การใช้น้ำปัจจุบัน
          </label>
          <Controller
            name="currentUsage"
            rules={{
              required: "กรุณากรอกการใช้น้ำปัจจุบัน",
              min: {
                value: 0,
                message: "กรุณากรอกค่ามากกว่า 0",
              },
            }}
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <input
                id="currentUsage"
                type="number"
                autoComplete="off"
                placeholder="การใช้น้ำปัจจุบัน"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                min={watch("prevUsage")}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            )}
          />
        </div>
        <div>
          <label className="block" htmlFor="prevUsage">
            การใช้น้ำเดิม
          </label>
          <Controller
            name="prevUsage"
            rules={{
              required: "กรุณากรอกการใช้น้ำเดิม",
              min: {
                value: 0,
                message: "กรุณากรอกค่ามากกว่า 0",
              },
            }}
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <input
                id="prevUsage"
                type="number"
                autoComplete="off"
                placeholder="การใช้น้ำเดิม"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                min={0}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            )}
          />
        </div>
        <div>
          <label className="block" htmlFor="isPrivilege">
            สิทธิพิเศษ
          </label>
          <Controller
            name="isPrivilege"
            control={control}
            render={({ field: { onChange, value } }) => (
              <input
                id="isPrivilege"
                type="checkbox"
                checked={value}
                onChange={onChange}
                className="border border-gray-300 rounded-md p-2"
              />
            )}
          />
        </div>
        {watch("isPrivilege") && (
          <div>
            <label className="block" htmlFor="privilegeUnitDiscount">
              ส่วนลด (หน่วย)
            </label>
            <Controller
              name="privilegeUnitDiscount"
              rules={{
                required: "กรุณากรอกส่วนลด",
                min: {
                  value: 0,
                  message: "กรุณากรอกค่ามากกว่า 0",
                },
              }}
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <input
                  id="privilegeUnitDiscount"
                  type="number"
                  autoComplete="off"
                  placeholder="ส่วนลด (หน่วย)"
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  min={0}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              )}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={
            !!errors["currentUsage"] ||
            !!errors["prevUsage"] ||
            !!errors["privilegeUnitDiscount"]
          }
          className="w-full bg-blue-500 text-white rounded-md p-2 disabled:opacity-50"
        >
          สร้างใบแจ้งค่าน้ำ
        </button>
      </form>
    </div>
  );
}

export default InvoiceForm;
