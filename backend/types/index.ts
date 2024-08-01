export type Resume = {
  name: string;
  summary: string;
  skills: string[];
  education: { school: string; degree: string }[];
  workHistory: {
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    title: string;
    duties: string[];
  }[];
};
