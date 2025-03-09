export type TMeterGroup = {
  id: number;
  group_name: string;
  meters: TMeter[];
};

export type TMeter = {
  id: number;
  meter_name: string;
};
