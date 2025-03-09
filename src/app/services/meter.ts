import { axiosInstance } from ".";
import { TMeter, TMeterGroup } from "../types";

const inquiryMeterGroup = async () => {
  return axiosInstance
    .get<TMeterGroup[]>("/meter/group")
    .then((res) => res.data);
};

const updateMeterName = async (
  meter: TMeter,
  newName: string,
  groupID: number
) => {
  return axiosInstance
    .put(`/meter`, {
      id: meter.id,
      meter_name: newName,
      group_id: groupID,
    })
    .then((res) => res.data);
};

const deleteMeter = async (meterId: number) => {
  return axiosInstance.delete(`/meter/${meterId}`).then((res) => res.data);
};

const createMeter = async (
  meterName: string,
  groupId: number
): Promise<TMeter> => {
  return axiosInstance
    .post("/meter", {
      meter_name: meterName,
      group_id: groupId,
    })
    .then((res) => res.data);
};

const meterService = {
  inquiryMeterGroup,
  updateMeterName,
  deleteMeter,
  createMeter,
};

export default meterService;
