export interface WorkLog {
    id: number;
    date?: Date;
    project: string;
    employee: string;
    hours: number;
    description: string;
}

const data = [
    {
        id: 0,
        project: "CRM for construction company",
        employee: "Christina West",
        hours: 6,
        projects: "CRM for construction company",
        date: "2020-10-12T05:44:32.915Z"
    },
    {
        id: 1,
        project: "CRM for construction company",
        employee: "Christina West",
        hours: 2,
        projects: "CRM for construction company",
        date: "2020-10-16T19:27:52.967Z"
    },
    // data省略
]

export const initialWorkhours: WorkLog[] = data.map<WorkLog>(log => ({ ...log, date: new Date(log.date), description: '' }))

export const projects: string[] = [
    '',
    'CRM for construction company',
    'New mobile app',
    'Advocate office website',
    'Website for the animal shelter',
]