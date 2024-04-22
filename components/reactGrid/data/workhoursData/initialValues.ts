export interface WorkLog {
    id: number;
    employeeType: string;//select
    employeeName: string;
    cost1: number;
    cost2: number;
    description: string;
    costs: number[]
}

export const developMonthInitialData: string[] = ['202401', '202402'];

export const employeeTypes: string[] = [
    '',
    '社員',
    '派遣',
]

// 生成する要素数(行数)を定義
const numberOfElements = 2;

// 基本となるオブジェクト
const baseObject = {
    employeeType: "社員",
    employeeName: "サンプル 太郎",
    hours: 6,
    cost1: 8,
    cost2: 8,
    employeeTypes: "社員",
    costs: [1, 2],
};

// IDを連番で割り当てた配列を生成
const data = Array.from({ length: numberOfElements }, (v, i) => ({
    id: i,
    ...baseObject
}));

// ※特にdesctiptionだけ外だししている意図はない
export const initialWorkhours: WorkLog[] = data.map<WorkLog>(log => ({ ...log, description: "" }))