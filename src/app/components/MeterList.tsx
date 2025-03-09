"use client";

import React, { Dispatch, SetStateAction } from "react";
import { TMeter, TMeterGroup } from "../types";
import { FaEdit, FaTrash, FaSave, FaPlus } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import meterService from "../services/meter";

type TMeterListProps = {
  meterList: TMeterGroup[];
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
  const queryClient = useQueryClient();
  const [selectedGroup, setSelectedGroup] = React.useState<number | undefined>(
    undefined
  );
  const [editingMeter, setEditingMeter] = React.useState<TMeter | null>(null);
  const [editingName, setEditingName] = React.useState("");
  const [isAddingMeter, setIsAddingMeter] = React.useState(false);
  const [newMeterName, setNewMeterName] = React.useState("");

  const meters =
    meterList
      .find((group) => group.id === selectedGroup)
      ?.meters.sort((a, b) => a.id - b.id) || [];

  const onChangeGroup = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroup(Number(e.target.value));
    setSelectedMeter(undefined);
    resetForm();
  };

  const onChangeMeter = (meter: TMeter) => {
    setSelectedMeter(meter);
    resetForm();
  };
  const { mutate: updateMeterName } = useMutation<
    TMeter,
    Error,
    { meter: TMeter; newName: string; groupID: number }
  >({
    mutationFn: ({ meter, newName, groupID }) =>
      meterService.updateMeterName(meter, newName, groupID),
  });

  const { mutate: deleteMeter } = useMutation<TMeter, Error, number>({
    mutationFn: (meterId) => meterService.deleteMeter(meterId),
  });

  const { mutate: createMeter } = useMutation<
    TMeter,
    Error,
    { meterName: string; groupId: number }
  >({
    mutationFn: ({ meterName, groupId }) =>
      meterService.createMeter(meterName, groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meterList"] });
    },
  });

  const onDeleteMeter = (meter: TMeter) => {
    const confirm = window.confirm("ยืนยันการลบมิเตอร์นี้");
    if (confirm) {
      deleteMeter(meter.id);
      queryClient.invalidateQueries({ queryKey: ["meterList"] });
    }
  };

  const onSaveMeter = (meter: TMeter, newName: string, groupID: number) => {
    const confirm = window.confirm("ยืนยันการบันทึกชื่อมิเตอร์");
    if (confirm) {
      updateMeterName({ meter, newName, groupID: groupID });
      queryClient.invalidateQueries({ queryKey: ["meterList"] });
    }
  };

  const handleIconClick = (
    e: React.MouseEvent,
    meter: TMeter,
    action: "edit" | "delete"
  ) => {
    e.stopPropagation();
    if (action === "edit") {
      setEditingMeter(meter);
      setEditingName(meter.meter_name);
    } else if (action === "delete") {
      onDeleteMeter(meter);
    }
  };

  const handleSave = (e: React.MouseEvent, meter: TMeter, groupID: number) => {
    e.stopPropagation();
    onSaveMeter(meter, editingName, groupID);
    setEditingMeter(null);
    setEditingName("");
  };

  const handleCreateMeter = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGroup && newMeterName.trim()) {
      const confirm = window.confirm("ยืนยันการเพิ่มมิเตอร์");
      if (confirm) {
        createMeter({ meterName: newMeterName.trim(), groupId: selectedGroup });
        setNewMeterName("");
        setIsAddingMeter(false);
      }
    }
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
            <option key={group.id} value={group.id}>
              {group.group_name}
            </option>
          ))}
        </select>
      </div>

      {selectedGroup && (
        <div className="mt-4 px-2">
          {isAddingMeter ? (
            <form onSubmit={handleCreateMeter} className="flex gap-2">
              <input
                type="text"
                value={newMeterName}
                onChange={(e) => setNewMeterName(e.target.value)}
                placeholder="ชื่อมิเตอร์ใหม่"
                className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                เพิ่ม
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingMeter(false);
                  setNewMeterName("");
                }}
                className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                ยกเลิก
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingMeter(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <FaPlus /> เพิ่มมิเตอร์
            </button>
          )}
        </div>
      )}

      <div className="h-[600px] flex flex-col items-center mt-4 space-y-1 px-2 overflow-y-auto">
        {meters.length > 0 &&
          meters.map((meter) => (
            <div
              key={meter.id}
              onClick={() => onChangeMeter(meter)}
              className={`w-full px-4 py-2 border rounded-md hover:bg-blue-300 cursor-pointer ${
                selectedMeter?.id === meter.id ? "bg-blue-500 text-white" : ""
              } flex justify-between items-center`}
            >
              {editingMeter?.id === meter.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 px-2 py-1 mr-2 text-black rounded border-gray-300 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <span>{meter.meter_name}</span>
              )}
              <div className="flex gap-2">
                {editingMeter?.id === meter.id ? (
                  <FaSave
                    className={`cursor-pointer hover:text-green-700 ${
                      selectedMeter?.id === meter.id
                        ? "text-white"
                        : "text-green-500"
                    }`}
                    onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
                      if (selectedGroup) {
                        handleSave(e, meter, selectedGroup);
                      }
                    }}
                  />
                ) : (
                  <FaEdit
                    className={`cursor-pointer hover:text-blue-700 ${
                      selectedMeter?.id === meter.id
                        ? "text-white"
                        : "text-blue-500"
                    }`}
                    onClick={(e: React.MouseEvent<Element, MouseEvent>) =>
                      handleIconClick(e, meter, "edit")
                    }
                  />
                )}
                <FaTrash
                  className={`cursor-pointer hover:text-red-700 ${
                    selectedMeter?.id === meter.id
                      ? "text-white"
                      : "text-red-500"
                  }`}
                  onClick={(e: React.MouseEvent<Element, MouseEvent>) =>
                    handleIconClick(e, meter, "delete")
                  }
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
