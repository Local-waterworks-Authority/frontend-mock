"use client";

import React, { Dispatch, SetStateAction } from "react";
import { TMeter, TMeterList } from "../page";

type TMeterListProps = {
  meterList: TMeterList[];
  selectedMeter: TMeter | undefined;
  setSelectedMeter: Dispatch<SetStateAction<TMeter | undefined>>;
  resetForm: () => void;
};

export default function MeterList({
  meterList,
  selectedMeter,
  setSelectedMeter,
  resetForm,
}: TMeterListProps) {
  const [selectedGroup, setSelectedGroup] = React.useState<number | undefined>(
    undefined
  );

  const meters =
    meterList.find((group) => group.groupId === selectedGroup)?.meters || [];

  const onChangeGroup = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroup(Number(e.target.value));
    setSelectedMeter(undefined);
    resetForm();
  };

  const onChangeMeter = (meter: TMeter) => {
    setSelectedMeter(meter);
    resetForm();
  };
  return (
    <div className="w-[400px] h-fit">
      <h2 className="text-center text-lg font-bold">รายการมิเตอร์</h2>
      <div className="flex justify-center items-center gap-2 mt-4">
        <div>เล่ม: </div>
        <select
          value={selectedGroup}
          onChange={onChangeGroup}
          className="w-full px-2 py-1 border border-gray-300 rounded-md"
        >
          <option value="">กรุณาเลือกเล่ม</option>
          {meterList.map((group) => (
            <option key={group.groupId} value={group.groupId}>
              {group.groupName}
            </option>
          ))}
        </select>
      </div>
      <div className="h-[600px] flex flex-col items-center mt-4 space-y-1 px-2 overflow-y-auto">
        {meters.length > 0 &&
          meters.map((meter) => (
            <div
              key={meter.meterId}
              onClick={() => onChangeMeter(meter)}
              className={`w-full px-4 py-2 border rounded-md hover:bg-blue-300 cursor-pointer ${
                selectedMeter?.meterId === meter.meterId
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              {meter.meterName}
            </div>
          ))}
      </div>
    </div>
  );
}
